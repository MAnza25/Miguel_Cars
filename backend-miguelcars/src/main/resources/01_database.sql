-- ============================================================
--  MIGUEL CARS — Script 01: Base de datos completa
--  Ejecutar UNA SOLA VEZ sobre PostgreSQL (usuario postgres)
--  Crea la BD, el schema y todas las tablas.
-- ============================================================

-- 1. Crear base de datos (ejecutar conectado a 'postgres')
-- CREATE DATABASE miguel_cars;
-- \c miguel_cars

-- 2. Crear schema
CREATE SCHEMA IF NOT EXISTS miguel_cars;
SET search_path TO miguel_cars;

-- ────────────────────────────────────────────────────────────
-- TABLAS INDEPENDIENTES
-- ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS miguel_cars.roles (
    id          SERIAL       PRIMARY KEY,
    nombre      VARCHAR(50)  NOT NULL,
    descripcion VARCHAR(200)
);

CREATE TABLE IF NOT EXISTS miguel_cars.clientes (
    id             SERIAL       PRIMARY KEY,
    cedula         VARCHAR(20)  UNIQUE NOT NULL,
    nombre         VARCHAR(100) NOT NULL,
    telefono       VARCHAR(20),
    correo         VARCHAR(100),
    activo         BOOLEAN      DEFAULT TRUE,
    creado_en      TIMESTAMPTZ  DEFAULT NOW(),
    actualizado_en TIMESTAMPTZ  DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS miguel_cars.checklist (
    id                   SERIAL       PRIMARY KEY,
    nivel_combustible    VARCHAR(20),
    rayones              BOOLEAN      DEFAULT FALSE,
    golpes               BOOLEAN      DEFAULT FALSE,
    vidrios_rotos        BOOLEAN      DEFAULT FALSE,
    luces_danadas        BOOLEAN      DEFAULT FALSE,
    observaciones        TEXT,
    kilometraje_entrada  INTEGER,
    registrado_en        TIMESTAMPTZ  DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
-- TABLAS CON DEPENDENCIAS SIMPLES
-- ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS miguel_cars.usuarios (
    id             SERIAL       PRIMARY KEY,
    rol_id         INTEGER      REFERENCES miguel_cars.roles(id),
    nombre         VARCHAR(100) NOT NULL,
    usuario        VARCHAR(50)  UNIQUE NOT NULL,
    password_hash  VARCHAR(255) NOT NULL,
    activo         BOOLEAN      DEFAULT TRUE,
    creado_en      TIMESTAMPTZ  DEFAULT NOW(),
    actualizado_en TIMESTAMPTZ  DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS miguel_cars.vehiculos (
    placa          VARCHAR(10)  PRIMARY KEY,
    id_cliente     INTEGER      REFERENCES miguel_cars.clientes(id),
    marca          VARCHAR(50)  NOT NULL,
    modelo         VARCHAR(50)  NOT NULL,
    color          VARCHAR(30),
    anio           SMALLINT,
    kilometraje    INTEGER      DEFAULT 0,
    activo         BOOLEAN      DEFAULT TRUE,
    creado_en      TIMESTAMPTZ  DEFAULT NOW(),
    actualizado_en TIMESTAMPTZ  DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
-- TABLAS PRINCIPALES
-- ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS miguel_cars.orden_servicio (
    id               SERIAL        PRIMARY KEY,
    numero_orden     VARCHAR(20)   UNIQUE,
    id_checklist     INTEGER       UNIQUE REFERENCES miguel_cars.checklist(id),
    placa            VARCHAR(10)   REFERENCES miguel_cars.vehiculos(placa),
    id_cliente       INTEGER       REFERENCES miguel_cars.clientes(id),
    id_usuario       INTEGER       REFERENCES miguel_cars.usuarios(id),
    motivo_ingreso   TEXT,
    diagnostico      TEXT,
    estado           VARCHAR(20)   NOT NULL DEFAULT 'PENDIENTE'
                                   CHECK (estado IN ('PENDIENTE','EN_PROCESO','FINALIZADA','ENTREGADA')),
    fecha_ingreso    TIMESTAMPTZ   DEFAULT NOW(),
    fecha_entrega    TIMESTAMPTZ,
    total_servicios  NUMERIC(10,2) DEFAULT 0,
    total_repuestos  NUMERIC(10,2) DEFAULT 0,
    total_general    NUMERIC(10,2) DEFAULT 0,
    actualizado_en   TIMESTAMPTZ   DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS miguel_cars.detalle_orden (
    id              SERIAL        PRIMARY KEY,
    id_orden        INTEGER       NOT NULL REFERENCES miguel_cars.orden_servicio(id) ON DELETE CASCADE,
    tipo            VARCHAR(10)   NOT NULL CHECK (tipo IN ('SERVICIO','REPUESTO')),
    descripcion     VARCHAR(200)  NOT NULL,
    cantidad        NUMERIC(10,2) NOT NULL DEFAULT 1,
    precio_unitario NUMERIC(10,2) NOT NULL,
    subtotal        NUMERIC(10,2) GENERATED ALWAYS AS (cantidad * precio_unitario) STORED
);

CREATE TABLE IF NOT EXISTS miguel_cars.citas (
    id             SERIAL       PRIMARY KEY,
    id_cliente     INTEGER      REFERENCES miguel_cars.clientes(id),
    placa          VARCHAR(10)  REFERENCES miguel_cars.vehiculos(placa),
    id_usuario     INTEGER      REFERENCES miguel_cars.usuarios(id),
    id_orden       INTEGER      REFERENCES miguel_cars.orden_servicio(id),
    fecha          DATE         NOT NULL,
    hora           TIME         NOT NULL,
    motivo         VARCHAR(200),
    estado         VARCHAR(20)  DEFAULT 'PROGRAMADA'
                                CHECK (estado IN ('PROGRAMADA','ATENDIDA','CANCELADA')),
    observaciones  TEXT,
    creado_en      TIMESTAMPTZ  DEFAULT NOW(),
    actualizado_en TIMESTAMPTZ  DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS miguel_cars.factura (
    id             SERIAL        PRIMARY KEY,
    id_orden       INTEGER       UNIQUE REFERENCES miguel_cars.orden_servicio(id),
    id_usuario     INTEGER       REFERENCES miguel_cars.usuarios(id),
    numero_factura VARCHAR(30)   UNIQUE NOT NULL,
    fecha          TIMESTAMPTZ   DEFAULT NOW(),
    subtotal       NUMERIC(10,2) NOT NULL,
    descuento      NUMERIC(10,2) DEFAULT 0,
    total          NUMERIC(10,2) NOT NULL,
    pdf_url        VARCHAR(500),
    enviado_wp     BOOLEAN       DEFAULT FALSE
);

-- ────────────────────────────────────────────────────────────
-- OPTIMIZACIÓN: ÍNDICES PARA CONSULTAS FRECUENTES
-- Mejora el rendimiento de búsquedas en columnas usadas en
-- cláusulas WHERE, ORDER BY y filtros de la aplicación.
-- ────────────────────────────────────────────────────────────

-- Órdenes de servicio: búsquedas por placa (historial vehicular)
CREATE INDEX IF NOT EXISTS idx_ordenes_placa     ON miguel_cars.orden_servicio(placa);
-- Órdenes de servicio: filtro por estado (PENDIENTE, EN_PROCESO, etc.)
CREATE INDEX IF NOT EXISTS idx_ordenes_estado    ON miguel_cars.orden_servicio(estado);
-- Órdenes de servicio: búsquedas por cliente
CREATE INDEX IF NOT EXISTS idx_ordenes_cliente   ON miguel_cars.orden_servicio(id_cliente);
-- Órdenes de servicio: ordenar por fecha de ingreso (historial)
CREATE INDEX IF NOT EXISTS idx_ordenes_fecha     ON miguel_cars.orden_servicio(fecha_ingreso DESC);
-- Citas: filtrar por fecha (agenda del día)
CREATE INDEX IF NOT EXISTS idx_citas_fecha       ON miguel_cars.citas(fecha);
-- Citas: filtrar por estado
CREATE INDEX IF NOT EXISTS idx_citas_estado      ON miguel_cars.citas(estado);
-- Vehículos: buscar todos los vehículos de un cliente
CREATE INDEX IF NOT EXISTS idx_vehiculos_cliente ON miguel_cars.vehiculos(id_cliente);
-- Clientes: búsqueda por cédula (endpoint /api/clientes/cedula/{cedula})
CREATE INDEX IF NOT EXISTS idx_clientes_cedula   ON miguel_cars.clientes(cedula);
-- Detalle orden: obtener todos los detalles de una orden
CREATE INDEX IF NOT EXISTS idx_detalle_orden     ON miguel_cars.detalle_orden(id_orden);
-- Factura: buscar factura por orden
CREATE INDEX IF NOT EXISTS idx_factura_orden     ON miguel_cars.factura(id_orden);

-- ────────────────────────────────────────────────────────────
-- VERIFICACIÓN
-- ────────────────────────────────────────────────────────────
SELECT table_name AS tabla,
       (SELECT COUNT(*) FROM information_schema.columns c
        WHERE c.table_schema = 'miguel_cars' AND c.table_name = t.table_name) AS columnas
FROM information_schema.tables t
WHERE table_schema = 'miguel_cars' AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- ────────────────────────────────────────────────────────────
-- TABLAS INDEPENDIENTES
-- ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS miguel_cars.roles (
    id          SERIAL       PRIMARY KEY,
    nombre      VARCHAR(50)  NOT NULL,
    descripcion VARCHAR(200)
);

CREATE TABLE IF NOT EXISTS miguel_cars.clientes (
    id             SERIAL       PRIMARY KEY,
    cedula         VARCHAR(20)  UNIQUE NOT NULL,
    nombre         VARCHAR(100) NOT NULL,
    telefono       VARCHAR(20),
    correo         VARCHAR(100),
    activo         BOOLEAN      DEFAULT TRUE,
    creado_en      TIMESTAMPTZ  DEFAULT NOW(),
    actualizado_en TIMESTAMPTZ  DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS miguel_cars.checklist (
    id                   SERIAL       PRIMARY KEY,
    nivel_combustible    VARCHAR(20),
    rayones              BOOLEAN      DEFAULT FALSE,
    golpes               BOOLEAN      DEFAULT FALSE,
    vidrios_rotos        BOOLEAN      DEFAULT FALSE,
    luces_danadas        BOOLEAN      DEFAULT FALSE,
    observaciones        TEXT,
    kilometraje_entrada  INTEGER,
    registrado_en        TIMESTAMPTZ  DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
-- TABLAS CON DEPENDENCIAS SIMPLES
-- ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS miguel_cars.usuarios (
    id             SERIAL       PRIMARY KEY,
    rol_id         INTEGER      REFERENCES miguel_cars.roles(id),
    nombre         VARCHAR(100) NOT NULL,
    usuario        VARCHAR(50)  UNIQUE NOT NULL,
    password_hash  VARCHAR(255) NOT NULL,
    activo         BOOLEAN      DEFAULT TRUE,
    creado_en      TIMESTAMPTZ  DEFAULT NOW(),
    actualizado_en TIMESTAMPTZ  DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS miguel_cars.vehiculos (
    placa          VARCHAR(10)  PRIMARY KEY,
    id_cliente     INTEGER      REFERENCES miguel_cars.clientes(id),
    marca          VARCHAR(50)  NOT NULL,
    modelo         VARCHAR(50)  NOT NULL,
    color          VARCHAR(30),
    anio           SMALLINT,
    kilometraje    INTEGER      DEFAULT 0,
    activo         BOOLEAN      DEFAULT TRUE,
    creado_en      TIMESTAMPTZ  DEFAULT NOW(),
    actualizado_en TIMESTAMPTZ  DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
-- TABLAS PRINCIPALES
-- ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS miguel_cars.orden_servicio (
    id               SERIAL        PRIMARY KEY,
    numero_orden     VARCHAR(20)   UNIQUE,
    id_checklist     INTEGER       UNIQUE REFERENCES miguel_cars.checklist(id),
    placa            VARCHAR(10)   REFERENCES miguel_cars.vehiculos(placa),
    id_cliente       INTEGER       REFERENCES miguel_cars.clientes(id),
    id_usuario       INTEGER       REFERENCES miguel_cars.usuarios(id),
    motivo_ingreso   TEXT,
    diagnostico      TEXT,
    estado           VARCHAR(20)   NOT NULL DEFAULT 'PENDIENTE'
                                   CHECK (estado IN ('PENDIENTE','EN_PROCESO','FINALIZADA','ENTREGADA')),
    fecha_ingreso    TIMESTAMPTZ   DEFAULT NOW(),
    fecha_entrega    TIMESTAMPTZ,
    total_servicios  NUMERIC(10,2) DEFAULT 0,
    total_repuestos  NUMERIC(10,2) DEFAULT 0,
    total_general    NUMERIC(10,2) DEFAULT 0,
    actualizado_en   TIMESTAMPTZ   DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS miguel_cars.detalle_orden (
    id              SERIAL        PRIMARY KEY,
    id_orden        INTEGER       NOT NULL REFERENCES miguel_cars.orden_servicio(id) ON DELETE CASCADE,
    tipo            VARCHAR(10)   NOT NULL CHECK (tipo IN ('SERVICIO','REPUESTO')),
    descripcion     VARCHAR(200)  NOT NULL,
    cantidad        NUMERIC(10,2) NOT NULL DEFAULT 1,
    precio_unitario NUMERIC(10,2) NOT NULL,
    subtotal        NUMERIC(10,2) GENERATED ALWAYS AS (cantidad * precio_unitario) STORED
);

CREATE TABLE IF NOT EXISTS miguel_cars.citas (
    id             SERIAL       PRIMARY KEY,
    id_cliente     INTEGER      REFERENCES miguel_cars.clientes(id),
    placa          VARCHAR(10)  REFERENCES miguel_cars.vehiculos(placa),
    id_usuario     INTEGER      REFERENCES miguel_cars.usuarios(id),
    id_orden       INTEGER      REFERENCES miguel_cars.orden_servicio(id),
    fecha          DATE         NOT NULL,
    hora           TIME         NOT NULL,
    motivo         VARCHAR(200),
    estado         VARCHAR(20)  DEFAULT 'PROGRAMADA'
                                CHECK (estado IN ('PROGRAMADA','ATENDIDA','CANCELADA')),
    observaciones  TEXT,
    creado_en      TIMESTAMPTZ  DEFAULT NOW(),
    actualizado_en TIMESTAMPTZ  DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS miguel_cars.factura (
    id             SERIAL        PRIMARY KEY,
    id_orden       INTEGER       UNIQUE REFERENCES miguel_cars.orden_servicio(id),
    id_usuario     INTEGER       REFERENCES miguel_cars.usuarios(id),
    numero_factura VARCHAR(30)   UNIQUE NOT NULL,
    fecha          TIMESTAMPTZ   DEFAULT NOW(),
    subtotal       NUMERIC(10,2) NOT NULL,
    descuento      NUMERIC(10,2) DEFAULT 0,
    total          NUMERIC(10,2) NOT NULL,
    pdf_url        VARCHAR(500),
    enviado_wp     BOOLEAN       DEFAULT FALSE
);

-- ────────────────────────────────────────────────────────────
-- VERIFICACIÓN
-- ────────────────────────────────────────────────────────────
SELECT table_name AS tabla,
       (SELECT COUNT(*) FROM information_schema.columns c
        WHERE c.table_schema = 'miguel_cars' AND c.table_name = t.table_name) AS columnas
FROM information_schema.tables t
WHERE table_schema = 'miguel_cars' AND table_type = 'BASE TABLE'
ORDER BY table_name;

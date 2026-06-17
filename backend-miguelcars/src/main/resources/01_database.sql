-- ============================================================
--  MIGUEL CARS — Script 01: Crear base de datos desde cero
--  Ejecutar conectado a la BD "miguel_cars" en pgAdmin
--  Pasos previos (ejecutar como superusuario si es necesario):
--    CREATE DATABASE miguel_cars;
-- ============================================================

-- ── Schema ───────────────────────────────────────────────────
CREATE SCHEMA IF NOT EXISTS miguel_cars;
SET search_path TO miguel_cars;

-- ── Limpiar si ya existe (reinicio completo) ─────────────────
DROP TABLE IF EXISTS miguel_cars.factura          CASCADE;
DROP TABLE IF EXISTS miguel_cars.citas            CASCADE;
DROP TABLE IF EXISTS miguel_cars.detalle_orden    CASCADE;
DROP TABLE IF EXISTS miguel_cars.orden_servicio   CASCADE;
DROP TABLE IF EXISTS miguel_cars.checklist        CASCADE;
DROP TABLE IF EXISTS miguel_cars.vehiculos        CASCADE;
DROP TABLE IF EXISTS miguel_cars.clientes         CASCADE;
DROP TABLE IF EXISTS miguel_cars.usuarios         CASCADE;
DROP TABLE IF EXISTS miguel_cars.roles            CASCADE;

-- ────────────────────────────────────────────────────────────
-- TABLAS INDEPENDIENTES (sin FK)
-- ────────────────────────────────────────────────────────────

CREATE TABLE miguel_cars.roles (
    id          SERIAL PRIMARY KEY,
    nombre      VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(255),
    permisos    TEXT -- Lista de permisos (ej: CLIENTES_VER, ORDENES_CREAR)
);

CREATE TABLE miguel_cars.clientes (
    id             SERIAL       PRIMARY KEY,
    cedula         VARCHAR(20)  UNIQUE NOT NULL,
    nombre         VARCHAR(100) NOT NULL,
    telefono       VARCHAR(20),
    correo         VARCHAR(100),
    activo         BOOLEAN      DEFAULT TRUE,
    creado_en      TIMESTAMPTZ  DEFAULT NOW(),
    actualizado_en TIMESTAMPTZ  DEFAULT NOW()
);

CREATE TABLE miguel_cars.checklist (
    id                  SERIAL       PRIMARY KEY,
    nivel_combustible   VARCHAR(20),
    rayones             BOOLEAN      DEFAULT FALSE,
    golpes              BOOLEAN      DEFAULT FALSE,
    vidrios_rotos       BOOLEAN      DEFAULT FALSE,
    luces_danadas       BOOLEAN      DEFAULT FALSE,
    observaciones       TEXT,
    kilometraje_entrada INTEGER,
    registrado_en       TIMESTAMPTZ  DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
-- TABLAS CON DEPENDENCIAS SIMPLES
-- ────────────────────────────────────────────────────────────

CREATE TABLE miguel_cars.usuarios (
    id             SERIAL       PRIMARY KEY,
    rol_id         INTEGER      REFERENCES miguel_cars.roles(id),
    nombre         VARCHAR(100) NOT NULL,
    usuario        VARCHAR(50)  UNIQUE NOT NULL,
    password_hash  VARCHAR(255) NOT NULL,
    activo         BOOLEAN      DEFAULT TRUE,
    creado_en      TIMESTAMPTZ  DEFAULT NOW(),
    actualizado_en TIMESTAMPTZ  DEFAULT NOW()
);

CREATE TABLE miguel_cars.vehiculos (
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

CREATE TABLE miguel_cars.orden_servicio (
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

CREATE TABLE miguel_cars.detalle_orden (
    id              SERIAL        PRIMARY KEY,
    id_orden        INTEGER       NOT NULL REFERENCES miguel_cars.orden_servicio(id) ON DELETE CASCADE,
    tipo            VARCHAR(10)   NOT NULL CHECK (tipo IN ('SERVICIO','REPUESTO')),
    descripcion     VARCHAR(200)  NOT NULL,
    cantidad        NUMERIC(10,2) NOT NULL DEFAULT 1,
    precio_unitario NUMERIC(10,2) NOT NULL,
    subtotal        NUMERIC(10,2) GENERATED ALWAYS AS (cantidad * precio_unitario) STORED
);

CREATE TABLE miguel_cars.citas (
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

CREATE TABLE miguel_cars.factura (
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
-- ÍNDICES — optimización de consultas frecuentes
-- ────────────────────────────────────────────────────────────
CREATE INDEX idx_ordenes_placa     ON miguel_cars.orden_servicio(placa);
CREATE INDEX idx_ordenes_estado    ON miguel_cars.orden_servicio(estado);
CREATE INDEX idx_ordenes_cliente   ON miguel_cars.orden_servicio(id_cliente);
CREATE INDEX idx_ordenes_fecha     ON miguel_cars.orden_servicio(fecha_ingreso DESC);
CREATE INDEX idx_citas_fecha       ON miguel_cars.citas(fecha);
CREATE INDEX idx_citas_estado      ON miguel_cars.citas(estado);
CREATE INDEX idx_vehiculos_cliente ON miguel_cars.vehiculos(id_cliente);
CREATE INDEX idx_clientes_cedula   ON miguel_cars.clientes(cedula);
CREATE INDEX idx_detalle_orden     ON miguel_cars.detalle_orden(id_orden);
CREATE INDEX idx_factura_orden     ON miguel_cars.factura(id_orden);

-- ────────────────────────────────────────────────────────────
-- VERIFICACIÓN — debe mostrar 8 tablas
-- ────────────────────────────────────────────────────────────
SELECT table_name AS tabla,
       (SELECT COUNT(*) FROM information_schema.columns c
        WHERE c.table_schema = 'miguel_cars' AND c.table_name = t.table_name) AS columnas
FROM information_schema.tables t
WHERE table_schema = 'miguel_cars' AND table_type = 'BASE TABLE'
ORDER BY table_name;

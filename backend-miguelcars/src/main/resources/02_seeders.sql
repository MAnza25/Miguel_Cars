-- ============================================================
--  MIGUEL CARS — Script 02: Datos de prueba (seeders)
--  Ejecutar DESPUÉS de 01_database.sql
--  3 roles, 3 usuarios, 5 registros por tabla
-- ============================================================

SET search_path TO miguel_cars;

-- ── Limpiar en orden correcto ────────────────────────────────
TRUNCATE TABLE miguel_cars.factura          RESTART IDENTITY CASCADE;
TRUNCATE TABLE miguel_cars.citas            RESTART IDENTITY CASCADE;
TRUNCATE TABLE miguel_cars.detalle_orden    RESTART IDENTITY CASCADE;
TRUNCATE TABLE miguel_cars.orden_servicio   RESTART IDENTITY CASCADE;
TRUNCATE TABLE miguel_cars.checklist        RESTART IDENTITY CASCADE;
TRUNCATE TABLE miguel_cars.vehiculos        RESTART IDENTITY CASCADE;
TRUNCATE TABLE miguel_cars.clientes         RESTART IDENTITY CASCADE;
TRUNCATE TABLE miguel_cars.usuarios         RESTART IDENTITY CASCADE;
TRUNCATE TABLE miguel_cars.roles            RESTART IDENTITY CASCADE;

-- ── 1. ROLES (3) ─────────────────────────────────────────────
INSERT INTO miguel_cars.roles (nombre, descripcion, permisos) VALUES
  ('Administrador', 'Acceso total al sistema', 'DASHBOARD_VER,CLIENTES_VER,CLIENTES_CREAR,CLIENTES_EDITAR,CLIENTES_ELIMINAR,VEHICULOS_VER,VEHICULOS_CREAR,VEHICULOS_EDITAR,VEHICULOS_ELIMINAR,CITAS_VER,CITAS_CREAR,CITAS_EDITAR,CITAS_ELIMINAR,ORDENES_VER,ORDENES_CREAR,ORDENES_EDITAR,ORDENES_ELIMINAR,FACTURAS_VER,FACTURAS_CREAR,USUARIOS_VER,USUARIOS_CREAR,ROLES_VER'),
  ('Mecánico',      'Gestión de órdenes y diagnósticos', 'CLIENTES_VER,CLIENTES_CREAR,CLIENTES_EDITAR,VEHICULOS_VER,VEHICULOS_CREAR,VEHICULOS_EDITAR,ORDENES_VER,ORDENES_CREAR'),
  ('Recepcionista', 'Gestión de citas y clientes', 'CLIENTES_VER,CLIENTES_CREAR,CLIENTES_EDITAR,VEHICULOS_VER,VEHICULOS_CREAR,VEHICULOS_EDITAR,CITAS_VER,CITAS_CREAR,CITAS_EDITAR,ORDENES_VER,FACTURAS_VER,FACTURAS_CREAR');

-- ── 2. USUARIOS (3) ──────────────────────────────────────────
-- ID 1 = Admin, ID 2 = Mecánico, ID 3 = Recepcionista
INSERT INTO miguel_cars.usuarios (rol_id, nombre, usuario, password_hash, activo, creado_en) VALUES
  (1, 'Jarol Andrade',    'admin',       'admin', TRUE, NOW()),
  (2, 'Carlos Pérez',     'mecanico',    '123',   TRUE, NOW()),
  (3, 'Laura Gómez',      'recepcion',   '123',   TRUE, NOW());

-- ── 3. CLIENTES (5) ──────────────────────────────────────────
-- IDs: 1=Roberto, 2=Sandra, 3=Felipe, 4=Mónica, 5=Luis
INSERT INTO miguel_cars.clientes (cedula, nombre, telefono, correo, activo, creado_en) VALUES
  ('1001234567', 'Roberto Salcedo',  '3101234567', 'roberto@email.com',  TRUE, NOW()),
  ('1002345678', 'Sandra Medina',    '3112345678', 'sandra@email.com',   TRUE, NOW()),
  ('1003456789', 'Felipe Arias',     '3123456789', 'felipe@email.com',   TRUE, NOW()),
  ('1004567890', 'Mónica Castillo',  '3134567890', 'monica@email.com',   TRUE, NOW()),
  ('1005678901', 'Luis Fernández',   '3145678901', 'luis@email.com',     TRUE, NOW());

-- ── 4. VEHÍCULOS (5, uno por cliente) ────────────────────────
INSERT INTO miguel_cars.vehiculos (placa, id_cliente, marca, modelo, color, anio, kilometraje, activo, creado_en) VALUES
  ('ABC123', 1, 'Toyota',    'Corolla', 'Blanco', 2019, 45000, TRUE, NOW()),
  ('DEF456', 2, 'Chevrolet', 'Spark',   'Rojo',   2021, 18000, TRUE, NOW()),
  ('GHI789', 3, 'Renault',   'Logan',   'Gris',   2018, 72000, TRUE, NOW()),
  ('JKL012', 4, 'Mazda',     '3',       'Azul',   2020, 33000, TRUE, NOW()),
  ('MNO345', 5, 'Nissan',    'Sentra',  'Negro',  2017, 95000, TRUE, NOW());

-- ── 5. CHECKLIST (5, uno por orden) ──────────────────────────
INSERT INTO miguel_cars.checklist
  (nivel_combustible, rayones, golpes, vidrios_rotos, luces_danadas, observaciones, kilometraje_entrada, registrado_en)
VALUES
  ('1/2',   FALSE, FALSE, FALSE, FALSE, 'Vehículo en buen estado',          45000, NOW()-INTERVAL '4 days'),
  ('3/4',   TRUE,  FALSE, FALSE, FALSE, 'Rayón leve en puerta derecha',     18000, NOW()-INTERVAL '3 days'),
  ('lleno', FALSE, FALSE, FALSE, FALSE, 'Sin novedades',                    72000, NOW()-INTERVAL '2 days'),
  ('1/4',   FALSE, TRUE,  FALSE, FALSE, 'Golpe menor en parachoques',       33000, NOW()-INTERVAL '1 day'),
  ('1/2',   FALSE, FALSE, FALSE, FALSE, 'Sin novedades',                    95000, NOW());

-- ── 6. ÓRDENES DE SERVICIO (5) ───────────────────────────────
-- Órdenes 1-3 ENTREGADAS (tendrán factura)
-- Orden 4 FINALIZADA, Orden 5 EN_PROCESO
INSERT INTO miguel_cars.orden_servicio
  (numero_orden, id_checklist, placa, id_cliente, id_usuario,
   motivo_ingreso, diagnostico, estado,
   fecha_ingreso, fecha_entrega,
   total_servicios, total_repuestos, total_general, actualizado_en)
VALUES
  ('ORD-2026-0001', 1, 'ABC123', 1, 2,
   'Mantenimiento 45k km',      'Cambio de aceite y filtros',
   'ENTREGADA',  NOW()-INTERVAL '4 days', NOW()-INTERVAL '3 days', 45000, 70000,  115000, NOW()-INTERVAL '3 days'),

  ('ORD-2026-0002', 2, 'DEF456', 2, 2,
   'Chirrido al frenar',         'Desgaste de pastillas delanteras',
   'ENTREGADA',  NOW()-INTERVAL '3 days', NOW()-INTERVAL '2 days', 35000, 103000, 138000, NOW()-INTERVAL '2 days'),

  ('ORD-2026-0003', 3, 'GHI789', 3, 2,
   'Revisión general',           'Mantenimiento preventivo completo',
   'ENTREGADA',  NOW()-INTERVAL '2 days', NOW()-INTERVAL '1 day',  90000, 0,      90000,  NOW()-INTERVAL '1 day'),

  ('ORD-2026-0004', 4, 'JKL012', 4, 2,
   'Check engine encendido',     'Sensor O2 defectuoso — en reparación',
   'FINALIZADA', NOW()-INTERVAL '1 day',  NULL,                    40000, 22000,  62000,  NOW()),

  ('ORD-2026-0005', 5, 'MNO345', 5, 2,
   'Ruido en motor',             'Diagnóstico en curso',
   'EN_PROCESO', NOW(),          NULL,                             0,     0,      0,      NOW());

-- ── 7. DETALLE DE ÓRDENES ────────────────────────────────────
INSERT INTO miguel_cars.detalle_orden (id_orden, tipo, descripcion, cantidad, precio_unitario) VALUES
  -- Orden 1
  (1, 'SERVICIO', 'Cambio de aceite y filtro',     1, 45000),
  (1, 'REPUESTO', 'Filtro de aceite',              1, 15000),
  (1, 'REPUESTO', 'Aceite motor 5W30 4L',          1, 55000),
  -- Orden 2
  (2, 'SERVICIO', 'Revisión de frenos',             1, 35000),
  (2, 'REPUESTO', 'Pastillas de freno delanteras', 1, 85000),
  (2, 'REPUESTO', 'Líquido de frenos DOT4',        1, 18000),
  -- Orden 3
  (3, 'SERVICIO', 'Mantenimiento preventivo',       1, 90000),
  -- Orden 4
  (4, 'SERVICIO', 'Diagnóstico electrónico',        1, 40000),
  (4, 'REPUESTO', 'Filtro de aire',                1, 22000);

-- ── 8. CITAS (5) ─────────────────────────────────────────────
INSERT INTO miguel_cars.citas
  (id_cliente, placa, id_usuario, id_orden, fecha, hora, motivo, estado, observaciones, creado_en)
VALUES
  (1, 'ABC123', 3, 1,    CURRENT_DATE-4, '09:00', 'Mantenimiento 45k km',     'ATENDIDA',   'Cliente puntual',             NOW()-INTERVAL '4 days'),
  (2, 'DEF456', 3, 2,    CURRENT_DATE-3, '10:30', 'Revisión de frenos',       'ATENDIDA',   'Desgaste confirmado',         NOW()-INTERVAL '3 days'),
  (3, 'GHI789', 3, 3,    CURRENT_DATE-2, '08:00', 'Mantenimiento general',    'ATENDIDA',   'Sin novedades mayores',       NOW()-INTERVAL '2 days'),
  (4, 'JKL012', 3, NULL, CURRENT_DATE,   '11:00', 'Check engine encendido',   'PROGRAMADA', 'Confirmar antes de llegar',   NOW()),
  (5, 'MNO345', 3, NULL, CURRENT_DATE+1, '14:00', 'Revisión ruido en motor',  'PROGRAMADA', 'Primera visita del cliente',  NOW());

-- ── 9. FACTURAS (solo órdenes ENTREGADAS: 1-3) ───────────────
INSERT INTO miguel_cars.factura
  (id_orden, id_usuario, numero_factura, fecha, subtotal, descuento, total, enviado_wp)
VALUES
  (1, 1, 'FAC-2026-001', NOW()-INTERVAL '3 days', 115000, 0,      115000, TRUE),
  (2, 1, 'FAC-2026-002', NOW()-INTERVAL '2 days', 138000, 6900,   131100, TRUE),
  (3, 1, 'FAC-2026-003', NOW()-INTERVAL '1 day',   90000, 0,       90000, FALSE);

-- ── VERIFICACIÓN ─────────────────────────────────────────────
SELECT tabla, filas FROM (
  SELECT 'roles'         AS tabla, COUNT(*) AS filas FROM miguel_cars.roles          UNION ALL
  SELECT 'usuarios',               COUNT(*)          FROM miguel_cars.usuarios        UNION ALL
  SELECT 'clientes',               COUNT(*)          FROM miguel_cars.clientes        UNION ALL
  SELECT 'vehiculos',              COUNT(*)          FROM miguel_cars.vehiculos       UNION ALL
  SELECT 'checklist',              COUNT(*)          FROM miguel_cars.checklist       UNION ALL
  SELECT 'orden_servicio',         COUNT(*)          FROM miguel_cars.orden_servicio  UNION ALL
  SELECT 'detalle_orden',          COUNT(*)          FROM miguel_cars.detalle_orden   UNION ALL
  SELECT 'citas',                  COUNT(*)          FROM miguel_cars.citas           UNION ALL
  SELECT 'factura',                COUNT(*)          FROM miguel_cars.factura
) t ORDER BY tabla;

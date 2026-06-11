-- ============================================================
--  MIGUEL CARS — Script 02: Datos de prueba (seeders)
--  Ejecutar DESPUÉS de 01_database.sql
--  Limpia y recarga todos los datos de ejemplo.
-- ============================================================

SET search_path TO miguel_cars;

-- ── Limpiar en orden (respeta FK) ────────────────────────────
TRUNCATE TABLE miguel_cars.factura          RESTART IDENTITY CASCADE;
TRUNCATE TABLE miguel_cars.citas            RESTART IDENTITY CASCADE;
TRUNCATE TABLE miguel_cars.detalle_orden    RESTART IDENTITY CASCADE;
TRUNCATE TABLE miguel_cars.orden_servicio   RESTART IDENTITY CASCADE;
TRUNCATE TABLE miguel_cars.checklist        RESTART IDENTITY CASCADE;
TRUNCATE TABLE miguel_cars.vehiculos        RESTART IDENTITY CASCADE;
TRUNCATE TABLE miguel_cars.clientes         RESTART IDENTITY CASCADE;
TRUNCATE TABLE miguel_cars.usuarios         RESTART IDENTITY CASCADE;
TRUNCATE TABLE miguel_cars.roles            RESTART IDENTITY CASCADE;

-- ── 1. ROLES ─────────────────────────────────────────────────
INSERT INTO miguel_cars.roles (nombre, descripcion) VALUES
  ('Administrador',  'Acceso total al sistema'),
  ('Mecánico',       'Gestión de órdenes y diagnósticos'),
  ('Recepcionista',  'Gestión de citas y clientes');

-- ── 2. USUARIOS ──────────────────────────────────────────────
INSERT INTO miguel_cars.usuarios (rol_id, nombre, usuario, password_hash, activo, creado_en) VALUES
  (1, 'Miguel Rodríguez',  'miguel.admin',  'admin123', TRUE, NOW()),
  (2, 'Carlos Pérez',      'carlos.mec',    'mec123',   TRUE, NOW()),
  (2, 'Andrés Torres',     'andres.mec',    'mec123',   TRUE, NOW()),
  (3, 'Laura Gómez',       'laura.rec',     'rec123',   TRUE, NOW()),
  (2, 'Sebastián Castro',  'sebastian.mec', 'mec123',   TRUE, NOW()),
  (3, 'Valentina Ruiz',    'valentina.rec', 'rec123',   TRUE, NOW()),
  (2, 'Diego Morales',     'diego.mec',     'mec123',   TRUE, NOW()),
  (1, 'Jorge Herrera',     'jorge.admin',   'admin123', TRUE, NOW()),
  (2, 'Camila Jiménez',    'camila.mec',    'mec123',   TRUE, NOW()),
  (3, 'Patricia Vargas',   'patricia.rec',  'rec123',   TRUE, NOW());

-- ── 3. CLIENTES ──────────────────────────────────────────────
INSERT INTO miguel_cars.clientes (cedula, nombre, telefono, correo, activo, creado_en) VALUES
  ('1001234567', 'Roberto Salcedo',    '3101234567', 'roberto.salcedo@email.com',  TRUE, NOW()),
  ('1002345678', 'Sandra Medina',      '3112345678', 'sandra.medina@email.com',    TRUE, NOW()),
  ('1003456789', 'Felipe Arias',       '3123456789', 'felipe.arias@email.com',     TRUE, NOW()),
  ('1004567890', 'Mónica Castillo',    '3134567890', 'monica.castillo@email.com',  TRUE, NOW()),
  ('1005678901', 'Luis Fernández',     '3145678901', 'luis.fernandez@email.com',   TRUE, NOW()),
  ('1006789012', 'Carolina Ospina',    '3156789012', 'carolina.ospina@email.com',  TRUE, NOW()),
  ('1007890123', 'Hernán Muñoz',       '3167890123', 'hernan.munoz@email.com',     TRUE, NOW()),
  ('1008901234', 'Gloria Bermúdez',    '3178901234', 'gloria.bermudez@email.com',  TRUE, NOW()),
  ('1009012345', 'Julián Suárez',      '3189012345', 'julian.suarez@email.com',    TRUE, NOW()),
  ('1000123456', 'Natalia Restrepo',   '3190123456', 'natalia.restrepo@email.com', TRUE, NOW());

-- ── 4. VEHÍCULOS ─────────────────────────────────────────────
INSERT INTO miguel_cars.vehiculos (placa, id_cliente, marca, modelo, color, anio, kilometraje, activo, creado_en) VALUES
  ('ABC123', 1,  'Toyota',     'Corolla',   'Blanco',   2019, 45000,  TRUE, NOW()),
  ('DEF456', 2,  'Chevrolet',  'Spark',     'Rojo',     2021, 18000,  TRUE, NOW()),
  ('GHI789', 3,  'Renault',    'Logan',     'Gris',     2018, 72000,  TRUE, NOW()),
  ('JKL012', 4,  'Mazda',      '3',         'Azul',     2020, 33000,  TRUE, NOW()),
  ('MNO345', 5,  'Nissan',     'Sentra',    'Negro',    2017, 95000,  TRUE, NOW()),
  ('PQR678', 6,  'Honda',      'Civic',     'Blanco',   2022, 12000,  TRUE, NOW()),
  ('STU901', 7,  'Kia',        'Picanto',   'Amarillo', 2016, 110000, TRUE, NOW()),
  ('VWX234', 8,  'Hyundai',    'Elantra',   'Gris',     2021, 27000,  TRUE, NOW()),
  ('YZA567', 9,  'Ford',       'Fiesta',    'Verde',    2019, 58000,  TRUE, NOW()),
  ('BCD890', 10, 'Volkswagen', 'Polo',      'Blanco',   2020, 41000,  TRUE, NOW());

-- ── 5. CHECKLIST (uno por orden) ─────────────────────────────
INSERT INTO miguel_cars.checklist (nivel_combustible, rayones, golpes, vidrios_rotos, luces_danadas, observaciones, kilometraje_entrada, registrado_en) VALUES
  ('1/2',   FALSE, FALSE, FALSE, FALSE, 'Vehículo en buen estado general',            45000,  NOW() - INTERVAL '9 days'),
  ('3/4',   TRUE,  FALSE, FALSE, FALSE, 'Rayón leve en puerta trasera derecha',        18000,  NOW() - INTERVAL '8 days'),
  ('vacío', FALSE, TRUE,  FALSE, FALSE, 'Golpe menor en parachoques trasero',           72000,  NOW() - INTERVAL '7 days'),
  ('lleno', FALSE, FALSE, FALSE, FALSE, 'Sin novedades',                                33000,  NOW() - INTERVAL '6 days'),
  ('1/4',   TRUE,  TRUE,  FALSE, TRUE,  'Daños múltiples, luz trasera rota',            95000,  NOW() - INTERVAL '5 days'),
  ('1/2',   FALSE, FALSE, FALSE, FALSE, 'Sin novedades',                                12000,  NOW() - INTERVAL '4 days'),
  ('3/4',   FALSE, FALSE, TRUE,  FALSE, 'Vidrio trasero izquierdo fisurado',            110000, NOW() - INTERVAL '3 days'),
  ('1/2',   FALSE, FALSE, FALSE, FALSE, 'Buen estado general',                          27000,  NOW() - INTERVAL '2 days'),
  ('vacío', TRUE,  FALSE, FALSE, FALSE, 'Rayones en capó',                              58000,  NOW() - INTERVAL '1 day'),
  ('3/4',   FALSE, FALSE, FALSE, FALSE, 'Sin novedades',                                41000,  NOW());

-- ── 6. ÓRDENES DE SERVICIO ───────────────────────────────────
INSERT INTO miguel_cars.orden_servicio
  (numero_orden, id_checklist, placa, id_cliente, id_usuario, motivo_ingreso, diagnostico, estado, fecha_ingreso, fecha_entrega, total_servicios, total_repuestos, total_general, actualizado_en)
VALUES
  ('ORD-2026-0001', 1,  'ABC123', 1,  2, 'Mantenimiento 45.000 km',              'Cambio de aceite y filtros, revisión general',           'ENTREGADA',  NOW()-INTERVAL '9 days', NOW()-INTERVAL '8 days', 45000,  70000,  115000, NOW()-INTERVAL '8 days'),
  ('ORD-2026-0002', 2,  'DEF456', 2,  3, 'Chirrido al frenar',                   'Desgaste de pastillas delanteras confirmado',            'ENTREGADA',  NOW()-INTERVAL '8 days', NOW()-INTERVAL '7 days', 35000,  103000, 138000, NOW()-INTERVAL '7 days'),
  ('ORD-2026-0003', 3,  'GHI789', 3,  2, 'Revisión distribución urgente',        'Correa de distribución próxima a ruptura',               'ENTREGADA',  NOW()-INTERVAL '7 days', NOW()-INTERVAL '5 days', 150000, 120000, 270000, NOW()-INTERVAL '5 days'),
  ('ORD-2026-0004', 4,  'JKL012', 4,  6, 'Luz check engine encendida',           'Sensor O2 defectuoso, requiere reemplazo',               'ENTREGADA',  NOW()-INTERVAL '6 days', NOW()-INTERVAL '5 days', 40000,  22000,  62000,  NOW()-INTERVAL '5 days'),
  ('ORD-2026-0005', 5,  'MNO345', 5,  8, 'Mantenimiento general alto kilometraje','Frenos, suspensión y bujías intervenidas',              'ENTREGADA',  NOW()-INTERVAL '5 days', NOW()-INTERVAL '3 days', 135000, 228000, 363000, NOW()-INTERVAL '3 days'),
  ('ORD-2026-0006', 6,  'PQR678', 6,  2, 'Mantenimiento preventivo 12.000 km',   'Revisión completa sin novedades mayores',                'ENTREGADA',  NOW()-INTERVAL '4 days', NOW()-INTERVAL '3 days', 90000,  0,      90000,  NOW()-INTERVAL '3 days'),
  ('ORD-2026-0007', 7,  'STU901', 7,  3, 'Batería descargada frecuentemente',    'Batería reemplazada, sistema eléctrico revisado',        'FINALIZADA', NOW()-INTERVAL '3 days', NOW()-INTERVAL '1 day',  50000,  280000, 330000, NOW()-INTERVAL '1 day'),
  ('ORD-2026-0008', 8,  'VWX234', 8,  6, 'Ruido en dirección al girar',          'Alineación y balanceo, revisión de suspensión',          'EN_PROCESO', NOW()-INTERVAL '2 days', NOW()+INTERVAL '1 day',  105000, 0,      105000, NOW()),
  ('ORD-2026-0009', 9,  'YZA567', 9,  8, 'Mantenimiento aceite y bujías',        'Cambio de aceite, filtros y bujías',                     'EN_PROCESO', NOW()-INTERVAL '1 day',  NOW()+INTERVAL '1 day',  75000,  63000,  138000, NOW()),
  ('ORD-2026-0010', 10, 'BCD890', 10, 2, 'Ruido extraño en motor',               'Diagnóstico en curso, posible falla en sistema admisión','PENDIENTE',  NOW(),                   NOW()+INTERVAL '2 days', 0,      0,      0,      NOW());

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
  (3, 'SERVICIO', 'Cambio de correa distribución', 1, 150000),
  (3, 'REPUESTO', 'Correa de distribución',        1, 120000),
  -- Orden 4
  (4, 'SERVICIO', 'Diagnóstico electrónico',        1, 40000),
  (4, 'REPUESTO', 'Filtro de aire',                1, 22000),
  -- Orden 5
  (5, 'SERVICIO', 'Mantenimiento preventivo',       1, 90000),
  (5, 'SERVICIO', 'Revisión de suspensión',         1, 45000),
  (5, 'REPUESTO', 'Pastillas de freno delanteras', 1, 85000),
  (5, 'REPUESTO', 'Bujías x4',                     1, 48000),
  (5, 'REPUESTO', 'Amortiguador delantero',         1, 95000),
  -- Orden 6
  (6, 'SERVICIO', 'Mantenimiento preventivo 12k',  1, 90000),
  -- Orden 7
  (7, 'SERVICIO', 'Revisión sistema eléctrico',    1, 50000),
  (7, 'REPUESTO', 'Batería 60Ah',                  1, 280000),
  -- Orden 8
  (8, 'SERVICIO', 'Alineación y balanceo',          1, 60000),
  (8, 'SERVICIO', 'Revisión de suspensión',         1, 45000),
  -- Orden 9
  (9, 'SERVICIO', 'Cambio de aceite',               1, 45000),
  (9, 'SERVICIO', 'Cambio de bujías',               1, 30000),
  (9, 'REPUESTO', 'Aceite motor 5W30 4L',           1, 55000),
  (9, 'REPUESTO', 'Bujías x4',                      1, 48000);

-- ── 8. CITAS ─────────────────────────────────────────────────
INSERT INTO miguel_cars.citas (id_cliente, placa, id_usuario, id_orden, fecha, hora, motivo, estado, observaciones, creado_en) VALUES
  (1,  'ABC123', 4, 1, CURRENT_DATE-10, '09:00', 'Mantenimiento 45.000 km',          'ATENDIDA',   'Cliente puntual',                  NOW()-INTERVAL '10 days'),
  (2,  'DEF456', 6, 2, CURRENT_DATE-9,  '10:30', 'Revisión frenos — chirrido',        'ATENDIDA',   'Desgaste confirmado en revisión',  NOW()-INTERVAL '9 days'),
  (3,  'GHI789', 4, 3, CURRENT_DATE-8,  '08:00', 'Revisión distribución urgente',     'ATENDIDA',   'Correa próxima a ruptura',         NOW()-INTERVAL '8 days'),
  (4,  'JKL012', 6, 4, CURRENT_DATE-7,  '11:00', 'Check engine encendido',            'ATENDIDA',   'Sensor O2 defectuoso',             NOW()-INTERVAL '7 days'),
  (5,  'MNO345', 4, 5, CURRENT_DATE-6,  '14:00', 'Mantenimiento general 95k km',      'ATENDIDA',   'Múltiples intervenciones',         NOW()-INTERVAL '6 days'),
  (6,  'PQR678', 6, 6, CURRENT_DATE-5,  '09:30', 'Mantenimiento preventivo 12k',      'ATENDIDA',   'Todo en orden',                    NOW()-INTERVAL '5 days'),
  (7,  'STU901', 4, 7, CURRENT_DATE-3,  '15:00', 'Batería descargada',                'ATENDIDA',   'Batería reemplazada',              NOW()-INTERVAL '3 days'),
  (8,  'VWX234', 6, 8, CURRENT_DATE-1,  '10:00', 'Ruido en dirección',                'ATENDIDA',   'En proceso de revisión',           NOW()-INTERVAL '1 day'),
  (9,  'YZA567', 4, NULL, CURRENT_DATE, '11:00', 'Mantenimiento aceite y bujías',      'PROGRAMADA', 'Cliente confirmó asistencia',      NOW()),
  (10, 'BCD890', 6, NULL, CURRENT_DATE+2,'09:00','Ruido extraño en motor',             'PROGRAMADA', 'Posible diagnóstico extendido',    NOW());

-- ── 9. FACTURAS (órdenes 1-6 ya entregadas/finalizadas) ──────
INSERT INTO miguel_cars.factura (id_orden, id_usuario, numero_factura, fecha, subtotal, descuento, total, enviado_wp) VALUES
  (1, 1, 'FAC-2026-001', NOW()-INTERVAL '8 days',  115000, 0,       115000, TRUE),
  (2, 1, 'FAC-2026-002', NOW()-INTERVAL '7 days',  138000, 6900,    131100, TRUE),
  (3, 1, 'FAC-2026-003', NOW()-INTERVAL '5 days',  270000, 0,       270000, FALSE),
  (4, 1, 'FAC-2026-004', NOW()-INTERVAL '5 days',   62000, 0,        62000, TRUE),
  (5, 1, 'FAC-2026-005', NOW()-INTERVAL '3 days',  363000, 18150,   344850, FALSE),
  (6, 1, 'FAC-2026-006', NOW()-INTERVAL '3 days',   90000, 0,        90000, TRUE);

-- ── VERIFICACIÓN ─────────────────────────────────────────────
SELECT 'roles'          AS tabla, COUNT(*) AS filas FROM miguel_cars.roles         UNION ALL
SELECT 'usuarios',                COUNT(*)          FROM miguel_cars.usuarios       UNION ALL
SELECT 'clientes',                COUNT(*)          FROM miguel_cars.clientes       UNION ALL
SELECT 'vehiculos',               COUNT(*)          FROM miguel_cars.vehiculos      UNION ALL
SELECT 'checklist',               COUNT(*)          FROM miguel_cars.checklist      UNION ALL
SELECT 'orden_servicio',          COUNT(*)          FROM miguel_cars.orden_servicio UNION ALL
SELECT 'detalle_orden',           COUNT(*)          FROM miguel_cars.detalle_orden  UNION ALL
SELECT 'citas',                   COUNT(*)          FROM miguel_cars.citas          UNION ALL
SELECT 'factura',                 COUNT(*)          FROM miguel_cars.factura
ORDER BY tabla;

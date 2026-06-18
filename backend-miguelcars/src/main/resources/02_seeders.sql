-- ============================================================
--  MIGUEL CARS — Script 02: Datos de prueba (seeders) MEJORADOS
--  Ejecutar DESPUÉS de 01_database.sql
--  Roles y Usuarios mantenidos, Datos de negocio expandidos
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
INSERT INTO miguel_cars.usuarios (rol_id, nombre, usuario, password_hash, activo, creado_en) VALUES
  (1, 'Jarol Andrade',    'admin',       'admin', TRUE, NOW()),
  (2, 'Carlos Pérez',     'mecanico',    '123',   TRUE, NOW()),
  (3, 'Laura Gómez',      'recepcion',   '123',   TRUE, NOW());

-- ── 3. CLIENTES (10) ─────────────────────────────────────────
INSERT INTO miguel_cars.clientes (cedula, nombre, telefono, correo, activo, creado_en) VALUES
  ('1001234567', 'Roberto Salcedo',  '3101234567', 'roberto@email.com',  TRUE, '2026-01-10'),
  ('1002345678', 'Sandra Medina',    '3112345678', 'sandra@email.com',   TRUE, '2026-01-15'),
  ('1003456789', 'Felipe Arias',     '3123456789', 'felipe@email.com',   TRUE, '2026-02-01'),
  ('1004567890', 'Mónica Castillo',  '3134567890', 'monica@email.com',   TRUE, '2026-02-20'),
  ('1005678901', 'Luis Fernández',   '3145678901', 'luis@email.com',     TRUE, '2026-03-05'),
  ('1006789012', 'Andrea Torres',    '3156789012', 'andrea@email.com',   TRUE, '2026-03-15'),
  ('1007890123', 'Juan Carlos Ruiz', '3167890123', 'juanc@email.com',    TRUE, '2026-04-01'),
  ('1008901234', 'Patricia Moreno',  '3178901234', 'patricia@email.com', TRUE, '2026-04-10'),
  ('1009012345', 'Diego Herrera',    '3189012345', 'diego@email.com',    TRUE, '2026-05-02'),
  ('1010123456', 'Camila Vargas',    '3190123456', 'camila@email.com',   TRUE, '2026-05-20');

-- ── 4. VEHÍCULOS (15) ────────────────────────────────────────
INSERT INTO miguel_cars.vehiculos (placa, id_cliente, marca, modelo, color, anio, kilometraje, activo, creado_en) VALUES
  ('ABC123', 1, 'Toyota',    'Corolla', 'Blanco', 2019, 45000, TRUE, '2026-01-10'),
  ('DEF456', 2, 'Chevrolet', 'Spark',   'Rojo',   2021, 18000, TRUE, '2026-01-15'),
  ('GHI789', 3, 'Renault',   'Logan',   'Gris',   2018, 72000, TRUE, '2026-02-01'),
  ('JKL012', 4, 'Mazda',     '3',       'Azul',   2020, 33000, TRUE, '2026-02-20'),
  ('MNO345', 5, 'Nissan',    'Sentra',  'Negro',  2017, 95000, TRUE, '2026-03-05'),
  ('PQR678', 6, 'Kia',       'Picanto', 'Plata',  2022, 12000, TRUE, '2026-03-15'),
  ('STU901', 7, 'Ford',      'Fiesta',  'Blanco', 2016, 88000, TRUE, '2026-04-01'),
  ('VWX234', 8, 'Hyundai',   'Tucson',  'Gris',   2020, 42000, TRUE, '2026-04-10'),
  ('YZA567', 9, 'Volkswagen','Golf',    'Azul',   2018, 65000, TRUE, '2026-05-02'),
  ('BCD890', 10,'Suzuki',    'Swift',   'Rojo',   2023, 5000,  TRUE, '2026-05-20'),
  ('EFG123', 1, 'Honda',     'Civic',   'Negro',  2021, 25000, TRUE, '2026-03-10'), -- Segundo carro de Roberto
  ('HIJ456', 2, 'Jeep',      'Renegade','Verde',  2022, 15000, TRUE, '2026-04-15'), -- Segundo carro de Sandra
  ('KLM789', 3, 'BMW',       'X3',      'Blanco', 2021, 30000, TRUE, '2026-05-01'), -- Segundo carro de Felipe
  ('NOP012', 6, 'Audi',      'A3',      'Gris',   2019, 40000, TRUE, '2026-05-15'), -- Segundo carro de Andrea
  ('QRS345', 7, 'Mercedes',  'C200',    'Negro',  2020, 35000, TRUE, '2026-06-01'); -- Segundo carro de Juan Carlos

-- ── 5. CHECKLISTS (Para las órdenes) ─────────────────────────
INSERT INTO miguel_cars.checklist (nivel_combustible, rayones, golpes, vidrios_rotos, luces_danadas, observaciones, kilometraje_entrada, registrado_en) VALUES
  ('1/2', FALSE, FALSE, FALSE, FALSE, 'Buen estado', 45100, '2026-03-05 08:30'),
  ('3/4', TRUE,  FALSE, FALSE, FALSE, 'Rayón puerta', 18200, '2026-03-12 09:15'),
  ('1/4', FALSE, TRUE,  FALSE, FALSE, 'Golpe defensa', 72500, '2026-03-25 10:00'),
  ('lleno', FALSE, FALSE, FALSE, FALSE, 'OK', 33400, '2026-04-02 14:00'),
  ('1/2', FALSE, FALSE, FALSE, FALSE, 'OK', 95300, '2026-04-10 08:00'),
  ('3/4', FALSE, FALSE, FALSE, FALSE, 'OK', 12100, '2026-04-18 11:30'),
  ('1/4', TRUE,  TRUE,  FALSE, TRUE,  'Varios detalles', 88500, '2026-04-28 09:00'),
  ('1/2', FALSE, FALSE, FALSE, FALSE, 'OK', 42300, '2026-05-05 15:00'),
  ('3/4', FALSE, FALSE, FALSE, FALSE, 'OK', 65400, '2026-05-12 10:30'),
  ('lleno', FALSE, FALSE, FALSE, FALSE, 'Nuevo', 5100, '2026-05-22 08:45'),
  ('1/2', FALSE, FALSE, FALSE, FALSE, 'OK', 25600, '2026-05-28 14:15'),
  ('1/4', FALSE, FALSE, FALSE, FALSE, 'OK', 15400, '2026-06-02 09:30'),
  ('3/4', FALSE, FALSE, FALSE, FALSE, 'OK', 30500, '2026-06-05 08:00'),
  ('1/2', TRUE,  FALSE, FALSE, FALSE, 'Rayón capo', 40200, '2026-06-10 11:00'),
  ('3/4', FALSE, FALSE, FALSE, FALSE, 'OK', 35100, '2026-06-15 08:30'),
  ('1/2', FALSE, FALSE, FALSE, FALSE, 'Revisión preventiva', 46000, '2026-06-16 09:00'),
  ('1/4', FALSE, FALSE, FALSE, FALSE, 'Ruido frenos', 19000, '2026-06-17 08:00');

-- ── 6. ÓRDENES DE SERVICIO (17) ──────────────────────────────
-- Distribuidas en los últimos 4 meses
INSERT INTO miguel_cars.orden_servicio (numero_orden, id_checklist, placa, id_cliente, id_usuario, motivo_ingreso, diagnostico, estado, fecha_ingreso, fecha_entrega, total_servicios, total_repuestos, total_general) VALUES
  ('ORD-2026-001', 1, 'ABC123', 1, 2, 'Mantenimiento preventivo', 'Cambio aceite y filtros', 'ENTREGADA', '2026-03-05 08:30', '2026-03-06 16:00', 50000, 120000, 170000),
  ('ORD-2026-002', 2, 'DEF456', 2, 2, 'Revisión frenos', 'Cambio pastillas delanteras', 'ENTREGADA', '2026-03-12 09:15', '2026-03-12 17:30', 40000, 95000, 135000),
  ('ORD-2026-003', 3, 'GHI789', 3, 2, 'Golpe en suspensión', 'Cambio amortiguadores traseros', 'ENTREGADA', '2026-03-25 10:00', '2026-03-27 11:00', 80000, 350000, 430000),
  ('ORD-2026-004', 4, 'JKL012', 4, 2, 'Cambio de aceite', 'Mantenimiento básico', 'ENTREGADA', '2026-04-02 14:00', '2026-04-02 18:00', 50000, 110000, 160000),
  ('ORD-2026-005', 5, 'MNO345', 5, 2, 'Falla eléctrica', 'Cambio de batería y bornes', 'ENTREGADA', '2026-04-10 08:00', '2026-04-10 12:00', 30000, 450000, 480000),
  ('ORD-2026-006', 6, 'PQR678', 6, 2, 'Primer mantenimiento', 'Revisión niveles y escaneo', 'ENTREGADA', '2026-04-18 11:30', '2026-04-18 16:00', 60000, 0, 60000),
  ('ORD-2026-007', 7, 'STU901', 7, 2, 'Reparación motor', 'Cambio de empaque culata', 'ENTREGADA', '2026-04-28 09:00', '2026-05-05 17:00', 450000, 320000, 770000),
  ('ORD-2026-008', 8, 'VWX234', 8, 2, 'Alineación y balanceo', 'Servicio preventivo', 'ENTREGADA', '2026-05-05 15:00', '2026-05-06 10:00', 70000, 0, 70000),
  ('ORD-2026-009', 9, 'YZA567', 9, 2, 'Ruido en rodamiento', 'Cambio rodamiento delantero izq', 'ENTREGADA', '2026-05-12 10:30', '2026-05-13 15:00', 55000, 180000, 235000),
  ('ORD-2026-010', 10, 'BCD890', 10, 2, 'Revisión de garantía', 'Ajuste de frenos y niveles', 'ENTREGADA', '2026-05-22 08:45', '2026-05-22 13:00', 0, 0, 0),
  ('ORD-2026-011', 11, 'EFG123', 1, 2, 'Cambio de aceite', 'Filtros y aceite sintético', 'ENTREGADA', '2026-05-28 14:15', '2026-05-28 17:30', 50000, 150000, 200000),
  ('ORD-2026-012', 12, 'HIJ456', 2, 2, 'Mantenimiento 15k', 'Servicio preventivo completo', 'ENTREGADA', '2026-06-02 09:30', '2026-06-03 16:00', 120000, 80000, 200000),
  ('ORD-2026-013', 13, 'KLM789', 3, 2, 'Check engine', 'Cambio sensor de oxígeno', 'ENTREGADA', '2026-06-05 08:00', '2026-06-06 11:00', 60000, 280000, 340000),
  ('ORD-2026-014', 14, 'NOP012', 6, 2, 'Ruido suspensión', 'Cambio de bujes delanteros', 'FINALIZADA', '2026-06-10 11:00', NULL, 80000, 120000, 200000),
  ('ORD-2026-015', 15, 'QRS345', 7, 2, 'Mantenimiento A', 'Servicio Mercedes-Benz', 'EN_PROCESO', '2026-06-15 08:30', NULL, 250000, 450000, 700000),
  ('ORD-2026-016', 16, 'ABC123', 1, 2, 'Viaje largo', 'Revisión general viaje', 'EN_PROCESO', '2026-06-16 09:00', NULL, 40000, 0, 40000),
  ('ORD-2026-017', 17, 'DEF456', 2, 2, 'Chirrido frenos', 'Diagnóstico en curso', 'PENDIENTE', '2026-06-17 08:00', NULL, 0, 0, 0);

-- ── 7. DETALLE DE ÓRDENES (Muestra) ──────────────────────────
INSERT INTO miguel_cars.detalle_orden (id_orden, tipo, descripcion, cantidad, precio_unitario) VALUES
  (1, 'SERVICIO', 'Cambio de aceite', 1, 50000),
  (1, 'REPUESTO', 'Aceite 10W30', 4, 25000),
  (1, 'REPUESTO', 'Filtro aceite', 1, 20000),
  (2, 'SERVICIO', 'Mano de obra frenos', 1, 40000),
  (2, 'REPUESTO', 'Pastillas CERAMIC', 1, 95000),
  (5, 'REPUESTO', 'Batería MAC 1100', 1, 450000),
  (7, 'SERVICIO', 'Mano de obra culata', 1, 450000),
  (7, 'REPUESTO', 'Kit empaques', 1, 320000);

-- ── 8. CITAS (20) ────────────────────────────────────────────
INSERT INTO miguel_cars.citas (id_cliente, placa, id_usuario, id_orden, fecha, hora, motivo, estado, creado_en) VALUES
  (1, 'ABC123', 3, 1,    '2026-03-05', '08:30', 'Mantenimiento', 'ATENDIDA', '2026-03-01'),
  (2, 'DEF456', 3, 2,    '2026-03-12', '09:00', 'Frenos', 'ATENDIDA', '2026-03-05'),
  (3, 'GHI789', 3, 3,    '2026-03-25', '10:00', 'Suspensión', 'ATENDIDA', '2026-03-20'),
  (4, 'JKL012', 3, 4,    '2026-04-02', '14:00', 'Aceite', 'ATENDIDA', '2026-03-28'),
  (5, 'MNO345', 3, 5,    '2026-04-10', '08:00', 'Falla eléctrica', 'ATENDIDA', '2026-04-05'),
  (6, 'PQR678', 3, 6,    '2026-04-18', '11:00', 'Mantenimiento', 'ATENDIDA', '2026-04-15'),
  (7, 'STU901', 3, 7,    '2026-04-28', '09:00', 'Motor', 'ATENDIDA', '2026-04-20'),
  (8, 'VWX234', 3, 8,    '2026-05-05', '15:00', 'Alineación', 'ATENDIDA', '2026-05-01'),
  (9, 'YZA567', 3, 9,    '2026-05-12', '10:00', 'Rodamiento', 'ATENDIDA', '2026-05-10'),
  (10,'BCD890', 3, 10,   '2026-05-22', '08:30', 'Garantía', 'ATENDIDA', '2026-05-15'),
  (1, 'EFG123', 3, 11,   '2026-05-28', '14:00', 'Aceite', 'ATENDIDA', '2026-05-25'),
  (2, 'HIJ456', 3, 12,   '2026-06-02', '09:00', 'Mantenimiento', 'ATENDIDA', '2026-05-30'),
  (3, 'KLM789', 3, 13,   '2026-06-05', '08:00', 'Check engine', 'ATENDIDA', '2026-06-01'),
  (6, 'NOP012', 3, 14,   '2026-06-10', '11:00', 'Suspensión', 'ATENDIDA', '2026-06-08'),
  (7, 'QRS345', 3, 15,   '2026-06-15', '08:30', 'Mantenimiento A', 'ATENDIDA', '2026-06-10'),
  (1, 'ABC123', 3, 16,   '2026-06-16', '09:00', 'Revisión viaje', 'ATENDIDA', '2026-06-14'),
  (2, 'DEF456', 3, 17,   '2026-06-17', '08:00', 'Chirrido', 'ATENDIDA', '2026-06-16'),
  (8, 'VWX234', 3, NULL, '2026-06-18', '10:00', 'Luces', 'PROGRAMADA', '2026-06-15'),
  (9, 'YZA567', 3, NULL, '2026-06-19', '14:00', 'Revisión', 'PROGRAMADA', '2026-06-16'),
  (4, 'JKL012', 3, NULL, '2026-06-17', '16:00', 'Consulta', 'CANCELADA', '2026-06-16');

-- ── 9. FACTURAS (Para las órdenes ENTREGADAS) ────────────────
INSERT INTO miguel_cars.factura (id_orden, id_usuario, numero_factura, fecha, subtotal, descuento, total, enviado_wp) VALUES
  (1, 1, 'FAC-2026-001', '2026-03-06 16:30', 170000, 0, 170000, TRUE),
  (2, 1, 'FAC-2026-002', '2026-03-12 18:00', 135000, 5000, 130000, TRUE),
  (3, 1, 'FAC-2026-003', '2026-03-27 11:30', 430000, 0, 430000, TRUE),
  (4, 1, 'FAC-2026-004', '2026-04-02 18:15', 160000, 0, 160000, FALSE),
  (5, 1, 'FAC-2026-005', '2026-04-10 12:30', 480000, 10000, 470000, TRUE),
  (6, 1, 'FAC-2026-006', '2026-04-18 16:15', 60000, 0, 60000, FALSE),
  (7, 1, 'FAC-2026-007', '2026-05-05 17:30', 770000, 20000, 750000, TRUE),
  (8, 1, 'FAC-2026-008', '2026-05-06 10:30', 70000, 0, 70000, TRUE),
  (9, 1, 'FAC-2026-009', '2026-05-13 15:30', 235000, 0, 235000, FALSE),
  (10, 1, 'FAC-2026-010', '2026-05-22 13:15', 0, 0, 0, TRUE),
  (11, 1, 'FAC-2026-011', '2026-05-28 17:45', 200000, 5000, 195000, TRUE),
  (12, 1, 'FAC-2026-012', '2026-06-03 16:15', 200000, 0, 200000, TRUE),
  (13, 1, 'FAC-2026-013', '2026-06-06 11:30', 340000, 0, 340000, TRUE);

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

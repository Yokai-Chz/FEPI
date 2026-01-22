-- Base de datos para el sistema de Grúas de la CDMX

-- Tabla de Ubicación (Estandarizada con el sistema central)
CREATE TABLE ubicacion (
    id_ubicacion SERIAL PRIMARY KEY,
    municipio VARCHAR(100),
    vialidad VARCHAR(150),
    numero_exterior VARCHAR(20),
    nombre_asentamiento VARCHAR(150),
    codigo_postal VARCHAR(10),
    nombre_entidad VARCHAR(100),
    coordenadas VARCHAR(100)
);

-- Catálogo de Tipos de Grúa
CREATE TABLE cat_tipo_grua (
    id_tipo_grua SERIAL PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL, -- Ejemplo: A, B, C, D
    descripcion VARCHAR(255),
    capacidad_toneladas DECIMAL(5,2)
);

-- Tabla de Grúas
CREATE TABLE gruas (
    id_grua SERIAL PRIMARY KEY,
    placas VARCHAR(15) UNIQUE NOT NULL,
    no_economico VARCHAR(20) UNIQUE,
    id_tipo_grua INTEGER REFERENCES cat_tipo_grua(id_tipo_grua),
    marca VARCHAR(50),
    modelo VARCHAR(50),
    anio INTEGER,
    latitud_actual DECIMAL(10, 6),
    longitud_actual DECIMAL(10, 6),
    estado VARCHAR(20) DEFAULT 'DISPONIBLE' CHECK (estado IN ('DISPONIBLE', 'OCUPADA', 'MANTENIMIENTO', 'FUERA_SERVICIO'))
);

-- Tabla de Depósitos (Corralones)
CREATE TABLE depositos (
    id_deposito SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    id_ubicacion INTEGER REFERENCES ubicacion(id_ubicacion),
    capacidad_total INTEGER,
    capacidad_ocupada INTEGER DEFAULT 0,
    telefono VARCHAR(20),
    horario_atencion VARCHAR(100),
    estatus BOOLEAN DEFAULT TRUE
);

-- Tabla de Usuarios de Depósitos / Sistema
CREATE TABLE usuarios_deposito (
    id_usuario SERIAL PRIMARY KEY,
    nombre_completo VARCHAR(150) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol VARCHAR(30) CHECK (rol IN ('ADMIN_GENERAL', 'ADMIN_DEPOSITO', 'OPERADOR_DEPOSITO', 'RECEPCION')),
    id_deposito INTEGER REFERENCES depositos(id_deposito), -- NULL para ADMIN_GENERAL
    activo BOOLEAN DEFAULT TRUE
);

-- Asociación Grúa - Depósito (Para asignar grúas a zonas/depósitos específicos)
CREATE TABLE asociacion_grua_deposito (
    id_asociacion SERIAL PRIMARY KEY,
    id_grua INTEGER REFERENCES gruas(id_grua) ON DELETE CASCADE,
    id_deposito INTEGER REFERENCES depositos(id_deposito) ON DELETE CASCADE,
    fecha_asignacion VARCHAR(30),
    activo BOOLEAN DEFAULT TRUE
);

-- Tabla de Solicitudes de Arrastre / Servicios
CREATE TABLE solicitudes_arrastre (
    id_solicitud SERIAL PRIMARY KEY,
    folio VARCHAR(50) UNIQUE NOT NULL,
    fecha_solicitud VARCHAR(30),
    id_grua INTEGER REFERENCES gruas(id_grua),
    id_deposito_destino INTEGER REFERENCES depositos(id_deposito),
    id_ubicacion_origen INTEGER REFERENCES ubicacion(id_ubicacion),
    
    -- Datos del vehículo arrastrado
    placas_vehiculo VARCHAR(15),
    marca_vehiculo VARCHAR(50),
    color_vehiculo VARCHAR(30),
    tipo_vehiculo VARCHAR(50),
    
    -- Vinculación con sistema de infracciones (referencia externa)
    id_infraccion_vinculada INTEGER, 
    
    motivo_arrastre TEXT,
    estatus_servicio VARCHAR(30) DEFAULT 'SOLICITADO' CHECK (estatus_servicio IN ('SOLICITADO', 'ASIGNADO', 'EN_CAMINO', 'EN_PROCESO', 'EN_DEPOSITO', 'CANCELADO')),
    
    observaciones TEXT
);

-- ==========================================
-- SISTEMA DE PARQUÍMETROS CDMX 2026
-- ==========================================

CREATE TABLE cat_poligonos (
    id_poligono SERIAL PRIMARY KEY,
    nombre_poligono VARCHAR(100) NOT NULL
);

CREATE TABLE cat_colonias_parquimetro (
    id_colonia SERIAL PRIMARY KEY,
    id_poligono INTEGER REFERENCES cat_poligonos(id_poligono),
    nombre_colonia VARCHAR(100) NOT NULL
);

CREATE TABLE tickets_parquimetro (
    id_ticket SERIAL PRIMARY KEY,
    placas_vehiculo VARCHAR(20) NOT NULL, -- Flexible para placas foráneas
    id_colonia INTEGER REFERENCES cat_colonias_parquimetro(id_colonia),
    fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    monto_pagado DECIMAL(10, 2) NOT NULL, -- Tarifa $3.40 / 15 min
    fecha_vencimiento TIMESTAMP NOT NULL
);

-- Vista para consulta de oficiales
CREATE OR REPLACE VIEW vista_estado_parquimetro AS
SELECT 
    placas_vehiculo,
    fecha_vencimiento,
    ROUND(EXTRACT(EPOCH FROM (fecha_vencimiento - NOW()))/60) AS minutos_restantes,
    CASE 
        WHEN fecha_vencimiento > NOW() THEN 'VIGENTE'
        ELSE 'EXPIRADO'
    END AS estatus
FROM tickets_parquimetro;

-- INSERCIÓN DE CATÁLOGOS OFICIALES
INSERT INTO cat_poligonos (nombre_poligono) VALUES 
('ANZURES'), ('BENITO JUÁREZ SUR'), ('BENITO JUÁREZ NORTE'), ('FLORIDA'), 
('GUADALUPE INN'), ('LOMAS'), ('POLANCO'), ('ROMA-CONDESA');

INSERT INTO cat_colonias_parquimetro (id_poligono, nombre_colonia) VALUES 
(7, 'Polanco Chapultepec'), (7, 'Polanco Reforma'), 
(8, 'Roma Norte I'), (8, 'Hipódromo I'),
(3, 'Nápoles');

-- DATOS DE PRUEBA (Ejemplos con formato CDMX y foráneo)
INSERT INTO tickets_parquimetro (placas_vehiculo, id_colonia, monto_pagado, fecha_vencimiento) VALUES
('A01-AAA', 1, 13.60, NOW() + interval '1 hour'),   -- Vigente
('Z99-ZZZ', 3, 6.80, NOW() - interval '10 minutes'), -- Expirado
('MEX-4432', 4, 27.20, NOW() + interval '2 hours'); -- Foránea Vigente

-- ==========================================

-- INSERCIÓN DE DATOS DE PRUEBA ORIGINALES
-- Ubicaciones (Ejemplos para depósitos)
INSERT INTO ubicacion (municipio, vialidad, numero_exterior, nombre_asentamiento, codigo_postal, nombre_entidad, coordenadas) VALUES
('Cuauhtémoc', 'Calle General Gabriel Hernandez', '56', 'Doctores', '06720', 'Ciudad de México', '19.4194,-99.1456'), -- Deposito 1
('Iztapalapa', 'Av. Tlahuac', 'S/N', 'Santa Maria Tomatlan', '09870', 'Ciudad de México', '19.3245,-99.0876'), -- Deposito 2
('Gustavo A. Madero', 'Av. 608', '100', 'San Juan de Aragon', '07969', 'Ciudad de México', '19.4567,-99.0912'); -- Deposito 3

-- Tipos de Grúa
INSERT INTO cat_tipo_grua (tipo, descripcion, capacidad_toneladas) VALUES
('Tipo A', 'Grúa de pluma para vehículos ligeros', 3.5),
('Tipo B', 'Grúa de plataforma para vehículos ligeros y medianos', 6.0),
('Tipo C', 'Grúa para vehículos pesados', 12.0),
('Tipo D', 'Grúa rotativa de alto tonelaje', 20.0);

-- Grúas
INSERT INTO gruas (placas, no_economico, id_tipo_grua, marca, modelo, anio, latitud_actual, longitud_actual, estado) VALUES
('GR-001', 'ECO-101', 2, 'Ford', 'F-450', 2020, 19.4326, -99.1332, 'DISPONIBLE'), -- Centro Histórico
('GR-002', 'ECO-102', 2, 'Chevrolet', '3500', 2021, 19.4194, -99.1456, 'DISPONIBLE'), -- Doctores
('GR-003', 'ECO-103', 1, 'Dodge', 'Ram 4000', 2019, 19.3245, -99.0876, 'OCUPADA'),    -- Iztapalapa
('GR-004', 'ECO-104', 3, 'International', 'DuraStar', 2022, 19.4567, -99.0912, 'MANTENIMIENTO'), -- Aragón
('GR-005', 'ECO-105', 2, 'Kenworth', 'T370', 2023, 19.3900, -99.1600, 'DISPONIBLE'), -- Narvarte
('GR-006', 'ECO-106', 1, 'Ford', 'F-550', 2018, 19.2900, -99.1500, 'DISPONIBLE'), -- Tlalpan
('GR-007', 'ECO-107', 4, 'Peterbilt', '337', 2021, 19.3500, -99.2000, 'DISPONIBLE'), -- Álvaro Obregón
('GR-008', 'ECO-108', 2, 'Hino', '338', 2022, 19.5000, -99.1200, 'DISPONIBLE'), -- Indios Verdes
('GR-009', 'ECO-109', 3, 'Freightliner', 'M2', 2020, 19.3600, -99.0500, 'DISPONIBLE'), -- Iztacalco
('GR-010', 'ECO-110', 1, 'RAM', '5500', 2023, 19.4200, -99.1800, 'DISPONIBLE'); -- Polanco

-- Depósitos
INSERT INTO depositos (nombre, id_ubicacion, capacidad_total, capacidad_ocupada, telefono, horario_atencion) VALUES
('Depósito Vehicular Módulo 39', 1, 500, 120, '55-1234-5678', '24 horas'),
('Corralón Iztapalapa 2', 2, 800, 450, '55-8765-4321', '08:00 - 20:00'),
('Depósito Norte', 3, 600, 300, '55-1122-3344', '24 horas');

-- Usuarios de Depósito
INSERT INTO usuarios_deposito (nombre_completo, username, password_hash, rol, id_deposito) VALUES
('Administrador General', 'admin_main', 'hash_admin_secret', 'ADMIN_GENERAL', NULL),
('Roberto Gomez', 'admin_dep1', 'hash_secret', 'ADMIN_DEPOSITO', 1),
('Maria Delgado', 'recep_dep1', 'hash_secret', 'RECEPCION', 1),
('Carlos Ruiz', 'oper_dep2', 'hash_secret', 'OPERADOR_DEPOSITO', 2);

-- Asociación Grúa - Depósito
INSERT INTO asociacion_grua_deposito (id_grua, id_deposito) VALUES
(1, 1), (2, 1), (3, 2), (4, 3), (5, 2), (6, 3), (7, 1), (8, 2), (9, 3), (10, 1);

-- Solicitudes de Arrastre (Ejemplo)
-- Primero insertamos una ubicación de origen para el arrastre
INSERT INTO ubicacion (municipio, vialidad, numero_exterior, nombre_asentamiento, codigo_postal, nombre_entidad, coordenadas) VALUES
('Benito Juárez', 'Av. Universidad', '1200', 'Xoco', '03330', 'Ciudad de México', '19.3625,-99.1628');

INSERT INTO solicitudes_arrastre (folio, id_grua, id_deposito_destino, id_ubicacion_origen, placas_vehiculo, marca_vehiculo, color_vehiculo, tipo_vehiculo, estatus_servicio, motivo_arrastre) VALUES
('SERV-2024001', 3, 2, 4, 'XYZ-987', 'Nissan', 'Rojo', 'Sedan', 'EN_PROCESO', 'Estacionamiento prohibido')
ON CONFLICT (folio) DO NOTHING;

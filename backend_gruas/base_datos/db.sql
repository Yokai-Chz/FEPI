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
    no_economico VARCHAR(50) UNIQUE,
    id_tipo_grua INTEGER REFERENCES cat_tipo_grua(id_tipo_grua),
    marca VARCHAR(50),
    modelo VARCHAR(50),
    anio INTEGER,
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
    
    -- Datos operativos del agente
    id_agente VARCHAR(50),
    referencia_manual TEXT,

    -- Datos del vehículo arrastrado
    placas_vehiculo VARCHAR(15),
    marca_vehiculo VARCHAR(50),
    color_vehiculo VARCHAR(30),
    tipo_vehiculo VARCHAR(50),
    tiene_llaves BOOLEAN DEFAULT FALSE,
    es_foraneo BOOLEAN DEFAULT FALSE,
    inventario_detalles JSONB, -- Se guarda el objeto JSON completo del inventario
    
    -- Vinculación con sistema de infracciones (referencia externa)
    id_infraccion_vinculada INTEGER, 
    
    motivo_arrastre TEXT,
    estatus_servicio VARCHAR(30) DEFAULT 'SOLICITADO' CHECK (estatus_servicio IN ('SOLICITADO', 'ASIGNADO', 'EN_CAMINO', 'EN_PROCESO', 'EN_DEPOSITO', 'CANCELADO')),
    
    observaciones TEXT
);

-- INSERCIÓN DE DATOS REALES (Fuente: SSC CDMX)

-- Ubicaciones de Depósitos
INSERT INTO ubicacion (municipio, vialidad, numero_exterior, nombre_asentamiento, codigo_postal, nombre_entidad, coordenadas) VALUES
('Azcapotzalco', 'Avenida Benito Juárez', 'S/N', 'San Martin Xochinahuac', '02120', 'Ciudad de México', '19.5091,-99.1894'), -- Culturas
('Azcapotzalco', 'Cerrada de Francisco Villa', 'S/N', 'San Pedro Xalpa', '02710', 'Ciudad de México', '19.4975,-99.2086'), -- Las Armas
('Gustavo A. Madero', 'Avenida Talismán', 'S/N', 'San Juan de Aragón I Sección', '07969', 'Ciudad de México', ''),
('Gustavo A. Madero', 'Avenida Insurgentes Norte', 'S/N', 'Santa Isabel Tola', '07010', 'Ciudad de México', '19.4907,-99.1197'), -- Indios Verdes
('Iztacalco', 'Añil', '705', 'Granjas México', '08400', 'Ciudad de México', ''),
('Iztacalco', 'Juan N. Álvarez', 'S/N', 'Campamento 02 de octubre', '08930', 'Ciudad de México', ''),
('Iztacalco', 'Eje 3 Oriente Francisco del Paso y Troncoso', 'S/N', 'Barrio San Miguel', '08650', 'Ciudad de México', ''),
('Iztapalapa', 'Avenida Fuerte de Loreto', 'S/N', 'Ejercito de Agua Prieta', '09578', 'Ciudad de México', ''),
('Iztacalco', 'Avenida Rio Churubusco', 'S/N', 'Carlos Zapata Vela', '08040', 'Ciudad de México', ''),
('Iztapalapa', 'Calle 3', 'S/N', 'Chinampac de Juárez', '09208', 'Ciudad de México', '19.3836,-99.0391'), -- Módulo 39
('Iztapalapa', 'Eje 5 Sur', 'S/N', 'Ejercito de Agua Prieta', '09578', 'Ciudad de México', ''),
('Miguel Hidalgo', 'Presa Salinillas', '400', 'Irrigación', '11500', 'Ciudad de México', ''),
('Tláhuac', 'Juan Mendoza', 'S/N', 'San José', '13020', 'Ciudad de México', ''),
('Tláhuac', 'Canal de Chalco', 'S/N', 'Del Mar', '13270', 'Ciudad de México', '19.2941,-99.0625'), -- Piraña II
('Xochimilco', 'Capulines', 'S/N', 'Barrio de Xaltocan', '16090', 'Ciudad de México', ''),
('Cuauhtémoc', 'Calle Nezahualcóyotl', 'S/N', 'Centro', '06080', 'Ciudad de México', ''),
('Xochimilco', 'Anillo Periférico Oriente', 'S/N', 'San Lorenzo la Cebada', '16035', 'Ciudad de México', ''),
('Xochimilco', 'Camino Viejo a Santiago', '16030', 'Ampliación La Noria', '16030', 'Ciudad de México', '19.2618,-99.1158'), -- La Noria
('Miguel Hidalgo', 'Calle Lago Ginebra', 'S/N', 'Cuauhtémoc Pensil', '11490', 'Ciudad de México', ''),
('Gustavo A. Madero', 'Eje Central Lázaro Cárdenas', 'S/N', 'Magdalena de las Salinas', '07760', 'Ciudad de México', ''),
('Venustiano Carranza', 'Calle Genaro García', 'S/N', 'Jardín Balbuena', '15900', 'Ciudad de México', ''),
('Coyoacán', 'Viaducto Tlalpan', '3333', 'Viejo Ejido Santa Úrsula Coapa', '04980', 'Ciudad de México', ''),
('Cuauhtémoc', 'Fresno', 'S/N', 'Atlampa', '06450', 'Ciudad de México', ''),
('Magdalena Contreras', 'Principal', 'S/N', 'Tierra Unida', '10369', 'Ciudad de México', ''),
('Álvaro Obregón', 'Avenida Santa Fe', 'S/N', 'Santa Fe Peña Blanca', '01376', 'Ciudad de México', '19.3647,-99.2743'), -- Santa Fe
('Álvaro Obregón', 'Dr. Alfonso Caso Andrade', 'S/N', 'Las Águilas', '01710', 'Ciudad de México', '');

-- Tipos de Grúa
INSERT INTO cat_tipo_grua (tipo, descripcion, capacidad_toneladas) VALUES
('Tipo A', 'Grúa de pluma para vehículos ligeros', 3.5),
('Tipo B', 'Grúa de plataforma para vehículos ligeros y medianos', 6.0),
('Tipo C', 'Grúa para vehículos pesados', 12.0),
('Tipo D', 'Grúa rotativa de alto tonelaje', 20.0);

-- Grúas
INSERT INTO gruas (placas, no_economico, id_tipo_grua, marca, modelo, anio, estado) VALUES
('GR-001', 'ECO-1001', 2, 'Ford', 'F-450', 2020, 'DISPONIBLE'),
('GR-002', 'ECO-1002', 2, 'Chevrolet', '3500', 2021, 'DISPONIBLE'),
('GR-003', 'ECO-1003', 1, 'Dodge', 'Ram 4000', 2019, 'OCUPADA'),
('GR-004', 'ECO-1004', 3, 'International', 'DuraStar', 2018, 'MANTENIMIENTO');

-- Depósitos
INSERT INTO depositos (nombre, id_ubicacion, capacidad_total, capacidad_ocupada, telefono, horario_atencion) VALUES
('Depósito Vehicular Culturas', 1, 500, 0, '5589448811', '08:00 - 20:00'),
('Depósito Vehicular Las Armas', 2, 500, 0, '5589331700', '08:00 - 20:00'),
('Depósito Vehicular El Zarco', 3, 500, 0, '5557717855', '08:00 - 20:00'),
('Depósito Vehicular Indios Verdes', 4, 500, 0, '5557481757', '08:00 - 20:00'),
('Depósito Vehicular Añil', 5, 500, 0, '5517161844', '08:00 - 20:00'),
('Depósito Vehicular La Viga', 6, 500, 0, '5556331400', '08:00 - 20:00'),
('Depósito Vehicular Troncoso', 7, 500, 0, '5555908041', '08:00 - 20:00'),
('Depósito Vehicular Santa Cruz', 8, 500, 0, '5526336772', '08:00 - 20:00'),
('Depósito Vehicular Central de Abastos', 9, 500, 0, '5557688554', '08:00 - 20:00'),
('Depósito Vehicular Módulo 39', 10, 500, 0, '5557738986', '08:00 - 20:00'),
('Depósito Vehicular Fuerte Loreto', 11, 500, 0, NULL, '08:00 - 20:00'),
('Depósito Vehicular Salinillas', 12, 500, 0, '5589448947', '08:00 - 20:00'),
('Depósito Vehicular Tláhuac', 13, 500, 0, '5571599385', '08:00 - 20:00'),
('Depósito Vehicular Piraña II', 14, 500, 0, '5550871491', '08:00 - 20:00'),
('Depósito Vehicular Xochimilco', 15, 500, 0, '5589361204', '08:00 - 20:00'),
('Depósito Vehicular Centro Histórico', 16, 500, 0, '5550866269', '08:00 - 20:00'),
('Depósito Vehicular Cuemanco', 17, 500, 0, NULL, '08:00 - 20:00'),
('Depósito Vehicular La Noria', 18, 500, 0, '5572581808', '08:00 - 20:00'),
('Depósito Vehicular Río San Joaquín', 19, 500, 0, '5589488415', '08:00 - 20:00'),
('Depósito Vehicular Cien Metros', 20, 500, 0, '5589449375', '08:00 - 20:00'),
('Depósito Vehicular Velódromo', 21, 500, 0, '5571582114', '08:00 - 20:00'),
('Depósito Vehicular Coyoacán', 22, 500, 0, '5563795688', '08:00 - 20:00'),
('Depósito Vehicular Fresno', 23, 500, 0, '5589714160', '08:00 - 20:00'),
('Depósito Vehicular Tierra Unida', 24, 500, 0, NULL, '08:00 - 20:00'),
('Depósito Vehicular Santa Fe', 25, 500, 0, '5589583225', '08:00 - 20:00'),
('Depósito Vehicular Las Águilas', 26, 500, 0, '5589445924', '08:00 - 20:00');

-- Usuarios de Depósito
INSERT INTO usuarios_deposito (nombre_completo, username, password_hash, rol, id_deposito) VALUES
('Administrador General', 'admin_main', 'hash_admin_secret', 'ADMIN_GENERAL', NULL),
('Roberto Gomez', 'admin_dep1', 'hash_secret', 'ADMIN_DEPOSITO', 1),
('Maria Delgado', 'recep_dep1', 'hash_secret', 'RECEPCION', 1),
('Carlos Ruiz', 'oper_dep2', 'hash_secret', 'OPERADOR_DEPOSITO', 2);

-- Asociación Grúa - Depósito
INSERT INTO asociacion_grua_deposito (id_grua, id_deposito) VALUES
(1, 1),
(2, 1),
(3, 2),
(4, 3);

-- Solicitudes de Arrastre (Ejemplo)
-- Primero insertamos una ubicación de origen para el arrastre
INSERT INTO ubicacion (municipio, vialidad, numero_exterior, nombre_asentamiento, codigo_postal, nombre_entidad, coordenadas) VALUES
('Benito Juárez', 'Av. Universidad', '1200', 'Xoco', '03330', 'Ciudad de México', '19.3625,-99.1628');

INSERT INTO solicitudes_arrastre (folio, id_grua, id_deposito_destino, id_ubicacion_origen, placas_vehiculo, marca_vehiculo, color_vehiculo, tipo_vehiculo, estatus_servicio, motivo_arrastre) VALUES
('SERV-2024001', 3, 2, 4, 'XYZ-987', 'Nissan', 'Rojo', 'Sedan', 'EN_PROCESO', 'Estacionamiento prohibido')
ON CONFLICT (folio) DO NOTHING;

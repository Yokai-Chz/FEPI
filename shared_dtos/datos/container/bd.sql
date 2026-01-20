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

CREATE TABLE catalogo_infracciones (
    id_catalogo_infracciones SERIAL PRIMARY KEY,
    articulo VARCHAR(10),
    fraccion VARCHAR(10),
    descripcion TEXT,
    monto VARCHAR(20)
);

CREATE TABLE personas (
    id_persona SERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    apellido_paterno VARCHAR(100),
    apellido_materno VARCHAR(100),
    curp VARCHAR(18) UNIQUE,
    rfc VARCHAR(13) UNIQUE
);

CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    id_persona INTEGER REFERENCES personas(id_persona),
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    tipo_usuario VARCHAR(20) CHECK (tipo_usuario IN ('admin', 'oficial', 'consulta')),    
    borrado BOOLEAN DEFAULT FALSE
);

CREATE TABLE infracciones (
    id_infraccion SERIAL PRIMARY KEY,
    linea_captura VARCHAR(40),
    fecha VARCHAR(30),
    ubicacion_infraccion INTEGER REFERENCES ubicacion(id_ubicacion), 
    vehiculo_infraccionado VARCHAR(15),
    id_usuario INTEGER REFERENCES usuarios(id_usuario),
    ubicacion_infractor INTEGER REFERENCES ubicacion(id_ubicacion),
    licencia_infractor VARCHAR(25),
    estatus_pago BOOLEAN DEFAULT FALSE
);

CREATE TABLE evidencias (
    id_evidencia SERIAL PRIMARY KEY,
    archivo TEXT
);

CREATE TABLE infracciones_evidencias (
    id_infraccion INTEGER REFERENCES infracciones(id_infraccion),
    id_evidencia INTEGER REFERENCES evidencias(id_evidencia),
    PRIMARY KEY (id_infraccion, id_evidencia)
);

CREATE TABLE asociacion_infracciones (
    id_asociacion_infracciones SERIAL PRIMARY KEY, 
    id_catalogo_infraccion INTEGER REFERENCES catalogo_infracciones(id_catalogo_infracciones),
    id_infraccion INTEGER REFERENCES infracciones(id_infraccion)
);


-- 1. Inserciones para la tabla ubicacion
INSERT INTO ubicacion (municipio, vialidad, numero_exterior, nombre_asentamiento, codigo_postal, nombre_entidad, coordenadas)
VALUES
('Municipio A', 'Vialidad 1', '123', 'Asentamiento 1', '12345', 'Entidad A', '19.4326, -99.1332'),
('Municipio B', 'Vialidad 2', '456', 'Asentamiento 2', '23456', 'Entidad B', '20.6597, -103.3496'),
('Municipio C', 'Vialidad 3', '789', 'Asentamiento 3', '34567', 'Entidad C', '25.6866, -100.3161'),
('Municipio D', 'Vialidad 4', '101', 'Asentamiento 4', '45678', 'Entidad D', '22.1565, -100.9855'),
('Municipio E', 'Vialidad 5', '112', 'Asentamiento 5', '56789', 'Entidad E', '19.4326, -99.1332'),
('Municipio F', 'Vialidad 6', '131', 'Asentamiento 6', '67890', 'Entidad F', '20.6597, -103.3496'),
('Municipio G', 'Vialidad 7', '415', 'Asentamiento 7', '78901', 'Entidad G', '25.6866, -100.3161'),
('Municipio H', 'Vialidad 8', '161', 'Asentamiento 8', '89012', 'Entidad H', '22.1565, -100.9855'),
('Municipio I', 'Vialidad 9', '718', 'Asentamiento 9', '90123', 'Entidad I', '19.4326, -99.1332'),
('Municipio J', 'Vialidad 10', '192', 'Asentamiento 10', '01234', 'Entidad J', '20.6597, -103.3496');

-- 2. Inserciones para la tabla catalogo_infracciones (Nuevo catálogo)
INSERT INTO catalogo_infracciones (articulo, fraccion, descripcion, monto)
VALUES
('ART-06', NULL, 'No respetar preferencia de paso o prioridad de uso de peatones.', '10.00'),
('ART-07', 'I', 'Insultar, denigrar o golpear al personal de tránsito.', '20.00'),
('ART-07', 'III', 'Uso indebido del claxon o provocar ruido excesivo con el motor.', '5.00'),
('ART-08', 'I', 'No obedecer indicaciones de agentes o señalización vial.', '10.00'),
('ART-08', 'V', 'Rebasar por la derecha o no dar 1.50m de distancia a ciclistas/motociclistas.', '5.00'),
('ART-09', 'I', 'Exceder límites de velocidad en carriles centrales (Máx. 80 km/h).', '10.00'),
('ART-09', 'II', 'Exceder límites de velocidad en vías primarias (Máx. 50 km/h).', '10.00'),
('ART-09', 'V', 'Exceder velocidad en zonas escolares o de hospitales (Máx. 20 km/h).', '10.00'),
('ART-10', 'VI', 'No respetar la luz roja del semáforo o invadir cruce peatonal.', '10.00'),
('ART-11', 'VIII', 'Dar vuelta en "U" en lugares prohibidos o cerca de curvas.', '20.00'),
('ART-11', 'X-a', 'Circular sobre carriles exclusivos para el transporte público.', '40.00'),
('ART-11', 'XIV', 'Circular detrás de vehículos de emergencia (distancia < 50m).', '20.00'),
('ART-21', 'I', 'Motocicletas: Circular sobre aceras o áreas peatonales.', '10.00'),
('ART-21', 'II', 'Motocicletas: Circular por vías ciclistas exclusivas.', '20.00'),
('ART-30', 'I', 'Estacionarse sobre banquetas, cruces peatonales o ciclovías.', '10.00'),
('ART-30', 'XII', 'Estacionarse en doble o más filas.', '10.00'),
('ART-30', 'XV', 'Estacionarse en lugares para personas con discapacidad.', '20.00'),
('ART-34', 'II', 'Organizar o participar en arrancones (competencias de velocidad).', '21.00'),
('ART-37', 'II-b', 'No utilizar el cinturón de seguridad (conductor y pasajeros).', '5.00'),
('ART-38', 'II-c', 'Cargar personas o animales entre brazos y piernas al conducir.', '10.00'),
('ART-38', 'II-e', 'Utilizar teléfono celular o dispositivos móviles al conducir.', '30.00'),
('ART-39', NULL, 'Transportar menores de 12 años sin sistema de retención infantil.', '5.00'),
('ART-43', 'VII', 'Instalar película de control solar (polarizado) mayor al 20%.', '20.00'),
('ART-44', 'I', 'No portar licencia de conducir o permiso vigente.', '10.00'),
('ART-45', NULL, 'No contar con placas o tarjeta de circulación vigente.', '20.00'),
('ART-46', NULL, 'No contar con póliza de seguro de responsabilidad civil vigente.', '20.00'),
('ART-50', NULL, 'Conducir bajo influjo de alcohol (>0.4 mg/l aire) o narcóticos.', '0.00');

-- 3. Inserciones para la tabla personas
INSERT INTO personas (nombre, apellido_paterno, apellido_materno, curp, rfc)
VALUES
('Juan', 'Pérez', 'Gómez', 'CURP001', 'RFC001'),
('Maria', 'García', 'Hernández', 'CURP002', 'RFC002'),
('José', 'López', 'Martínez', 'CURP003', 'RFC003'),
('Ana', 'Martínez', 'García', 'CURP004', 'RFC004'),
('Luis', 'Hernández', 'Pérez', 'CURP005', 'RFC005'),
('Laura', 'Gómez', 'López', 'CURP006', 'RFC006'),
('Carlos', 'Díaz', 'Sánchez', 'CURP007', 'RFC007'),
('Sofia', 'Ramírez', 'Flores', 'CURP008', 'RFC008'),
('Miguel', 'Torres', 'Reyes', 'CURP009', 'RFC009'),
('Elena', 'Vargas', 'Morales', 'CURP010', 'RFC010');

-- 4. Inserciones para la tabla usuarios
-- NOTA: Se eliminó 'placa_oficial' porque no existe en la definición de la tabla.
INSERT INTO usuarios (id_persona, username, password_hash, tipo_usuario)
VALUES
(1, '11111', '$2b$10$z1ivW2NySj29cjwIVkAP7uB7Aff59sT2ae51TLOaD3RLbOQvZ4WSy', 'admin'),
(2, '22222', '$2b$10$z1ivW2NySj29cjwIVkAP7uB7Aff59sT2ae51TLOaD3RLbOQvZ4WSy', 'oficial'),
(3, '33333', '$2b$10$z1ivW2NySj29cjwIVkAP7uB7Aff59sT2ae51TLOaD3RLbOQvZ4WSy', 'consulta'),
(4, '44444', '$2b$10$z1ivW2NySj29cjwIVkAP7uB7Aff59sT2ae51TLOaD3RLbOQvZ4WSy', 'admin'),
(5, '55555', '$2b$10$z1ivW2NySj29cjwIVkAP7uB7Aff59sT2ae51TLOaD3RLbOQvZ4WSy', 'oficial'),
(6, '66666', '$2b$10$z1ivW2NySj29cjwIVkAP7uB7Aff59sT2ae51TLOaD3RLbOQvZ4WSy', 'consulta'),
(7, '77777', '$2b$10$z1ivW2NySj29cjwIVkAP7uB7Aff59sT2ae51TLOaD3RLbOQvZ4WSy', 'admin'),
(8, '88888', '$2b$10$z1ivW2NySj29cjwIVkAP7uB7Aff59sT2ae51TLOaD3RLbOQvZ4WSy', 'oficial'),
(9, '99999', '$2b$10$z1ivW2NySj29cjwIVkAP7uB7Aff59sT2ae51TLOaD3RLbOQvZ4WSy', 'consulta'),
(10, '00000', '$2b$10$z1ivW2NySj29cjwIVkAP7uB7Aff59sT2ae51TLOaD3RLbOQvZ4WSy', 'admin');

-- 5. Inserciones para la tabla infracciones
-- NOTA: Se cambió 'ubicacion' por 'ubicacion_infraccion' para coincidir con la tabla.
INSERT INTO infracciones (linea_captura, fecha, ubicacion_infraccion, vehiculo_infraccionado, id_usuario, licencia_infractor)
VALUES
('LC1', '2024-01-01', 1, 'ABC-123', 2, 'LIC001'),
('LC2', '2024-01-02', 2, 'DEF-456', 5, 'LIC002'),
('LC3', '2024-01-03', 3, 'GHI-789', 8, 'LIC003'),
('LC4', '2024-01-04', 4, 'JKL-101', 2, 'LIC004'),
('LC5', '2024-01-05', 5, 'MNO-112', 5, 'LIC005'),
('LC6', '2024-01-06', 6, 'PQR-131', 8, 'LIC006'),
('LC7', '2024-01-07', 7, 'STU-415', 2, 'LIC007'),
('LC8', '2024-01-08', 8, 'VWX-161', 5, 'LIC008'),
('LC9', '2024-01-09', 9, 'YZA-718', 8, 'LIC009'),
('LC10', '2024-01-10', 10, 'BCD-192', 2, 'LIC010');

-- 6. Inserciones para la tabla asociacion_infracciones
INSERT INTO asociacion_infracciones (id_catalogo_infraccion, id_infraccion)
VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 6),
(7, 7),
(8, 8),
(9, 9),
(10, 10);
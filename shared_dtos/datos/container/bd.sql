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
    ultima_conexion VARCHAR(30) DEFAULT NULL,
    token_version INTEGER DEFAULT 1,
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
    notas TEXT,
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



-- Inserciones para la tabla ubicacion
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

-- Inserciones para la tabla catalogo_infracciones
INSERT INTO catalogo_infracciones (articulo, fraccion, descripcion, monto)
VALUES
('ART-01', 'I', 'Descripción de la infracción 1', '100.00'),
('ART-02', 'II', 'Descripción de la infracción 2', '150.00'),
('ART-03', 'III', 'Descripción de la infracción 3', '200.00'),
('ART-04', 'IV', 'Descripción de la infracción 4', '250.00'),
('ART-05', 'V', 'Descripción de la infracción 5', '300.00'),
('ART-06', 'VI', 'Descripción de la infracción 6', '350.00'),
('ART-09', 'VII', 'Descripción de la infracción 7', '400.00'),
('ART-10', 'VIII', 'Descripción de la infracción 8', '450.00'),
('ART-12', 'IX', 'Descripción de la infracción 9', '500.00'),
('ART-60', 'X', 'Descripción de la infracción 10', '550.00');

-- Inserciones para la tabla personas
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

-- Inserciones para la tabla usuarios //Contraseñas hasheadas con bcrypt (password: "securepassword")
INSERT INTO usuarios (id_persona, username, password_hash, tipo_usuario)
VALUES
(1, '11111', '$2b$10$ITvnlr2gfsBFeaXvUPKud./LEgZuutG.ECos5TGEISdcy.KD8p7Xu', 'admin'),
(2, '22222', '$2b$10$ITvnlr2gfsBFeaXvUPKud./LEgZuutG.ECos5TGEISdcy.KD8p7Xu', 'oficial'),
(3, '33333', '$2b$10$ITvnlr2gfsBFeaXvUPKud./LEgZuutG.ECos5TGEISdcy.KD8p7Xu', 'consulta'),
(4, '44444', '$2b$10$ITvnlr2gfsBFeaXvUPKud./LEgZuutG.ECos5TGEISdcy.KD8p7Xu', 'admin'),
(5, '55555', '$2b$10$ITvnlr2gfsBFeaXvUPKud./LEgZuutG.ECos5TGEISdcy.KD8p7Xu', 'oficial'),
(6, '66666', '$2b$10$ITvnlr2gfsBFeaXvUPKud./LEgZuutG.ECos5TGEISdcy.KD8p7Xu', 'consulta'),
(7, '77777', '$2b$10$ITvnlr2gfsBFeaXvUPKud./LEgZuutG.ECos5TGEISdcy.KD8p7Xu', 'admin'),
(8, '88888', '$2b$10$ITvnlr2gfsBFeaXvUPKud./LEgZuutG.ECos5TGEISdcy.KD8p7Xu', 'oficial'),
(9, '99999', '$2b$10$ITvnlr2gfsBFeaXvUPKud./LEgZuutG.ECos5TGEISdcy.KD8p7Xu', 'consulta'),
(10, '00000', '$2b$10$ITvnlr2gfsBFeaXvUPKud./LEgZuutG.ECos5TGEISdcy.KD8p7Xu', 'admin');

-- Inserciones para la tabla infracciones
INSERT INTO infracciones (linea_captura, fecha, ubicacion_infraccion, ubicacion_infractor, vehiculo_infraccionado, id_usuario, licencia_infractor, notas, estatus_pago)
VALUES
('LC1', '2024-01-01', 1, 1, 'ABC-123', 2, 'LIC001', 'Sin notas', FALSE),
('LC2', '2024-01-02', 2, 2, 'DEF-456', 5, 'LIC002', 'Sin notas', FALSE),
('LC3', '2024-01-03', 3, 3, 'GHI-789', 8, 'LIC003', 'Sin notas', FALSE),
('LC4', '2024-01-04', 4, 4, 'JKL-101', 2, 'LIC004', 'Sin notas', FALSE),
('LC5', '2024-01-05', 5, 5, 'MNO-112', 5, 'LIC005', 'Sin notas', FALSE),
('LC6', '2024-01-06', 6, 6, 'PQR-131', 8, 'LIC006', 'Sin notas', FALSE),
('LC7', '2024-01-07', 7, 7, 'STU-415', 2, 'LIC007', 'Sin notas', FALSE),
('LC8', '2024-01-08', 8, 8, 'VWX-161', 5, 'LIC008', 'Sin notas', FALSE),
('LC9', '2024-01-09', 9, 9, 'YZA-718', 8, 'LIC009', 'Sin notas', FALSE),
('LC10', '2024-01-10', 10, 10, 'BCD-192', 2, 'LIC010', 'Sin notas', FALSE);

-- Inserciones para la tabla evidencias
INSERT INTO evidencias (archivo)
VALUES
('evidencia1.jpg'),
('evidencia2.png'),
('evidencia3.pdf'),
('evidencia4.jpg'),
('evidencia5.png'),
('evidencia6.pdf'),
('evidencia7.jpg'),
('evidencia8.png'),
('evidencia9.pdf'),
('evidencia10.jpg');

-- Inserciones para la tabla infracciones_evidencias
INSERT INTO infracciones_evidencias (id_infraccion, id_evidencia)
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

-- Inserciones para la tabla asociacion_infracciones
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


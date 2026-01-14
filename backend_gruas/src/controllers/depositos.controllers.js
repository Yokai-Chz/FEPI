import { pool } from "../db.js";

// Función auxiliar para crear la ubicación antes de crear el depósito
// (Similar a como se hace en infracciones, pero simplificado para este contexto si es necesario)
// Asumimos que la ubicación se crea junto con el deposito o se pasa un ID existente.
// Para este ejemplo, implementaremos la creación de ubicación básica si vienen datos de ubicación.

const createUbicacionLocal = async (ubicacionData) => {
    const { municipio, vialidad, numero_exterior, nombre_asentamiento, codigo_postal, nombre_entidad, coordenadas } = ubicacionData;
    const query = `
        INSERT INTO ubicacion (municipio, vialidad, numero_exterior, nombre_asentamiento, codigo_postal, nombre_entidad, coordenadas)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id_ubicacion
    `;
    const values = [municipio, vialidad, numero_exterior, nombre_asentamiento, codigo_postal, nombre_entidad, coordenadas];
    const result = await pool.query(query, values);
    return result.rows[0].id_ubicacion;
};


export const createDeposito = async (req, res) => {
    const { nombre, capacidad_total, telefono, horario_atencion, ubicacion } = req.body;

    // Validación básica
    if (!nombre) {
        return res.status(400).json({ error: "El nombre del depósito es obligatorio." });
    }

    let id_ubicacion = null;
    let client;

    try {
        client = await pool.connect();
        await client.query('BEGIN');

        // 1. Manejar Ubicación
        if (ubicacion && typeof ubicacion === 'object') {
             // Si viene objeto de ubicación, la creamos
            const queryUbi = `
                INSERT INTO ubicacion (municipio, vialidad, numero_exterior, nombre_asentamiento, codigo_postal, nombre_entidad, coordenadas)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING id_ubicacion
            `;
            const valuesUbi = [
                ubicacion.municipio, 
                ubicacion.vialidad, 
                ubicacion.numero_exterior, 
                ubicacion.nombre_asentamiento, 
                ubicacion.codigo_postal, 
                ubicacion.nombre_entidad, 
                ubicacion.coordenadas
            ];
            const resUbi = await client.query(queryUbi, valuesUbi);
            id_ubicacion = resUbi.rows[0].id_ubicacion;
        } else if (req.body.id_ubicacion) {
            // Si viene solo el ID
            id_ubicacion = req.body.id_ubicacion;
        }

        // 2. Crear Depósito
        const query = `
            INSERT INTO depositos (nombre, id_ubicacion, capacidad_total, telefono, horario_atencion)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;
        const values = [nombre, id_ubicacion, capacidad_total, telefono, horario_atencion];
        const result = await client.query(query, values);

        await client.query('COMMIT');
        res.status(201).json(result.rows[0]);

    } catch (err) {
        if (client) await client.query('ROLLBACK');
        console.error(err);
        return res.status(500).json({ error: "Error al crear el depósito" });
    } finally {
        if (client) client.release();
    }
};

export const getDepositos = async (req, res) => {
    try {
        const query = `
            SELECT d.*, 
                   u.municipio, u.vialidad, u.numero_exterior, u.nombre_asentamiento, u.codigo_postal
            FROM depositos d
            LEFT JOIN ubicacion u ON d.id_ubicacion = u.id_ubicacion
            WHERE d.estatus = true
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Error al obtener depósitos" });
    }   
};

export const getDeposito = async (req, res) => {
    const { id } = req.params;
    try {
        const query = `
            SELECT d.*, 
                   u.municipio, u.vialidad, u.numero_exterior, u.nombre_asentamiento, u.codigo_postal, u.nombre_entidad, u.coordenadas
            FROM depositos d
            LEFT JOIN ubicacion u ON d.id_ubicacion = u.id_ubicacion
            WHERE d.id_deposito = $1
        `;
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Depósito no encontrado" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Error al obtener el depósito" });
    }  
};

export const updateDeposito = async (req, res) => {
    const { id } = req.params;
    const { nombre, capacidad_total, capacidad_ocupada, telefono, horario_atencion, estatus } = req.body;

    try {
        const query = `
            UPDATE depositos
            SET nombre = $1, capacidad_total = $2, capacidad_ocupada = $3, telefono = $4, horario_atencion = $5, estatus = $6
            WHERE id_deposito = $7
            RETURNING *
        `;
        const values = [nombre, capacidad_total, capacidad_ocupada, telefono, horario_atencion, estatus, id];
        const result = await pool.query(query, values);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Depósito no encontrado" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Error al actualizar el depósito" });
    }
};

export const deleteDeposito = async (req, res) => {
    const { id } = req.params;
    try {
        // Soft delete
        const query = `UPDATE depositos SET estatus = false WHERE id_deposito = $1`;
        const result = await pool.query(query, [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Depósito no encontrado" });
        }

        res.status(204).send();
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Error al eliminar el depósito" });
    }
};

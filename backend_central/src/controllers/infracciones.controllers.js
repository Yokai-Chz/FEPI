import { pool } from "../db.js";

export const createInfraccion = (req, res) => {
    const {
        articulo_id,
        fecha_hora,
        lugar,
        descripcion,
        placas,
        conductor_id,
        agente_id
    } = req.body;

    const query = `
        INSERT INTO infracciones 
        (articulo_id, fecha_hora, lugar, descripcion, placas, conductor_id, agente_id) 
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
    
    const values = [
        articulo_id,
        fecha_hora,
        lugar,
        descripcion,
        placas,
        conductor_id || null,
        agente_id
    ];

    pool.query(query, values, (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Database insertion error" });
        }
        res.status(201).json(result.rows[0]);
    });
}

export const getInfracciones = (req, res) => {
    pool.query("SELECT * FROM infracciones", (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Database query error" });
        }
        res.json(result.rows);
    });
}

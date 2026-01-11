import { pool } from "../db.js";

export const getCatalogo = (req, res) => {
    pool.query("SELECT * FROM catalogoInfracciones", (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Database query error" });
        }
        res.json(result.rows);
    });
}


import { pool } from "../db.js";

export const getCatalogo = async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM "catalogoInfracciones"`);
        res.json(result.rows);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Database query error" });
    }
}
import { pool } from "../db.js";

export const getInfraccionCatalogo = async (req, res, articulo) => {
    try {
        const query = 'SELECT * FROM catalogo_infracciones WHERE articulo = $1';
        const result = await pool.query(query, [articulo]);
        return result.rows[0].id_catalogo_infracciones;
    } catch (error) {
        console.error("Error fetching infraccion catalogo:", error.message);
        res.status(500).json({ error: "Error al obtener el catálogo de infracciones" });
    }
}


export const getCatalogo = async (req, res) => {
    try {
        const query = 'SELECT * FROM catalogo_infracciones';
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching catalogo:", error.message);
        res.status(500).json({ error: "Error al obtener el catálogo" });
    }
}
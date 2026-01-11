import { pool } from "../db.js";

export const createFolio = async (req, res) => {
    try {
        const { id_agente} = req.body;

        // Obtener la fecha actual en formato YYYYMMDD
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const day = today.getDate().toString().padStart(2, '0');
        const datePart = `${year}${month}${day}`;

        // Obtener el último número de folio para el día actual
        const lastFolioQuery = `
            SELECT folio FROM "folioInfracciones"
            WHERE folio LIKE $1 || '%'
            ORDER BY folio DESC
            LIMIT 1;
        `;
        const lastFolioResult = await pool.query(lastFolioQuery, [datePart]);

        let nextSequence = 1;
        if (lastFolioResult.rows.length > 0) {
            const lastFolio = lastFolioResult.rows[0].folio;
            const lastSequence = parseInt(lastFolio.substring(datePart.length), 10);
            nextSequence = lastSequence + 1;
        }

        // Formatear el número de secuencia a 4 dígitos
        const sequencePart = nextSequence.toString().padStart(4, '0');

        // Construir el folio final
        const folio = `${datePart}${sequencePart}`;

        const query = `
            INSERT INTO folios (folio, idOficial)
            VALUES ($1, $2)
            RETURNING *;
        `;
        const values = [folio, id_agente];
        const result = await pool.query(query, values);
        return result.rows[0];
    }
    catch (error) {
        console.error(error);
    }
}
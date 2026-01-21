import { pool } from "../db.js";

export const createEvidencias = async (id_infraccion, evidencias) => {

    const id_evidencias = [];

    for (const evidencia of evidencias) {
        
        const imgenBase64 = evidencia;
        
        if (!imgenBase64) {
            throw new Error("Faltan datos en el JSON para crear evidencia");
        }

        // Insertar solo el archivo en la tabla evidencias
        const query = `
            INSERT INTO evidencias (
                "archivo"
            ) VALUES ($1) RETURNING id_evidencia`;

        const values = [
            imgenBase64
        ];

        const result = await pool.query(query, values);
        
        id_evidencias.push(result.rows[0].id_evidencia);
    }

    const queryAsociarEvidencias = ` 
        INSERT INTO infracciones_evidencias (id_infraccion, id_evidencia)
        VALUES ($1, $2)`;

    for (const id_evidencia of id_evidencias) {
        const valuesAsociar = [id_infraccion, id_evidencia];
        await pool.query(queryAsociarEvidencias, valuesAsociar);
    }

    return; 
}
import { pool } from "../db.js";

export const createGrua = async (req, res) => {
    const { placas, no_economico, id_tipo_grua, marca, modelo, anio, estado } = req.body;

    try {
        const query = `
            INSERT INTO gruas (placas, no_economico, id_tipo_grua, marca, modelo, anio, estado)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        `;

        const values = [placas, no_economico, id_tipo_grua, marca, modelo, anio, estado || 'DISPONIBLE'];

        const result = await pool.query(query, values);

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        if (err.code === '23505') { // Unique violation
            return res.status(409).json({ error: "Ya existe una grúa con esas placas o número económico." });
        }
        return res.status(500).json({ error: "Error en la base de datos al crear la grúa" });
    }
};

export const getGruas = async (req, res) => {
    try {
        const query = `
            SELECT g.*, ctg.tipo as tipo_grua_nombre, ctg.descripcion as tipo_descripcion 
            FROM gruas g
            LEFT JOIN cat_tipo_grua ctg ON g.id_tipo_grua = ctg.id_tipo_grua
            WHERE g.estado != 'FUERA_SERVICIO'
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Error en la base de datos al obtener grúas" });
    }   
};

export const getGrua = async (req, res) => {
    const { id } = req.params;
    
    try {
        const query = `
            SELECT g.*, ctg.tipo as tipo_grua_nombre, ctg.descripcion as tipo_descripcion 
            FROM gruas g
            LEFT JOIN cat_tipo_grua ctg ON g.id_tipo_grua = ctg.id_tipo_grua
            WHERE g.id_grua = $1
        `;
        const result = await pool.query(query, [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Grúa no encontrada" });
        }
        
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Error en la base de datos al obtener la grúa" });
    }  
};

export const updateGrua = async (req, res) => {
    const { id } = req.params;
    const { placas, no_economico, id_tipo_grua, marca, modelo, anio, estado } = req.body;

    try {
        const query = `
            UPDATE gruas 
            SET placas = $1, no_economico = $2, id_tipo_grua = $3, marca = $4, modelo = $5, anio = $6, estado = $7
            WHERE id_grua = $8
            RETURNING *
        `;
        
        const values = [placas, no_economico, id_tipo_grua, marca, modelo, anio, estado, id];
        const result = await pool.query(query, values);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Grúa no encontrada" });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        if (error.code === '23505') {
            return res.status(409).json({ error: "Conflicto con placas o número económico existente." });
        }
        return res.status(500).json({ error: "Error en la base de datos al actualizar la grúa" });
    }
};

export const deleteGrua = async (req, res) => {
    const { id } = req.params;
    
    try {
        // Soft delete: Cambiamos estado a FUERA_SERVICIO
        const query = `UPDATE gruas SET estado = 'FUERA_SERVICIO' WHERE id_grua = $1 RETURNING id_grua`;
        const result = await pool.query(query, [id]);
        
        if (result.rowCount === 0) {
             return res.status(404).json({ error: "Grúa no encontrada" });
        }
        
        res.status(204).send();
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Error en la base de datos al eliminar la grúa" });   
    }
};

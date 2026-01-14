import { pool } from "../db.js";
import bcrypt from "bcryptjs";

export const createUsuario = async (req, res) => {
    const { nombre_completo, username, password, rol, id_deposito } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const query = `
            INSERT INTO usuarios_deposito (nombre_completo, username, password_hash, rol, id_deposito)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id_usuario, nombre_completo, username, rol, id_deposito, activo
        `;

        const values = [nombre_completo, username, hashedPassword, rol, id_deposito];

        const result = await pool.query(query, values);

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        if (err.code === '23505') { // Unique violation
            return res.status(409).json({ error: "El nombre de usuario ya existe." });
        }
        return res.status(500).json({ error: "Error en la base de datos" });
    }
};

export const getUsuario = async (req, res) => {
    const userId = req.params.id;
    if (!userId) {
        return res.status(400).json({ error: "Se requiere un id de usuario valido" });
    }
    
    try {
        const result = await pool.query(`SELECT id_usuario, nombre_completo, username, rol, id_deposito, activo, ultimo_acceso FROM usuarios_deposito WHERE id_usuario = $1`, [userId]);
        const user = result.rows[0];
        
        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        
        res.json(user);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Error en la base de datos" });
    }  
};

export const getUsuarios = async (req, res) => {
    try {
        const result = await pool.query(`SELECT id_usuario, nombre_completo, username, rol, id_deposito, activo, ultimo_acceso FROM usuarios_deposito WHERE activo = true`);
        const users = result.rows;
        res.json(users);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Error en la base de datos" });
    }   
};

export const updateUsuario = async (req, res) => {
    const userId = req.params.id;
    const { nombre_completo, rol, id_deposito } = req.body;
    
    if (!userId) {
        return res.status(400).json({ error: "Se requiere un id de usuario valido" });
    }

    try {
        const query = `
            UPDATE usuarios_deposito 
            SET nombre_completo = $1, rol = $2, id_deposito = $3 
            WHERE id_usuario = $4
            RETURNING id_usuario, nombre_completo, username, rol, id_deposito
        `;
        
        const values = [nombre_completo, rol, id_deposito, userId];
        const result = await pool.query(query, values);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error en la base de datos" });
    }
};

export const deleteUsuario = async (req, res) => {
    const userId = req.params.id;
    if (!userId) {
        return res.status(400).json({ error: "Se requiere un id de usuario valido" });
    }
    
    try {
        // Soft delete
        const response = await pool.query(`UPDATE usuarios_deposito SET activo = false WHERE id_usuario = $1`, [userId]);
        
        if (response.rowCount === 0) {
             return res.status(404).json({ error: "Usuario no encontrado" });
        }
        
        res.status(204).send();
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Error en la base de datos" });   
    }
};

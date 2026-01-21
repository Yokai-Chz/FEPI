import { pool } from "../db.js";
import bcrypt from "bcryptjs";

/*
    Funcion para la creacion de un nuevo oficial
*/
export const createOficial = async (req, res) => {
    const { nombre, apellido_paterno, apellido_materno, curp, rfc, username, password } = req.body;
    const tipo_usuario = 'oficial'; // Hardcoded to 'oficial'

    try {
        // 1. Verificar si la persona ya existe por CURP o RFC
        let personaResult = await pool.query('SELECT id_persona FROM personas WHERE curp = $1 OR rfc = $2', [curp, rfc]);
        let id_persona;

        if (personaResult.rows.length > 0) {
            id_persona = personaResult.rows[0].id_persona;
        } else {
            // Si no existe, crearla
            const newPersona = await pool.query(
                `INSERT INTO personas (nombre, apellido_paterno, apellido_materno, curp, rfc) VALUES ($1, $2, $3, $4, $5) RETURNING id_persona`,
                [nombre, apellido_paterno, apellido_materno, curp, rfc]
            );
            id_persona = newPersona.rows[0].id_persona;
        }

        // 2. Hashear la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Crear el usuario
        const resUsuario = await pool.query(
            `INSERT INTO usuarios (id_persona, username, password_hash, tipo_usuario) VALUES ($1, $2, $3, $4) RETURNING id_usuario, username, tipo_usuario`,
            [id_persona, username, hashedPassword, tipo_usuario]
        );

        res.status(201).json(resUsuario.rows[0]);

    } catch (err) {
        console.error(err);
        if (err.code === '23505') { // Unique violation
            // Check if it's the username that already exists
            const userExists = await pool.query('SELECT id_usuario FROM usuarios WHERE username = $1', [username]);
            if (userExists.rows.length > 0) {
                return res.status(409).json({ error: "El nombre de usuario ya existe." });
            }
            return res.status(409).json({ error: "Un usuario con el mismo CURP o RFC ya ha sido registrado." });
        }
        return res.status(500).json({ error: "Error de base de datos al crear el oficial." });
    }
};

/*
    Funcion para obtener todos los oficiales no borrados
*/
export const getOficiales = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                u.id_usuario,
                u.username,
                u.tipo_usuario,
                u.borrado,
                p.nombre,
                p.apellido_paterno,
                p.apellido_materno,
                p.curp,
                p.rfc
            FROM usuarios u
            JOIN personas p ON u.id_persona = p.id_persona
            WHERE u.tipo_usuario = 'oficial' AND u.borrado = false
        `);
        const users = result.rows;
        res.json(users);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Error de base de datos al obtener los oficiales." });
    }   
};


export const getOficial = async (req, res) => {
    const userId = req.params.id;
    if (!userId) {
        return res.status(400).json({ error: "Se requiere un id de usuario valido" });
    }

    try {
        const result = await pool.query(`
            SELECT 
                u.id_usuario,
                u.username,
                u.tipo_usuario,
                u.borrado,
                p.nombre,
                p.apellido_paterno,
                p.apellido_materno,
                p.curp,
                p.rfc
            FROM usuarios u
            JOIN personas p ON u.id_persona = p.id_persona
            WHERE u.id_usuario = $1 AND u.tipo_usuario = 'oficial'`, 
            [userId]
        );
        const user = result.rows[0];
        
        if (!user) {
            return res.status(404).json({ error: "Oficial no encontrado" });
        }
    
        res.json(user);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Error de base de datos" });
    }  
};

import { pool } from "../db.js";
import bcrypt from "bcryptjs";


/*
    Funcion para la creacion de un nuevo usuario
    1. Hashear la contrasena
    2. Insertar los datos en la tabla personas
    3. Insertar los datos en la tabla usuarios
*/
export const createUser = async (req, res) => {

    /*
        Un ejemplo de cuerpo de solicitud (req.body):
        {
            "nombre": "Juan",
            "apellido_paterno": "Perez",
            "apellido_materno": "Lopez",
            "curp": "PELO800101HDFRRN09",
            "rfc": "PELO800101XXX",
            "username": "juanperez",
            "password": "securepassword",
            "tipo_usuario": "oficial"
        }
    */
    const { nombre, apellido_paterno, apellido_materno, curp, rfc, username, password, tipo_usuario } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const resPersona = await pool.query(
            `INSERT INTO personas (nombre, apellido_paterno, apellido_materno, curp, rfc) VALUES ($1, $2, $3, $4, $5) RETURNING id_persona`,
            [nombre, apellido_paterno, apellido_materno, curp, rfc]
        );
        const id_persona = resPersona.rows[0].id_persona;

        const resUsuario = await pool.query(
            `INSERT INTO usuarios (id_persona, username, password_hash, tipo_usuario) VALUES ($1, $2, $3, $4) RETURNING id_usuario, username, tipo_usuario`,
            [id_persona, username, hashedPassword, tipo_usuario]
        );

        await pool.query('COMMIT');
        res.status(201).json(resUsuario.rows[0]);
    } catch (err) {
        console.error(err);
        if (err.code === '23505') { // Unique violation
            return res.status(409).json({ error: "User, CURP or RFC already exists." });
        }
        return res.status(500).json({ error: "Database error" });
    }
};


/*
    Funcion para obtener un usuario por su ID
*/
export const getUser = async (req, res) => {
    const userId = req.params.id;
    if (!userId) {
        return res.status(400).json({ error: "Se requiere un id de usuario valido" });
    }
    
    try {
        const result = await pool.query(`SELECT * FROM usuarios WHERE id_usuario = $1`, [userId]);
        const user = result.rows[0];
        
        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
    
        res.json(user);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Database error" });
    }  
};


/*
    Funcion para eliminar un usuario por su ID (soft delete)
*/
export const deleteUser = async (req, res) => {
    const userId = req.params.id;
    if (!userId) {
        return res.status(400).json({ error: "Se requiere un id de usuario valido" });
    }
    
    try {
        const response = await pool.query(`UPDATE usuarios SET borrado = true WHERE id_usuario = $1 `, [userId]);
        res.status(204).send("Successfully deleted");
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Database error" });   
    }
};


/*
    Funcion para actualizar los datos de una persona asociada a un usuario
*/
export const updateUser = async (req, res) => {
    const userId = req.params.id;
    const { nombre, apellido_paterno, apellido_materno, curp, rfc } = req.body;
    if (!userId) {
        return res.status(400).json({ error: "Se requiere un id de usuario valido" });
    }
    try {
        const resultUser = await pool.query(`SELECT id_persona FROM usuarios WHERE id_usuario = $1`, [userId]);
        const id_persona = resultUser.rows[0].id_persona;

        const response = await pool.query(
            `UPDATE personas SET nombre = $1, apellido_paterno = $2, apellido_materno = $3, curp = $4, rfc = $5 WHERE id_persona = $6`,
            [nombre, apellido_paterno, apellido_materno, curp, rfc, id_persona]
        );
        if (response.rowCount === 0) {
            return res.status(404).json({ error: "Persona no encontrada" });
        }

        res.status(200).send("Successfully updated");
    } catch (error) {
        
    }
};


/*
    Funcion para obtener todos los usuarios no borrados
*/
export const getUsers = async (req, res) => {
    
    try {
        const result = await pool.query(`SELECT * FROM usuarios WHERE borrado = false`);
        const users = result.rows;
        res.json(users);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Database error" });
    }   
};


/*
    Funcion para actualizar la ultima conexion de un usuario
*/
export const updateLastConnection = async (userId) => {
    try {
        const timestamp = new Date().toISOString();
        await pool.query(
            `UPDATE usuarios SET ultima_conexion = $1 WHERE id_usuario = $2`,
            [timestamp, userId]
        );
    } catch (err) {
        console.error("Error updating last connection:", err);
    }
};


/*
    Funcion para actualizar la contrasena de un usuario
*/
export const updatePassword = async (userId, newPassword) => {
    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await pool.query(
            `UPDATE usuarios SET password_hash = $1 WHERE id_usuario = $2`,
            [hashedPassword, userId]
        );
    } catch (err) {
        console.error("Error updating password:", err);
    }
}; 


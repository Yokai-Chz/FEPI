import { pool } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// In a real application, this secret should be in an environment variable
const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey";

export const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
    }

    try {
        const result = await pool.query(`SELECT * FROM "usuarios" WHERE username = $1`, [username]);
        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
    
        const isPasswordCorrect = await bcrypt.compare(password, user.password_hash);

        if (!isPasswordCorrect) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // HU002: Lógica de primer ingreso (si ultima_conexion es null)
        const primerIngreso = user.ultima_conexion === null;

        // HU002: Control de sesión única (incrementamos versión del token)
        const nuevoTokenVersion = (user.token_version || 0) + 1;
        
        await pool.query(
            `UPDATE "usuarios" SET token_version = $1, ultima_conexion = $2 WHERE id_usuario = $3`,
            [nuevoTokenVersion, new Date().toISOString(), user.id_usuario]
        );
        
        const personaResult = await pool.query(
            'SELECT apellido_paterno FROM "personas" WHERE id_persona = $1',
            [user.id_persona]
        )

        const persona = personaResult.rows[0];

        // Incluimos token_version en el JWT para validación futura en middleware
        const token = jwt.sign(
            { 
                id_usuario: user.id_usuario, 
                username: user.username,
                apellido: persona.apellido_paterno,
                primer_ingreso: primerIngreso,
                token_version: nuevoTokenVersion 
            }, 
            JWT_SECRET, 
            { expiresIn: "8h" } // HU002: Expiración de 8 horas
        );
        
        res.status(200).json({ 
            token,
            mensaje: primerIngreso ? "Primer inicio de sesión detectado. Se recomienda cambio de contraseña." : "Login exitoso"
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Database error" });
    }
};
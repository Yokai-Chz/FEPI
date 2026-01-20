import jwt from 'jsonwebtoken';
import { pool } from '../db.js';

// In a real application, use an environment variable
const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey";

export const auth = async (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // HU002: Verificación de sesión única (token_version)
    const result = await pool.query('SELECT token_version FROM usuarios WHERE id_usuario = $1', [decoded.id_usuario]);
    const user = result.rows[0];

    if (!user || user.token_version !== decoded.token_version) {
      return res.status(401).json({ error: 'Sesión expirada o iniciada en otro dispositivo' });
    }

    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};
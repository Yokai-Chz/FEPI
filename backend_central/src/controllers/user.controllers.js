import { pool } from "../db.js";
import bcrypt from "bcryptjs";

export const createUser = async (req, res) => {
    const { username, password, email } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            `INSERT INTO "users" (username, password, email) VALUES ($1, $2, $3) RETURNING *`,
            [username, hashedPassword, email]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        if (err.code === '23505') { // Unique violation
            return res.status(409).json({ error: "User already exists." });
        }
        return res.status(500).json({ error: "Database error" });
    }
};

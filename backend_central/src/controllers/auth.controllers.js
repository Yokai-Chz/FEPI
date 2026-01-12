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
        const result = await pool.query(`SELECT * FROM "users" WHERE username = $1`, [username]);
        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
            expiresIn: "3h",
        });

        res.json({ token });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Database error" });
    }
};
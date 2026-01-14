import { pool } from "../db.js";

export const getDashboardStats = async (req, res) => {
    try {
        const client = await pool.connect();
        try {
            // 1. Solicitudes de hoy (Equivalente a "infracciones de hoy" en contexto de grúas)
            // Usamos la fecha del servidor de BD para consistencia
            const querySolicitudesHoy = `
                SELECT COUNT(*) as total 
                FROM solicitudes_arrastre 
                WHERE CAST(fecha_solicitud AS DATE) = CURRENT_DATE
            `;

            // 2. Grúas Disponibles
            const queryGruasDisponibles = `
                SELECT COUNT(*) as total 
                FROM gruas 
                WHERE estado = 'DISPONIBLE'
            `;

            // 3. Capacidad de Corralones (Global)
            const queryCapacidad = `
                SELECT SUM(capacidad_total) as total_espacios, SUM(capacidad_ocupada) as espacios_ocupados
                FROM depositos 
                WHERE estatus = true
            `;

            // Ejecutamos en paralelo
            const [resSolicitudes, resGruas, resCapacidad] = await Promise.all([
                client.query(querySolicitudesHoy),
                client.query(queryGruasDisponibles),
                client.query(queryCapacidad)
            ]);

            const capacidadTotal = parseInt(resCapacidad.rows[0].total_espacios || 0);
            const capacidadOcupada = parseInt(resCapacidad.rows[0].espacios_ocupados || 0);
            const porcentajeOcupacion = capacidadTotal > 0 ? ((capacidadOcupada / capacidadTotal) * 100).toFixed(2) : 0;

            res.json({
                solicitudes_hoy: parseInt(resSolicitudes.rows[0].total || 0),
                gruas_disponibles: parseInt(resGruas.rows[0].total || 0),
                capacidad_corralones: {
                    total: capacidadTotal,
                    ocupada: capacidadOcupada,
                    disponible: capacidadTotal - capacidadOcupada,
                    porcentaje_ocupacion: `${porcentajeOcupacion}%`
                }
            });

        } finally {
            client.release();
        }
    } catch (err) {
        console.error("Error en dashboard stats:", err);
        res.status(500).json({ error: "Error al obtener estadísticas del dashboard" });
    }
};

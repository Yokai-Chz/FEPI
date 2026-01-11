import { pool } from "../db.js";
import { createUbicacion } from "./ubicacion.controllers.js";
import { getVehiculo } from "./vehiculos.controllers.js";

export const createInfraccion = async (req, res) => {
    try {
        const { placa, niv, latitud, longitud, articulo_id, fecha_hora, descripcion, conductor_id, agente_id } = req.body;

        // Validamos que lleguen los datos del body
        if (!latitud || !longitud) {
            return res.status(400).json({ error: "Faltan latitud o longitud en el JSON" });
        }

        if (!placa && !niv) {
            return res.status(400).json({ error: "Faltan placa o niv en el JSON" });
        }

        // Obtenemos el id de la ubicación guardada en la base de datos
        const previewUbicacion = await createUbicacion(req, res);
        if (!previewUbicacion) return; // createUbicacion ya manejó el error

        // Validamos si tiene reporte de robo
        const reporteVehiculo = await getVehiculo(req, res); 
        if (!reporteVehiculo) return; // getVehiculo ya manejó el error

        const query = `
            INSERT INTO infracciones 
            (articulo_id, fecha_hora, ubicacion_id, descripcion, placas, conductor_id, agente_id, tiene_reporte_robo) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`;

        const values = [
            articulo_id,
            fecha_hora || 'NOW()',
            previewUbicacion, // ID retornado por createUbicacion
            descripcion,
            reporteVehiculo.placa || placa,
            conductor_id,
            agente_id,
            reporteVehiculo.tieneReporteRobo
        ];

        const result = await pool.query(query, values);
        res.json(result.rows[0]);

    } catch (error) {
        console.error(error);
        if (!res.headersSent) {
            res.status(500).json({ error: "Error en el servidor al crear la infracción" });
        }
    }
}

export const getInfracciones = (req, res) => {
    res.json({ mensaje: "Aquí se listarían las infracciones (Funcionalidad no implementada aún)" });
}

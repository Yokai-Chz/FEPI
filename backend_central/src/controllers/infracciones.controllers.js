import { pool } from "../db.js";
import { createUbicacion } from "./ubicacion.controllers.js";

export const createInfraccion = async (req, res) => {
    try {
        const { latitud, longitud } = req.body;

        // Validamos que lleguen los datos del body
        if (!latitud || !longitud) {
            return res.status(400).json({ error: "Faltan latitud o longitud en el JSON" });
        }

        // Obtenemos la previsualización de la ubicación
        const previewUbicacion = await createUbicacion(req, res);

        if (previewUbicacion) {
            // Respondemos con lo que se enviaría a la base de datos
            res.status(200).json({
                mensaje: "Previsualización de datos lista (No se guardó en BD)",
                datos_a_insertar: {
                    ...previewUbicacion,
                    // Aquí puedes agregar otros campos de la infracción que vengan en el body
                    articulo_id: req.body.articulo_id || "Pendiente",
                    placas: req.body.placas || "Pendiente"
                }
            });
        }

    } catch (error) {
        res.status(500).json({ error: "Error en el servidor de previsualización" });
    }
}

export const getInfracciones = (req, res) => {
    res.json({ mensaje: "Aquí se listarían las infracciones (Funcionalidad no implementada aún)" });
}

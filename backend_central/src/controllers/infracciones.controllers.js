import { pool } from "../db.js";
import { createUbicacion } from "./ubicacion.controllers.js";
import { getVehiculo } from "./vehiculos.controllers.js";
import { createFolio } from "./folios.controllers.js";
import { getLineaCaptura } from "./lineaCaptura.controllers.js";

export const createInfraccion = async (req, res) => {
    try {
        const { placa, niv, latitud, longitud, articulo_id, fecha_hora, descripcion, conductor_id, agente_id, infracciones} = req.body;

        // Validamos que lleguen los datos del body
        if (!latitud || !longitud) {
            return res.status(400).json({ error: "Faltan latitud o longitud en el JSON" });
        }

        if (!placa && !niv) {
            return res.status(400).json({ error: "Faltan placa o niv en el JSON" });
        }

        // Necesita: latitud , longitud
        const previewUbicacion = await createUbicacion(req, res);
        if (!previewUbicacion) return; 

        // Necesita: placa o niv
        const reporteVehiculo = await getVehiculo(req, res); 
        if (!reporteVehiculo) return; 

        // Necesita: id_agente
        const folioInfraccion = await createFolio(req, res);
        if (!folioInfraccion) return;

        // Necesita: placa, motivosIds(infracciones), id_agente, folioInfraccion
        const lineaCaptura = await getLineaCaptura(req, res);
        if (!lineaCaptura) return;



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

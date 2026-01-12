import { createUbicacion } from "./ubicacion.controllers.js";
import { getVehiculo } from "./vehiculos.controllers.js";
import { createFolio } from "./folios.controllers.js";
import { getLineaCaptura } from "./lineaCaptura.controllers.js";
import { pool } from "../db.js";

export const createInfraccion = async (req, res) => {
    try {
        const { fecha, latitud, longitud, placa, niv, id_agente, id_licencia, descripcion, infracciones} = req.body;

        // Validamos que lleguen los datos del body
        if (!latitud || !longitud) {
            return res.status(400).json({ error: "Faltan latitud o longitud en el JSON" });
        }

        if (!placa && !niv) {
            return res.status(400).json({ error: "Faltan placa o niv en el JSON" });
        }

        // Necesita: latitud , longitud
        const ubicacion = await createUbicacion(req, res);
        if (!ubicacion) return; 

        // Necesita: placa o niv
        const reporteVehiculo = await getVehiculo(req, res); 
        if (!reporteVehiculo) return; 

        const id_vehiculo = reporteVehiculo.placa || reporteVehiculo.niv;

        // Necesita: id_agente
        const folioInfraccion = await createFolio(req, res);
        if (!folioInfraccion) return;

        // Necesita: placa, motivosIds(infracciones), id_agente, folioInfraccion
        const lineaCaptura = await getLineaCaptura(req, res);
        if (!lineaCaptura) return;

        const nuevaInfraccion = {
            folioInfraccion,
            lineaCaptura,
            fecha,
            ubicacion,
            id_vehiculo,
            id_agente,
            descripcion,
            id_licencia
        };

        pool.query(`INSERT INTO "infracciones" (folio_infraccion, linea_captura, fecha, ubicacion_id, id_vehiculo, id_agente, descripcion, id_licencia) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [
            nuevaInfraccion.folioInfraccion,
            nuevaInfraccion.lineaCaptura,
            nuevaInfraccion.fecha,
            nuevaInfraccion.ubicacion.id,
            nuevaInfraccion.id_vehiculo,
            nuevaInfraccion.id_agente,
            nuevaInfraccion.descripcion,
            nuevaInfraccion.id_licencia
        ]);
        
        res.status(201).json({ mensaje: "Infracción creada exitosamente", infraccion: nuevaInfraccion });

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

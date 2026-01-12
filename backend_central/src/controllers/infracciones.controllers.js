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
        const ubicacion_id = await createUbicacion(req, res);
        if (!ubicacion_id) return; 

        // Necesita: placa o niv
        const reporteVehiculo = await getVehiculo(req, res); 
        if (!reporteVehiculo) return; 

        const id_vehiculo = reporteVehiculo.placa || reporteVehiculo.niv;
        
        // Necesita: id_agente
        const folioInfraccion = await createFolio(req, res);
        if (!folioInfraccion) return;

        const newFolio = folioInfraccion.folioInfraccion;
        const idOficial = folioInfraccion.idOficial;

        // Necesita: placa, motivosIds(infracciones), id_agente, folioInfraccion
        const lineaCaptura = await getLineaCaptura(req, res, folioInfraccion);
        if (!lineaCaptura) return;

        const nuevaInfraccion = {
            folioInfraccion: newFolio,
            lineaCaptura,
            fecha,
            ubicacion: ubicacion_id,
            id_vehiculo,
            id_agente: idOficial,
            descripcion,
        };

        const query = `
            INSERT INTO "infracciones" (
                "folioInfraccion", 
                "lineaCaptura", 
                fecha, 
                ubicacion, 
                "vehiculoInfraccionado", 
                "idOficial", 
                "descripcionConducta" 
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)`;

        const values = [
            nuevaInfraccion.folioInfraccion,
            nuevaInfraccion.lineaCaptura,
            nuevaInfraccion.fecha,
            nuevaInfraccion.ubicacion,
            nuevaInfraccion.id_vehiculo,
            nuevaInfraccion.id_agente,
            nuevaInfraccion.descripcion
        ];

        console.log("Nueva infracción a guardar:", nuevaInfraccion);

        pool.query(query, values);
        
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

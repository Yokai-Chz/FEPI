import { createUbicacion } from "./ubicacion.controllers.js";
import { getVehiculo } from "./vehiculos.controllers.js";
import { getLineaCaptura } from "./lineaCaptura.controllers.js";
import { createAsociacionInfraccion } from "./asociacion_infracciones.controllers.js";
import { pool } from "../db.js";

const fechaEsValida = (fecha) => {
    // todo: agregar revisiones adicionales a la fecha:
    // que sea reciente a la fecha de peticion post, para que no sea posible crear infracciones mucho despues de la fecha
    if(fecha) {
        return true;
    } else {
        return false;
    }
}

const agenteExiste = (id_agente) => {
    // todo
    return true;
}

const licenciaExiste = (id_licencia) => {
    // todo
    return true;
}

export const createInfraccion = async (req, res) => {
    try {
        const { fecha, latitud, longitud, placa, niv, id_agente, id_licencia, infracciones} = req.body;

        // Validamos que lleguen los datos del body
        if (!latitud || !longitud) {
            return res.status(400).json({ error: "Faltan latitud o longitud en el JSON" });
        }
        
        const fechaValida = fechaEsValida(fecha);
        if(!fechaValida) {
            return res.status(400).json({error: "La fecha proporcionado no existe o no es valida"})
        }

        if (!placa && !niv) {
            return res.status(400).json({ error: "Faltan placa y niv en el JSON" });
        }

        if(!agenteExiste(id_agente)) {
            return res.status(400).json({ error: "id de agente invalido" });
        }

        if(!licenciaExiste(id_licencia)) {
            return res.status(400).json({ error: "id licencia invalido" });
        }

        // Necesita: latitud , longitud
        const ubicacion_id = await createUbicacion(req, res);
        if (!ubicacion_id) return; 

        // Necesita: placa o niv
        const reporteVehiculo = await getVehiculo(req, res); 
        if (!reporteVehiculo) return; 

        const id_vehiculo = reporteVehiculo.placa || reporteVehiculo.niv;

        const nuevaInfraccion = {
            fecha, 
            ubicacion: ubicacion_id, 
            id_vehiculo, 
            id_agente, 
            id_licencia,
        };

        const query = `
            INSERT INTO "infracciones" (
                "fecha", 
                "ubicacion", 
                "vehiculo_infraccionado", 
                "id_usuario", 
                "licencia_infractor" 
            ) VALUES ($1, $2, $3, $4, $5) RETURNING id_infraccion`;

        const values = [
            nuevaInfraccion.fecha,
            nuevaInfraccion.ubicacion,
            nuevaInfraccion.id_vehiculo,
            nuevaInfraccion.id_agente,
            nuevaInfraccion.id_licencia
        ];

        let errorHappened = false;
        try {
            // Iniciamos un rollback por si sucede un error dentro de los siguientes funciones
            // ocupamos un solo cliente para poder ligar todos los queries
            const client = await pool.connect();
            client.query('BEGIN');

            const response = await client.query(query, values);
            const infraccion_id = response.rows[0].id_infraccion;


            createAsociacionInfraccion(req, res, client, infraccion_id, infracciones);

            const lineaCaptura = await getLineaCaptura(req, res, infraccion_id);

            const queryLineaCaptura = `
            UPDATE "infracciones" 
            SET "linea_captura" = $1 
            WHERE "id_infraccion" = $2
        `;
            const valuesLineaCaptura = [lineaCaptura, infraccion_id];

            await pool.query(queryLineaCaptura, valuesLineaCaptura);

            res.status(201).json({
                mensaje: "Infracción creada exitosamente",
                id_infraccion: infraccion_id,
                linea_captura: lineaCaptura
            });
        } catch (error) {
            errorHappened = true;
            res.status(500).json({ error: "Sucedio un error al insertar la infraccion" });
        } finally {
            if(client) {
                if(errorHappened) {
                    client.query('ROLLBACK');
                } else {
                    client.query('COMMIT');
                }
                client.release();
            }
            if(errorHappened) {
                throw new Error("Sucedio un error al insertar la infraccion a la base de datos");
            }
        }
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

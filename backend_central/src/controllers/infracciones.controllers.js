import { createUbicacion, createUbicacionDirect } from "./ubicacion.controllers.js";
import { getVehiculo, getAdeudosInternal } from "./vehiculos.controllers.js";
import { getLineaCaptura } from "./lineaCaptura.controllers.js";
import { createAsociacionInfraccion } from "./asociacion_infracciones.controllers.js";
import { createEvidencias } from "./evidencias.controllers.js";
import { getLicenciaInternal } from "./condutctor.controllers.js";
import { pool } from "../db.js";


export const createInfraccion = async (req, res) => {
    try {
        const { 
            fecha, 
            latitud, 
            longitud, 
            placa, 
            niv, 
            id_agente, 
            id_licencia, 
            infracciones, 
            ubicacion_infractor,
            evidencias, 
            notas
        } = req.body;

        // Validamos que lleguen los datos del body
        if (!latitud || !longitud) {
            return res.status(400).json({ error: "Faltan latitud o longitud en el JSON" });
        }
        
        const fechaValida = !isNaN(Date.parse(fecha));
        if(!fechaValida) {
            return res.status(400).json({error: "La fecha proporcionado no existe o no es valida"})
        }

        if (!placa && !niv) {
            return res.status(400).json({ error: "Faltan placa y niv en el JSON" });
        }

        if(!id_agente) {
            return res.status(400).json({ error: "Falta id_agente en el JSON" });
        }

        if (id_licencia) {
            const licenciaData = await getLicenciaInternal(id_licencia);
            if (!licenciaData) {
                return res.status(400).json({ error: "Licencia no válida o no encontrada" });
            }
        }

        if (!infracciones || !Array.isArray(infracciones) || infracciones.length === 0) {
            return res.status(400).json({ error: "Faltan infracciones en el JSON o no es un arreglo válido" });
        }

        // Necesita: latitud , longitud
        const ubicacion_id = await createUbicacion(req, res);
        if (!ubicacion_id) return; 

        let ubicacion_infractor_id = null;
        if (ubicacion_infractor) {
            ubicacion_infractor_id = await createUbicacionDirect(ubicacion_infractor);
            if (!ubicacion_infractor_id) {
                return res.status(500).json({ error: "Error al crear la ubicación del infractor" });
            }
        } 

        // Necesita: placa o niv
        const reporteVehiculo = await getVehiculo(req, res); 
        if (!reporteVehiculo) return; 

        if (reporteVehiculo.tieneReporteRobo) {
            return res.status(400).json({ error: "El vehículo tiene reporte de robo. No se puede generar la infracción." });
        }

        const adeudos = await getAdeudosInternal(reporteVehiculo.placa);
        let warningMessage = null;
        if (adeudos.length > 0) {
            warningMessage = "El vehículo tiene adeudos pendientes.";
        }

        const id_vehiculo = reporteVehiculo.placa || reporteVehiculo.niv;

        const nuevaInfraccion = {
            fecha, 
            ubicacion: ubicacion_id, 
            id_vehiculo, 
            id_agente, 
            id_licencia: id_licencia || null,
            ubicacion_infractor: ubicacion_infractor_id,
            notas: notas || null
        };

        const query = `
            INSERT INTO "infracciones" (
                "fecha", 
                "ubicacion_infraccion", 
                "vehiculo_infraccionado", 
                "id_usuario", 
                "licencia_infractor",
                "ubicacion_infractor",
                "notas" 
            ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id_infraccion`;

        const values = [
            nuevaInfraccion.fecha,
            nuevaInfraccion.ubicacion,
            nuevaInfraccion.id_vehiculo,
            nuevaInfraccion.id_agente,
            nuevaInfraccion.id_licencia,
            nuevaInfraccion.ubicacion_infractor,
            nuevaInfraccion.notas
        ];

        const response = await pool.query(query, values);
        const infraccion_id = response.rows[0].id_infraccion;

        await createAsociacionInfraccion(req, res, pool, infraccion_id, infracciones);

        await createEvidencias(infraccion_id, evidencias);

        const lineaCaptura = await getLineaCaptura(req, res, infraccion_id);

        const folio = `INF-${String(infraccion_id).padStart(7, '0')}`;

        const queryLineaCaptura = `
        UPDATE "infracciones" 
        SET "linea_captura" = $1, "folio" = $2
        WHERE "id_infraccion" = $3
        `;
        const valuesLineaCaptura = [lineaCaptura, folio, infraccion_id];

        await pool.query(queryLineaCaptura, valuesLineaCaptura);

        res.status(201).json({
            mensaje: "Infracción creada exitosamente",
            id_infraccion: infraccion_id,
            folio,
            linea_captura: lineaCaptura,
            advertencia: warningMessage
        });

    } catch (error) {
        console.error(error);
        if (!res.headersSent) {
            res.status(500).json({ error: "Error en el servidor al crear la infracción" });
        }
    }
}

export const getInfracciones = async (req, res) => {
    try {
        const query = `
            SELECT
                i.id_infraccion,
                i.folio,
                i.fecha,
                i.vehiculo_infraccionado AS placa,
                i.id_usuario AS id_agente,
                i.notas,
                i.licencia_infractor AS id_licencia,
                COALESCE(split_part(u.coordenadas, ',', 1), '0')::float AS latitud,
                COALESCE(split_part(u.coordenadas, ',', 2), '0')::float AS longitud,
                CASE 
                    WHEN i.ubicacion_infractor IS NOT NULL THEN json_build_object(
                        'municipio', ui.municipio,
                        'vialidad', ui.vialidad,
                        'numero_exterior', ui.numero_exterior,
                        'nombre_asentamiento', ui.nombre_asentamiento,
                        'codigo_postal', ui.codigo_postal,
                        'nombre_entidad', ui.nombre_entidad
                    )
                    ELSE NULL
                END AS ubicacion_infractor,
                (
                    SELECT COALESCE(array_agg(ci.articulo), ARRAY[]::varchar[])
                    FROM asociacion_infracciones ai
                    JOIN catalogo_infracciones ci ON ai.id_catalogo_infraccion = ci.id_catalogo_infracciones
                    WHERE ai.id_infraccion = i.id_infraccion
                ) AS infracciones,
                (
                    SELECT COALESCE(array_agg(e.archivo), ARRAY[]::varchar[])
                    FROM infracciones_evidencias ie
                    JOIN evidencias e ON ie.id_evidencia = e.id_evidencia
                    WHERE ie.id_infraccion = i.id_infraccion
                ) AS evidencias
            FROM
                infracciones i
            LEFT JOIN
                ubicacion u ON i.ubicacion_infraccion = u.id_ubicacion
            LEFT JOIN
                ubicacion ui ON i.ubicacion_infractor = ui.id_ubicacion
            WHERE
                i.borrado = false
            GROUP BY
                i.id_infraccion, i.folio, u.coordenadas, ui.municipio, ui.vialidad, ui.numero_exterior, ui.nombre_asentamiento, ui.codigo_postal, ui.nombre_entidad
            ORDER BY
                i.fecha DESC;
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching infracciones:", error.message);
        res.status(500).json({ error: "Error al obtener las infracciones" });
    }
}

export const getInfraccionById = async (req, res) => {
    const { id } = req.params;

    try {
        let infraccionQuery;
        let queryValue;

        if (id.startsWith('INF-')) {
            infraccionQuery = `SELECT * FROM infracciones WHERE folio = $1 AND borrado = false`;
            queryValue = id;
        } else {
            if (isNaN(parseInt(id))) {
                return res.status(400).json({ error: "ID de infracción o folio no válido." });
            }
            infraccionQuery = `SELECT * FROM infracciones WHERE id_infraccion = $1 AND borrado = false`;
            queryValue = parseInt(id);
        }
        
        const infraccionResult = await pool.query(infraccionQuery, [queryValue]);

        if (infraccionResult.rows.length === 0) {
            return res.status(404).json({ error: "Infracción no encontrada" });
        }
        const infraccion = infraccionResult.rows[0];

        const ubicacionQuery = 'SELECT * FROM ubicacion WHERE id_ubicacion = $1';
        const ubicacionResult = await pool.query(ubicacionQuery, [infraccion.ubicacion_infraccion]);
        const ubicacionDetalle = ubicacionResult.rows[0] || {};
        const [lat, lon] = (ubicacionDetalle.coordenadas || "0,0").split(',').map(s => parseFloat(s.trim()));

        let ubicacionInfractorDetalle = null;
        if (infraccion.ubicacion_infractor) {
            const ubicacionInfractorResult = await pool.query(ubicacionQuery, [infraccion.ubicacion_infractor]);
            if (ubicacionInfractorResult.rows.length > 0) {
                const { id_ubicacion, coordenadas, ...rest } = ubicacionInfractorResult.rows[0];
                ubicacionInfractorDetalle = {
                    municipio: rest.municipio,
                    vialidad: rest.vialidad,
                    numero_exterior: rest.numero_exterior,
                    nombre_asentamiento: rest.nombre_asentamiento,
                    codigo_postal: rest.codigo_postal,
                    nombre_entidad: rest.nombre_entidad
                };
            }
        }

        const motivosQuery = `
            SELECT ci.articulo FROM asociacion_infracciones ai
            JOIN catalogo_infracciones ci ON ai.id_catalogo_infraccion = ci.id_catalogo_infracciones
            WHERE ai.id_infraccion = $1`;
        const motivosResult = await pool.query(motivosQuery, [infraccion.id_infraccion]);

        const motivos = motivosResult.rows.map(row => row.articulo);

        const evidenciasQuery = `
            SELECT e.archivo FROM infracciones_evidencias ie
            JOIN evidencias e ON ie.id_evidencia = e.id_evidencia
            WHERE ie.id_infraccion = $1`;
        const evidenciasResult = await pool.query(evidenciasQuery, [infraccion.id_infraccion]);
        const evidencias = evidenciasResult.rows.map(row => row.archivo);

        const formattedInfraccion = {
            fecha: infraccion.fecha,
            folio: infraccion.folio,
            latitud: lat,
            longitud: lon,
            placa: infraccion.vehiculo_infraccionado,
            niv: null, // NIV no se almacena directamente en la infracción
            id_agente: infraccion.id_usuario,
            notas: infraccion.notas,
            infracciones: motivos,
            id_licencia: infraccion.licencia_infractor,
            ubicacion_infractor: ubicacionInfractorDetalle,
            evidencias: evidencias,
            estatus: infraccion.estatus,
        };

        res.json(formattedInfraccion);

    } catch (error) {
        console.error("Error fetching infraccion by id or folio:", error.message);
        res.status(500).json({ error: "Error al obtener la infracción" });
    }
};

export const updateInfraccion = async (req, res) => {
    const { id } = req.params;
    const { notas } = req.body;

    if (typeof notas === 'undefined') {
        return res.status(400).json({ error: "Solo se permite actualizar el campo 'notas'." });
    }

    try {
        const query = `
            UPDATE infracciones 
            SET notas = $1 
            WHERE id_infraccion = $2 AND borrado = false
            RETURNING *`;
        
        const values = [notas, id];
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Infracción no encontrada o ya está borrada." });
        }

        res.json({
            mensaje: "Infracción actualizada exitosamente",
            infraccion: result.rows[0]
        });

    } catch (error) {
        console.error("Error updating infraccion:", error.message);
        res.status(500).json({ error: "Error al actualizar la infracción" });
    }
};

export const deleteInfraccion = async (req, res) => {
    const { id } = req.params;

    try {
        const query = `
            UPDATE infracciones 
            SET borrado = true 
            WHERE id_infraccion = $1
            RETURNING id_infraccion`;
            
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Infracción no encontrada." });
        }

        res.status(204).send(); // No content

    } catch (error) {
        console.error("Error deleting infraccion:", error.message);
        res.status(500).json({ error: "Error al borrar la infracción" });
    }
};

// HU007: Solicitar Modificación de Placa
export const solicitarModificacionPlaca = async (req, res) => {
    const { id } = req.params;
    const { placa, justificacion } = req.body;
    const id_usuario_modificador = req.user.id_usuario;

    if (!placa || !justificacion) {
        return res.status(400).json({ error: "Se requiere la nueva placa y una justificación." });
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const infraccionResult = await client.query('SELECT vehiculo_infraccionado FROM infracciones WHERE id_infraccion = $1 AND borrado = false', [id]);
        if (infraccionResult.rows.length === 0) {
            return res.status(404).json({ error: "Infracción no encontrada." });
        }
        const valor_anterior = infraccionResult.rows[0].vehiculo_infraccionado;

        const diff = placa.split('').filter((char, i) => char !== valor_anterior[i]).length;
        if (diff > 3) {
            return res.status(400).json({ error: "La corrección de la placa no puede exceder los 3 caracteres." });
        }

        const auditQuery = `
            INSERT INTO auditoria_infracciones 
            (id_infraccion, id_usuario_modificador, fecha_modificacion, campo_modificado, valor_anterior, valor_nuevo, tipo_modificacion, justificacion, estatus_autorizacion)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'PENDIENTE') RETURNING id_auditoria`;
            
        const auditResult = await client.query(auditQuery, [id, id_usuario_modificador, new Date().toISOString(), 'vehiculo_infraccionado', valor_anterior, placa, 'CORRECCION', justificacion]);

        await client.query('COMMIT');
        res.status(202).json({ 
            mensaje: "Solicitud de modificación de placa enviada para autorización.",
            id_auditoria: auditResult.rows[0].id_auditoria
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Error al solicitar modificación de placa:", error.message);
        res.status(500).json({ error: "Error interno al solicitar la modificación." });
    } finally {
        client.release();
    }
};

// HU007: Solicitar Anulación de Infracción
export const solicitarAnulacionInfraccion = async (req, res) => {
    const { id } = req.params;
    const { justificacion } = req.body;
    const id_usuario_modificador = req.user.id_usuario;

    if (!justificacion) {
        return res.status(400).json({ error: "Se requiere una justificación para solicitar la anulación." });
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const infraccionResult = await client.query('SELECT estatus FROM infracciones WHERE id_infraccion = $1 AND borrado = false', [id]);
        if (infraccionResult.rows.length === 0) {
            return res.status(404).json({ error: "Infracción no encontrada." });
        }
        const valor_anterior = infraccionResult.rows[0].estatus;

        if (valor_anterior === 'ANULADA') {
            return res.status(400).json({ error: "La infracción ya ha sido anulada." });
        }

        const auditQuery = `
            INSERT INTO auditoria_infracciones 
            (id_infraccion, id_usuario_modificador, fecha_modificacion, campo_modificado, valor_anterior, valor_nuevo, tipo_modificacion, justificacion, estatus_autorizacion)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'PENDIENTE') RETURNING id_auditoria`;
            
        const auditResult = await client.query(auditQuery, [id, id_usuario_modificador, new Date().toISOString(), 'estatus', valor_anterior, 'ANULADA', 'ANULACION', justificacion]);

        await client.query('COMMIT');
        res.status(202).json({ 
            mensaje: "Solicitud de anulación de infracción enviada para autorización.",
            id_auditoria: auditResult.rows[0].id_auditoria
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Error al solicitar anulación de infracción:", error.message);
        res.status(500).json({ error: "Error interno al solicitar la anulación." });
    } finally {
        client.release();
    }
};

// HU008: Auditoría de Cambios
export const getHistorialInfraccion = async (req, res) => {
    const { id } = req.params;

    try {
        const query = `
            SELECT 
                a.fecha_modificacion,
                a.campo_modificado,
                a.valor_anterior,
                a.valor_nuevo,
                a.tipo_modificacion,
                a.justificacion,
                u_mod.username AS modificado_por,
                u_aut.username AS autorizado_por,
                a.estatus_autorizacion
            FROM auditoria_infracciones a
            JOIN usuarios u_mod ON a.id_usuario_modificador = u_mod.id_usuario
            LEFT JOIN usuarios u_aut ON a.id_usuario_autorizador = u_aut.id_usuario
            WHERE a.id_infraccion = $1
            ORDER BY a.fecha_modificacion DESC`;
        
        const result = await pool.query(query, [id]);
        res.json(result.rows);

    } catch (error) {
        console.error("Error al obtener el historial de la infracción:", error.message);
        res.status(500).json({ error: "Error interno al obtener el historial." });
    }
};

// HU007: Autorizar Cambio de Infracción
export const autorizarCambioInfraccion = async (req, res) => {
    const { id_auditoria } = req.params;
    const { estatus_autorizacion, justificacion_autorizador } = req.body;
    const id_usuario_autorizador = req.user.id_usuario;

    if (!estatus_autorizacion || !['APROBADO', 'RECHAZADO'].includes(estatus_autorizacion)) {
        return res.status(400).json({ error: "El estado de autorización debe ser 'APROBADO' o 'RECHAZADO'." });
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Obtener la solicitud de auditoría
        const auditResult = await client.query('SELECT * FROM auditoria_infracciones WHERE id_auditoria = $1', [id_auditoria]);
        if (auditResult.rows.length === 0) {
            return res.status(404).json({ error: "Solicitud de cambio no encontrada." });
        }
        const solicitud = auditResult.rows[0];

        // 2. Validar que no esté ya procesada y que el autorizador no sea el solicitante
        if (solicitud.estatus_autorizacion !== 'PENDIENTE') {
            return res.status(400).json({ error: "Esta solicitud ya ha sido procesada." });
        }
        if (solicitud.id_usuario_modificador === id_usuario_autorizador) {
            return res.status(403).json({ error: "No puede autorizar sus propias solicitudes de cambio." });
        }

        // 3. Si se aprueba, aplicar el cambio
        if (estatus_autorizacion === 'APROBADO') {
            const { id_infraccion, campo_modificado, valor_nuevo } = solicitud;
            const updateQuery = `UPDATE infracciones SET ${campo_modificado} = $1 WHERE id_infraccion = $2`;
            await client.query(updateQuery, [valor_nuevo, id_infraccion]);
        }

        // 4. Actualizar el registro de auditoría
        const updateAuditQuery = `
            UPDATE auditoria_infracciones 
            SET estatus_autorizacion = $1, id_usuario_autorizador = $2, fecha_autorizacion = $3, justificacion = COALESCE(justificacion, '') || ' | Justificación Autorizador: ' || $4
            WHERE id_auditoria = $5`;
        await client.query(updateAuditQuery, [estatus_autorizacion, id_usuario_autorizador, new Date().toISOString(), justificacion_autorizador, id_auditoria]);

        await client.query('COMMIT');
        res.json({ mensaje: `La solicitud de cambio ha sido ${estatus_autorizacion.toLowerCase()}.` });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Error al autorizar el cambio:", error.message);
        res.status(500).json({ error: "Error interno al procesar la autorización." });
    } finally {
        client.release();
    }
};


// HU007: Obtener Solicitudes Pendientes
export const getSolicitudesPendientes = async (req, res) => {
    try {
        const query = `
            SELECT 
                a.id_auditoria,
                a.id_infraccion,
                i.folio,
                a.fecha_modificacion,
                a.campo_modificado,
                a.valor_anterior,
                a.valor_nuevo,
                a.tipo_modificacion,
                a.justificacion,
                u.username AS solicitado_por
            FROM auditoria_infracciones a
            JOIN usuarios u ON a.id_usuario_modificador = u.id_usuario
            JOIN infracciones i ON a.id_infraccion = i.id_infraccion
            WHERE a.estatus_autorizacion = 'PENDIENTE'
            ORDER BY a.fecha_modificacion ASC`;
            
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error("Error al obtener solicitudes pendientes:", error.message);
        res.status(500).json({ error: "Error interno al obtener las solicitudes." });
    }
};
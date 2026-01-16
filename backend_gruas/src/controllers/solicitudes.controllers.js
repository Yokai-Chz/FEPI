import { pool } from "../db.js";
import axios from 'axios';
import { randomBytes } from 'crypto';

// Helper: Calcular distancia (Haversine Formula) en Kilómetros
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radio de la tierra en km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distancia en km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

// Helper: Determinar tipo de grúa según el vehículo
function determinarTipoGrua(tipoVehiculo) {
    if (!tipoVehiculo) return 'Tipo A'; // Default
    
    const tipo = tipoVehiculo.toUpperCase();
    
    // Lógica basada en reglamento (simplificada)
    if (['BICICLETA', 'MOTOCICLETA', 'COMPACTO', 'SEDAN', 'HATCHBACK'].some(t => tipo.includes(t))) {
        return 'Tipo A'; // Hasta 3.5 ton
    }
    if (['CAMIONETA', 'SUV', 'VAN', 'PICKUP'].some(t => tipo.includes(t))) {
        return 'Tipo B'; // Hasta 6 ton
    }
    if (['CAMION', 'AUTOBUS', 'MICROBUS'].some(t => tipo.includes(t))) {
        return 'Tipo C'; // Hasta 12 ton
    }
    if (['TRAILER', 'TRACTOCAMION', 'MAQUINARIA'].some(t => tipo.includes(t))) {
        return 'Tipo D'; // Alto tonelaje
    }
    
    return 'Tipo A'; // Default si no coincide
}

// Helper: Validar Horario (Básico)
function isDepotOpen(horarioStr) {
    if (!horarioStr) return true; // Si no hay horario, asumimos abierto
    const lower = horarioStr.toLowerCase();
    if (lower.includes('24 horas') || lower.includes('24h')) return true;

    // Formato esperado "08:00 - 20:00"
    const partes = horarioStr.split('-');
    if (partes.length !== 2) return true; // Formato desconocido, asumimos abierto

    try {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMin = now.getMinutes();
        const currentTime = currentHour * 60 + currentMin;

        const [startH, startM] = partes[0].trim().split(':').map(Number);
        const [endH, endM] = partes[1].trim().split(':').map(Number);

        const startTime = startH * 60 + startM;
        const endTime = endH * 60 + endM;

        return currentTime >= startTime && currentTime <= endTime;
    } catch (e) {
        return true; // Error al parsear, fail open
    }
}

export const createSolicitud = async (req, res) => {
    // Desestructuración plana según README
    const { 
        latitud,
        longitud,
        placas_vehiculo,
        marca_vehiculo,
        color_vehiculo,
        tipo_vehiculo,
        motivo_arrastre,
        id_infraccion_vinculada,
        observaciones,
        // Campos opcionales / adicionales
        id_agente,
        referencia_manual,
        tiene_llaves,
        es_foraneo,
        inventario_detalles 
    } = req.body;

    // Validación básica
    if (!latitud || !longitud) {
        return res.status(400).json({ error: "Se requieren latitud y longitud para asignar el servicio." });
    }

    if (!placas_vehiculo || !tipo_vehiculo) {
        return res.status(400).json({ error: "Se requieren placas y tipo de vehículo." });
    }

    // Determinamos qué tipo de grúa se necesita (A, B, C, D)
    const tipoGruaRequerida = determinarTipoGrua(tipo_vehiculo);

    let client;
    try {
        // 0. Obtener detalles de ubicación con Google Maps API
        let ubicacionDetails = {
            vialidad: 'Desconocida',
            numero_exterior: '',
            asentamiento: '',
            codigo_postal: '',
            municipio: '',
            entidad: 'CDMX',
            coordenadas: `${latitud}, ${longitud}`
        };

        const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
        if (API_KEY) {
            try {
                const googleUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitud},${longitud}&key=${API_KEY}`;
                const googleResponse = await axios.get(googleUrl);

                if (googleResponse.data.status === 'OK' && googleResponse.data.results.length > 0) {
                    const components = googleResponse.data.results[0].address_components;
                    const getComp = (type) => components.find(c => c.types.includes(type))?.long_name || '';

                    ubicacionDetails.vialidad = getComp("route");
                    ubicacionDetails.numero_exterior = getComp("street_number");
                    ubicacionDetails.asentamiento = getComp("sublocality_level_1") || getComp("neighborhood");
                    ubicacionDetails.codigo_postal = getComp("postal_code");
                    ubicacionDetails.municipio = getComp("administrative_area_level_2");
                    ubicacionDetails.entidad = getComp("administrative_area_level_1");
                }
            } catch (apiError) {
                console.error("Error al consultar Google Maps API:", apiError.message);
                // Continuamos con valores por defecto
            }
        }

        client = await pool.connect();
        await client.query('BEGIN');

        // 1. Obtener Depósitos Activos y sus Ubicaciones
        const queryDepositos = `
            SELECT d.id_deposito, d.nombre, d.capacidad_total, d.capacidad_ocupada, d.horario_atencion,
                   u.coordenadas
            FROM depositos d
            JOIN ubicacion u ON d.id_ubicacion = u.id_ubicacion
            WHERE d.estatus = true
        `;
        const resDepositos = await client.query(queryDepositos);
        let candidates = [];

        // 2. Filtrar y Calcular distancias
        for (const depot of resDepositos.rows) {
            // Validar capacidad
            if (depot.capacidad_ocupada >= depot.capacidad_total) continue;

            // Validar horario
            if (!isDepotOpen(depot.horario_atencion)) continue;

            // Calcular distancia
            if (depot.coordenadas) {
                const [dLat, dLon] = depot.coordenadas.split(',').map(c => parseFloat(c.trim()));
                const dist = getDistanceFromLatLonInKm(latitud, longitud, dLat, dLon);
                
                candidates.push({ ...depot, distance: dist });
            }
        }

        // Ordenar por distancia (menor a mayor)
        candidates.sort((a, b) => a.distance - b.distance);

        let assignedGrua = null;
        let assignedDepot = null;

        // 3. Buscar Grúa Disponible del TIPO REQUERIDO en el depósito más cercano
        for (const depot of candidates) {
            const queryGrua = `
                SELECT g.id_grua, g.placas, ctg.tipo 
                FROM gruas g
                JOIN asociacion_grua_deposito agd ON g.id_grua = agd.id_grua
                JOIN cat_tipo_grua ctg ON g.id_tipo_grua = ctg.id_tipo_grua
                WHERE agd.id_deposito = $1 
                  AND g.estado = 'DISPONIBLE'
                  AND agd.activo = true
                  AND ctg.tipo = $2
                LIMIT 1
            `;
            const resGrua = await client.query(queryGrua, [depot.id_deposito, tipoGruaRequerida]);
            
            if (resGrua.rows.length > 0) {
                assignedGrua = resGrua.rows[0];
                assignedDepot = depot;
                break; // Encontramos el par (Depósito Cercano - Grúa Disponible del Tipo Correcto)
            }
        }

        if (!assignedGrua || !assignedDepot) {
            await client.query('ROLLBACK');
            return res.status(404).json({ 
                error: `No hay grúas ${tipoGruaRequerida} disponibles cercanas o los depósitos están llenos/cerrados.` 
            });
        }

        // 4. Crear Ubicación de Origen para el registro
        const queryUbi = `
            INSERT INTO ubicacion (
                vialidad, numero_exterior, nombre_asentamiento, codigo_postal, 
                municipio, nombre_entidad, coordenadas
            ) VALUES ($1, $2, $3, $4, $5, $6, $7) 
            RETURNING id_ubicacion
        `;
        const valuesUbi = [
            ubicacionDetails.vialidad,
            ubicacionDetails.numero_exterior,
            ubicacionDetails.asentamiento,
            ubicacionDetails.codigo_postal,
            ubicacionDetails.municipio,
            ubicacionDetails.entidad,
            ubicacionDetails.coordenadas
        ];
        
        const resUbi = await client.query(queryUbi, valuesUbi);
        const idUbicacionOrigen = resUbi.rows[0].id_ubicacion;

        // 5. Crear Solicitud
        // Generamos un folio corto y único (ej. FOL-A1B2C3D4)
        const folio = `FOL-${randomBytes(4).toString('hex').toUpperCase()}`; 
        const fechaSolicitud = new Date().toISOString();

        const queryInsert = `
            INSERT INTO solicitudes_arrastre (
                folio, fecha_solicitud, id_grua, id_deposito_destino, id_ubicacion_origen,
                placas_vehiculo, marca_vehiculo, color_vehiculo, tipo_vehiculo,
                id_agente, referencia_manual, tiene_llaves, es_foraneo, inventario_detalles,
                observaciones, id_infraccion_vinculada, motivo_arrastre, estatus_servicio
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, 'ASIGNADO')
            RETURNING *
        `;
        
        // Convertimos el inventario a string JSON para guardarlo en JSONB
        const inventarioJson = JSON.stringify(inventario_detalles || {});

        const valuesInsert = [
            folio, 
            fechaSolicitud, 
            assignedGrua.id_grua, 
            assignedDepot.id_deposito, 
            idUbicacionOrigen,
            placas_vehiculo, 
            marca_vehiculo, 
            color_vehiculo, 
            tipo_vehiculo,
            id_agente,
            referencia_manual,
            tiene_llaves,
            es_foraneo,
            inventarioJson,
            observaciones,
            id_infraccion_vinculada,
            motivo_arrastre
        ];
        
        const resSolicitud = await client.query(queryInsert, valuesInsert);

        // 6. Actualizar Estado Grúa
        await client.query(`UPDATE gruas SET estado = 'OCUPADA' WHERE id_grua = $1`, [assignedGrua.id_grua]);

        // 7. Actualizar Ocupación Depósito
        await client.query(`UPDATE depositos SET capacidad_ocupada = capacidad_ocupada + 1 WHERE id_deposito = $1`, [assignedDepot.id_deposito]);

        await client.query('COMMIT');

        // Cálculo simple de tiempo estimado (Velocidad promedio 30 km/h en ciudad)
        const velocidadPromedio = 30; 
        const tiempoHoras = assignedDepot.distance / velocidadPromedio;
        const tiempoMinutos = Math.ceil(tiempoHoras * 60);

        // Respuesta formateada según README
        res.status(201).json({
            mensaje: "Solicitud creada y recursos asignados correctamente",
            solicitud: resSolicitud.rows[0],
            asignacion: {
                deposito: assignedDepot.nombre,
                distancia_km: assignedDepot.distance.toFixed(2),
                grua: assignedGrua.placas,
                tiempo_estimado: `${tiempoMinutos} min`
            }
        });

    } catch (err) {
        if (client) await client.query('ROLLBACK');
        console.error(err);
        return res.status(500).json({ error: "Error interno al procesar la solicitud de arrastre" });
    } finally {
        if (client) client.release();
    }
};

export const getSolicitudes = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT s.*, g.placas as placas_grua, d.nombre as nombre_deposito 
            FROM solicitudes_arrastre s
            LEFT JOIN gruas g ON s.id_grua = g.id_grua
            LEFT JOIN depositos d ON s.id_deposito_destino = d.id_deposito
            ORDER BY s.id_solicitud DESC
        `);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al obtener solicitudes" });
    }
};

export const updateSolicitudStatus = async (req, res) => {
    const { id } = req.params;
    const { estatus_servicio } = req.body; // Ej: 'EN_DEPOSITO', 'CANCELADO', 'FINALIZADO'

    if (!estatus_servicio) {
        return res.status(400).json({error: "Se requiere el nuevo estatus"});
    }

    let client;
    try {
        client = await pool.connect();
        await client.query('BEGIN');

        // Obtener solicitud actual
        const resSol = await client.query(`SELECT * FROM solicitudes_arrastre WHERE id_solicitud = $1`, [id]);
        if (resSol.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({error: "Solicitud no encontrada"});
        }
        const solicitud = resSol.rows[0];

        // Actualizar estatus
        const updateQuery = `UPDATE solicitudes_arrastre SET estatus_servicio = $1 WHERE id_solicitud = $2 RETURNING *`;
        const result = await client.query(updateQuery, [estatus_servicio, id]);

        // Lógica de liberación de recursos
        // Si el servicio finaliza o se cancela, liberamos la grúa
        if (['FINALIZADO', 'CANCELADO', 'EN_DEPOSITO'].includes(estatus_servicio)) {
            // Liberar Grúa
            await client.query(`UPDATE gruas SET estado = 'DISPONIBLE' WHERE id_grua = $1`, [solicitud.id_grua]);
            
            // Nota: La capacidad del depósito NO se decrementa aquí si el coche queda 'EN_DEPOSITO'.
            // Solo se decrementaría si el coche sale del depósito (otro proceso).
            // Si se CANCELA antes de llegar, sí podríamos decrementar la ocupación reservada, 
            // pero por simplicidad asumimos que la reserva cuenta hasta que se libere explicitamente el vehiculo.
             if (estatus_servicio === 'CANCELADO') {
                 await client.query(`UPDATE depositos SET capacidad_ocupada = capacidad_ocupada - 1 WHERE id_deposito = $1`, [solicitud.id_deposito_destino]);
             }
        }

        await client.query('COMMIT');
        res.json(result.rows[0]);

    } catch (err) {
        if (client) await client.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ error: "Error al actualizar estatus" });
    } finally {
        if (client) client.release();
    }
};

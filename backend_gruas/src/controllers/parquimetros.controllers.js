import { pool } from "../db.js";

// Consultar estado de una placa (Para el Oficial)
export const consultarPlaca = async (req, res) => {
    const { placa } = req.params;

    try {
        // Consultamos directo a la Vista SQL que ya calcula los minutos
        const query = `
            SELECT * FROM vista_estado_parquimetro 
            WHERE placas_vehiculo = $1
            ORDER BY fecha_vencimiento DESC 
            LIMIT 1
        `;
        
        const result = await pool.query(query, [placa]);

        if (result.rows.length === 0) {
            return res.json({
                placa: placa,
                estatus: "SIN_TICKET",
                mensaje: "No se encontraron tickets recientes para esta placa."
            });
        }

        const estado = result.rows[0];
        
        // Respuesta formateada para la app del oficial
        res.json({
            placa: estado.placas_vehiculo,
            estatus: estado.estatus, // 'VIGENTE' o 'EXPIRADO'
            minutos_restantes: Math.floor(estado.minutos_restantes),
            fecha_vencimiento: estado.fecha_vencimiento,
            accion_sugerida: estado.estatus === 'EXPIRADO' ? 'COLOCAR INMOVILIZADOR' : 'NINGUNA'
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al consultar parquímetro" });
    }
};

// Registrar un pago (Simulación de usuario pagando en la máquina/app)
export const registrarPago = async (req, res) => {
    const { placas, id_colonia, monto } = req.body;

    // Tarifa 2026: $3.40 pesos por cada 15 minutos
    const TARIFA_15_MIN = 3.40;

    if (!placas || !monto || monto < TARIFA_15_MIN) {
        return res.status(400).json({ error: "Datos incompletos o monto insuficiente (Min $3.40)" });
    }

    try {
        // Calcular tiempo comprado
        const bloques = Math.floor(monto / TARIFA_15_MIN);
        const minutosComprados = bloques * 15;

        // Calcular vencimiento
        const fechaVencimiento = new Date();
        fechaVencimiento.setMinutes(fechaVencimiento.getMinutes() + minutosComprados);

        const query = `
            INSERT INTO tickets_parquimetro (placas_vehiculo, id_colonia, monto_pagado, fecha_vencimiento)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;

        const result = await pool.query(query, [placas, id_colonia || 1, monto, fechaVencimiento]);

        res.status(201).json({
            mensaje: "Pago registrado exitosamente",
            ticket: result.rows[0],
            tiempo_comprado: `${minutosComprados} minutos`
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al registrar pago" });
    }
};

// Listar colonias (Para llenar el select en la app)
export const getColonias = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT c.id_colonia, c.nombre_colonia, p.nombre_poligono 
            FROM cat_colonias_parquimetro c
            JOIN cat_poligonos p ON c.id_poligono = p.id_poligono
            ORDER BY p.nombre_poligono, c.nombre_colonia
        `);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al obtener colonias" });
    }
};

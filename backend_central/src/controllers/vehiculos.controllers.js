import { API_REPUVE, API_FINANZAS } from "../config.js";

// Helper interno para consultar REPUVE
export const getVehiculoInternal = async (placa, niv) => {
    const url = `${API_REPUVE}/${placa || niv}`;
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });
        if (!response.ok) return null;
        const data = await response.json();
        if (!data.placa && !data.niv) return null;
        return {
            placa: data.placa,
            niv: data.niv,
            tieneReporteRobo: data.tiene_reporte_robo
        };
    } catch (error) {
        console.error("Error interno obteniendo vehículo:", error);
        return null;
    }
};

// Helper interno para consultar Adeudos en Finanzas
export const getAdeudosInternal = async (placa) => {
    if (!placa) return [];
    const url = `${API_FINANZAS}?placa=${placa}`;
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": "Bearer SSC_TOKEN_2026" 
            }
        });
        if (!response.ok) return [];
        const json = await response.json();
        // Filtramos solo las pendientes o vencidas
        if (json.success && Array.isArray(json.data)) {
            return json.data.filter(item => 
                item.estatus === 'PENDIENTE' || item.estatus === 'VENCIDA'
            );
        }
        return [];
    } catch (error) {
        console.error("Error interno obteniendo adeudos:", error);
        return [];
    }
};

// Controlador para usar en createInfraccion (Legacy support)
export const getVehiculo = async (req, res) => {
    const { placa, niv } = req.body;
    const vehiculo = await getVehiculoInternal(placa, niv);
    
    if (!vehiculo) {
        if (!res.headersSent) res.status(404).json({ error: "Vehículo no encontrado en REPUVE" });
        return null;
    }
    return vehiculo;
};

// Nuevo Controlador para el Endpoint GET /vehiculos/:placa
export const consultarVehiculo = async (req, res) => {
    const { placa } = req.params;

    try {
        // 1. Consultar REPUVE
        const infoRepuve = await getVehiculoInternal(placa, null);
        
        // 2. Consultar Adeudos en Finanzas
        const adeudos = await getAdeudosInternal(placa);

        // Consolidar respuesta
        const respuesta = {
            placa: placa,
            encontradoEnRepuve: !!infoRepuve,
            datosRepuve: infoRepuve || null,
            tieneReporteRobo: infoRepuve?.tieneReporteRobo || false,
            adeudos: adeudos,
            totalAdeudos: adeudos.length,
            montoTotalAdeudos: adeudos.reduce((sum, item) => sum + (item.monto_total || 0), 0)
        };

        res.json(respuesta);

    } catch (error) {
        console.error("Error en consultarVehiculo:", error);
        res.status(500).json({ error: "Error al consultar información del vehículo" });
    }
};

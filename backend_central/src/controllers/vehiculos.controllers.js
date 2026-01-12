import { API_REPUVE } from "../config.js";

export const getVehiculo = async (req, res) => {
    const { placa, niv } = req.body;
    const url = `${API_REPUVE}/${placa || niv}`;
    
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });

        const data = await response.json();
        
        if ((!data.placa && !data.niv)) {
            res.status(404).json({ error: "Vehículo no encontrado en REPUVE" });
            return null;
        }

        return {
            placa: data.placa,
            niv: data.niv,
            tieneReporteRobo: data.tiene_reporte_robo
        };

    } catch (error) {
        console.error("Error al obtener el vehículo:", error);
        if (!res.headersSent) {
            res.status(500).json({ error: "Error al obtener el vehículo" });
        }
        return null;
    }
}

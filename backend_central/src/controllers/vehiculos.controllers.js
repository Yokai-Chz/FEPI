import { API_REPUVE } from "../config.js";

export const getVehiculo = async (req, res) => {
    const { placa, niv } = req.body;
    const url = API_REPUVE;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ placa, niv })
        });

        const data = await response.json();

        return {
            placa: data.identificacion_vehicular.placa,
            niv: data.identificacion_vehicular.niv,
            tieneReporteRobo: data.estatus_legal.tiene_reporte_robo
        };

    } catch (error) {
        console.error("Error al obtener el vehículo:", error);
        if (!res.headersSent) {
            res.status(500).json({ error: "Error al obtener el vehículo" });
        }
        return null;
    }
}

import { API_FINANZAS } from "../config.js";

export const getLineaCaptura = async (req, res) => {
    const url = API_FINANZAS;
    const { placa, infracciones, id_agente, folioInfraccion } = req.body;

    const motivosIds = infracciones; 
    const idOficial = id_agente;
    
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ placa, motivosIds, idOficial, folioInfraccion })
        });
        const data = await response.json();
        res.json(data.linea_captura);
    } catch (error) {
        console.error('Error fetching línea de captura:', error);
        res.status(500).json({ error: "Error al obtener la línea de captura" });
    }
}
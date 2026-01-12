import { API_FINANZAS } from "../config.js";

export const getLineaCaptura = async (req, res, folioInfraccion) => {
    const url = API_FINANZAS;
    const { placa, infracciones, id_agente } = req.body;

    const motivosIds = infracciones; 
    const idOficial = id_agente;
    
    try {
        
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json",
                        'Authorization': 'Bearer SSC_TOKEN_2026'},
            body: JSON.stringify({ placa, motivosIds, idOficial, folioInfraccion })
        });
        
        const respuesta = await response.json();

        if (!response.ok) {
            console.error('Error response from Finanzas API:', respuesta);
            return res.status(response.status).json({ error: "Error al obtener la línea de captura" });
        }
        return respuesta.data.linea_captura;
        
    } catch (error) {
        console.error('Error fetching línea de captura:', error);
        res.status(500).json({ error: "Error al obtener la línea de captura" });
    }
}
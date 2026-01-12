import { API_SEMOVI_CONDUCTORES } from "../config";

export const getConductor = async (req, res) => {
    const url = API_SEMOVI_CONDUCTORES;
    const { licenciaInfractor } = req.body;
    
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ licenciaInfractor })
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching licencia de conductor:', error);
        res.status(500).json({ error: "Error al obtener la licencia de conductor" });
    }
}
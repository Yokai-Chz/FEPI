import { API_SEMOVI_CONDUCTORES } from "../config.js";

// Helper interno para consultar Licencia en SEMOVI
export const getLicenciaInternal = async (licenciaInfractor) => {
    const url = `${API_SEMOVI_CONDUCTORES}${licenciaInfractor}`;
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });
        
        if (!response.ok) {
            if (response.status === 404) return null;
            throw new Error(`API responded with status ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error interno obteniendo licencia:', error);
        return null;
    }
};

export const getConductor = async (req, res) => {
    const url = API_SEMOVI_CONDUCTORES;
    const { licenciaInfractor } = req.body;
    
    try {
        
        if (!licenciaInfractor) {
            return res.status(400).json({ error: "Falta licenciaInfractor" });
        }

        const data = await getLicenciaInternal(licenciaInfractor);
        
        if (!data) {
            return res.status(404).json({ error: "Licencia no encontrada" });
        }
        
        res.json(data);
    } catch (error) {
        console.error('Error fetching licencia de conductor:', error);
        res.status(500).json({ error: "Error al obtener la licencia de conductor" });
    }
}
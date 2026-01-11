import { pool } from '../db.js';
import axios from 'axios';

export const createUbicacion = async (req, res) => {
    const { latitud, longitud } = req.body;

    try {
        const API_KEY = process.env.GOOGLE_MAPS_API_KEY; 
        const googleUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitud},${longitud}&key=${API_KEY}`;
        
        const googleResponse = await axios.get(googleUrl);
        
        if (googleResponse.data.status !== 'OK') {
            res.status(404).json({ error: "Google no encontró la ubicación", status: googleResponse.data.status });
            return null;
        }

        const components = googleResponse.data.results[0].address_components;
        const getComp = (type) => components.find(c => c.types.includes(type))?.long_name || '';

        // Objeto que se enviaría a la DB
        const datosParaDB = {
            nombre_vialidad: getComp("route"),
            numero_exterior: getComp("street_number"),
            nombre_asentamiento: getComp("sublocality_level_1") || getComp("neighborhood"),
            codigo_postal: getComp("postal_code"),
            nombre_municipio: getComp("administrative_area_level_2"),
            nombre_entidad: getComp("administrative_area_level_1"),
            coordenadas: `${latitud}, ${longitud}`
        };

        // En lugar de hacer pool.query, solo retornamos el objeto
        return datosParaDB;

    } catch (error) {
        console.error("Error en Google API:", error.message);
        if (!res.headersSent) {
            res.status(500).json({ error: "Error conectando con Google" });
        }
        return null;
    }
};
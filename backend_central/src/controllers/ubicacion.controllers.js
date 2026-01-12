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
        const id = `${latitud}-${longitud}-${Date.now()}`;


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


        const query = `
            INSERT INTO ubicacion (
                "vialidad", 
                "numero_exterior", 
                "nombre_asentamiento", 
                "codigo_postal", 
                "municipio", 
                "nombre_entidad", 
                "coordenadas"
            ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id_ubicacion`;

        const values = [
            datosParaDB.nombre_vialidad,
            datosParaDB.numero_exterior,
            datosParaDB.nombre_asentamiento,
            datosParaDB.codigo_postal,
            datosParaDB.nombre_municipio,
            datosParaDB.nombre_entidad,
            datosParaDB.coordenadas
        ];

        const result = await pool.query(query, values);
        
        return result.rows[0].id_ubicacion;

    } catch (error) {
        console.error("Error en createUbicacion:", error.message);
        if (!res.headersSent) {
            res.status(500).json({ error: "Error al procesar la ubicación" });
        }
        return null;
    }
};
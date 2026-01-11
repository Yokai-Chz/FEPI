import { pool } from "../db";

// La obtencion de vehiculos sera optenido mediante el metodo GET a la api http://localhost:3000/api/repuve 
export const getVehiculo = (req, res) => {
    const url = "http://localhost:3000/api/repuve";

    fetch(url)
        .then(response => response.json())
        .then(data => {
            res.json(data);
        })
        .catch(error => {
            res.status(500).json({ error: "Error fetching vehiculos data" });
        });
}

// La creacion de vehiculos sera mediante el metodo POST a la api http://localhost:3000/api/repuve const createVehiculo = (req, res) => {

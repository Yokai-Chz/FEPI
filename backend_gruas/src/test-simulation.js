import axios from 'axios';
import { PORT } from './config.js';

const SERVER_URL = `http://localhost:${PORT || 3000}`;

// El JSON ajustado a lo que el controlador realmente espera
const payload = {
  "latitud": 19.3625,
  "longitud": -99.1628,
  "placas_vehiculo": "TEST-001",
  "marca_vehiculo": "NISSAN",
  "color_vehiculo": "ROJO",
  "tipo_vehiculo": "Sedan",
  "motivo_arrastre": "Prueba automática de inicio",
  "id_infraccion_vinculada": 123,
  "observaciones": "Solicitud generada por test automático"
};

async function runTest() {
    console.log('\n---------------------------------------------------');
    console.log('🧪 INICIANDO TEST DE INTEGRACIÓN (Simulación Frontend)');
    console.log('---------------------------------------------------');
    console.log(`📡 Conectando a: ${SERVER_URL}`);
    
    try {
        // Prueba de conexión básica
        try {
            const rootResponse = await axios.get(`${SERVER_URL}/`);
            console.log(`✅ Conexión establecida: ${rootResponse.data}`);
        } catch (e) {
            console.error(`❌ Fallo conexión raíz: ${e.message}`);
        }

        console.log(`\n📡 Enviando POST a: ${SERVER_URL}/solicitudes`);
        const start = Date.now();
        const response = await axios.post(`${SERVER_URL}/solicitudes`, payload);
        const duration = Date.now() - start;

        console.log(`✅ Petición exitosa en ${duration}ms`);
        console.log('\n📩 RESPUESTA DEL SERVIDOR:');
        console.log(JSON.stringify(response.data, null, 2));

        // Validación de la respuesta
        const data = response.data;
        const validacion = 
            data.solicitud && 
            data.asignacion && 
            data.asignacion.deposito && 
            data.asignacion.grua;

        console.log('\n🧐 VALIDACIÓN DE RESPUESTA:');
        if (validacion) {
            console.log('✅ PASS: La respuesta contiene solicitud y asignación.');
        } else {
            console.log('❌ FAIL: La respuesta NO cumple con la estructura esperada.');
        }

    } catch (error) {
        console.log('\n❌ ERROR EN EL TEST:');
        if (error.response) {
            // El servidor respondió con un código de estado fuera del rango 2xx
            console.error(`Status: ${error.response.status}`);
            console.error('Data:', error.response.data);
        } else if (error.request) {
            // La petición fue hecha pero no se recibió respuesta
            console.error('No se recibió respuesta del servidor. ¿Está encendido?');
        } else {
            console.error('Error:', error.message);
        }
    } finally {
        console.log('---------------------------------------------------\n');
    }
}

// Ejecutar el test
runTest();

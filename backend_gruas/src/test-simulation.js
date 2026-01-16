import axios from 'axios';
import { PORT } from './config.js';

const SERVER_URL = `http://localhost:${PORT || 3000}`;

// El JSON exacto que definiste
const payload = {
  "id_agente": "982734",
  "coordenadas": {
    "lat": 19.3647, // Coordenada cercana a Santa Fe (uno de los depósitos con lat/lng en BD) para asegurar éxito
    "lng": -99.2743
  },
  "referencia_manual": "Prueba automática de inicio",
  "detalles_vehiculo": {
    "placa": "TEST-001",
    "marcaModelo": "NISSAN",
    "color": "ROJO",
    "tipo": "COMPACTO", // Esto detonará la búsqueda de Grúa Tipo A
    "tieneLlaves": false,
    "esForaneo": false,
    "inventario": {
      "cristalesRotos": false,
      "sinLlantas": false,
      "objetosValor": true,
      "golpesCarroceria": false
    },
    "observaciones": "Solicitud generada por test automático"
  }
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

        console.log(`\n📡 Enviando POST a: ${SERVER_URL}/solicitudes-debug`);
        const start = Date.now();
        const response = await axios.post(`${SERVER_URL}/solicitudes-debug`, payload);
        const duration = Date.now() - start;

        console.log(`✅ Petición exitosa en ${duration}ms`);
        console.log('\n📩 RESPUESTA DEL SERVIDOR:');
        console.log(JSON.stringify(response.data, null, 2));

        // Validación de la interfaz RespuestaServidorGrua
        const data = response.data;
        const validacion = 
            data.folio_servicio && 
            data.deposito_asignado && 
            data.unidad_asignada && 
            data.tiempo_estimado && 
            data.estatus;

        console.log('\n🧐 VALIDACIÓN DE INTERFAZ:');
        if (validacion) {
            console.log('✅ PASS: La respuesta cumple con "RespuestaServidorGrua"');
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

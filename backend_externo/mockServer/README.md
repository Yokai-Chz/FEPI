# Mock Server - Sistema de Infracciones CDMX

Este repositorio contiene un servidor mock desarrollado con FastAPI que simula servicios externos necesarios para el sistema de infracciones de tránsito de la Ciudad de México. Provee endpoints simulados para **SEMOVI**, **REPUVE** y **Servicios Logísticos**, permitiendo el desarrollo y pruebas del backend principal sin depender de sistemas reales.

## Módulos y Endpoints

A continuación se describen los servicios disponibles:

### 1. SEMOVI (Secretaría de Movilidad)
Simula la consulta del padrón vehicular y licencias.

*   **Consultar Vehículo**
    *   `GET /api/semovi/vehiculo/{placa}`
    *   Retorna información del vehículo, tarjeta de circulación y propietario.
*   **Consultar Licencia**
    *   `GET /api/semovi/licencia/{numero_licencia}`
    *   Retorna el estatus, tipo y vigencia de una licencia de conducir.

#### 1.1 Consulta de Padrón Vehicular
* **Endpoint:** `GET /api/semovi/vehiculo/{placa}`

**Respuesta Exitosa (200 OK):**
```json
{
  "placa": "A01-AAA",
  "marca": "Nissan",
  "modelo": "Versa",
  "color": "Blanco",
  "anio": 2023,
  "tarjeta_circulacion": {
    "folio": "TC-987654321",
    "vigencia": "2026-12-31",
    "estatus": "VIGENTE"
  },
  "propietario": {
    "nombre_completo": "Juan Pérez López",
    "rfc": "PELJ800101XYZ",
    "domicilio_fiscal": "Av. Reforma 222, CDMX"
  }
}

```

#### 1.2 Consulta de Licencia de Conducir

* **Endpoint:** `GET /api/semovi/licencia/{numero_licencia}`

**Respuesta Exitosa (200 OK):**

```json
{
  "numero_licencia": "L12345678",
  "tipo": "A",
  "estatus": "ACTIVA",
  "fecha_vencimiento": "2026-05-20"
}

```


### 2. REPUVE (Registro Público Vehicular)
Simula la consulta de estatus legal de vehículos (robo).

*   **Consulta Ciudadana**
    *   `GET /api/repuve/consulta/{placa}`
    *   Retorna la identificación vehicular (NIV, NCI, características) y si tiene reporte de robo activo.

**Respuesta Exitosa (200 OK) - Sin Reporte de Robo:**

```json
{
  "identificacion_vehicular": {
    "placa": "A01-AAA",
    "niv": "3N1AB23C4D567890",
    "nci": "1459345", // Número de Constancia de Inscripción
    "marca": "Nissan",
    "modelo": "Versa",
    "anio_modelo": 2023,
    "clase": "Automóvil",
    "tipo": "Sedan",
    "numero_puertas": 4,
    "pais_origen": "México"
  },
  "estatus_legal": {
    "tiene_reporte_robo": false,
    "mensaje": "SIN REPORTE DE ROBO"
  }
}

```

**Respuesta (200 OK) - CON REPORTE DE ROBO (Alerta):**

```json
{
  "identificacion_vehicular": {
    "placa": "ROB-666",
    "niv": "1HGBH41JZMN109186",
    "nci": "8822110",
    "marca": "Chevrolet",
    "modelo": "Malibu",
    "anio_modelo": 2018,
    "clase": "Automóvil",
    "tipo": "Sedan"
  },
  "estatus_legal": {
    "tiene_reporte_robo": true,
    "mensaje": "CON REPORTE DE ROBO",
    "fuentes_reporte": {
      "fgj": { // Fiscalía General de Justicia
        "activo": true,
        "entidad": "Fiscalía CDMX",
        "fecha_averiguacion": "2024-01-15",
        "folio": "CI-FCY/OY/UI-1S/D/0001"
      },
      "ocra": { // Oficina Coordinadora de Riesgos Asegurados
        "activo": false
      },
      "extranjero": { // USA / CAN
        "activo": false
      }
    }
  }
}

```


### 3. Servicios Logísticos
Simula la interacción con proveedores de servicios auxiliares.

*   **Solicitar Grúa**
    *   `POST /api/servicios/solicitar-grua`
    *   Simula la asignación de una unidad de arrastre, devolviendo ETA y datos de la grúa.

**Body (Request):**

```json
{
  "latitud": 19.4326,
  "longitud": -99.1332,
  "tipo_vehiculo": "SEDAN"
}

```

**Respuesta Exitosa (200 OK):**

```json
{
  "id_asignacion": "GRUA-500",
  "unidad": "Grúa Titan 4",
  "placa_grua": "GR-04-CDMX",
  "concesionaria": "Grúas Metropolitanas",
  "eta_minutos": 15
}

```

## Instalación y Ejecución

1.  Construir y levantar el contenedor:
    ```bash
    docker-compose up --build
    ```
    El servidor estará disponible en `http://localhost:8000`.

## Datos de Prueba

El script de población genera varios casos específicos para pruebas:

*   **Vehículo Limpio:** Placa `A01-AAA` (Sin reporte de robo, documentos vigentes).
*   **Vehículo Robado:** Placa `ROB-666` (Con reporte de robo activo en Fiscalía CDMX).
*   **Licencia Activa:** Número `L12345678`.

Adicionalmente, se generan vehículos aleatorios en cada ejecución de `populate_db.py`.


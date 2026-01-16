# Backend - Sistema de Grúas CDMX

Este proyecto es la API backend para el sistema de gestión de grúas y depósitos vehiculares (corralones) de la Ciudad de México.

## Tecnologías Utilizadas

-   **Node.js** (Express.js)
-   **PostgreSQL**
-   **bcryptjs** (Hashing de contraseñas)
-   **Morgan** (Logger HTTP)

---

## Endpoints de la API

### 1. Dashboard
#### `GET /dashboard/stats`
Obtiene estadísticas operativas en tiempo real.

-   **Respuesta (200 OK):**
    ```json
    {
        "solicitudes_hoy": 5,
        "gruas_disponibles": 12,
        "capacidad_corralones": {
            "total": 1900,
            "ocupada": 870,
            "disponible": 1030,
            "porcentaje_ocupacion": "45.79%"
        }
    }
    ```

---

### 2. Solicitudes de Arrastre
#### `POST /solicitudes`
Crea una solicitud y asigna automáticamente la grúa/depósito más cercano.

-   **Cuerpo (Request):**
    ```json
    {
        "latitud": 19.3625,
        "longitud": -99.1628,
        "placas_vehiculo": "XYZ-987",
        "marca_vehiculo": "Nissan",
        "color_vehiculo": "Rojo",
        "tipo_vehiculo": "Sedan",
        "motivo_arrastre": "Estacionamiento prohibido",
        "id_infraccion_vinculada": 123,
        "observaciones": "Vehículo con cristales abajo"
    }
    ```
-   **Respuesta (201 Created):**
    ```json
    {
        "mensaje": "Solicitud creada y recursos asignados correctamente",
        "solicitud": { "id_solicitud": 1, "folio": "FOL-170526... ", ... },
        "asignacion": {
            "deposito": "Depósito Vehicular Módulo 39",
            "distancia_km": "2.45",
            "grua": "GR-001"
        }
    }
    ```

#### `PUT /solicitudes/:id/status`
Actualiza el estado de un servicio (ej. de ASIGNADO a EN_DEPOSITO).

-   **Cuerpo (Request):**
    ```json
    { "estatus_servicio": "EN_DEPOSITO" }
    ```
-   **Respuesta (200 OK):** Objeto de la solicitud actualizado.

---

### 3. Usuarios del Sistema
#### `POST /usuarios`
-   **Cuerpo (Request):**
    ```json
    {
        "nombre_completo": "Juan Pérez",
        "username": "jperez",
        "password": "mi_password_seguro",
        "rol": "ADMIN_DEPOSITO",
        "id_deposito": 1
    }
    ```
-   **Respuesta (201 Created):** Objeto de usuario (sin password_hash).

#### `GET /usuarios`
-   **Respuesta (200 OK):** `[{ "id_usuario": 1, "nombre_completo": "...", "rol": "..." }, ...]`

---

### 4. Grúas
#### `POST /gruas`
-   **Cuerpo (Request):**
    ```json
    {
        "placas": "GR-123",
        "no_economico": "ECO-500",
        "id_tipo_grua": 2,
        "marca": "Ford",
        "modelo": "F-550",
        "anio": 2022,
        "estado": "DISPONIBLE"
    }
    ```
-   **Respuesta (201 Created):** Objeto de la grúa creada.

#### `GET /gruas`
-   **Respuesta (200 OK):** Lista de grúas con detalles de su tipo.

---

### 5. Depósitos (Corralones)
#### `POST /depositos`
Permite crear un depósito enviando datos de ubicación nuevos o un ID existente.

-   **Cuerpo (Request):**
    ```json
    {
        "nombre": "Corralón Poniente",
        "capacidad_total": 300,
        "telefono": "55-1111-2222",
        "horario_atencion": "24 horas",
        "ubicacion": {
            "municipio": "Álvaro Obregón",
            "vialidad": "Av. Centenario",
            "numero_exterior": "500",
            "nombre_asentamiento": "Lomas",
            "codigo_postal": "01210",
            "nombre_entidad": "CDMX",
            "coordenadas": "19.3500, -99.2000"
        }
    }
    ```
-   **Respuesta (201 Created):** Objeto del depósito creado.

#### `GET /depositos`
-   **Respuesta (200 OK):** Lista de depósitos incluyendo datos de dirección.

---

## Lógica de Negocio: Asignación Automática

El sistema utiliza la **Fórmula Haversine** para calcular distancias lineales. Al crear una solicitud, se prioriza:
1.  Depósitos que tengan capacidad libre.
2.  Depósitos que se encuentren dentro de su horario de atención.
3.  Cercanía geográfica al lugar del evento.
4.  Disponibilidad de grúas físicas en dicho depósito.
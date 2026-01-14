# Guía de Pruebas de API (Backend Grúas)

Este documento sirve como referencia para probar los endpoints de la API del sistema de grúas utilizando herramientas como **Postman**, **Insomnia**, **Thunder Client** o `curl`.

## Configuración Base

-   **URL Base:** `http://localhost:4000` (o el puerto configurado en tu `.env`)
-   **Headers Comunes:**
    -   `Content-Type`: `application/json`

---

## 1. Dashboard

### Obtener Estadísticas
Obtiene el resumen de operaciones del día.

-   **Método:** `GET`
-   **Endpoint:** `/dashboard/stats`
-   **Respuesta Esperada (200):**
    ```json
    {
        "solicitudes_hoy": 5,
        "gruas_disponibles": 10,
        "capacidad_corralones": { ... }
    }
    ```

---

## 2. Gestión de Usuarios (Depósitos/Admin)

### Crear Usuario
-   **Método:** `POST`
-   **Endpoint:** `/usuarios`
-   **JSON Body:**
    ```json
    {
        "nombre_completo": "Laura Admin",
        "username": "admin_norte",
        "password": "passwordSeguro123",
        "rol": "ADMIN_DEPOSITO",
        "id_deposito": 1 
    }
    ```
    > Nota: `id_deposito` puede ser `null` si es `ADMIN_GENERAL`.

### Listar Usuarios
-   **Método:** `GET`
-   **Endpoint:** `/usuarios`

### Actualizar Usuario
-   **Método:** `PUT`
-   **Endpoint:** `/usuarios/1` (Reemplaza `1` por ID real)
-   **JSON Body:**
    ```json
    {
        "nombre_completo": "Laura Actualizada",
        "rol": "OPERADOR_DEPOSITO",
        "id_deposito": 1
    }
    ```

### Eliminar Usuario
-   **Método:** `DELETE`
-   **Endpoint:** `/usuarios/1`

---

## 3. Gestión de Depósitos (Corralones)

### Crear Depósito
Registra un nuevo corralón y su ubicación.

-   **Método:** `POST`
-   **Endpoint:** `/depositos`
-   **JSON Body:**
    ```json
    {
        "nombre": "Depósito Sur - Xochimilco",
        "capacidad_total": 500,
        "telefono": "55-5555-5555",
        "horario_atencion": "24 horas",
        "ubicacion": {
            "municipio": "Xochimilco",
            "vialidad": "Av. Guadalupe I. Ramírez",
            "numero_exterior": "100",
            "nombre_asentamiento": "Barrio San Antonio",
            "codigo_postal": "16000",
            "nombre_entidad": "CDMX",
            "coordenadas": "19.2600, -99.1000"
        }
    }
    ```

### Listar Depósitos
-   **Método:** `GET`
-   **Endpoint:** `/depositos`

---

## 4. Gestión de Grúas

### Registrar Grúa
-   **Método:** `POST`
-   **Endpoint:** `/gruas`
-   **JSON Body:**
    ```json
    {
        "placas": "GR-999",
        "no_economico": "ECO-999",
        "id_tipo_grua": 2, 
        "marca": "Kenworth",
        "modelo": "T370",
        "anio": 2023,
        "estado": "DISPONIBLE"
    }
    ```
    > Nota: Asegúrate de que el `id_tipo_grua` exista en el catálogo (ej. 1, 2, 3, 4).

### Listar Grúas
-   **Método:** `GET`
-   **Endpoint:** `/gruas`

### Actualizar Grúa
-   **Método:** `PUT`
-   **Endpoint:** `/gruas/1`
-   **JSON Body:**
    ```json
    {
        "placas": "GR-999-X",
        "no_economico": "ECO-999",
        "id_tipo_grua": 2,
        "marca": "Kenworth",
        "modelo": "T370",
        "anio": 2023,
        "estado": "MANTENIMIENTO"
    }
    ```

---

## 5. Solicitudes de Arrastre

### Crear Solicitud (Asignación Automática)
Este endpoint busca el depósito más cercano con espacio y horario, y le asigna una grúa disponible.

-   **Método:** `POST`
-   **Endpoint:** `/solicitudes`
-   **JSON Body:**
    ```json
    {
        "latitud": 19.4326,
        "longitud": -99.1332,
        "placas_vehiculo": "ABC-123",
        "marca_vehiculo": "Volkswagen",
        "color_vehiculo": "Blanco",
        "tipo_vehiculo": "Sedan",
        "motivo_arrastre": "Estacionamiento en doble fila",
        "id_infraccion_vinculada": 1001,
        "observaciones": "El conductor no estaba presente."
    }
    ```
-   **Respuesta Exitosa (201):**
    Retorna detalles de la solicitud y la asignación (Grúa y Depósito).

### Listar Historial de Solicitudes
-   **Método:** `GET`
-   **Endpoint:** `/solicitudes`

### Actualizar Estado de Solicitud
Cambia el estado del servicio. Si se finaliza o cancela, libera la grúa automáticamente.

-   **Método:** `PUT`
-   **Endpoint:** `/solicitudes/1/status` (Reemplaza `1` por el ID del folio/solicitud)
-   **JSON Body:**
    ```json
    {
        "estatus_servicio": "EN_DEPOSITO"
    }
    ```
    > Estados válidos comunes: `EN_CAMINO`, `EN_PROCESO`, `EN_DEPOSITO`, `FINALIZADO`, `CANCELADO`.

---

## Notas para Pruebas

1.  **Google Maps API:** Si no has configurado una API Key válida en el `.env`, la creación de solicitudes funcionará pero no registrará la dirección exacta (calle, colonia) en la base de datos, solo las coordenadas.
2.  **Disponibilidad:** Para que una solicitud se cree con éxito, debe haber al menos **un depósito activo** con capacidad disponible y **una grúa disponible** asociada a ese depósito (o en el sistema general, dependiendo de tu regla de negocio exacta, aunque actualmente el código busca grúas asociadas al depósito cercano).
3.  **Datos de Prueba:** Utiliza los endpoints de creación (`POST`) para llenar la base de datos antes de probar las listas o actualizaciones.

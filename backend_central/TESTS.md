# Guía de Pruebas de API (Backend Central)

Este documento sirve como referencia para probar los endpoints de la API utilizando herramientas como **Postman**, **Insomnia**, **Thunder Client** o `curl`.

## Configuración Base

-   **URL Base:** `http://localhost:3000` (o el puerto configurado en tu `.env`)
-   **Headers Comunes:**
    -   `Content-Type`: `application/json`

---

## 1. Autenticación

### Login de Usuario
Genera un token JWT para autenticación (si se implementa seguridad en rutas futuras).

-   **Método:** `POST`
-   **Endpoint:** `/login`
-   **JSON Body:**
    ```json
    {
        "username": "juanperez",
        "password": "securepassword"
    }
    ```
-   **Respuesta Esperada (200):**
    ```json
    {
        "token": "eyJhbGciOiJIUzI1NiIsIn..."
    }
    ```

---

## 2. Gestión de Usuarios

### Crear Usuario
Registra un nuevo usuario administrativo u operativo junto con sus datos personales.

-   **Método:** `POST`
-   **Endpoint:** `/users`
-   **JSON Body:**
    ```json
    {
        "nombre": "Roberto",
        "apellido_paterno": "Gómez",
        "apellido_materno": "Bolaños",
        "curp": "GOBO290221HDFRRN05",
        "rfc": "GOBO290221ABC",
        "username": "chespirito",
        "password": "password123",
        "tipo_usuario": "oficial"
    }
    ```

### Listar Usuarios
Obtiene todos los usuarios activos.

-   **Método:** `GET`
-   **Endpoint:** `/users`

### Obtener Usuario por ID
-   **Método:** `GET`
-   **Endpoint:** `/users/1` (Reemplaza `1` por un ID real)

### Actualizar Usuario
Actualiza los datos personales asociados al usuario.

-   **Método:** `PUT`
-   **Endpoint:** `/users/1`
-   **JSON Body:**
    ```json
    {
        "nombre": "Roberto Alonso",
        "apellido_paterno": "Gómez",
        "apellido_materno": "Bolaños",
        "curp": "GOBO290221HDFRRN05",
        "rfc": "GOBO290221ABC"
    }
    ```

### Eliminar Usuario (Borrado Lógico)
-   **Método:** `DELETE`
-   **Endpoint:** `/users/1`

---

## 3. Catálogos

### Obtener Catálogo de Infracciones
Muestra la lista de tipos de infracciones disponibles para asignar.

-   **Método:** `GET`
-   **Endpoint:** `/catalogo`

---

## 4. Infracciones

### Crear Nueva Infracción
Registra una infracción completa. Incluye validación de vehículo, geocodificación de ubicación, asociación de motivos y generación de línea de captura.

-   **Método:** `POST`
-   **Endpoint:** `/infracciones`
-   **JSON Body:**
    ```json
    {
        "fecha": "2024-01-15T14:30:00Z",
        "latitud": 19.432608, 
        "longitud": -99.133209,
        "placa": "A01-AAA",
        "niv": "NIV1234567890",
        "id_agente": 1,
        "notas": "Estacionado en lugar prohibido",
        "infracciones": ["ART-06"], 
        "ubicacion_infractor": {
            "municipio": "Cuauhtémoc",
            "vialidad": "Av. Paseo de la Reforma",
            "numero_exterior": "S/N",
            "nombre_asentamiento": "Centro",
            "codigo_postal": "06000",
            "nombre_entidad": "Ciudad de México"
        },
        "evidencias": [
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA...",
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUB...",
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUC...",
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUD..."
        ]
    }    ```
    > **Nota:** El campo `infracciones` recibe un array con los identificadores (artículos) del catálogo. `evidencias` espera cadenas en base64.

### Listar Infracciones
(Nota: Este endpoint actualmente devuelve un mensaje de placeholder)

-   **Método:** `GET`
-   **Endpoint:** `/infracciones`

---

## Notas Adicionales

-   **Base de Datos:** Asegúrate de que los contenedores de Docker (si usas Docker) o tu servicio local de PostgreSQL estén corriendo.
-   **IDs:** Los IDs mostrados en los ejemplos (`1`, `ART-01`) deben existir previamente en tu base de datos (tablas `usuarios` y `catalogo_infracciones`). Usa los scripts de inicialización (`bd.sql`) para tener datos de prueba.

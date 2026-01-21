# Guía de Pruebas de API (Backend Central)

Este documento sirve como referencia para probar los endpoints de la API utilizando herramientas como **Postman**, **Insomnia**, **Thunder Client** o `curl`.

## Configuración Base

-   **URL Base:** `http://localhost:4000` (o el puerto configurado en tu `.env`)
-   **Headers Comunes:**
    -   `Content-Type`: `application/json`

---

## 1. Autenticación

### Login de Usuario
Genera un token JWT para autenticación.

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

## 3. Oficiales

### Crear Oficial
Registra un nuevo oficial.

-   **Método:** `POST`
-   **Endpoint:** `/oficiales`
-   **JSON Body:**
    ```json
    {
        "nombre": "Pedro",
        "apellido_paterno": "Infante",
        "apellido_materno": "Cruz",
        "curp": "INCP550415HDFRRN01",
        "rfc": "INCP550415XYZ",
        "username": "pedroinfante",
        "password": "password456"
    }
    ```

### Listar Oficiales
Obtiene todos los oficiales activos.

-   **Método:** `GET`
-   **Endpoint:** `/oficiales`

### Obtener Oficial por ID
-   **Método:** `GET`
-   **Endpoint:** `/oficiales/1` (Reemplaza `1` por un ID real)

---

## 4. Vehículos

### Consultar Vehículo por Placa
Obtiene información sobre un vehículo, incluyendo reporte de robo y adeudos.

-   **Método:** `GET`
-   **Endpoint:** `/vehiculos/ABC-123` (Reemplaza `ABC-123` por una placa real)

---

## 5. Catálogos

### Obtener Catálogo de Infracciones
Muestra la lista de tipos de infracciones disponibles para asignar.

-   **Método:** `GET`
-   **Endpoint:** `/catalogo`

---

## 6. Infracciones

### Crear Nueva Infracción
Registra una infracción completa.

-   **Método:** `POST`
-   **Endpoint:** `/infracciones`
-   **JSON Body:**
    ```json
    {
        "fecha": "2024-01-15T14:30:00Z",
        "latitud": 19.503005, 
        "longitud": -99.146881,
        "placa": "A01-AAA",
        "niv": "NIV1234567890",
        "id_agente": 1,
        "notas": "Estacionado en lugar prohibido",
        "infracciones": ["ART-06"],
        "id_licencia": "789456", 
        "ubicacion_infractor": {
            "municipio": "Cuauhtémoc",
            "vialidad": "Av. Paseo de la Reforma",
            "numero_exterior": "S/N",
            "nombre_asentamiento": "Centro",
            "codigo_postal": "06000",
            "nombre_entidad": "Ciudad de México"
        },
        "evidencias": [
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA..."
        ]
    }
    ```

### Listar Infracciones
-   **Método:** `GET`
-   **Endpoint:** `/infracciones`

### Obtener Infracción por ID o Folio
-   **Método:** `GET`
-   **Endpoint:** `/infracciones/1` o `/infracciones/INF-0000001`

### Actualizar Notas de Infracción
-   **Método:** `PATCH`
-   **Endpoint:** `/infracciones/1`
-   **Header (Autenticación):** `Authorization: Bearer <tu_token_jwt>`
-   **JSON Body:**
    ```json
    {
        "notas": "Se actualiza la nota."
    }
    ```

### Eliminar Infracción (Borrado Lógico)
-   **Método:** `DELETE`
-   **Endpoint:** `/infracciones/1`
-   **Header (Autenticación):** `Authorization: Bearer <tu_token_jwt>`

---

## Notas Adicionales

-   **Base de Datos:** Asegúrate de que tu servicio de PostgreSQL esté corriendo.
-   **IDs:** Los IDs en los ejemplos (`1`, `ART-01`) deben existir en tu base de datos.
-   **Autenticación:** Para los endpoints que lo requieran, no olvides incluir el token JWT en el header `Authorization`.
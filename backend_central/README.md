# Backend Central API

Este proyecto es el API backend central para un sistema de gestión de infracciones de tránsito. Está construido con Node.js, Express y se conecta a una base de datos PostgreSQL.

## Tecnologías Utilizadas

-   **Node.js:** Entorno de ejecución de JavaScript.
-   **Express.js:** Framework para aplicaciones web de Node.js.
-   **PostgreSQL:** Sistema de base de datos relacional.
-   **bcryptjs:** Para el hash de contraseñas.
-   **jsonwebtoken:** Para implementar autenticación basada en JWT.
-   **morgan:** Middleware para el registro de solicitudes HTTP.
-   **Módulos ES (ESM):** Sistema moderno de módulos de JavaScript.

## Instalación

1.  **Clona el repositorio:**
    ```bash
    git clone <url_del_repositorio>
    cd backend_central
    ```

2.  **Instala las dependencias:**
    ```bash
    npm install
    ```

3.  **Variables de Entorno:**
    Crea un archivo `.env` en la raíz del proyecto y añade tus variables de entorno. Un archivo `.env` típico podría ser así:
    ```
    PORT=3000
    DB_USER=tu_usuario_db
    DB_HOST=tu_host_db
    DB_DATABASE=tu_nombre_db
    DB_PASSWORD=tu_contraseña_db
    DB_PORT=5432
    JWT_SECRET=tu_clave_secreta_jwt
    ```

4.  **Configuración de la Base de Datos:**
    Asegúrate de tener una base de datos PostgreSQL en funcionamiento y configurada según tu archivo `.env`.

## Uso

### Modo de Desarrollo

Para ejecutar el servidor en modo de desarrollo con reinicios automáticos al cambiar archivos:
```bash
npm run dev
```

### Modo de Producción

Para iniciar el servidor en producción:
```bash
npm start
```

## Endpoints de la API

A continuación se detallan los endpoints disponibles en el API.

### Autenticación

#### `POST /login`

Autentica a un usuario y devuelve un token JWT.

-   **Valores Esperados (Request Body):**
    ```json
    {
        "username": "nombredeusuario",
        "password": "súper_contraseña"
    }
    ```

-   **Respuesta Exitosa (Código 200):**
    ```json
    {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```

-   **Respuestas de Error:**
    -   **Código 400:** `{"error": "Username and password are required"}`
    -   **Código 401:** `{"error": "Invalid credentials"}`

---

### Usuarios

#### `POST /users`

Crea un nuevo usuario en la base de datos (con datos personales).

-   **Valores Esperados (Request Body):**
    ```json
    {
        "nombre": "Juan",
        "apellido_paterno": "Perez",
        "apellido_materno": "Lopez",
        "curp": "PELO800101HDFRRN09",
        "rfc": "PELO800101XXX",
        "username": "juanperez",
        "password": "securepassword",
        "tipo_usuario": "oficial"
    }
    ```

-   **Respuesta Exitosa (Código 201):**
    Retorna el objeto del usuario creado.
    ```json
    {
        "id_usuario": 1,
        "username": "juanperez",
        "tipo_usuario": "oficial"
    }
    ```

-   **Respuestas de Error:**
    -   **Código 409:** `{"error": "User already exists."}` (Si el usuario, CURP o RFC ya existe)

#### `GET /users`
Obtiene la lista de usuarios activos.

-   **Respuesta Exitosa (Código 200):**
    ```json
    [
        {
            "id_usuario": 1,
            "id_persona": 5,
            "username": "juanperez",
            "tipo_usuario": "oficial",
            "borrado": false
        },
        ...
    ]
    ```

#### `GET /users/:id`
Obtiene un usuario por ID.

-   **Respuesta Exitosa (Código 200):** Objeto de usuario completo.
-   **Respuesta Error (404):** `{"error": "Usuario no encontrado"}`

#### `PUT /users/:id`
Actualiza datos personales (Persona) asociados al usuario.

-   **Valores Esperados (Request Body):**
    ```json
    {
        "nombre": "Juan Carlos",
        "apellido_paterno": "Perez",
        "apellido_materno": "Diaz",
        "curp": "...",
        "rfc": "..."
    }
    ```
-   **Respuesta Exitosa (Código 200):** "Successfully updated"

#### `DELETE /users/:id`
Baja lógica de usuario (Soft delete).

-   **Respuesta Exitosa (Código 204):** No content.

---

### Infracciones

#### `POST /infracciones`

Crea una nueva infracción. Este endpoint orquesta la creación de ubicación, validación de vehículo, asociación de infracciones del catálogo y generación de línea de captura externa.

-   **Valores Esperados (Request Body):**
    ```json
    {
        "fecha": "2024-01-01T12:00:00Z",
        "latitud": 19.4326,
        "longitud": -99.1332,
        "placa": "ABC-123",
        "niv": "1GKSKDEFGH1234567",
        "id_agente": "AGENTE-001",
        "id_licencia": "LIC-XYZ",
        "descripcion": "Exceso de velocidad.",
        "infracciones": ["ART-01", "ART-04"],
        "ubicacion_infractor": {
             "municipio": "Cuauhtémoc",
             "vialidad": "Reforma",
             "numero_exterior": "222",
             "nombre_asentamiento": "Juárez",
             "codigo_postal": "06600",
             "nombre_entidad": "CDMX"
        },
        "evidencias": ["base64string...", "base64string..."]
    }
    ```

-   **Respuesta Exitosa (Código 201):**
    ```json
    {
        "mensaje": "Infracción creada exitosamente",
        "id_infraccion": 12345,
        "linea_captura": "12345678901234567890"
    }
    ```

-   **Respuestas de Error:**
    -   **Código 400:** `{"error": "Faltan latitud o longitud en el JSON"}`
    -   **Código 400:** `{"error": "Faltan placa y niv en el JSON"}`
    -   **Código 500:** `{"error": "Sucedio un error al insertar la infraccion"}`


### Catálogo

#### `GET /catalogo`

Obtiene el catálogo completo de infracciones desde la base de datos.

-   **Respuesta Exitosa (Código 200):**
    Un arreglo de objetos, donde cada objeto representa un tipo de infracción del catálogo.
    ```json
    [
        {
            "id_catalogo_infracciones": 1,
            "articulo": "ART-01",
            "fraccion": "I",
            "descripcion": "Exceso de velocidad",
            "monto": "100.00"
        },
        ...
    ]
    ```
-   **Respuestas de Error:**
    -   **Código 500:** `{"error": "Error al obtener el catálogo"}`
# Backend - Sistema de Grúas CDMX

Este proyecto es la API backend para el sistema de gestión de grúas y depósitos vehiculares (corralones) de la Ciudad de México. Permite administrar el inventario de grúas, la capacidad de los depósitos, usuarios operativos y gestionar automáticamente las solicitudes de arrastre basándose en la ubicación y disponibilidad.

## Tecnologías Utilizadas

-   **Node.js**: Entorno de ejecución.
-   **Express.js**: Framework para la API REST.
-   **PostgreSQL**: Base de datos relacional (con soporte PostGIS para futuras expansiones, aunque aquí se usa lógica Haversine básica).
-   **node-postgres (pg)**: Driver para conectar con PostgreSQL.
-   **bcryptjs**: Hashing de contraseñas para usuarios.
-   **Morgan**: Logger de solicitudes HTTP.

## Estructura del Proyecto

-   `src/index.js`: Punto de entrada de la aplicación.
-   `src/config.js`: Configuración de variables de entorno y base de datos.
-   `src/db.js`: Configuración del pool de conexión a PostgreSQL.
-   `src/controllers/`: Lógica de negocio para cada entidad (Grúas, Depósitos, Usuarios, Solicitudes).
-   `src/routes/`: Definición de endpoints de la API.
-   `base_datos/`: Scripts SQL y configuración Docker para la base de datos.

## Instalación y Configuración

1.  **Requisitos Previos**:
    -   Node.js (v18 o superior recomendado)
    -   Docker y Docker Compose (para levantar la base de datos rápidamente)

2.  **Instalar Dependencias**:
    ```bash
    cd backend_gruas
    npm install
    ```

3.  **Configurar Variables de Entorno**:
    El proyecto usa un archivo `.env` (o carga valores por defecto en `src/config.js`). Asegúrate de que los puertos y credenciales coincidan con tu base de datos.

4.  **Levantar Base de Datos**:
    Puedes usar el archivo `docker-compose.yaml` incluido en `base_datos/`:
    ```bash
    cd base_datos
    docker-compose up -d
    ```
    Esto levantará un contenedor PostgreSQL e inicializará las tablas y datos semilla definidos en `db.sql`.

5.  **Ejecutar el Servidor**:
    -   Modo desarrollo: `npm run dev`
    -   Modo producción: `npm start`

## Endpoints Principales

### Dashboard
-   `GET /dashboard/stats`: Obtiene estadísticas generales (solicitudes de hoy, grúas disponibles, ocupación de corralones).

### Solicitudes de Arrastre (Servicios)
-   `POST /solicitudes`: Crea una nueva solicitud. **Automáticamente asigna la grúa y el depósito más cercanos** que estén disponibles y abiertos.
    -   *Body*: `{ "latitud": 19.4326, "longitud": -99.1332, "placas_vehiculo": "ABC-123", ... }`
-   `GET /solicitudes`: Lista el historial de solicitudes.
-   `PUT /solicitudes/:id/status`: Actualiza el estado (ej. 'FINALIZADO', 'CANCELADO'). Libera la grúa automáticamente al finalizar.

### Grúas
-   `GET /gruas`: Lista todas las grúas operativas.
-   `POST /gruas`: Registra una nueva grúa.
-   `PUT /gruas/:id`: Actualiza datos de una grúa.
-   `DELETE /gruas/:id`: Baja lógica de una grúa.

### Depósitos (Corralones)
-   `GET /depositos`: Lista depósitos activos con su capacidad.
-   `POST /depositos`: Crea un nuevo depósito (y su ubicación).
-   `PUT /depositos/:id`: Actualiza datos del depósito.
-   `DELETE /depositos/:id`: Baja lógica de un depósito.

### Usuarios (Operativos y Admin)
-   `POST /usuarios`: Crea usuarios con roles (ADMIN_GENERAL, ADMIN_DEPOSITO, OPERADOR, RECEPCION).
-   `GET /usuarios`: Lista usuarios activos.
-   `PUT /usuarios/:id`: Actualiza datos de usuario.
-   `DELETE /usuarios/:id`: Baja lógica de usuario.

## Lógica de Asignación Automática

Al recibir una solicitud (`POST /solicitudes`), el sistema:
1.  Filtra depósitos que tengan espacio (`capacidad_ocupada < capacidad_total`) y estén abiertos (según horario).
2.  Calcula la distancia lineal (fórmula Haversine) desde las coordenadas del incidente hasta cada depósito candidato.
3.  Busca la grúa más cercana: Itera los depósitos ordenados por cercanía y selecciona el primero que tenga al menos una grúa en estado `DISPONIBLE`.
4.  Realiza una transacción atómica para:
    -   Registrar la solicitud.
    -   Marcar la grúa como `OCUPADA`.
    -   Incrementar la ocupación del depósito destino.

## Contribución

Sigue los estándares de código existentes (ES Modules, Async/Await, manejo de errores centralizado en controladores).

# Guía de Verificación de Historias de Usuario

Este documento detalla los flujos de prueba (JSONs y Endpoints) para validar el cumplimiento de las Historias de Usuario.

---

## HU001: Registro y Sincronización de Infracciones

**Objetivo:** Verificar registro de multas, carga de evidencias, ubicación y alertas previas.

### Paso 1: Consultar Alertas de Vehículo (Previo a multar)
El oficial escanea/ingresa la placa para ver si tiene reporte de robo o adeudos.

*   **Endpoint:** `GET /vehiculos/ABC-123`
*   **Prueba:** Verificar que el sistema alerte si hay robo o adeudos.

**Respuesta Esperada (Con alertas):**
```json
{
  "placa": "ABC-123",
  "encontradoEnRepuve": true,
  "datosRepuve": {
    "placa": "ABC-123",
    "tieneReporteRobo": true  // <--- ALERTA DE ROBO
  },
  "adeudos": [
    {
      "linea_captura": "...",
      "estatus": "PENDIENTE", // <--- ALERTA DE ADEUDO
      "monto_total": 1500
    }
  ],
  "totalAdeudos": 1
}
```

### Paso 2: Registrar Infracción
El oficial llena los datos y envía la multa.

*   **Endpoint:** `POST /infracciones`
*   **Body (JSON):**
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
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA...",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUB...",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUC...",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUD..."
    ]
}
```

**Respuesta Esperada:**
```json
{
    "mensaje": "Infracción creada exitosamente",
    "id_infraccion": 123,
    "linea_captura": "123456789012345" // <--- Generada por Finanzas
}
```

### Casos Particulares (Validaciones)

**Caso A: Vehículo con Reporte de Robo**
Si el vehículo detectado (por placa o NIV) tiene reporte de robo activo en REPUVE:

*   **Respuesta Esperada (Código 400):**
```json
{
    "error": "El vehículo tiene reporte de robo. No se puede generar la infracción."
}
```

**Caso B: Vehículo con Adeudos Pendientes**
Si el vehículo tiene multas o tenencias vencidas/pendientes en Finanzas:

*   **Respuesta Esperada (Código 201):**
    La infracción **SÍ** se crea, pero se incluye una advertencia.
```json
{
    "mensaje": "Infracción creada exitosamente",
    "id_infraccion": 124,
    "linea_captura": "...",
    "advertencia": "El vehículo tiene adeudos pendientes."
}
```

**Caso C: Licencia no válida o no encontrada**
Si se proporciona un `id_licencia` que no existe en el sistema de SEMOVI:

*   **Respuesta Esperada (Código 400):**
```json
{
    "error": "Licencia no válida o no encontrada"
}
```

**Caso D: Infracción sin datos del conductor (Vehículo abandonado/estacionado)**
Si no se proporciona `id_licencia` ni `ubicacion_infractor`:

*   **Respuesta Esperada (Código 201):**
    La infracción se crea normalmente vinculada únicamente al vehículo.
```json
{
    "mensaje": "Infracción creada exitosamente",
    "id_infraccion": 125,
    "linea_captura": "..."
}
```

---

## HU002: Autenticación y Control de Sesión

**Objetivo:** Verificar seguridad, sesión única y cambio de contraseña obligatorio.

### Paso 1: Login (Primer Ingreso)
Oficial ingresa por primera vez.

*   **Endpoint:** `POST /login`
*   **Body:**
```json
{
    "username": "oficial_nuevo", 
    "password": "password_temporal"
}
```

**Respuesta Esperada:**
```json
{
    "token": "eyJhbGci...",
    "primer_ingreso": true, // <--- Indica que DEBE cambiar contraseña
    "mensaje": "Primer inicio de sesión detectado..."
}
```

### Paso 2: Cambio de Contraseña (Validación de Seguridad)
Intentar cambiar a una contraseña débil.

*   **Endpoint:** `PATCH /users/1/password`
*   **Body (Contraseña Débil):** `{"newPassword": "123"}`

**Respuesta Esperada (Error):**
```json
{ "error": "La contraseña debe tener al menos 8 caracteres" }
```

*   **Body (Contraseña Correcta):** `{"newPassword": "NuevaPassword1!"}`

**Respuesta Esperada (Éxito):**
```json
{ "mensaje": "Contraseña actualizada exitosamente" }
```

### Paso 3: Verificar Sesión Única
1.  Hacer Login en Dispositivo A -> Recibes `Token_A` (Versión 1).
2.  Hacer Login en Dispositivo B -> Recibes `Token_B` (Versión 2).
3.  Intentar usar `Token_A` para cualquier consulta.

*   **Endpoint:** `GET /users` con Header `Authorization: Bearer Token_A`

**Respuesta Esperada (Bloqueo):**
```json
{ "error": "Sesión expirada o iniciada en otro dispositivo" }
```

---

## Obtención y Uso del Token JWT

Para interactuar con endpoints protegidos por autenticación, primero se debe obtener un JSON Web Token (JWT) a través del endpoint de login. Este token debe ser incluido en la cabecera `Authorization` de las solicitudes subsiguientes.

### Paso 1: Obtener el Token JWT (Login)

*   **Método:** `POST`
*   **Endpoint:** `/login`
*   **Body (JSON):**
    ```json
    {
        "username": "un_usuario_existente",
        "password": "su_password"
    }
    ```
    (Puedes usar "11111" y "securepassword" si usaste los datos de prueba del `bd.sql`)

*   **Respuesta Esperada (200):**
    ```json
    {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c3VhcmlvIjoxLCJ1c2VybmFtZSI6IjExMTExIiwidG9rZW5fdmVyc2lvbiI6MSwiaWF0IjoxNzA1NzA4ODAwLCJleHAiOjE3MDU3Mzc2MDB9.EXAMPLE_TOKEN_STRING",
        "primer_ingreso": false,
        "mensaje": "Login exitoso"
    }
    ```
    Copia el valor del campo `token`.

### Paso 2: Usar el Token en Solicitudes Protegidas

Una vez obtenido el token, inclúyelo en la cabecera `Authorization` con el prefijo `Bearer` para acceder a los endpoints protegidos, como `solicitar-modificacion-placa` y `solicitar-anulacion`.

*   **Cabecera:**
    ```
    Authorization: Bearer <tu_token_jwt_aqui>
    ```

---

## HU007: Modificación y Anulación de Infracciones (Proceso de Doble Autorización)

**Objetivo:** Verificar la corrección de datos menores y la anulación de infracciones a través de un proceso de dos pasos con autorización de un tercero, asegurando el registro de auditoría.

### Flujo General

1.  **Solicitud de Cambio:** Un usuario (ej. oficial) solicita una modificación o anulación. Esta solicitud se registra en auditoría con estado `PENDIENTE`.
2.  **Consulta de Solicitudes:** Un administrador consulta las solicitudes pendientes.
3.  **Autorización/Rechazo:** Un administrador diferente al que hizo la solicitud aprueba o rechaza el cambio. Si se aprueba, el cambio se aplica a la infracción; de lo contrario, no.

### Escenario 1: Solicitar Corrección de Placa

1.  **Obtener una infracción existente.**
    *   `GET /infracciones/1`
    *   Verificar la placa actual (ej. `ABC-123`).

2.  **Solicitar Modificación de la Placa con Justificación.**
    *   **Endpoint:** `PATCH /infracciones/1/solicitar-modificacion-placa`
    *   **Cabecera:** `Authorization: Bearer <token_de_usuario_solicitante>`
    *   **Body (JSON):**
        ```json
        {
            "placa": "ABD-123",
            "justificacion": "Corrección de un caracter en la placa según la evidencia fotográfica."
        }
        ```
    *   **Respuesta Esperada (202 Accepted):**
        ```json
        {
            "mensaje": "Solicitud de modificación de placa enviada para autorización.",
            "id_auditoria": 1 // ID del registro de auditoría generado
        }
        ```

### Escenario 2: Solicitar Anulación de Infracción

1.  **Seleccionar una infracción activa.**
    *   `GET /infracciones/2`
    *   Verificar que el estado no sea `ANULADA`.

2.  **Solicitar Anulación de la Infracción con Justificación.**
    *   **Endpoint:** `PATCH /infracciones/2/solicitar-anulacion`
    *   **Cabecera:** `Authorization: Bearer <token_de_usuario_solicitante>`
    *   **Body (JSON):**
        ```json
        {
            "justificacion": "La infracción fue levantada por error, el vehículo no correspondía."
        }
        ```
    *   **Respuesta Esperada (202 Accepted):**
        ```json
        {
            "mensaje": "Solicitud de anulación de infracción enviada para autorización.",
            "id_auditoria": 2 // ID del registro de auditoría generado
        }
        ```

### Escenario 3: Consultar Solicitudes Pendientes

1.  **Obtener un token de un usuario AUTORIZADOR** (diferente al solicitante).
    *   `POST /login` (ej. con otro usuario administrador)

2.  **Consultar todas las solicitudes de cambio pendientes.**
    *   **Endpoint:** `GET /infracciones/solicitudes-pendientes`
    *   **Cabecera:** `Authorization: Bearer <token_de_usuario_autorizador>`
    *   **Respuesta Esperada (200 OK):**
        ```json
        [
            {
                "id_auditoria": 1,
                "id_infraccion": 1,
                "folio": "INF-0000001",
                "fecha_modificacion": "2026-01-16T12:00:00.000Z",
                "campo_modificado": "vehiculo_infraccionado",
                "valor_anterior": "ABC-123",
                "valor_nuevo": "ABD-123",
                "tipo_modificacion": "CORRECCION",
                "justificacion": "Corrección de un caracter en la placa según la evidencia fotográfica.",
                "solicitado_por": "usuario_solicitante_1"
            },
            {
                "id_auditoria": 2,
                "id_infraccion": 2,
                "folio": "INF-0000002",
                "fecha_modificacion": "2026-01-16T12:05:00.000Z",
                "campo_modificado": "estatus",
                "valor_anterior": "ACTIVA",
                "valor_nuevo": "ANULADA",
                "tipo_modificacion": "ANULACION",
                "justificacion": "La infracción fue levantada por error, el vehículo no correspondía.",
                "solicitado_por": "usuario_solicitante_2"
            }
        ]
        ```

### Escenario 4: Autorizar/Rechazar una Solicitud

1.  **Seleccionar una `id_auditoria` de las solicitudes pendientes.** (ej. `1` del Escenario 3).

2.  **Autorizar la solicitud.**
    *   **Endpoint:** `PATCH /infracciones/auditoria/1/autorizar`
    *   **Cabecera:** `Authorization: Bearer <token_de_usuario_autorizador>`
    *   **Body (JSON - Aprobación):**
        ```json
        {
            "estatus_autorizacion": "APROBADO",
            "justificacion_autorizador": "Solicitud revisada y aprobada."
        }
        ```
    *   **Respuesta Esperada (200 OK):**
        ```json
        {
            "mensaje": "La solicitud de cambio ha sido aprobada."
        }
        ```

3.  **Verificar que el cambio se aplicó a la infracción.**
    *   `GET /infracciones/1`
    *   Confirmar que la placa ahora es `ABD-123`.

4.  **Rechazar otra solicitud.** (ej. `2` del Escenario 3).
    *   **Endpoint:** `PATCH /infracciones/auditoria/2/autorizar`
    *   **Cabecera:** `Authorization: Bearer <token_de_usuario_autorizador>`
    *   **Body (JSON - Rechazo):**
        ```json
        {
            "estatus_autorizacion": "RECHAZADO",
            "justificacion_autorizador": "No hay evidencia suficiente para la anulación."
        }
        ```
    *   **Respuesta Esperada (200 OK):**
        ```json
        {
            "mensaje": "La solicitud de cambio ha sido rechazada."
        }
        ```

5.  **Verificar que el cambio NO se aplicó a la infracción.**
    *   `GET /infracciones/2`
    *   Confirmar que el estado sigue siendo `ACTIVA` (o el que tuviera antes de la solicitud).

---

## HU008: Auditoría de Cambios de una Infracción

**Objetivo:** Consultar el historial de modificaciones de una infracción.

### Escenario Único: Consultar Historial Detallado

1.  **Consultar el historial de la infracción `1` (placa modificada).**
    *   **Endpoint:** `GET /infracciones/1/historial`
    *   **Cabecera:** `Authorization: Bearer <token_de_usuario_con_permisos_de_consulta>`
    *   **Respuesta Esperada (200 OK):**
        ```json
        [
            {
                "fecha_modificacion": "2026-01-16T12:00:00.000Z",
                "campo_modificado": "vehiculo_infraccionado",
                "valor_anterior": "ABC-123",
                "valor_nuevo": "ABD-123",
                "tipo_modificacion": "CORRECCION",
                "justificacion": "Corrección de un caracter en la placa según la evidencia fotográfica. | Justificación Autorizador: Solicitud revisada y aprobada.",
                "modificado_por": "usuario_solicitante_1",
                "autorizado_por": "usuario_autorizador_1",
                "estatus_autorizacion": "APROBADO"
            }
        ]
        ```

2.  **Consultar el historial de la infracción `2` (anulación rechazada).**
    *   **Endpoint:** `GET /infracciones/2/historial`
    *   **Cabecera:** `Authorization: Bearer <token_de_usuario_con_permisos_de_consulta>`
    *   **Respuesta Esperada (200 OK):**
        ```json
        [
            {
                "fecha_modificacion": "2026-01-16T12:05:00.000Z",
                "campo_modificado": "estatus",
                "valor_anterior": "ACTIVA",
                "valor_nuevo": "ANULADA",
                "tipo_modificacion": "ANULACION",
                "justificacion": "La infracción fue levantada por error, el vehículo no correspondía. | Justificación Autorizador: No hay evidencia suficiente para la anulación.",
                "modificado_por": "usuario_solicitante_2",
                "autorizado_por": "usuario_autorizador_1",
                "estatus_autorizacion": "RECHAZADO"
            }
        ]
        ```
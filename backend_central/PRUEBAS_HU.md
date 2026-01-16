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

Una vez obtenido el token, inclúyelo en la cabecera `Authorization` con el prefijo `Bearer` para acceder a los endpoints protegidos, como `modificar-placa` y `anular`.

*   **Cabecera:**
    ```
    Authorization: Bearer <tu_token_jwt_aqui>
    ```

*   **Ejemplo de Uso (Modificar Placa):**
    *   **Método:** `PATCH`
    *   **Endpoint:** `/infracciones/1/modificar-placa`
    *   **Cabecera:** `Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c3VhcmlvIjoxLCJ1c2VybmFtZSI6IjExMTExIiwidG9rZW5fdmVyc2lvbiI6MSwiaWF0IjoxNzA1NzA4ODAwLCJleHAiOjE3MDU3Mzc2MDB9.EXAMPLE_TOKEN_STRING`
    *   **Body (JSON):**
        ```json
        {
            "placa": "ABD-123",
            "justificacion": "Corrección de un caracter en la placa."
        }
        ```

## HU007: Modificación y Anulación de Infracciones

**Objetivo:** Verificar la corrección de datos menores y la anulación de infracciones, asegurando que cada cambio quede registrado en la auditoría.

### Escenario 1: Corrección de Placa

1.  **Obtener una infracción existente.**
    *   `GET /infracciones/1`
    *   Verificar la placa actual (ej. `ABC-123`).

2.  **Modificar la placa con una justificación.**
    *   **Endpoint:** `PATCH /infracciones/1/modificar-placa`
    *   **Body (JSON):**
        ```json
        {
            "placa": "ABD-123",
            "justificacion": "Corrección de un caracter en la placa según la evidencia fotográfica."
        }
        ```
    *   **Respuesta Esperada (200):**
        ```json
        {
            "mensaje": "Placa de la infracción actualizada y auditada correctamente."
        }
        ```

3.  **Verificar que el cambio se aplicó.**
    *   `GET /infracciones/1`
    *   Confirmar que la placa ahora es `ABD-123`.

### Escenario 2: Anulación de Infracción

1.  **Seleccionar una infracción activa.**
    *   `GET /infracciones/2`
    *   Verificar que el estado no sea `ANULADA`.

2.  **Anular la infracción con una justificación.**
    *   **Endpoint:** `PATCH /infracciones/2/anular`
    *   **Body (JSON):**
        ```json
        {
            "justificacion": "La infracción fue levantada por error, el vehículo no correspondía."
        }
        ```
    *   **Respuesta Esperada (200):**
        ```json
        {
            "mensaje": "Infracción anulada y auditada correctamente."
        }
        ```

3.  **Verificar que el estado de la infracción cambió.**
    *   `GET /infracciones/2`
    *   Aunque la infracción anulada no debería aparecer en la lista general, si se consulta por ID, su estado debería ser `ANULADA`. (Esto depende de la implementación final de `getInfraccionById`).

---

## HU008: Auditoría de Cambios de una Infracción

**Objetivo:** Consultar el historial de modificaciones de una infracción.

### Escenario Único: Consultar Historial

1.  **Utilizar la infracción del Escenario 1 (ID 1), que ya fue modificada.**
    *   **Endpoint:** `GET /infracciones/1/historial`
    *   **Respuesta Esperada (200):**
        Un arreglo con al menos un objeto de auditoría.
        ```json
        [
            {
                "fecha_modificacion": "2026-01-16T12:00:00.000Z",
                "campo_modificado": "vehiculo_infraccionado",
                "valor_anterior": "ABC-123",
                "valor_nuevo": "ABD-123",
                "tipo_modificacion": "CORRECCION",
                "justificacion": "Corrección de un caracter en la placa según la evidencia fotográfica.",
                "modificado_por": "11111", // admin username
                "autorizado_por": "11111", // admin username
                "estatus_autorizacion": "APROBADO"
            }
        ]
        ```

2.  **Utilizar la infracción del Escenario 2 (ID 2), que fue anulada.**
    *   **Endpoint:** `GET /infracciones/2/historial`
    *   **Respuesta Esperada (200):**
        ```json
        [
            {
                "fecha_modificacion": "2026-01-16T12:05:00.000Z",
                "campo_modificado": "estatus",
                "valor_anterior": "ACTIVA",
                "valor_nuevo": "ANULADA",
                "tipo_modificacion": "ANULACION",
                "justificacion": "La infracción fue levantada por error, el vehículo no correspondía.",
                "modificado_por": "11111",
                "autorizado_por": "11111",
                "estatus_autorizacion": "APROBADO"
            }
        ]
        ```
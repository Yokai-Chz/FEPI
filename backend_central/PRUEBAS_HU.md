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
    "tieneReporteRobo": true
  },
  "adeudos": [
    {
      "linea_captura": "...",
      "estatus": "PENDIENTE",
      "monto_total": 1500
    }
  ],
  "totalAdeudos": 1,
  "montoTotalAdeudos": 1500
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
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA..."
    ]
}
```

**Respuesta Esperada:**
```json
{
    "mensaje": "Infracción creada exitosamente",
    "id_infraccion": 123,
    "folio": "INF-0000123",
    "linea_captura": "123456789012345"
}
```

### Casos Particulares (Validaciones)

**Caso A: Vehículo con Reporte de Robo**
*   **Respuesta Esperada (Código 400):**
```json
{
    "error": "El vehículo tiene reporte de robo. No se puede generar la infracción."
}
```

**Caso B: Vehículo con Adeudos Pendientes**
*   **Respuesta Esperada (Código 201 con advertencia):**
```json
{
    "mensaje": "Infracción creada exitosamente",
    "id_infraccion": 124,
    "folio": "INF-0000124",
    "linea_captura": "...",
    "advertencia": "El vehículo tiene adeudos pendientes."
}
```

**Caso C: Licencia no válida o no encontrada**
*   **Respuesta Esperada (Código 400):**
```json
{
    "error": "Licencia no válida o no encontrada"
}
```

**Caso D: Infracción sin datos del conductor**
*   **Respuesta Esperada (Código 201):**
```json
{
    "mensaje": "Infracción creada exitosamente",
    "id_infraccion": 125,
    "folio": "INF-0000125",
    "linea_captura": "..."
}
```

---

## HU002: Autenticación y Control de Sesión

**Objetivo:** Verificar seguridad, sesión única y cambio de contraseña.

### Paso 1: Login
*   **Endpoint:** `POST /login`
*   **Body:**
```json
{
    "username": "un_usuario", 
    "password": "su_password"
}
```
**Respuesta Esperada:**
```json
{
    "token": "eyJhbGci...",
    "mensaje": "Login exitoso"
}
```

### Paso 2: Cambio de Contraseña
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
1.  Hacer Login en Dispositivo A -> Recibes `Token_A`.
2.  Hacer Login en Dispositivo B -> Recibes `Token_B`.
3.  Intentar usar `Token_A`.
*   **Endpoint:** `GET /users` con Header `Authorization: Bearer Token_A`
**Respuesta Esperada (Bloqueo):**
```json
{ "error": "Sesión expirada o iniciada en otro dispositivo" }
```

---

## HU007: Modificación y Anulación de Infracciones

**Objetivo:** Verificar la corrección y anulación de infracciones con autorización.

### Flujo General

1.  **Solicitud:** Un usuario solicita una modificación o anulación.
2.  **Consulta:** Un administrador consulta las solicitudes pendientes.
3.  **Autorización/Rechazo:** Un administrador aprueba o rechaza el cambio.

### Escenario 1: Solicitar Corrección de Placa
*   **Endpoint:** `PATCH /infracciones/1/solicitar-modificacion-placa`
*   **Body:**
    ```json
    {
        "placa": "ABD-123",
        "justificacion": "Corrección de un caracter."
    }
    ```
*   **Respuesta (202):**
    ```json
    {
        "mensaje": "Solicitud de modificación de placa enviada para autorización.",
        "id_auditoria": 1
    }
    ```

### Escenario 2: Solicitar Anulación de Infracción
*   **Endpoint:** `PATCH /infracciones/2/solicitar-anulacion`
*   **Body:**
    ```json
    {
        "justificacion": "La infracción fue levantada por error."
    }
    ```
*   **Respuesta (202):**
    ```json
    {
        "mensaje": "Solicitud de anulación de infracción enviada para autorización.",
        "id_auditoria": 2
    }
    ```

### Escenario 3: Consultar Solicitudes Pendientes
*   **Endpoint:** `GET /infracciones/solicitudes-pendientes`
*   **Respuesta (200):**
    ```json
    [
        {
            "id_auditoria": 1,
            "id_infraccion": 1,
            "folio": "INF-0000001",
            "campo_modificado": "vehiculo_infraccionado",
            "valor_nuevo": "ABD-123",
            "solicitado_por": "usuario_solicitante"
        }
    ]
    ```

### Escenario 4: Autorizar/Rechazar una Solicitud
*   **Endpoint:** `PATCH /infracciones/auditoria/1/autorizar`
*   **Body (Aprobación):**
    ```json
    {
        "estatus_autorizacion": "APROBADO",
        "justificacion_autorizador": "Solicitud aprobada."
    }
    ```
*   **Respuesta (200):** `{"mensaje": "La solicitud de cambio ha sido aprobada."}`

---

## HU008: Auditoría de Cambios de una Infracción

**Objetivo:** Consultar el historial de modificaciones de una infracción.

### Escenario Único: Consultar Historial
*   **Endpoint:** `GET /infracciones/1/historial`
*   **Respuesta (200):**
    ```json
    [
        {
            "fecha_modificacion": "2026-01-16T12:00:00.000Z",
            "campo_modificado": "vehiculo_infraccionado",
            "valor_anterior": "ABC-123",
            "valor_nuevo": "ABD-123",
            "modificado_por": "usuario_solicitante",
            "autorizado_por": "usuario_autorizador",
            "estatus_autorizacion": "APROBADO"
        }
    ]
    ```

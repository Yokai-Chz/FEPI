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
    "latitud": 19.432608, 
    "longitud": -99.133209,
    "placa": "ABC-123",
    "niv": "NIV1234567890",
    "id_agente": 1,
    "descripcion": "Estacionado en lugar prohibido",
    "infracciones": ["ART-01"], 
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
    "linea_captura": "123456789012345" // <--- Generada por Finanzas
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

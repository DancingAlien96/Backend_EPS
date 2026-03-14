# API ENDPOINTS - SISTEMA DE REGISTRO PROGRESIVO

## Base URL
```
Desarrollo: http://localhost:3000/api
Producción: https://epsb.pruebascunori.shop/api
```

---

## AUTENTICACIÓN

### 1. POST `/auth/registro/paso-0`
**Descripción**: Seleccionar tipo de usuario (no crea cuenta aún)

**Body**:
```json
{
  "member_type": "emprendimiento|empresa|organizacion|institucion|consumidor"
}
```

**Validaciones**:
- `member_type` requerido y debe ser uno de los valores permitidos
- Si es "consumidor", validar que feature flag esté activo

**Respuesta 200**:
```json
{
  "success": true,
  "member_type": "emprendimiento",
  "nextStep": 1,
  "message": "Tipo de perfil seleccionado. Continúa con tus datos de acceso."
}
```

**Respuesta 400** (consumidor deshabilitado):
```json
{
  "error": "El registro de consumidores no está disponible actualmente"
}
```

---

### 2. POST `/auth/registro/paso-1`
**Descripción**: Crear cuenta de usuario (paso obligatorio)

**Body**:
```json
{
  "member_type": "emprendimiento",
  "nombre_completo": "Juan Pérez",
  "correo_electronico": "juan@ejemplo.com",
  "telefono_whatsapp": "+50212345678",
  "contrasena": "MiPassword123",
  
  // Opcionales
  "municipio_id": 45,
  "departamento_id": 8,
  "numero_identificacion": "1234567890101",
  "fecha_nacimiento": "1990-05-15"
}
```

**Validaciones**:
- Email único (no debe existir en la BD)
- Contraseña mínimo 8 caracteres, al menos 1 mayúscula y 1 número
- Teléfono formato +502XXXXXXXX
- `member_type` debe coincidir con el seleccionado en paso 0

**Respuesta 201**:
```json
{
  "success": true,
  "userId": 123,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 123,
    "email": "juan@ejemplo.com",
    "nombre_completo": "Juan Pérez",
    "member_type": "emprendimiento"
  },
  "profileCompletion": 20,
  "currentStep": 1,
  "nextStep": 2,
  "message": "¡Cuenta creada exitosamente! Completa tu perfil para acceder a todas las funciones."
}
```

**Respuesta 400** (email duplicado):
```json
{
  "error": "El correo ya está registrado",
  "field": "correo_electronico",
  "suggestion": "¿Ya tienes cuenta? Intenta iniciar sesión."
}
```

**Notas**:
- El token JWT debe incluir: `{ userId, email, memberType, roles }`
- Se crea automáticamente el registro en `registration_progress` con 20%
- Se asigna rol `usuario_autenticado`

---

### 3. POST `/auth/login`
**Descripción**: Iniciar sesión

**Body**:
```json
{
  "email": "juan@ejemplo.com",
  "password": "MiPassword123"
}
```

**Respuesta 200**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 123,
    "email": "juan@ejemplo.com",
    "nombre_completo": "Juan Pérez",
    "member_type": "emprendimiento",
    "profileCompletion": 65,
    "currentStep": 4,
    "registrationCompleted": false,
    "isApproved": false
  },
  "redirectTo": "/registro/paso/4"
}
```

**Respuesta 401**:
```json
{
  "error": "Credenciales incorrectas"
}
```

---

### 4. GET `/auth/me`
**Descripción**: Obtener información del usuario autenticado

**Headers**: `Authorization: Bearer {token}`

**Respuesta 200**:
```json
{
  "user": {
    "id": 123,
    "email": "juan@ejemplo.com",
    "nombre_completo": "Juan Pérez",
    "member_type": "emprendimiento",
    "telefono_whatsapp": "+50212345678",
    "municipio": "Chiquimula",
    "departamento": "Chiquimula"
  },
  "progress": {
    "currentStep": 4,
    "completionPercentage": 65,
    "registrationCompleted": false,
    "isApproved": false,
    "completedSteps": [1, 2, 3],
    "skippedSteps": [3],
    "nextStep": 4
  },
  "roles": ["usuario_autenticado", "emprendedor_verificado"]
}
```

---

## REGISTRO POR PASOS

### 5. POST `/registro/paso-2`
**Descripción**: Perfil base del negocio/entidad

**Headers**: `Authorization: Bearer {token}`

**Body para Emprendimiento/Empresa**:
```json
{
  "nombre_emprendimiento": "Artesanías Don Juan",
  "descripcion_corta": "Producción y venta de artesanías típicas de Guatemala",
  "sector_id": 5,
  "etapa_negocio": "creciendo",
  "fecha_inicio": "2020-03-15",
  "tiene_logo": true,
  "logo_url": "https://res.cloudinary.com/dood2syly/image/upload/v123/logo.png"
}
```

**Body para Organización**:
```json
{
  "nombre_entidad": "Incubadora de Negocios Oriente",
  "tipo_entidad": "incubadora",
  "descripcion_servicios": "Asesoría y acompañamiento a emprendedores",
  "cobertura_geografica": [45, 46, 47],
  "logo_url": "https://res.cloudinary.com/..."
}
```

**Body para Consumidor**:
```json
{
  "intereses": ["artesanias", "alimentos", "tecnologia"],
  "categorias_favoritas": [1, 3, 5, 8]
}
```

**Validaciones**:
- Campos obligatorios según el `member_type` del usuario
- `sector_id` debe existir en tabla `sectores_economicos`
- `logo_url` debe ser URL válida de Cloudinary

**Respuesta 200**:
```json
{
  "success": true,
  "stepCompleted": 2,
  "profileCompletion": 40,
  "nextStep": 3,
  "message": "Perfil base guardado exitosamente"
}
```

---

### 6. POST `/registro/paso-3`
**Descripción**: Ventas y pagos (solo negocio)

**Headers**: `Authorization: Bearer {token}`

**Body**:
```json
{
  "canales_venta": ["ferias", "whatsapp", "facebook"],
  "metodos_pago": ["efectivo", "transferencia", "tigo_money"],
  "usa_pasarela_pago": true,
  "proveedor_pasarela": "pagadito",
  "tipo_cuenta_bancaria": "personal"
}
```

**Validaciones**:
- Solo para `member_type` = "emprendimiento" o "empresa"
- Si `usa_pasarela_pago` = true, `proveedor_pasarela` es obligatorio
- `canales_venta` y `metodos_pago` deben ser arrays no vacíos

**Respuesta 200**:
```json
{
  "success": true,
  "stepCompleted": 3,
  "profileCompletion": 55,
  "nextStep": 4
}
```

**Respuesta 403** (si es consumidor):
```json
{
  "error": "Este paso no aplica para tu tipo de perfil"
}
```

---

### 7. POST `/registro/paso-4`
**Descripción**: Logística y presencia digital

**Body**:
```json
{
  "realiza_envios": "nacional",
  "metodos_envio": ["guatex", "cargo_expreso"],
  "politica_cobro_envio": "cliente_paga",
  
  "facebook_url": "https://facebook.com/artesaniasdonjuan",
  "instagram_url": "@artesaniasdonjuan",
  "whatsapp_business": "+50212345678",
  "sitio_web": "https://artesaniasdonjuan.com"
}
```

**Validaciones**:
- Si `realiza_envios` != "no", `metodos_envio` es obligatorio
- URLs deben ser válidas
- Instagram y TikTok pueden ser con o sin @

**Respuesta 200**:
```json
{
  "success": true,
  "stepCompleted": 4,
  "profileCompletion": 75,
  "nextStep": 5
}
```

---

### 8. POST `/registro/paso-5`
**Descripción**: Formalización (opcional)

**Body**:
```json
{
  "registro_SAT": true,
  "nit": "1234567-8",
  "puede_emitir_facturas": true,
  "archivo_rtu": "https://res.cloudinary.com/.../rtu.pdf",
  
  "estado_registro_mercantil": "registrado",
  
  "tiene_patente_comercio": true,
  "numero_patente": "123456",
  "archivo_patente": "https://res.cloudinary.com/.../patente.pdf",
  
  "interes_registro_marca": "ya_tengo",
  "estado_marca": "Marca Registrada #45678",
  
  "otros_registros": "Registro sanitario vigente"
}
```

**Validaciones**:
- Si `registro_SAT` = true, `nit` es obligatorio
- Si `puede_emitir_facturas` = true, `archivo_rtu` es obligatorio
- Si `tiene_patente_comercio` = true, `numero_patente` es obligatorio

**Respuesta 200**:
```json
{
  "success": true,
  "stepCompleted": 5,
  "profileCompletion": 90,
  "nextStep": 6
}
```

---

### 9. POST `/registro/paso-6`
**Descripción**: Intereses y apoyos (final)

**Body para Emprendimiento/Empresa**:
```json
{
  "necesidades_apoyo": [
    "financiamiento",
    "marketing_digital",
    "formalizacion",
    "capacitacion"
  ]
}
```

**Body para Organización**:
```json
{
  "tipos_apoyo_ofrecidos": ["capacitaciones", "asesoria", "financiamiento"],
  "puede_publicar_eventos": true,
  "puede_publicar_noticias": false,
  "puede_publicar_convocatorias": true
}
```

**Body para Consumidor**:
```json
{
  "suscribirse_noticias": true,
  "suscribirse_eventos": true
}
```

**Respuesta 200**:
```json
{
  "success": true,
  "stepCompleted": 6,
  "profileCompletion": 100,
  "registrationCompleted": true,
  "message": "¡Felicidades! Tu perfil está completo. En breve un administrador revisará tu información.",
  "redirectTo": "/dashboard",
  "pendingApproval": true
}
```

---

### 10. POST `/registro/saltar-paso/:step`
**Descripción**: Saltar un paso (solo si es permitido)

**Headers**: `Authorization: Bearer {token}`

**Params**: `step` = número del paso (2-6)

**Body**: (vacío)

**Validaciones**:
- Paso 1 y 2 NO son saltables
- Solo pasos 3, 4, 5, 6 permiten "saltar"

**Respuesta 200**:
```json
{
  "success": true,
  "stepSkipped": 3,
  "currentStep": 4,
  "profileCompletion": 40,
  "message": "Puedes completar este paso más tarde desde tu perfil"
}
```

**Respuesta 400**:
```json
{
  "error": "Este paso no puede saltarse",
  "reason": "Información básica requerida"
}
```

---

### 11. GET `/registro/progreso`
**Descripción**: Obtener progreso actual del registro

**Headers**: `Authorization: Bearer {token}`

**Respuesta 200**:
```json
{
  "userId": 123,
  "memberType": "emprendimiento",
  "currentStep": 4,
  "completionPercentage": 65,
  "registrationCompleted": false,
  "isApproved": false,
  "steps": [
    {
      "step": 1,
      "completed": true,
      "skipped": false,
      "completedAt": "2025-01-15T10:30:00Z"
    },
    {
      "step": 2,
      "completed": true,
      "skipped": false,
      "completedAt": "2025-01-15T10:35:00Z"
    },
    {
      "step": 3,
      "completed": false,
      "skipped": true,
      "completedAt": null
    },
    {
      "step": 4,
      "completed": false,
      "skipped": false,
      "completedAt": null
    }
  ],
  "recommendations": [
    {
      "title": "Agrega tu logo",
      "description": "Los negocios con logo reciben 3x más visitas",
      "action": "Subir logo",
      "points": 5,
      "stepNumber": 2
    },
    {
      "title": "Completa información de ventas",
      "description": "Ayuda a clientes a saber cómo comprarte",
      "action": "Ir al paso 3",
      "points": 15,
      "stepNumber": 3
    }
  ]
}
```

---

### 12. POST `/registro/guardado-automatico`
**Descripción**: Guardar progreso sin avanzar de paso (auto-save)

**Headers**: `Authorization: Bearer {token}`

**Body**:
```json
{
  "step": 3,
  "data": {
    "canales_venta": ["ferias", "whatsapp"],
    "metodos_pago": ["efectivo"]
  }
}
```

**Respuesta 200**:
```json
{
  "success": true,
  "message": "Cambios guardados",
  "savedAt": "2025-01-15T14:23:45Z"
}
```

---

## PERFIL DE USUARIO

### 13. GET `/perfil/:userId`
**Descripción**: Ver perfil público de un usuario

**Params**: `userId` = ID del usuario

**Query Params** (opcionales):
- `?full=true` - Incluir todos los datos (requiere auth y ser el mismo usuario)

**Respuesta 200** (vista pública):
```json
{
  "id": 123,
  "nombre": "Artesanías Don Juan",
  "descripcion": "Producción y venta de artesanías típicas de Guatemala",
  "logo": "https://res.cloudinary.com/.../logo.png",
  "sector": "Artesanías",
  "municipio": "Chiquimula",
  "departamento": "Chiquimula",
  "etapa": "creciendo",
  "fechaInicio": "2020-03-15",
  "redes": {
    "facebook": "https://facebook.com/artesaniasdonjuan",
    "instagram": "@artesaniasdonjuan",
    "whatsapp": "+50212345678",
    "sitioWeb": "https://artesaniasdonjuan.com"
  },
  "profileCompletion": 100,
  "verified": true
}
```

---

### 14. PUT `/perfil/actualizar`
**Descripción**: Actualizar información del perfil (después del registro)

**Headers**: `Authorization: Bearer {token}`

**Body**: (campos que se quieren actualizar)
```json
{
  "descripcion_corta": "Nueva descripción actualizada",
  "facebook_url": "https://facebook.com/nuevo-perfil",
  "metodos_pago": ["efectivo", "transferencia", "tarjeta"]
}
```

**Respuesta 200**:
```json
{
  "success": true,
  "message": "Perfil actualizado exitosamente",
  "profileCompletion": 88,
  "updatedFields": ["descripcion_corta", "facebook_url", "metodos_pago"]
}
```

---

## ADMINISTRACIÓN

### 15. GET `/admin/solicitudes-pendientes`
**Descripción**: Listar usuarios con registro completo pendientes de aprobación

**Headers**: `Authorization: Bearer {token}` (rol admin requerido)

**Query Params**:
- `?page=1&limit=20`
- `?memberType=emprendimiento` - Filtrar por tipo
- `?ordenar=fecha_asc|fecha_desc|completion_desc`

**Respuesta 200**:
```json
{
  "solicitudes": [
    {
      "userId": 123,
      "nombre": "Juan Pérez",
      "email": "juan@ejemplo.com",
      "memberType": "emprendimiento",
      "nombreNegocio": "Artesanías Don Juan",
      "profileCompletion": 100,
      "fechaRegistro": "2025-01-15T10:30:00Z",
      "diasEsperando": 3,
      "telefono": "+50212345678",
      "municipio": "Chiquimula"
    }
  ],
  "total": 45,
  "page": 1,
  "totalPages": 3
}
```

---

### 16. POST `/admin/aprobar-usuario/:userId`
**Descripción**: Aprobar registro de un usuario

**Headers**: `Authorization: Bearer {token}` (rol admin requerido)

**Params**: `userId` = ID del usuario a aprobar

**Body**:
```json
{
  "comentario": "Perfil revisado y aprobado",
  "asignarRol": "emprendedor_verificado"
}
```

**Respuesta 200**:
```json
{
  "success": true,
  "message": "Usuario aprobado exitosamente",
  "userId": 123,
  "newRole": "emprendedor_verificado",
  "notificationSent": true
}
```

---

### 17. POST `/admin/rechazar-usuario/:userId`
**Descripción**: Rechazar registro

**Body**:
```json
{
  "motivo": "Información incompleta o inconsistente",
  "detalles": "Falta comprobante de NIT"
}
```

**Respuesta 200**:
```json
{
  "success": true,
  "message": "Solicitud rechazada",
  "notificationSent": true
}
```

---

## CATÁLOGOS Y UTILIDADES

### 18. GET `/catalogos/sectores`
**Descripción**: Obtener lista de sectores económicos

**Respuesta 200**:
```json
{
  "sectores": [
    { "id": 1, "nombre": "Agricultura" },
    { "id": 2, "nombre": "Ganadería" },
    { "id": 3, "nombre": "Artesanías" },
    { "id": 4, "nombre": "Alimentos y Bebidas" },
    { "id": 5, "nombre": "Textiles" }
  ]
}
```

---

### 19. GET `/catalogos/municipios`
**Descripción**: Obtener municipios por departamento

**Query Params**: `?departamento_id=20`

**Respuesta 200**:
```json
{
  "municipios": [
    { "id": 280, "nombre": "Chiquimula" },
    { "id": 281, "nombre": "Esquipulas" },
    { "id": 282, "nombre": "Camotán" }
  ]
}
```

---

### 20. POST `/cloudinary/firma`
**Descripción**: Generar firma para subida directa a Cloudinary (si backend valida)

**Headers**: `Authorization: Bearer {token}`

**Body**:
```json
{
  "folder": "emprendedores/logos",
  "resourceType": "image"
}
```

**Respuesta 200**:
```json
{
  "signature": "abc123...",
  "timestamp": 1234567890,
  "cloudName": "dood2syly",
  "apiKey": "123456789"
}
```

---

## CÓDIGOS DE ESTADO

- `200 OK` - Operación exitosa
- `201 Created` - Recurso creado
- `400 Bad Request` - Error de validación
- `401 Unauthorized` - No autenticado
- `403 Forbidden` - Sin permisos
- `404 Not Found` - Recurso no encontrado
- `409 Conflict` - Conflicto (ej: email duplicado)
- `500 Internal Server Error` - Error del servidor

---

## AUTENTICACIÓN JWT

Todos los endpoints protegidos requieren header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

El JWT debe incluir:
```json
{
  "userId": 123,
  "email": "juan@ejemplo.com",
  "memberType": "emprendimiento",
  "roles": ["usuario_autenticado", "emprendedor_verificado"],
  "iat": 1234567890,
  "exp": 1234654290
}
```

---

## LÍMITES Y THROTTLING

- Rate Limit: 100 peticiones / minuto por IP
- Tamaño máximo de payload: 10MB
- Timeout: 30 segundos por request

---

## WEBHOOKS (futuro)

Para notificaciones en tiempo real considerar:
- WebSocket para progreso en tiempo real
- Webhook al completar registro (notificar admins)
- Email automático al aprobar/rechazar


# API Endpoints - Sistema de Administración

## 🔐 Autenticación Requerida

Todos estos endpoints requieren:
- Header: `Authorization: Bearer <JWT_TOKEN>`
- Rol: `administrador` o `superusuario`

---

## 📋 Ver Solicitudes Pendientes

**Endpoint:** `GET /api/admin/solicitudes-pendientes`

**Descripción:** Obtiene todas las solicitudes de registro que están completas pero pendientes de aprobación.

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response 200 OK:**
```json
{
  "total": 3,
  "solicitudes": [
    {
      "id": 15,
      "email": "maria.lopez@example.com",
      "nombre_completo": "María López",
      "telefono_whatsapp": "12345678",
      "member_type": "emprendimiento",
      "numero_identificacion": "1234567890101",
      "fecha_nacimiento": "1990-05-15",
      "municipio": "Chiquimula",
      "departamento": "Chiquimula",
      "created_at": "2026-03-07T10:30:00.000Z",
      "completion_percentage": 85.50,
      "completed_at": "2026-03-07T11:45:00.000Z",
      "perfil": {
        "nombre_emprendimiento": "Artesanías Maya",
        "sector": "Artesanías",
        "etapa_negocio": "empezando",
        "fecha_inicio": "2025-01-10",
        "logo_url": "https://res.cloudinary.com/.../logo.jpg",
        "registro_SAT": true,
        "tiene_patente": false,
        "nit": "12345678"
      }
    },
    {
      "id": 16,
      "email": "fundacion@example.com",
      "nombre_completo": "Juan Pérez",
      "telefono_whatsapp": "87654321",
      "member_type": "organizacion",
      "created_at": "2026-03-06T15:20:00.000Z",
      "completion_percentage": 90.00,
      "completed_at": "2026-03-06T16:00:00.000Z",
      "perfil": {
        "nombre_entidad": "Fundación Emprende+",
        "tipo_entidad": "ong",
        "ambito_geografico": "departamental",
        "puede_publicar_programas": true,
        "puede_publicar_eventos": true
      }
    }
  ]
}
```

---

## 👁️ Ver Detalle de Solicitud

**Endpoint:** `GET /api/admin/solicitud/:userId`

**Descripción:** Obtiene toda la información completa de una solicitud específica.

**Params:**
- `userId` (int) - ID del usuario

**Response 200 OK:**
```json
{
  "id": 15,
  "email": "maria.lopez@example.com",
  "nombre_completo": "María López",
  "telefono_whatsapp": "12345678",
  "member_type": "emprendimiento",
  "registration_completed": true,
  "registration_approved": false,
  "created_at": "2026-03-07T10:30:00.000Z",
  "progress": {
    "current_step": 6,
    "completion_percentage": 85.50,
    "step_1_completed": true,
    "step_2_completed": true,
    "step_3_completed": true,
    "step_4_completed": true,
    "step_5_completed": true,
    "step_6_completed": true,
    "completed_at": "2026-03-07T11:45:00.000Z"
  },
  "ventureProfile": {
    "nombre_emprendimiento": "Artesanías Maya",
    "descripcion_corta": "Producción de artesanías tradicionales",
    "sector": {
      "nombre_sector": "Artesanías"
    },
    "etapa_negocio": "empezando",
    "fecha_inicio": "2025-01-10",
    "canales_venta": ["ferias", "redes_sociales"],
    "metodos_pago": ["efectivo", "transferencia"],
    "facebook_url": "https://facebook.com/artesaniasmaya",
    "instagram_url": "@artesaniasmaya",
    "whatsapp_business": "12345678",
    "registro_SAT": true,
    "nit": "12345678",
    "necesidades_apoyo": ["capacitacion", "financiamiento"]
  },
  "municipio": {
    "nombre_municipio": "Chiquimula"
  },
  "departamento": {
    "nombre_departamento": "Chiquimula"
  }
}
```

---

## ✅ Aprobar Usuario

**Endpoint:** `POST /api/admin/aprobar-usuario/:userId`

**Descripción:** Aprueba la solicitud de un usuario, permitiéndole acceder al sistema completo.

**Params:**
- `userId` (int) - ID del usuario a aprobar

**Body (opcional):**
```json
{
  "observaciones": "Usuario verificado correctamente"
}
```

**Response 200 OK:**
```json
{
  "message": "Usuario aprobado exitosamente",
  "user": {
    "id": 15,
    "email": "maria.lopez@example.com",
    "nombre_completo": "María López",
    "member_type": "emprendimiento",
    "approved_at": "2026-03-07T14:20:00.000Z"
  }
}
```

**Errores:**
- `404` - Usuario no encontrado
- `400` - Usuario no completó registro o ya está aprobado

---

## ❌ Rechazar Usuario

**Endpoint:** `POST /api/admin/rechazar-usuario/:userId`

**Descripción:** Rechaza la solicitud de un usuario y desactiva su cuenta.

**Params:**
- `userId` (int) - ID del usuario a rechazar

**Body (requerido):**
```json
{
  "motivo": "Información incompleta o inconsistente"
}
```

**Response 200 OK:**
```json
{
  "message": "Usuario rechazado exitosamente",
  "user": {
    "id": 15,
    "email": "maria.lopez@example.com",
    "is_active": false
  }
}
```

**Errores:**
- `404` - Usuario no encontrado
- `400` - Falta motivo de rechazo o usuario ya aprobado

---

## 📊 Estadísticas de Solicitudes

**Endpoint:** `GET /api/admin/estadisticas-solicitudes`

**Descripción:** Obtiene estadísticas generales del sistema de registro.

**Response 200 OK:**
```json
{
  "total_usuarios": 45,
  "pendientes": 3,
  "aprobados": 35,
  "incompletos": 7,
  "emprendimientos": 25,
  "empresas": 5,
  "organizaciones": 8,
  "instituciones": 4,
  "consumidores": 3
}
```

---

## 🔄 Flujo Completo de Aprobación

### 1. Usuario completa registro
- Finaliza todos los pasos requeridos
- `registration_completed = true`
- `registration_approved = false`
- Queda en estado "Pendiente"

### 2. Admin revisa solicitudes
```bash
GET /api/admin/solicitudes-pendientes
```

### 3. Admin revisa detalle (opcional)
```bash
GET /api/admin/solicitud/:userId
```

### 4. Admin decide:

**Opción A - Aprobar:**
```bash
POST /api/admin/aprobar-usuario/:userId
Body: { "observaciones": "Verificado correctamente" }
```
- `registration_approved = true`
- `approved_by = admin_id`
- `approved_at = now()`
- Usuario recibe email de bienvenida
- Usuario puede acceder al sistema completo

**Opción B - Rechazar:**
```bash
POST /api/admin/rechazar-usuario/:userId
Body: { "motivo": "Datos inconsistentes" }
```
- `is_active = false`
- Usuario recibe email con motivo de rechazo
- Usuario no puede volver a iniciar sesión

---

## 🧪 Testing con cURL

### 1. Login como admin (obtener token):
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"correo_electronico":"admin@example.com","contrasena":"tu_password"}'
```

### 2. Ver solicitudes pendientes:
```bash
curl -X GET http://localhost:3000/api/admin/solicitudes-pendientes \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

### 3. Aprobar usuario:
```bash
curl -X POST http://localhost:3000/api/admin/aprobar-usuario/15 \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{"observaciones":"Aprobado"}'
```

### 4. Rechazar usuario:
```bash
curl -X POST http://localhost:3000/api/admin/rechazar-usuario/16 \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{"motivo":"Información inconsistente"}'
```

---

## 📧 Emails Automáticos (TODO)

Cuando se aprueba o rechaza un usuario, el sistema debería enviar:

**Email de Aprobación:**
```
Asunto: ¡Tu cuenta ha sido aprobada! 🎉

Hola María López,

Tu solicitud de registro en el Sistema de Emprendedores de Chiquimula 
ha sido aprobada exitosamente.

Ya puedes iniciar sesión y acceder a todos los beneficios del ecosistema:
- Publicar tus productos/servicios
- Postular a programas de apoyo
- Conectar con otros emprendedores
- Y mucho más...

Iniciar sesión: https://sistema.example.com/login

¡Bienvenido al ecosistema!
```

**Email de Rechazo:**
```
Asunto: Actualización sobre tu solicitud de registro

Hola María,

Tu solicitud de registro no pudo ser aprobada en este momento.

Motivo: Información incompleta o inconsistente

Si deseas volver a aplicar, por favor corrige la información y 
crea una nueva cuenta.

¿Dudas? Escríbenos a soporte@example.com
```

---

## 🔒 Permisos

| Acción | Superusuario | Administrador |
|--------|-------------|---------------|
| Ver solicitudes | ✅ | ✅ |
| Ver detalle | ✅ | ✅ |
| Aprobar | ✅ | ✅ |
| Rechazar | ✅ | ✅ |
| Ver estadísticas | ✅ | ✅ |

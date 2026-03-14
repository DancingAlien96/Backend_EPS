# 🔐 Sistema de Verificación de Perfiles

**Fecha:** 11 de marzo de 2026  
**Descripción:** Sistema completo para que administradores aprueben perfiles de usuarios registrados

---

## 📋 Resumen

El sistema permite que cuando un usuario complete su registro progresivo, el perfil quede **pendiente de verificación** hasta que un administrador lo revise y apruebe/rechace.

### Estados de Perfil:

| Estado | Descripción | Usuario ve | Admin puede |
|--------|-------------|------------|-------------|
| **Incompleto** | Registro no terminado | Barra de progreso | N/A |
| **⏳ Pending** | Esperando revisión | Banner amarillo | Aprobar/Rechazar |
| **✅ Approved** | Verificado | Badge verde | Ver historial |
| **🚫 Rejected** | No aprobado | Banner rojo + motivo | Re-revisar |

---

## 🗄️ Base de Datos

### Cambios en Tabla `users`:

```sql
-- Nuevos campos agregados:
approval_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending'
rejection_reason TEXT NULL
reviewed_at TIMESTAMP NULL
reviewed_by INT NULL -- FK a usuarios.id_usuario

-- Índice:
INDEX idx_approval_status (approval_status)

-- Foreign Key:
FOREIGN KEY (reviewed_by) REFERENCES usuarios(id_usuario)
```

### Migrar Base de Datos Existente:

```bash
mysql -u root -p emprendedores_chiquimula < backend-eps/database/migracion_sistema_aprobacion.sql
```

O ejecutar manualmente:
```sql
USE emprendedores_chiquimula;

ALTER TABLE users 
ADD COLUMN approval_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
ADD COLUMN rejection_reason TEXT NULL,
ADD COLUMN reviewed_at TIMESTAMP NULL,
ADD COLUMN reviewed_by INT NULL;

ALTER TABLE users
ADD CONSTRAINT fk_users_reviewed_by 
FOREIGN KEY (reviewed_by) REFERENCES usuarios(id_usuario);

-- Migrar datos existentes:
UPDATE users 
SET approval_status = 'approved',
    reviewed_at = approved_at,
    reviewed_by = approved_by
WHERE registration_approved = TRUE;
```

### Nuevos Tipos de Notificación:

```sql
INSERT INTO tipos_notificacion VALUES
('perfil_pendiente_revision', 'Nuevo perfil completo pendiente', 'alta', '#FF6B6B', 'user-clock', FALSE),
('perfil_aprobado', 'Perfil aprobado y verificado', 'alta', '#7ED321', 'user-check', FALSE),
('perfil_rechazado', 'Perfil no aprobado', 'alta', '#D0021B', 'user-times', FALSE),
('perfil_en_revision', 'Perfil siendo revisado', 'media', '#4A90E2', 'user-cog', TRUE);
```

---

## 🎨 Frontend

### 1. Componente `ProfileStatusBanner` 

**Ubicación:** `frontend-eps/components/public/ProfileStatusBanner.tsx`

**Uso:**
```tsx
import ProfileStatusBanner from '@/components/public/ProfileStatusBanner';

<ProfileStatusBanner />
```

**Muestra:**
- ⏳ **Pendiente:** Banner amarillo, "Tu perfil está en revisión"
- ✅ **Aprobado:** Banner verde, "Perfil Verificado"
- 🚫 **Rechazado:** Banner rojo con motivo y botón para editar
- 📝 **Incompleto:** Banner azul con barra de progreso

### 2. Panel Admin de Aprobaciones

**Ubicación:** `frontend-eps/app/admin/aprobaciones/page.tsx`

**Ruta:** `http://localhost:3001/admin/aprobaciones`

**Características:**
- ✅ Lista de perfiles pendientes, approved, rejected
- ✅ Paginación (10 por página)
- ✅ Botones Aprobar/Rechazar
- ✅ Modal de confirmación
- ✅ Campo obligatorio para motivo de rechazo
- ✅ Ver detalle completo del usuario

**Filtros:**
```
- Pendientes (status=pending)
- Aprobados (status=approved)
- Rechazados (status=rejected)
```

---

## 🔌 Backend API

### Controlador: `RegistrationStatus.controller.js`

**Ubicación:** `backend-eps/src/controllers/RegistrationStatus.controller.js`

### Endpoints:

#### 1. **Obtener Estado del Perfil** (Usuario)

```http
GET /api/registrationStatus/status
Authorization: Bearer <firebase-token>
```

**Respuesta:**
```json
{
  "id": 123,
  "email": "usuario@example.com",
  "nombre_completo": "Juan Pérez",
  "member_type": "emprendimiento",
  "registration_completed": true,
  "approval_status": "pending",
  "rejection_reason": null,
  "reviewed_at": null,
  "created_at": "2026-03-01T10:00:00Z",
  "completion_percentage": 100,
  "current_step": 6
}
```

---

#### 2. **Listar Perfiles Pendientes** (Admin)

```http
GET /api/registrationStatus/pending?status=pending&page=1&limit=10
Authorization: Bearer <admin-token>
```

**Query Params:**
- `status`: 'pending' | 'approved' | 'rejected'
- `page`: Número de página (default: 1)
- `limit`: Elementos por página (default: 20)

**Respuesta:**
```json
{
  "total": 15,
  "page": 1,
  "limit": 10,
  "totalPages": 2,
  "users": [
    {
      "id": 123,
      "email": "user@example.com",
      "nombre_completo": "Juan Pérez",
      "member_type": "emprendimiento",
      "approval_status": "pending",
      "dias_esperando": 3,
      "registration_progress": {
        "completion_percentage": 100
      },
      "profile": {
        "nombre_emprendimiento": "Panadería El Sol",
        "descripcion_corta": "Panadería artesanal...",
        "logo_url": "https://..."
      }
    }
  ]
}
```

---

#### 3. **Aprobar Perfil** (Admin)

```http
POST /api/registrationStatus/approve/:userId
Authorization: Bearer <admin-token>
```

**Respuesta:**
```json
{
  "message": "Perfil aprobado exitosamente",
  "user": {
    "id": 123,
    "email": "user@example.com",
    "approval_status": "approved",
    "reviewed_at": "2026-03-11T14:30:00Z"
  }
}
```

---

#### 4. **Rechazar Perfil** (Admin)

```http
POST /api/registrationStatus/reject/:userId
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "rejection_reason": "Información incompleta o no válida"
}
```

**Respuesta:**
```json
{
  "message": "Perfil rechazado",
  "user": {
    "id": 123,
    "email": "user@example.com",
    "approval_status": "rejected",
    "rejection_reason": "Información incompleta...",
    "reviewed_at": "2026-03-11T14:30:00Z"
  }
}
```

---

#### 5. **Reenviar para Revisión** (Usuario)

```http
POST /api/registrationStatus/resubmit
Authorization: Bearer <firebase-token>
```

**Uso:** Cuando un usuario con perfil rechazado lo corrige y quiere reenviarlo.

**Respuesta:**
```json
{
  "message": "Perfil reenviado para revisión",
  "approval_status": "pending"
}
```

---

## 🔐 Middleware de Autenticación

### Usuario Público (Firebase):
```javascript
// middleware/auth.js
const verificarToken = async (req, res, next) => {
  // Verificar Firebase ID Token
  // Adjuntar req.user = { id, email, ... }
};
```

### Admin (JWT):
```javascript
// middleware/adminAuth.js
const verificarAdmin = async (req, res, next) => {
  // Verificar JWT de admin
  // Adjuntar req.user = { id_usuario, rol, ... }
};
```

---

## 📱 Flujo de Usuario

### 1. Registro Completo

1. Usuario completa los 6 pasos del registro
2. `registration_completed = true`
3. `approval_status = 'pending'` (automático)
4. Sistema muestra: **"⏳ Tu perfil está en revisión"**

### 2. Usuario Ve su Estado

```tsx
// En cualquier página del usuario autenticado:
<ProfileStatusBanner />
```

Muestra el banner correspondiente según el estado.

### 3. Usuario con Perfil Rechazado

1. Ve banner rojo con motivo de rechazo
2. Click en **"Editar y Volver a Enviar"**
3. Corrige su perfil
4. Click en **"Reenviar para Revisión"**
5. Estado cambia a `'pending'` de nuevo

---

## 🛠️ Flujo de Administrador

### 1. Acceder al Panel

```
http://localhost:3001/admin/aprobaciones
```

### 2. Ver Perfiles Pendientes

- Filtro: **Pendientes**
- Lista muestra:
  - Nombre/Negocio
  - Email, teléfono
  - Tipo de usuario
  - Días esperando
  - % de completitud

### 3. Revisar Detalle

Click en **"Ver Detalle"** → Redirige a página completa del usuario

### 4. Aprobar

1. Click en **"Aprobar"**
2. Modal de confirmación
3. Click en **"Aprobar"**
4. Usuario recibe notificación
5. Perfil aparece en directorio público

### 5. Rechazar

1. Click en **"Rechazar"**
2. Modal solicita motivo (obligatorio)
3. Escribir: "Documentos no válidos, información incompleta, etc."
4. Click en **"Rechazar"**
5. Usuario ve banner rojo con el motivo

---

## 🔔 Sistema de Notificaciones

### Cuando se Aprueba:

```javascript
// TODO: Implementar en aprobarPerfil()
await crearNotificacion({
  id_tipo_notificacion: getTipoNotificacionId('perfil_aprobado'),
  id_usuario_destino: user.id,
  titulo: '✅ Tu perfil ha sido aprobado',
  mensaje: 'Tu perfil está verificado y visible en el directorio.',
  enlace: '/perfil'
});
```

### Cuando se Rechaza:

```javascript
await crearNotificacion({
  id_tipo_notificacion: getTipoNotificacionId('perfil_rechazado'),
  id_usuario_destino: user.id,
  titulo: '🚫 Tu perfil no fue aprobado',
  mensaje: `Motivo: ${rejection_reason}`,
  enlace: '/perfil/editar'
});
```

---

## 🧪 Testing

### Probar como Usuario:

1. **Registrarse:** Completar los 6 pasos
2. **Ver estado:** Ir a `/perfil` → Ver banner amarillo
3. **Esperar aprob:** Admin debe aprobar
4. **Si rechazado:** Ver banner rojo, editar, reenviar

### Probar como Admin:

1. **Login admin:** `admin@sistema.com` / `admin123`
2. **Ir a:** `/admin/aprobaciones`
3. **Aprobar usuario:** Click en "Aprobar"
4. **Rechazar usuario:** Click en "Rechazar", escribir motivo
5. **Verificar filtros:** Cambiar entre Pendientes/Aprobados/Rechazados

---

## 📊 Estadísticas Admin (Futuro)

### Dashboard Sugerido:

```javascript
// GET /api/registrationStatus/stats
{
  "total_usuarios": 150,
  "pendientes": 12,
  "aprobados": 125,
  "rechazados": 13,
  "tiempo_promedio_revision": "2.5 días",
  "ultimas_aprobaciones": [...]
}
```

---

## ⚙️ Configuración

### Variables de Entorno:

```env
# Backend (.env)
JWT_SECRET=tu_secret_aqui
DATABASE_URL=mysql://...

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### Permisos Requeridos:

```javascript
// Admin debe tener rol 'administrador' o 'superusuario'
const verificarAdmin = (req, res, next) => {
  if (!['administrador', 'superusuario'].includes(req.user.rol)) {
    return res.status(403).json({ error: 'No autorizado' });
  }
  next();
};
```

---

## 🚀 Deployment

### 1. Migrar Base de Datos:

```bash
# Producción
mysql -u root -p emprendedores_prod < backend-eps/database/migracion_sistema_aprobacion.sql
```

### 2. Deploy Backend:

```bash
cd backend-eps
npm install
npm run build  # Si aplica
npm start
```

### 3. Deploy Frontend:

```bash
cd frontend-eps
npm install
npm run build
npm start
```

### 4. Verificar:

- ✅ Banner de estado aparece en perfiles
- ✅ Panel admin accesible en `/admin/aprobaciones`
- ✅ Aprobación funciona
- ✅ Rechazo registra motivo
- ✅ Usuario puede reenviar

---

## 🐛 Troubleshooting

### Problema: Banner no aparece

**Solución:**
```javascript
// Verificar que ProfileStatusBanner está importado
import ProfileStatusBanner from '@/components/public/ProfileStatusBanner';

// Verificar token en localStorage
console.log(localStorage.getItem('token'));

// Verificar endpoint
GET /api/registrationStatus/status
```

### Problema: Admin no puede aprobar

**Solución:**
```javascript
// Verificar token admin en localStorage
console.log(localStorage.getItem('admin_token'));

// Verificar rol del admin
SELECT * FROM usuarios WHERE correo_electronico = 'admin@sistema.com';

// Debe tener rol='administrador' o 'superusuario'
```

### Problema: Error en migración SQL

**Solución:**
```sql
-- Verificar que tabla users existe
SHOW TABLES LIKE 'users';

-- Verificar que columna no existe ya
SHOW COLUMNS FROM users LIKE 'approval_status';

-- Si existe, eliminar columna primero
ALTER TABLE users DROP COLUMN approval_status;

-- Luego volver a ejecutar migración
```

---

## 📝 Checklist de Implementación

- [x] Agregar campos a tabla `users`
- [x] Crear migración SQL
- [x] Crear componente `ProfileStatusBanner`
- [x] Crear controlador `RegistrationStatus.controller`
- [x] Crear rutas `/api/registrationStatus/*`
- [x] Crear página `/admin/aprobaciones`
- [x] Agregar tipos de notificación
- [ ] Implementar envío real de notificaciones
- [ ] Agregar al menú de admin
- [ ] Crear página de detalle del usuario
- [ ] Agregar estadísticas al dashboard
- [ ] Testing completo

---

## 🎯 Próximos Pasos

### Fase 2 (Futuro):

1. **Notificaciones por Email:**
   - Enviar correo cuando perfil es aprobado
   - Enviar correo cuando perfil es rechazado

2. **Sistema de Comentarios:**
   - Admin puede dejar comentarios en perfiles
   - Usuario ve comentarios y puede responder

3. **Historial de Revisiones:**
   - Guardar todas las revisiones
   - Ver quién y cuándo aprobó/rechazó

4. **Aprobación Multi-Nivel:**
   - Requiere dos admins para aprobar
   - Workflow de aprobación configurable

5. **Dashboard de Estadísticas:**
   - Gráficas de aprobaciones por día/semana
   - Tiempo promedio de revisión
   - Tasa de rechazo por tipo de usuario

---

## 📞 Soporte

**Documentación creada:** 11 de marzo de 2026  
**Sistema:** Emprendedores Chiquimula  
**Versión:** 1.0.0

Para preguntas o problemas, contactar al equipo de desarrollo.

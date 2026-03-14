# 📋 ÍNDICE GENERAL - SISTEMA DE REGISTRO PROGRESIVO
## Plataforma del Ecosistema Emprendedor - Chiquimula

---

## 🎯 RESUMEN EJECUTIVO

Este proyecto transforma el sistema de registro de usuarios de un **formulario plano extenso** a un **wizard progresivo en 6 pasos** que maximiza la conversión y reduce el abandono.

### Beneficios Clave:
- ✅ **Captación rápida**: Solo 4 campos obligatorios para crear cuenta (Paso 1)
- ✅ **Mobile-first**: Máximo 4 campos por pantalla, optimizado para teléfonos
- ✅ **Flexible**: Permite saltar pasos opcionales y continuar después
- ✅ **Progresivo**: Perfil se completa gradualmente con recomendaciones inteligentes
- ✅ **Inclusivo**: No requiere documentos formales para iniciar

### Métricas Esperadas:
- **Conversión**: +150% (de 15% a 38%)
- **Tiempo de registro inicial**: 2 minutos (vs. 15 minutos actual)
- **Completitud promedio**: 75% en primera sesión
- **Abandono en móvil**: -60%

---

## 📚 DOCUMENTACIÓN COMPLETA

### 1. [ARQUITECTURA_REGISTRO_PROGRESIVO.md](./ARQUITECTURA_REGISTRO_PROGRESIVO.md)
**📖 Documento principal** (16,000 palabras)

**Contenido**:
- Visión general del sistema
- 5 tipos de usuario (Emprendimiento, Empresa, Organización, Institución, Consumidor)
- Flujo detallado de 6 pasos con campos específicos
- Motor de perfil progresivo
- Guardado automático
- Botón "Saltar paso"
- Lógica condicional (mostrar/ocultar campos)
- Roles y permisos
- Feature flag para consumidor
- Requisitos UX mobile-first

**Usar para**: Entender conceptos, reglas de negocio y flujos

---

### 2. [database/init.sql](../database/init.sql) - Sección: SISTEMA DE REGISTRO PROGRESIVO
**⚙️ Schema SQL integrado** (450+ líneas agregadas)

**Contenido**:
- Tabla `users` (autenticación separada de perfiles)
- Tabla `registration_progress` (tracking de pasos)
- Tablas de perfiles:
  - `venture_profiles` (emprendimientos y empresas)
  - `organization_profiles` (organizaciones e instituciones)
  - `consumer_profiles` (consumidores)
- Tabla `user_roles` (permisos dinámicos)
- Tabla `profile_change_log` (auditoría)
- Triggers automáticos
- Vistas útiles
- Índices de performance

**Usar para**: Las tablas se crean automáticamente con Docker, o ejecutar manualmente en BD existente

---

### 3. [API_ENDPOINTS_REGISTRO.md](./API_ENDPOINTS_REGISTRO.md)
**🔌 Especificación de API REST** (20 endpoints)

**Endpoints principales**:

#### Autenticación:
- `POST /auth/registro/paso-0` - Seleccionar tipo de usuario
- `POST /auth/registro/paso-1` - Crear cuenta (email, password)
- `POST /auth/login` - Iniciar sesión
- `GET /auth/me` - Datos del usuario autenticado

#### Registro por pasos:
- `POST /registro/paso-2` - Perfil base del negocio/entidad
- `POST /registro/paso-3` - Ventas y pagos
- `POST /registro/paso-4` - Logística y presencia digital
- `POST /registro/paso-5` - Formalización (opcional)
- `POST /registro/paso-6` - Intereses y apoyos
- `POST /registro/saltar-paso/:step` - Saltar paso opcional
- `GET /registro/progreso` - Obtener estado del registro
- `POST /registro/guardado-automatico` - Auto-save

#### Administración:
- `GET /admin/solicitudes-pendientes` - Listar usuarios por aprobar
- `POST /admin/aprobar-usuario/:userId` - Aprobar registro
- `POST /admin/rechazar-usuario/:userId` - Rechazar registro

#### Catálogos:
- `GET /catalogos/sectores` - Sectores económicos
- `GET /catalogos/municipios` - Municipios por departamento

**Usar para**: Implementar backend y consumir desde frontend

---

### 4. [API_ADMIN_APROBACIONES.md](./API_ADMIN_APROBACIONES.md)
**🔐 API de Administración** (endpoints para admins)

**Contenido**:
- Ver solicitudes pendientes de aprobación
- Ver detalle completo de una solicitud
- Aprobar usuarios (con observaciones)
- Rechazar usuarios (con motivo)
- Estadísticas de solicitudes
- Flujo completo de aprobación
- Testing con cURL
- Notificaciones por email (TODO)

**Flujo de aprobación**:
```
Usuario completa registro → Estado: Pendiente
                         ↓
Admin revisa solicitud en panel
                         ↓
              ┌──────────┴──────────┐
              ▼                     ▼
        APROBAR                 RECHAZAR
              │                     │
    registration_approved=true  is_active=false
    Email: "Bienvenido!"        Email: "Motivo..."
              │                     │
    Acceso completo           Sin acceso
```

**Usar para**: Implementar panel de administración

---

### 5. [../frontend-eps/docs/COMPONENTES_FRONTEND_REGISTRO.md](../../frontend-eps/docs/COMPONENTES_FRONTEND_REGISTRO.md)
**⚛️ Arquitectura de componentes React** (Next.js 16)

**Estructura**:
```
app/auth/registro/
  ├── page.tsx                    # Paso 0: Selección de perfil
  └── paso/[step]/page.tsx        # Pasos 1-6 dinámicos

components/registro/
  ├── StepWizard.tsx              # Contenedor principal
  ├── ProgressBar.tsx             # Barra de progreso visual
  ├── StepNavigation.tsx          # Botones Atrás/Siguiente/Saltar
  ├── ProfileTypeCard.tsx         # Tarjeta de selección
  ├── steps/
  │   ├── Step1CreateAccess.tsx   # Crear cuenta (email, password)
  │   ├── Step2BaseProfile.tsx    # Perfil base
  │   ├── Step3SalesPayments.tsx  # Ventas y pagos
  │   └── ...
  ├── fields/
  │   ├── ConditionalField.tsx    # Mostrar/ocultar con animación
  │   ├── CheckboxGroup.tsx       # Grupo de checkboxes
  │   └── CloudinaryUpload.tsx    # Subir archivos (ya existe)
  └── ProfileCompletionCard.tsx   # Widget de dashboard

contexts/
  └── RegistrationContext.tsx     # Estado global del registro

hooks/
  ├── useAutoSave.ts              # Guardado automático cada 3s
  ├── useStepValidation.ts        # Validación por paso
  └── useConditionalFields.ts     # Lógica de campos condicionales
```

**Ejemplos de código**:
- Wizard completo con navegación
- Paso 1 implementado (create access)
- Campo condicional con Framer Motion
- Hook de auto-save con debounce
- Responsive mobile-first con Tailwind

**Usar para**: Implementar frontend en Next.js/React

---

### 6. [ALGORITMO_COMPLETITUD_PERFIL.md](./ALGORITMO_COMPLETITUD_PERFIL.md)
**🧮 Matemáticas del perfil progresivo** (algoritmo de cálculo)

**Contenido**:
- Fórmula base de completitud
- Distribución de pesos por paso:
  - Paso 1: 20% (crear acceso)
  - Paso 2: 20% (perfil base)
  - Paso 3: 15% (ventas y pagos)
  - Paso 4: 20% (logística y redes)
  - Paso 5: 15% (formalización)
  - Paso 6: 10% (intereses)
- Cálculo detallado por paso (función por función)
- Redistribución de pesos para pasos N/A
- Recomendaciones inteligentes
- Badges y gamificación
- Implementación en JavaScript/Node.js
- Tests unitarios

**Usar para**: Implementar `ProfileCompletionService`

---

### 7. [PLAN_IMPLEMENTACION.md](./PLAN_IMPLEMENTACION.md)
**🗺️ Roadmap completo con checklist** (7 fases, 4 semanas)

**Fases de implementación**:

#### Fase 0: Preparación (1-2 días)
- Backup de BD actual
- Crear rama de desarrollo
- Instalar dependencias
- Configurar env variables

#### Fase 1: Base de Datos (2-3 días)
- Ejecutar migración SQL
- Crear modelos Sequelize
- Definir relaciones
- Seeders de catálogos

#### Fase 2: Backend API (4-5 días)
- Servicio de autenticación (JWT)
- Middleware de autorización
- Controllers de registro (pasos 1-6)
- Servicio de completitud
- Endpoints administrativos

#### Fase 3: Frontend (5-6 días)
- Contexto de registro
- Componentes base (wizard, progress bar)
- Formularios de pasos 1-6
- Auto-save con debounce
- Dashboard de perfil incompleto

#### Fase 4: Testing (3-4 días)
- Unit tests backend
- Integration tests API
- Component tests frontend
- E2E tests (Playwright/Cypress)
- Testing móvil

#### Fase 5: Migración de Datos (2 días)
- Script de migración de `solicitudes_emprendedor`
- Notificación a usuarios existentes
- Mantener tabla vieja como backup

#### Fase 6: Deployment (2-3 días)
- Code review y optimizaciones
- Security audit
- Deploy backend (Raspberry Pi + PM2)
- Deploy frontend (Raspberry Pi + PM2)
- Verificación en producción

#### Fase 7: Lanzamiento (1-2 días)
- Anuncio a usuarios
- Video tutorial
- Monitoreo activo 24/7

**Total estimado**: 20 días hábiles (4 semanas)

**Usar para**: Planificar sprints y asignar tareas

---

## 🎨 FLUJO VISUAL DEL SISTEMA

```
┌─────────────────────────────────────────────────────────┐
│             USUARIO SIN CUENTA                          │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│  PASO 0: ¿Qué tipo de perfil quieres?                  │
│  [🚀 Emprendedor] [🏢 Empresa] [🏛️ Organización]       │
│  [🏢 Institución] [🛍️ Consumidor]                      │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│  PASO 1 (20%): Crear Acceso                            │
│  • Nombre completo          • Email                     │
│  • Teléfono WhatsApp        • Contraseña                │
│                                                         │
│  [← Atrás]                    [Siguiente →]            │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│  🎉 ¡Cuenta creada! Completa tu perfil progresivamente │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│  PASO 2 (40%): Perfil Base                             │
│  • Nombre del negocio       • Descripción               │
│  • Sector económico         • Logo (opcional)           │
│                                                         │
│  [← Atrás]  [Completar después]  [Siguiente →]        │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│  PASO 3 (55%): Ventas y Pagos (solo negocio)          │
│  • ¿Cómo vendes? ☐ Ferias ☐ WhatsApp ☐ Tienda física │
│  • ¿Cómo cobras? ☐ Efectivo ☐ Transferencia ☐ Tarjeta│
│  • ¿Usas pasarela? → Si: ¿Cuál? (Pagadito, NeoNet...) │
│                                                         │
│  [← Atrás]  [Saltar paso]  [Siguiente →]              │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│  PASO 4 (75%): Logística y Redes                       │
│  • ¿Haces envíos? → Si: ¿Con quién? (Guatex, Cargo..) │
│  • Redes sociales: Facebook, Instagram, TikTok, Web    │
│                                                         │
│  [← Atrás]  [Saltar paso]  [Siguiente →]              │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│  PASO 5 (90%): Formalización (opcional)                │
│  • ¿Tienes SAT? → Si: NIT, RTU, emites facturas       │
│  • ¿Tienes patente? → Si: Número, archivo             │
│  • ¿Tienes marca registrada?                           │
│                                                         │
│  [← Atrás]  [Saltar paso]  [Siguiente →]              │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│  PASO 6 (100%): Intereses y Apoyos                     │
│  ¿En qué necesitas apoyo?                              │
│  ☐ Financiamiento  ☐ Capacitación  ☐ Marketing        │
│  ☐ Formalización   ☐ Exportación   ☐ Contabilidad     │
│                                                         │
│  [← Atrás]  [Saltar paso]  [Finalizar 🎉]             │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│  ✅ ¡PERFIL COMPLETO! En revisión por administrador    │
│  Mientras tanto, explora:                              │
│  • Ver programas de apoyo  • Buscar eventos            │
│  • Leer noticias           • Conectar con otros        │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│         ADMIN APRUEBA → USUARIO ACTIVO                  │
│  Dashboard completo con todas las funcionalidades      │
└─────────────────────────────────────────────────────────┘
```

---

## 🔑 CONCEPTOS CLAVE

### Member Type (Tipo de Miembro)
**Es una característica permanente del perfil**, define qué formulario se muestra:
- `emprendimiento` - Negocio informal o en etapa inicial
- `empresa` - MIPYME formalizada
- `organizacion` - ONG, asociación, cooperativa, incubadora
- `institucion` - Municipalidad o entidad pública
- `consumidor` - Persona que compra productos locales (Feature Flag)

### Roles (Permisos)
**Son permisos operativos dinámicos**, se asignan/revocan por admins:
- `usuario_autenticado` - Puede ver contenido
- `emprendedor_verificado` - Puede postular a programas
- `organizacion_aprobada` - Puede publicar eventos (con aprobación)
- `institucion_publica` - Puede publicar convocatorias
- `administrador` - Gestiona usuarios y contenido
- `super_admin` - Control total del sistema

### Profile Completion (Completitud del Perfil)
**Porcentaje de 0 a 100%** calculado dinámicamente:
- Paso 1 completo = 20%
- Paso 2 completo = 40%
- Paso 3 completo = 55%
- Paso 4 completo = 75%
- Paso 5 completo = 90%
- Paso 6 completo = 100%

**Bonus**: Campos opcionales pueden sumar puntos extra (ej: subir logo +5%)

### Auto-save
**Guardado automático cada 3 segundos** mientras el usuario escribe:
- Usa debounce para no sobrecargar el servidor
- Guarda en BD sin validaciones estrictas
- Indicador visual: "Guardado hace X segundos"
- Backup en `localStorage` por si pierde conexión

### Conditional Fields (Campos Condicionales)
**Campos que aparecen solo si se cumple una condición**:
- Si `tiene_logo === true` → mostrar campo "Subir logo"
- Si `usa_pasarela_pago === true` → mostrar "¿Qué pasarela usas?"
- Si `realiza_envios !== 'no'` → mostrar "¿Con quién envías?"

Implementado con animaciones suaves (Framer Motion)

---

## 🛠️ STACK TECNOLÓGICO

### Backend:
- **Runtime**: Node.js
- **Framework**: Express.js 4.18.2
- **ORM**: Sequelize 6.35.2
- **Base de datos**: MariaDB 10.11.14 (MySQL compatible)
- **Autenticación**: JWT (jsonwebtoken)
- **Password hashing**: bcryptjs
- **Validación**: express-validator
- **File uploads**: Cloudinary (client-side direct)

### Frontend:
- **Framework**: Next.js 16.1.1 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS 3.4
- **Animaciones**: Framer Motion
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Forms**: React Hook Form (opcional)
- **Validación**: Zod (opcional)

### DevOps:
- **Server**: Raspberry Pi 4 (Debian Bookworm)
- **Process Manager**: PM2
- **Reverse Proxy**: Cloudflare Tunnel (epsb.pruebascunori.shop)
- **Version Control**: Git/GitHub

---

## 📊 MÉTRICAS Y KPIs

| Métrica | Actual | Objetivo | Medición |
|---------|--------|----------|----------|
| **Tiempo de registro inicial** | 15 min | 2 min | Analytics (time on page) |
| **Tasa de conversión** | 15% | 38% | Registros completos / Visitantes |
| **Abandono en móvil** | 65% | 25% | Mobile vs Desktop completion |
| **Completitud promedio** | 45% | 75% | Promedio `completion_percentage` |
| **Registros diarios** | 5 | 15 | Count(`created_at` = today) |
| **Tiempo hasta aprobación** | 7 días | 2 días | Admin response time |

---

## ⚠️ CONSIDERACIONES DE SEGURIDAD

### Autenticación:
- ✅ Contraseñas hasheadas con `bcryptjs` (salt rounds: 10)
- ✅ JWT con expiración (7 días por defecto)
- ✅ Refresh tokens para sesiones largas (futuro)
- ✅ Rate limiting: 100 requests/min por IP

### Validación:
- ✅ Backend valida TODOS los inputs (nunca confiar en frontend)
- ✅ SQL injection prevention (Sequelize prepared statements)
- ✅ XSS protection (sanitizar HTML)
- ✅ CORS configurado correctamente

### Files:
- ✅ Cloudinary upload directo (sin pasar por backend)
- ✅ Límites de tamaño: 5MB imágenes, 20MB PDFs
- ✅ Extensiones permitidas: .jpg, .png, .pdf

### Permisos:
- ✅ Middleware `authorize(['rol1', 'rol2'])` en rutas protegidas
- ✅ Verificar propiedad de recursos (user A no puede editar perfil de user B)
- ✅ Admin actions logged en `profile_change_log`

---

## 🐛 TROUBLESHOOTING

### Error: "Email ya existe"
- **Causa**: Usuario intenta registrarse con email duplicado
- **Solución**: Ofrecer "¿Ya tienes cuenta? Inicia sesión" o "Recuperar contraseña"

### Error: "Token inválido o expirado"
- **Causa**: JWT expiró o fue manipulado
- **Solución**: Redirigir a `/auth/login` y pedir login nuevamente

### Perfil incompleto pero dice 100%
- **Causa**: Bug en algoritmo de completitud
- **Solución**: Ejecutar `ProfileCompletionService.recalculateAll()`

### Auto-save no funciona
- **Causa**: Debounce muy corto o internet lento
- **Solución**: Aumentar delay a 5 segundos, verificar logs de red

### Paso 3 se salta automáticamente
- **Causa**: Usuario es `consumidor` y Paso 3 no aplica
- **Solución**: Correcto, redistribuir peso a otros pasos

---

## 📞 CONTACTO Y SOPORTE

- **Documentación**: Ver archivos en `backend-eps/docs/` y `frontend-eps/docs/`
- **Repositorio**: *[GitHub URL aquí]*
- **Issues**: *[GitHub Issues URL aquí]*
- **Email**: *[Email de soporte aquí]*

---

## 📜 LICENCIA

[Especificar licencia del proyecto]

---

## 🎉 CRÉDITOS

Diseñado e implementado para la **Plataforma del Ecosistema Emprendedor de Chiquimula, Guatemala**.

**Stack**: Node.js + Express + Sequelize + MariaDB + Next.js 16 + React 19 + Tailwind CSS  
**Deployment**: Raspberry Pi 4 + PM2 + Cloudflare Tunnel

---

**Última actualización**: Diciembre 2024  
**Versión**: 1.0  
**Estado**: ✅ Documentación completa - Listo para implementación

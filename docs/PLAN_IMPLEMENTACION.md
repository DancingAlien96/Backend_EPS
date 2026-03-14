# PLAN DE IMPLEMENTACIÓN
## Sistema de Registro Progresivo - Roadmap Completo

---

## FASE 0: PREPARACIÓN (1-2 días)

### ✅ Checklist de Pre-requisitos

- [  ] **Backup de base de datos actual**
  ```bash
  mysqldump -u root -p sistema_emprendedores_chiquimula > backup_pre_migracion.sql
  ```

- [ ] **Crear rama de desarrollo**
  ```bash
  git checkout -b feature/registro-progresivo
  ```

- [ ] **Configurar variables de entorno**
  ```env
  # .env backend
  ENABLE_CONSUMER_REGISTRATION=false
  JWT_SECRET=your-secret-key-here
  JWT_EXPIRES_IN=7d
  
  # .env.local frontend
  NEXT_PUBLIC_ENABLE_CONSUMERS=false
  NEXT_PUBLIC_API_URL=http://localhost:3000/api
  ```

- [ ] **Instalar dependencias nuevas**
  ```bash
  # Backend
  npm install jsonwebtoken bcryptjs lodash
  
  # Frontend
  npm install framer-motion lodash
  ```

- [ ] **Documentar estructura actual**
  - Tabla `solicitudes_emprendedor` schema
  - Endpoints actuales de registro
  - Flujo actual de aprobación

---

## FASE 1: BASE DE DATOS (2-3 días)

### Día 1: Migración de Esquema

- [ ] **1.1 Revisar y ajustar `migration_registro_progresivo.sql`**
  - Verificar compatibilidad con MariaDB 10.11
  - Ajustar foreign keys existentes
  - Validar ENUMs con datos actuales

- [ ] **1.2 Ejecutar migración en entorno de desarrollo**
  ```bash
  # Las nuevas tablas ya están en init.sql
  # Si usas Docker, recrear el contenedor:
  docker-compose down -v
  docker-compose up -d
  
  # Si ya tienes BD creada, ejecuta solo las nuevas tablas:
  # (Extrae solo la sección "SISTEMA DE REGISTRO PROGRESIVO" del init.sql)
  ```

- [ ] **1.3 Verificar creación de tablas**
  ```sql
  SHOW TABLES;
  DESC users;
  DESC venture_profiles;
  DESC registration_progress;
  SELECT * FROM information_schema.TRIGGERS WHERE TRIGGER_SCHEMA = 'sistema_emprendedores_chiquimula';
  ```

- [ ] **1.4 Insertar datos de prueba**
  ```sql
  INSERT INTO users (email, password_hash, nombre_completo, telefono_whatsapp, member_type)
  VALUES ('test@test.com', '$2b$10$hashdeprueba', 'Usuario Test', '+50212345678', 'emprendimiento');
  ```

- [ ] **1.5 Validar triggers**
  - Verificar que se crea automáticamente `registration_progress`
  - Verificar que se crea perfil según `member_type`
  - Verificar que se asigna rol `usuario_autenticado`

### Día 2-3: Modelos Sequelize

- [ ] **2.1 Crear modelos**
  - `src/models/User.js`
  - `src/models/RegistrationProgress.js`
  - `src/models/VentureProfile.js`
  - `src/models/OrganizationProfile.js`
  - `src/models/ConsumerProfile.js`
  - `src/models/UserRole.js`

- [ ] **2.2 Definir relaciones**
  ```javascript
  // En User.js
  User.hasOne(RegistrationProgress, { foreignKey: 'user_id', as: 'progress' });
  User.hasOne(VentureProfile, { foreignKey: 'user_id', as: 'ventureProfile' });
  User.hasOne(OrganizationProfile, { foreignKey: 'user_id', as: 'organizationProfile' });
  User.hasOne(ConsumerProfile, { foreignKey: 'user_id', as: 'consumerProfile' });
  User.hasMany(UserRole, { foreignKey: 'user_id', as: 'roles' });
  ```

- [ ] **2.3 Crear seeders de catálogos** (si no existen)
  - Sectores económicos
  - Municipios y departamentos
  - Opciones predefinidas (canales de venta, métodos de pago)

- [ ] **2.4 Testear conexión y consultas**
  ```javascript
  const user = await User.findByPk(1, {
    include: ['progress', 'ventureProfile', 'roles']
  });
  console.log(user.toJSON());
  ```

---

## FASE 2: BACKEND API (4-5 días)

### Día 1: Autenticación y Middleware

- [ ] **3.1 Crear servicio de autenticación**
  - `src/services/AuthService.js`
    - `register(data)` - Registrar paso 1
    - `login(email, password)` - Iniciar sesión
    - `generateToken(user)` - Generar JWT
    - `verifyToken(token)` - Validar JWT

- [ ] **3.2 Crear middleware**
  - `src/middleware/authenticate.js` - Verificar JWT
  - `src/middleware/authorize.js` - Verificar roles
  - `src/middleware/validateStep.js` - Validar datos por paso

- [ ] **3.3 Testing de autenticación**
  ```bash
  # Probar con Postman/Thunder Client
  POST /api/auth/registro/paso-1
  POST /api/auth/login
  GET /api/auth/me
  ```

### Día 2: Endpoints de Registro (Pasos 0-3)

- [ ] **4.1 Controller de registro**
  - `src/controllers/RegistrationController.js`
    - `selectProfile()` - POST /paso-0
    - `createAccess()` - POST /paso-1
    - `saveBaseProfile()` - POST /paso-2
    - `saveSalesPayments()` - POST /paso-3

- [ ] **4.2 Validadores por paso**
  - `src/validators/stepValidators.js`
    - `validateStep1(data)` - Email único, contraseña fuerte
    - `validateStep2(data, memberType)` - Campos según tipo
    - `validateStep3(data, memberType)` - Condicionales

- [ ] **4.3 Testing endpoints**
  - [ ] Paso 1: Crear cuenta con datos válidos ✅
  - [ ] Paso 1: Rechazar email duplicado ❌
  - [ ] Paso 2: Guardar perfil de emprendimiento ✅
  - [ ] Paso 3: Validar campos condicionales ✅

### Día 3: Endpoints de Registro (Pasos 4-6)

- [ ] **5.1 Completar controller**
  - `saveLogistics()` - POST /paso-4
  - `saveFormalization()` - POST /paso-5
  - `saveInterests()` - POST /paso-6

- [ ] **5.2 Endpoint de saltar paso**
  - `skipStep()` - POST /saltar-paso/:step
  - Validar que el paso sea saltable
  - Actualizar `registration_progress`

- [ ] **5.3 Endpoint de progreso**
  - `getProgress()` - GET /registro/progreso
  - Devolver estado de cada paso
  - Incluir recomendaciones

- [ ] **5.4 Auto-save endpoint**
  - `autoSave()` - POST /registro/guardado-automatico
  - Guardar sin validaciones estrictas
  - Retornar timestamp

### Día 4: Servicio de Completitud

- [ ] **6.1 Implementar `ProfileCompletionService.js`**
  - Portar algoritmo del documento a JavaScript
  - `calculate(userId)` - Calcular % de completitud
  - `getRecommendations(userId)` - Generar recomendaciones
  - `checkBadges(userId)` - Verificar insignias

- [ ] **6.2 Integrar con endpoints**
  - Llamar después de guardar cada paso
  - Actualizar `completion_percentage` en BD
  - Retornar en respuesta al frontend

- [ ] **6.3 Testing algoritmo**
  ```javascript
  const completion = await ProfileCompletionService.calculate(userId);
  expect(completion).toBeGreaterThanOrEqual(20);
  ```

### Día 5: Endpoints Administrativos

- [ ] **7.1 Controller de admin**
  - `src/controllers/AdminController.js`
    - `getPendingApprovals()` - GET /admin/solicitudes-pendientes
    - `approveUser()` - POST /admin/aprobar-usuario/:userId
    - `rejectUser()` - POST /admin/rechazar-usuario/:userId

- [ ] **7.2 Middleware de autorización**
  - Verificar rol `administrador` o `super_admin`
  - `authorize(['administrador', 'super_admin'])`

- [ ] **7.3 Notificaciones** (opcional)
  - Email al aprobar/rechazar
  - Webhook a Discord/Slack

---

## FASE 3: FRONTEND (5-6 días)

### Día 1: Setup y Contexto

- [ ] **8.1 Crear contexto de registro**
  - `contexts/RegistrationContext.tsx`
    - Estado global: `currentStep`, `formData`, `memberType`
    - Funciones: `nextStep()`, `prevStep()`, `saveStep()`

- [ ] **8.2 Configurar rutas**
  - `app/auth/registro/page.tsx` (Paso 0)
  - `app/auth/registro/paso/[step]/page.tsx` (Pasos 1-6)
  - `app/auth/registro/completado/page.tsx` (Éxito)

- [ ] **8.3 Crear componentes base**
  - `components/registro/StepWizard.tsx`
  - `components/registro/ProgressBar.tsx`
  - `components/registro/StepNavigation.tsx`
  - `components/registro/ProfileTypeCard.tsx`

### Día 2: Paso 0 y Paso 1

- [ ] **9.1 Implementar Paso 0**
  - Grid de tarjetas de selección
  - Guardar `member_type` en localStorage
  - Botón "Continuar" a Paso 1

- [ ] **9.2 Implementar Paso 1**
  - Formulario de 4 campos obligatorios
  - Validación en tiempo real
  - Integración con API `POST /paso-1`
  - Guardar JWT token

- [ ] **9.3 Testing**
  - Navegar de Paso 0 a Paso 1 ✅
  - Crear cuenta y recibir token ✅
  - Validar email duplicado ❌

### Día 3: Pasos 2 y 3

- [ ] **10.1 Implementar Paso 2**
  - `steps/Step2BaseProfile.tsx`
  - Renderizar campos según `memberType`
  - Componente `CloudinaryUpload` para logo
  - Selector de sector económico

- [ ] **10.2 Implementar Paso 3**
  - `steps/Step3SalesPayments.tsx`
  - Checkboxes de canales de venta
  - Checkboxes de métodos de pago
  - Campo condicional: pasarela (si `usa_pasarela_pago === true`)

- [ ] **10.3 Componentes de campos**
  - `fields/CheckboxGroup.tsx`
  - `fields/ConditionalField.tsx` con animaciones

### Día 4: Pasos 4, 5 y 6

- [ ] **11.1 Implementar Paso 4**
  - Radios de "realiza_envios"
  - Checkboxes condicionales de métodos de envío
  - Inputs de redes sociales

- [ ] **11.2 Implementar Paso 5**
  - Toggles de formalización (SAT, patente, marca)
  - Campos condicionales de archivos PDF
  - Textarea de otros registros

- [ ] **11.3 Implementar Paso 6**
  - Checkboxes de necesidades de apoyo
  - Mensaje de éxito al finalizar

### Día 5: Auto-save y Hooks

- [ ] **12.1 Hook de auto-save**
  - `hooks/useAutoSave.ts`
  - Debounce de 3 segundos
  - POST a `/registro/guardado-automatico`
  - Indicador visual "Guardado hace X seg"

- [ ] **12.2 Hook de validación**
  - `hooks/useStepValidation.ts`
  - Reglas por campo
  - Mensajes de error

- [ ] **12.3 Hook de campos condicionales**
  - `hooks/useConditionalFields.ts`
  - Evaluar reglas en tiempo real

### Día 6: Perfil Incompleto y Dashboard

- [ ] **13.1 Banner de perfil incompleto**
  - `components/registro/ProfileCompletionCard.tsx`
  - Mostrar en dashboard si `completion < 100`
  - Botón "Continuar mi perfil"

- [ ] **13.2 Página de progreso**
  - `app/perfil/progreso/page.tsx`
  - Listar pasos completados/pendientes
  - Botones para ir a pasos específicos

- [ ] **13.3 Página de éxito**
  - `app/auth/registro/completado/page.tsx`
  - Mensaje de "Perfil en revisión"
  - Botón "Ir al dashboard"

---

## FASE 4: TESTING E INTEGRACIÓN (3-4 días)

### Testing Backend

- [ ] **14.1 Unit tests**
  - [ ] `AuthService.register()` crea usuario correctamente
  - [ ] `ProfileCompletionService.calculate()` devuelve % correcto
  - [ ] Validadores rechazan datos inválidos

- [ ] **14.2 Integration tests**
  - [ ] Flujo completo: Paso 0 → Paso 6
  - [ ] Saltar paso y continuar después
  - [ ] Aprobación por admin

- [ ] **14.3 API tests (Postman/Jest)**
  ```javascript
  describe('Registro Paso a Paso', () => {
    it('debería completar registro de emprendimiento', async () => {
      // POST /paso-1
      const res1 = await request.post('/api/auth/registro/paso-1').send({...});
      expect(res1.status).toBe(201);
      const token = res1.body.token;
      
      // POST /paso-2
      const res2 = await request.post('/api/registro/paso-2')
        .set('Authorization', `Bearer ${token}`)
        .send({...});
      expect(res2.body.profileCompletion).toBe(40);
      
      // ... continuar hasta paso 6
    });
  });
  ```

### Testing Frontend

- [ ] **15.1 Component tests (Jest + React Testing Library)**
  - [ ] `ProfileTypeCard` renderiza correctamente
  - [ ] `ConditionalField` se muestra/oculta según condición
  - [ ] `StepWizard` navega entre pasos

- [ ] **15.2 E2E tests (Playwright/Cypress)**
  ```javascript
  test('completar registro como emprendimiento', async ({ page }) => {
    await page.goto('/auth/registro');
    
    // Paso 0: Seleccionar tipo
    await page.click('text=Emprendedor');
    await page.click('text=Continuar');
    
    // Paso 1: Crear acceso
    await page.fill('input[name="nombre_completo"]', 'Juan Pérez');
    await page.fill('input[name="correo_electronico"]', 'juan@test.com');
    await page.fill('input[name="telefono_whatsapp"]', '+50212345678');
    await page.fill('input[name="contrasena"]', 'Test1234');
    await page.click('text=Siguiente');
    
    // Verificar que avanzó a paso 2
    await expect(page.locator('text=Paso 2 de 6')).toBeVisible();
  });
  ```

- [ ] **15.3 Testing en dispositivos móviles**
  - [ ] iPhone SE (375px)
  - [ ] iPhone 12 Pro (390px)
  - [ ] Samsung Galaxy S21 (360px)
  - [ ] iPad (768px)

### Integración y Fix de Bugs

- [ ] **16.1 Validar flujo completo**
  - Crear 5 cuentas de prueba (una de cada tipo)
  - Completar todos los pasos sin saltar
  - Saltar pasos opcionales y continuar
  - Verificar cálculo de completitud

- [ ] **16.2 Validar casos edge**
  - Usuario cierra navegador en paso 3 → Al regresar debe continuar
  - Usuario borra localStorage → Debe pedir login
  - Token expira → Debe redirigir a login
  - Conexión lenta → Debe mostrar loading

- [ ] **16.3 Fix de bugs identificados**
  - [ ] Bug 1: ...
  - [ ] Bug 2: ...
  - [ ] Bug 3: ...

---

## FASE 5: MIGRACIÓN DE DATOS EXISTENTES (2 días)

- [ ] **17.1 Script de migración**
  ```sql
  -- Migrar datos de solicitudes_emprendedor a new schema
  INSERT INTO users (email, password_hash, nombre_completo, telefono_whatsapp, member_type, ...)
  SELECT correo_electronico, '$2b$10$defaulthash', nombre_completo, telefono, 
         CASE tipo_persona 
           WHEN 'individual' THEN 'emprendimiento'
           WHEN 'organizacion' THEN 'organizacion'
           WHEN 'entidad' THEN 'institucion'
         END,
         ...
  FROM solicitudes_emprendedor
  WHERE estado_solicitud = 'aprobada';
  ```

- [ ] **17.2 Migrar perfiles**
  - Datos específicos a `venture_profiles`
  - Datos específicos a `organization_profiles`
  - Establecer `completion_percentage` inicial basado en datos existentes

- [ ] **17.3 Notificar usuarios migrados**
  - Email: "Actualizamos el sistema, crea tu nueva contraseña"
  - Link de reset password

- [ ] **17.4 Mantener tabla vieja** (por si acaso)
  - Renombrar a `solicitudes_emprendedor_backup`
  - Mantener por 30 días

---

## FASE 6: DEPLOYMENT (2-3 días)

### Pre-deployment

- [ ] **18.1 Code review**
  - Revisar todos los PRs
  - Resolver conflictos de merge
  - Verificar que no hay `console.log` en producción

- [ ] **18.2 Optimizaciones**
  - Minificar JS/CSS
  - Comprimir imágenes
  - Habilitar caché de API responses

- [ ] **18.3 Security audit**
  - [ ] Validar inputs en backend
  - [ ] Sanitizar SQL queries (usar prepared statements)
  - [ ] Rate limiting en endpoints
  - [ ] CORS configurado correctamente
  - [ ] JWT secret fuerte en producción

### Deployment Backend (Raspberry Pi)

- [ ] **19.1 Actualizar código en Raspberry**
  ```bash
  ssh cris@192.168.1.140
  cd ~/backend-eps
  git pull origin feature/registro-progresivo
  npm install
  ```

- [ ] **19.2 Ejecutar migración en producción**
  ```bash
  # Backup primero!
  mysqldump -u root -p sistema_emprendedores_chiquimula > backup_$(date +%Y%m%d).sql
  
  # Si usas Docker: recrear contenedor
  docker-compose down
  docker-compose up -d
  
  # Si BD nativa: ejecutar solo nuevas tablas desde init.sql
  # (Copiar sección SISTEMA DE REGISTRO PROGRESIVO a un archivo temporal)
  mysql -u root -p sistema_emprendedores_chiquimula < nuevas_tablas.sql
  ```

- [ ] **19.3 Reiniciar backend con PM2**
  ```bash
  pm2 restart backend
  pm2 logs backend
  ```

- [ ] **19.4 Verificar endpoints**
  ```bash
  curl http://localhost:3000/api/auth/registro/paso-1 -X POST -H "Content-Type: application/json" -d '{"test": true}'
  ```

### Deployment Frontend (Raspberry Pi)

- [ ] **20.1 Actualizar código**
  ```bash
  cd ~/frontend-eps
  git pull origin feature/registro-progresivo
  npm install
  ```

- [ ] **20.2 Build de producción**
  ```bash
  npm run build
  ```

- [ ] **20.3 Reiniciar con PM2**
  ```bash
  pm2 restart frontend
  pm2 logs frontend
  ```

- [ ] **20.4 Verificar en navegador**
  - https://epsb.pruebascunori.shop/auth/registro
  - Probar registro completo
  - Verificar en móvil

### Post-deployment

- [ ] **21.1 Monitoreo**
  - [ ] Logs de errores (backend)
  - [ ] Errores de JavaScript (frontend con Sentry o similar)
  - [ ] Performance (tiempos de carga)
  - [ ] Uso de base de datos

- [ ] **21.2 Documentación de operación**
  - Procedimiento de rollback
  - Comandos comunes de PM2
  - Cómo aprobar usuarios manualmente

- [ ] **21.3 Capacitación a admins**
  - Cómo usar el nuevo panel de aprobaciones
  - Qué revisar antes de aprobar un perfil
  - Cómo otorgar roles especiales

---

## FASE 7: COMUNICACIÓN Y LANZAMIENTO (1-2 días)

- [ ] **22.1 Anuncio a usuarios existentes**
  - Email masivo: "Nuevo sistema de registro mejorado"
  - Post en redes sociales
  - Banner en sitio web

- [ ] **22.2 Guía para usuarios**
  - Video tutorial (Loom/YouTube)
  - Guía PDF descargable
  - FAQs actualizadas

- [ ] **22.3 Abrir registro al público**
  - Remover feature flag si aplica
  - Activar consumidor si es deseado:
    ```env
    ENABLE_CONSUMER_REGISTRATION=true
    ```

- [ ] **22.4 Monitoreo primeros días**
  - Revisar registros cada hora las primeras 24h
  - Atender preguntas en tiempo real
  - Fix rápido de bugs críticos

---

## CRONOGRAMA ESTIMADO

```
┌──────────────────────────────────────────────────────────┐
│ SEMANA 1                                                 │
│ Lun-Mar:  Fase 0 + Fase 1 (Preparación + BD)           │
│ Mié-Jue:  Fase 1 continuación (Modelos Sequelize)      │
│ Vie:      Inicio Fase 2 (Auth + Middleware)            │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ SEMANA 2                                                 │
│ Lun-Mar:  Fase 2 continuación (Endpoints registro)     │
│ Mié:      Fase 2 fin (Completitud + Admin)             │
│ Jue-Vie:  Inicio Fase 3 (Frontend setup + Paso 0-1)    │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ SEMANA 3                                                 │
│ Lun-Mar:  Fase 3 continuación (Pasos 2-6)              │
│ Mié-Jue:  Fase 3 fin (Auto-save + Dashboard)           │
│ Vie:      Inicio Fase 4 (Testing backend)              │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ SEMANA 4                                                 │
│ Lun-Mar:  Fase 4 (Testing completo + Fix bugs)         │
│ Mié:      Fase 5 (Migración de datos)                  │
│ Jue:      Fase 6 (Deployment Raspberry)                │
│ Vie:      Fase 7 (Lanzamiento + Monitoreo)             │
└──────────────────────────────────────────────────────────┘
```

**Total**: ~20 días hábiles (4 semanas)

---

## CRITERIOS DE ÉXITO

✅ **Funcionalidad**:
- [ ] Usuario puede completar registro en menos de 5 minutos
- [ ] Registro móvil funciona perfectamente (< 768px)
- [ ] Auto-save previene pérdida de datos
- [ ] Cálculo de completitud es preciso

✅ **Performance**:
- [ ] Tiempo de carga de pasos < 2 segundos
- [ ] API responde en < 500ms
- [ ] Build de frontend < 500KB (gzipped)

✅ **UX**:
- [ ] Navegación intuitiva entre pasos
- [ ] Validaciones claras y amigables
- [ ] Puede saltar pasos opcionales
- [ ] Recomendaciones útiles

✅ **Seguridad**:
- [ ] Contraseñas hasheadas con bcrypt
- [ ] JWT con expiración
- [ ] Inputs sanitizados
- [ ] Rate limiting activo

✅ **Operación**:
- [ ] Logs de errores configurados
- [ ] Proceso de aprobación administrativo funcional
- [ ] Rollback documentado y probado

---

## RIESGOS Y MITIGACIÓN

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Migración de datos falla | Media | Alto | Backup completo antes, script de rollback listo |
| Usuarios no entienden nuevo flujo | Alta | Medio | Video tutorial, guía visual, soporte activo |
| Performance en Raspberry Pi | Media | Medio | Optimizar queries, cachear catálogos, indexar BD |
| Bugs en producción | Alta | Alto | Testing exhaustivo, deploy gradual, monitoreo 24/7 |
| Token JWT se filtra | Baja | Crítico | Expiración corta, rotación de secrets, auditoría |

---

## CHECKLIST FINAL ANTES DE DEPLOY

- [ ] ✅ Todos los tests pasan
- [ ] ✅ Code review completo
- [ ] ✅ Backup de BD producción
- [ ] ✅ Variables de entorno configuradas
- [ ] ✅ Logs y monitoreo activos
- [ ] ✅ Rollback plan documentado
- [ ] ✅ Equipo notificado del deploy
- [ ] ✅ Horario de mantenimiento comunicado

---

## SOPORTE POST-LANZAMIENTO

**Primera semana**:
- Monitoreo activo 24/7
- Hotfix deploy si es necesario
- Atención inmediata a reportes de bugs

**Primer mes**:
- Analizar métricas de uso
- Identificar puntos de abandono
- Iterar sobre UX según feedback
- Optimizar queries lentas

**Mantenimiento continuo**:
- Actualizar dependencias mensualmente
- Revisar logs de errores semanalmente
- Backup automático diario
- Auditoría de seguridad trimestral

---

## RECURSOS ADICIONALES

- **Documentación**:
  - [ARQUITECTURA_REGISTRO_PROGRESIVO.md](./ARQUITECTURA_REGISTRO_PROGRESIVO.md)
  - [API_ENDPOINTS_REGISTRO.md](./API_ENDPOINTS_REGISTRO.md)
  - [COMPONENTES_FRONTEND_REGISTRO.md](../frontend-eps/docs/COMPONENTES_FRONTEND_REGISTRO.md)
  - [ALGORITMO_COMPLETITUD_PERFIL.md](./ALGORITMO_COMPLETITUD_PERFIL.md)

- **Repositorios**:
  - Backend: `backend-eps/`
  - Frontend: `frontend-eps/`

- **Contacto del equipo**:
  - *Agregar emails/Slack del equipo*

---

**¡Éxito en la implementación!** 🚀

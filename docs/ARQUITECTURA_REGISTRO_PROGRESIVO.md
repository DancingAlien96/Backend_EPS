# ARQUITECTURA DEL SISTEMA DE REGISTRO PROGRESIVO
## Plataforma del Ecosistema Emprendedor - Chiquimula

---

## 1. VISIÓN GENERAL DEL SISTEMA

### Objetivo
Crear un sistema de registro mobile-first que capture usuarios rápidamente con datos mínimos y permita completar el perfil progresivamente mediante pasos guiados.

### Principios de Diseño
- **Captación Rápida**: Registro inicial con solo 4-5 campos obligatorios
- **Perfil Progresivo**: Completar información en pasos posteriores
- **Mobile-First**: Máximo 4 campos por pantalla
- **Bajo Friction**: Permitir "saltar paso" y continuar después
- **Inclusivo**: Nadie queda excluido por falta de documentos formales

---

## 2. TIPOS DE USUARIO

### 2.1 Emprendimiento
**Descripción**: Persona o negocio en etapa inicial o informal  
**Características**:
- Puede no tener NIT, logo o formalización
- Enfocado en necesidades de apoyo y crecimiento
- Acceso a recursos, eventos y programas

### 2.2 Empresa (MIPYME)
**Descripción**: Negocio formal con mayor madurez operativa  
**Características**:
- Generalmente tiene NIT y registros formales
- Facturación anual y estructura definida
- Acceso a convocatorias empresariales

### 2.3 Organización
**Descripción**: ONG, asociación, incubadora, cooperativa o entidad de apoyo  
**Características**:
- Puede publicar eventos y programas (con aprobación)
- Ofrece servicios a emprendedores
- No participa en programas de fomento empresarial

### 2.4 Institución Pública
**Descripción**: Municipalidad o entidad del gobierno  
**Características**:
- Publica convocatorias y programas oficiales
- Administra recursos públicos para emprendedores
- Rol de facilitador y promotor

### 2.5 Consumidor Local
**Descripción**: Persona interesada en comprar o seguir negocios locales  
**Características**:
- No tiene negocio propio
- Sigue emprendimientos favoritos
- Recibe notificaciones de eventos y noticias
- **Feature Flag**: Deshabilitado por defecto

---

## 3. FLUJO DE REGISTRO POR PASOS

### Paso 0: Selección de Perfil (0%)
**Objetivo**: Identificar tipo de usuario

**UI**: Tarjetas con iconos grandes (mobile-friendly)

```
┌─────────────────┐  ┌─────────────────┐
│  🚀 EMPRENDEDOR │  │  🏢 EMPRESA     │
│  Inicia tu idea │  │  Negocio formal │
└─────────────────┘  └─────────────────┘

┌─────────────────┐  ┌─────────────────┐
│  🏛️ ORGANIZACIÓN│  │  🏢 INSTITUCIÓN │
│  Apoyo social   │  │  Entidad pública│
└─────────────────┘  └─────────────────┘

┌─────────────────┐
│  🛍️ CONSUMIDOR  │
│  Compro local   │
└─────────────────┘
```

**Campo almacenado**: `member_type`  
**Valores**: `emprendimiento`, `empresa`, `organizacion`, `institucion`, `consumidor`

---

### Paso 1: Crear Acceso (20%)
**Objetivo**: Crear cuenta mínima viable

**Campos Obligatorios**:
- `nombre_completo` - Nombre y apellido
- `correo_electronico` - Email (login)
- `telefono_whatsapp` - WhatsApp principal
- `contrasena` - Contraseña (mín. 8 caracteres)

**Campos Opcionales** (mostrar con botón "Agregar más datos"):
- `municipio_id` - Select de municipios
- `departamento_id` - Select de departamentos
- `numero_identificacion` - DPI o NIT
- `fecha_nacimiento` - Fecha (date picker)

**Validaciones**:
- Email único en sistema
- Teléfono formato guatemalteco (+502)
- Contraseña segura (8+ caracteres, mayúscula, número)

**API Endpoint**: `POST /api/auth/registro/paso-1`

**Respuesta**:
```json
{
  "success": true,
  "userId": 123,
  "token": "jwt_token_aqui",
  "profileCompletion": 20,
  "nextStep": 2
}
```

---

### Paso 2: Perfil Base (40%)
**Objetivo**: Capturar información básica del negocio/entidad

#### Para Emprendimientos y Empresas:

**Campos Obligatorios**:
- `nombre_emprendimiento` - Nombre del negocio
- `descripcion_corta` - Máx. 200 caracteres
- `sector_id` - Dropdown de sectores económicos

**Campos Opcionales**:
- `etapa_negocio` - Radio buttons:
  - `idea` - "Tengo una idea"
  - `empezando` - "Iniciando operaciones"
  - `creciendo` - "En crecimiento"
  - `consolidado` - "Negocio estable"
- `fecha_inicio` - ¿Cuándo iniciaste?
- `tiene_logo` - Toggle Si/No

**Condicional** (si `tiene_logo` = true):
- `logo_url` - Botón "Subir logo" (Cloudinary)

#### Para Organizaciones:

**Campos Obligatorios**:
- `nombre_entidad`
- `tipo_entidad` - Dropdown:
  - ONG
  - Asociación
  - Cooperativa
  - Incubadora
  - Fundación
  - Otra

**Campos Opcionales**:
- `cobertura_geografica` - Checkboxes múltiples de municipios
- `descripcion_servicios` - ¿Qué apoyo ofrecen?

#### Para Consumidor:

**Campos**:
- `intereses` - Chips/tags (artesanías, alimentos, tecnología, etc.)
- `categorias_favoritas` - Select múltiple de sectores

**API Endpoint**: `POST /api/auth/registro/paso-2`

---

### Paso 3: Ventas y Pagos (55%)
**Solo para**: Emprendimientos y Empresas

**Pregunta Principal**: "¿Cómo vendes tus productos/servicios?"

**canales_venta** (Checkboxes múltiples):
- ☐ Ferias y mercados
- ☐ WhatsApp
- ☐ Facebook/Instagram
- ☐ Tienda física
- ☐ Marketplace (Amazon, MercadoLibre)
- ☐ Sitio web propio
- ☐ Ventas por catálogo

**Pregunta**: "¿Cómo recibes pagos?"

**metodos_pago** (Checkboxes múltiples):
- ☐ Efectivo
- ☐ Transferencia bancaria
- ☐ Tarjeta (POS)
- ☐ Billetera digital (Tigo Money, Movistar Money)
- ☐ Código QR
- ☐ Contra entrega
- ☐ Depósito bancario

**Pregunta**: "¿Usas pasarela de pagos en línea?"

**usa_pasarela_pago** - Toggle Si/No

**Condicional** (si = true):
- `proveedor_pasarela` - Dropdown:
  - Pagadito
  - NeoNet
  - VisaNet
  - QPay
  - Stripe
  - PayPal
  - Otro

- `tipo_cuenta_bancaria` - Radio:
  - Cuenta personal
  - Cuenta empresarial
  - Cooperativa
  - Billetera digital

**API Endpoint**: `POST /api/auth/registro/paso-3`

---

### Paso 4: Logística y Presencia Digital (75%)
**Solo para**: Emprendimientos y Empresas

**Pregunta**: "¿Realizas envíos de productos?"

**realiza_envios** - Radio buttons:
- ○ Sí, a nivel nacional
- ○ Solo entregas locales
- ○ No hago envíos

**Condicional** (si "Sí" o "Solo locales"):
**metodos_envio** (Checkboxes):
- ☐ Guatex
- ☐ Cargo Expreso
- ☐ Forza
- ☐ DHL
- ☐ UPS
- ☐ Mensajería local
- ☐ Entrega propia

**politica_cobro_envio** - Radio:
- ○ Envío gratis
- ○ Cliente paga envío
- ○ Depende del monto de compra

**Pregunta**: "¿Dónde te encuentran en línea?"

**Redes Sociales** (opcional):
- `facebook_url`
- `instagram_url`
- `tiktok_url`
- `whatsapp_business`
- `sitio_web`

**UI**: Inputs con iconos de cada red social

**API Endpoint**: `POST /api/auth/registro/paso-4`

---

### Paso 5: Formalización del Negocio (90%)
**Solo para**: Emprendimientos y Empresas

**Nota informativa**:
> "Esta información es opcional y ayuda a identificar oportunidades de apoyo"

**Pregunta**: "¿Estás inscrito en la SAT?"

**registro_SAT** - Toggle Si/No

**Condicional** (si = true):
- `nit` - Input con formato automático
- `puede_emitir_facturas` - Toggle Si/No

**Condicional** (si `puede_emitir_facturas` = true):
- `archivo_rtu` - Botón "Subir RTU" (PDF)

**Pregunta**: "¿Tienes registro mercantil?"

**estado_registro_mercantil** - Radio:
- ○ No
- ○ En trámite
- ○ Sí, registrado

**Pregunta**: "¿Tienes patente de comercio?"

**tiene_patente_comercio** - Toggle Si/No

**Condicional** (si = true):
- `numero_patente` - Input
- `archivo_patente` - Botón "Subir patente" (PDF/imagen)

**Pregunta**: "¿Te interesa registrar tu marca?"

**interes_registro_marca** - Radios:
- ○ Sí, me interesa
- ○ Ya tengo marca registrada
- ○ No en este momento

**Condicional** (si "Ya tengo"):
- `estado_marca` - Input (nombre o número de registro)

**Otros Registros**:
- `otros_registros` - Textarea (opcional)
  "¿Tienes otros registros? (Sanitario, MAGA, exportación, etc.)"

**API Endpoint**: `POST /api/auth/registro/paso-5`

---

### Paso 6: Intereses y Apoyos (100%)
**Objetivo**: Personalizar experiencia del usuario

#### Para Emprendimientos y Empresas:

**Pregunta**: "¿En qué necesitas apoyo?"

**necesidades_apoyo** (Checkboxes múltiples):
- ☐ Financiamiento
- ☐ Capacitación empresarial
- ☐ Formalización (SAT, registros)
- ☐ Marketing digital
- ☐ Vender en línea (e-commerce)
- ☐ Exportación
- ☐ Vender al Estado (compras públicas)
- ☐ Certificaciones de calidad
- ☐ Asesoría legal
- ☐ Contabilidad y finanzas

#### Para Organizaciones/Instituciones:

**Pregunta**: "¿Qué tipo de apoyo ofreces?"

**tipos_apoyo_ofrecidos** (Checkboxes):
- ☐ Capacitaciones
- ☐ Financiamiento/Crédito
- ☐ Asesoría técnica
- ☐ Espacios de coworking
- ☐ Aceleración de negocios
- ☐ Networking

**Permisos de publicación** (requieren aprobación admin):
- `puede_publicar_eventos` - Toggle
- `puede_publicar_noticias` - Toggle
- `puede_publicar_convocatorias` - Toggle

#### Para Consumidor:

**suscripciones** (Toggles):
- `suscribirse_noticias` - Recibir noticias por email
- `suscribirse_eventos` - Notificaciones de eventos

**API Endpoint**: `POST /api/auth/registro/paso-6`

**Respuesta Final**:
```json
{
  "success": true,
  "message": "¡Registro completado!",
  "profileCompletion": 100,
  "redirectTo": "/dashboard"
}
```

---

## 4. MOTOR DE PERFIL PROGRESIVO

### 4.1 Cálculo de Porcentaje

**Pesos por paso**:
```javascript
const stepWeights = {
  0: 0,   // Selección de perfil (no cuenta)
  1: 20,  // Crear acceso
  2: 20,  // Perfil base
  3: 15,  // Ventas y pagos
  4: 20,  // Logística y redes
  5: 15,  // Formalización
  6: 10   // Intereses y apoyos
};
```

**Cálculo dinámico**:
```javascript
function calculateProfileCompletion(userData, memberType) {
  let completion = 0;
  
  // Paso 1: Obligatorio (20%)
  if (userData.email && userData.password && userData.nombre_completo) {
    completion += 20;
    
    // Bonus por campos opcionales (hasta +5%)
    const optionalFields = ['municipio_id', 'fecha_nacimiento', 'numero_identificacion'];
    const filledOptional = optionalFields.filter(field => userData[field]).length;
    completion += (filledOptional / optionalFields.length) * 5;
  }
  
  // Paso 2: Perfil base (20%)
  if (memberType === 'emprendimiento' || memberType === 'empresa') {
    if (userData.nombre_emprendimiento && userData.descripcion_corta && userData.sector_id) {
      completion += 15;
      if (userData.logo_url) completion += 5; // Bonus por logo
    }
  }
  
  // ... continuar para cada paso
  
  return Math.round(completion);
}
```

### 4.2 Recomendaciones Inteligentes

**En el Panel del Usuario**:
```
┌────────────────────────────────────┐
│ Tu perfil está 65% completo        │
│ ████████████░░░░░░░░               │
│                                    │
│ Completa tu perfil para:           │
│ • Aparecer en búsquedas            │
│ • Recibir oportunidades            │
│ • Acceder a programas              │
│                                    │
│ [Continuar mi perfil]              │
└────────────────────────────────────┘
```

**Recomendaciones dinámicas**:
```javascript
function getRecommendations(userData, profileCompletion) {
  const recommendations = [];
  
  if (!userData.logo_url) {
    recommendations.push({
      title: "Agrega tu logo",
      description: "Los negocios con logo reciben 3x más visitas",
      action: "Subir logo",
      points: +5
    });
  }
  
  if (!userData.redes_sociales?.facebook) {
    recommendations.push({
      title: "Conecta tus redes sociales",
      description: "Permite que clientes te encuentren fácilmente",
      action: "Agregar redes",
      points: +10
    });
  }
  
  if (!userData.metodos_pago || userData.metodos_pago.length < 2) {
    recommendations.push({
      title: "Agrega más formas de pago",
      description: "Más opciones = más ventas",
      action: "Actualizar pagos",
      points: +5
    });
  }
  
  return recommendations;
}
```

---

## 5. GUARDADO AUTOMÁTICO

### 5.1 Estrategia de Guardado

**Por Paso Completado**:
- Al hacer clic en "Siguiente", guardar antes de avanzar
- Si falla, mostrar error y no avanzar

**Guardado en Borrador** (opcional):
- Guardar cada 30 segundos si hay cambios
- Indicador visual: "Último guardado: hace 2 minutos"

**LocalStorage como Respaldo**:
```javascript
// Guardar en localStorage por si el usuario cierra la página
const saveFormProgress = (stepNumber, formData) => {
  const progressKey = `registration_step_${stepNumber}_${userId}`;
  localStorage.setItem(progressKey, JSON.stringify({
    data: formData,
    timestamp: Date.now()
  }));
};

// Recuperar al volver
const recoverFormProgress = (stepNumber, userId) => {
  const progressKey = `registration_step_${stepNumber}_${userId}`;
  const saved = localStorage.getItem(progressKey);
  if (saved) {
    const { data, timestamp } = JSON.parse(saved);
    // Solo si es menor a 24 horas
    if (Date.now() - timestamp < 86400000) {
      return data;
    }
  }
  return null;
};
```

---

## 6. BOTÓN "SALTAR PASO"

### 6.1 Configuración por Paso

```javascript
const stepConfig = {
  1: { skippable: false, reason: "Datos de acceso obligatorios" },
  2: { skippable: false, reason: "Información básica requerida" },
  3: { skippable: true },
  4: { skippable: true },
  5: { skippable: true },
  6: { skippable: true }
};
```

### 6.2 UI del Botón

```jsx
{stepConfig[currentStep].skippable && (
  <button
    type="button"
    onClick={handleSkipStep}
    className="text-gray-500 underline text-sm"
  >
    Completar después
  </button>
)}
```

### 6.3 Lógica Backend

```javascript
// Permitir pasos vacíos si son saltables
router.post('/registro/paso-:step', async (req, res) => {
  const step = parseInt(req.params.step);
  const { userId, skipped } = req.body;
  
  if (skipped && stepConfig[step].skippable) {
    // Marcar paso como salt ado pero avanzar
    await ProfileProgress.update({
      [`step_${step}_skipped`]: true,
      current_step: step + 1
    }, { where: { user_id: userId } });
    
    return res.json({
      success: true,
      nextStep: step + 1,
      profileCompletion: calculateCompletion(userId)
    });
  }
  
  // Validar datos si no es saltado
  // ...
});
```

---

## 7. LÓGICA CONDICIONAL

### 7.1 Campos Dependientes

**Implementación Frontend** (React ejemplo):

```jsx
const [formData, setFormData] = useState({});

// Mostrar campo subir_logo solo si tiene_logo = true
{formData.tiene_logo && (
  <div className="campo-condicional fade-in">
    <label>Sube tu logo</label>
    <CloudinaryUpload onUpload={handleLogoUpload} />
  </div>
)}

// Mostrar proveedores de pasarela solo si usa_pasarela = true
{formData.usa_pasarela_pago && (
  <div className="campo-condicional fade-in">
    <label>¿Qué pasarela usas?</label>
    <select name="proveedor_pasarela">
      <option value="pagadito">Pagadito</option>
      <option value="neonet">NeoNet</option>
      {/* ... */}
    </select>
  </div>
)}

// Mostrar métodos de envío solo si realiza_envios != 'no'
{formData.realiza_envios !== 'no' && formData.realiza_envios && (
  <div className="campo-condicional fade-in">
    <label>¿Cómo envías?</label>
    <CheckboxGroup
      options={metodosEnvio}
      value={formData.metodos_envio}
      onChange={handleMetodosChange}
    />
  </div>
)}
```

### 7.2 Validación Condicional Backend

```javascript
const validateStep3 = (data) => {
  const errors = [];
  
  // Si usa pasarela, proveedor es obligatorio
  if (data.usa_pasarela_pago && !data.proveedor_pasarela) {
    errors.push({
      field: 'proveedor_pasarela',
      message: 'Selecciona tu proveedor de pasarela'
    });
  }
  
  // Si realiza envíos, debe tener al menos un método
  if (data.realiza_envios === 'si' || data.realiza_envios === 'solo_local') {
    if (!data.metodos_envio || data.metodos_envio.length === 0) {
      errors.push({
        field: 'metodos_envio',
        message: 'Selecciona al menos un método de envío'
      });
    }
  }
  
  return errors;
};
```

---

## 8. ROLES Y PERMISOS

### 8.1 Separación de Conceptos

**Tipo de Usuario** (`member_type`):
- Es una característica del perfil
- Define qué campos del formulario se muestran
- Se establece en Paso 0 y no cambia

**Roles** (`roles`):
- Son permisos operativos en el sistema
- Se asignan o revocan dinámicamente
- Un usuario puede tener múltiples roles

### 8.2 Tabla de Roles

```sql
CREATE TABLE user_roles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  role_name ENUM(
    'usuario_autenticado',
    'emprendedor_verificado',
    'empresa_verificada',
    'organizacion_aprobada',
    'institucion_publica',
    'consumidor',
'administrador',
    'super_admin'
  ) NOT NULL,
  granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  granted_by INT NULL,
  expires_at TIMESTAMP NULL, -- Para permisos temporales
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (granted_by) REFERENCES users(id),
  UNIQUE KEY unique_user_role (user_id, role_name)
);
```

### 8.3 Matriz de Permisos

| Permiso | Emprendedor | Empresa | Organización | Institución | Consumidor | Admin |
|---------|-------------|---------|--------------|-------------|------------|-------|
| Editar perfil propio | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Ver programas | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Postularse a programas | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ |
| Publicar eventos | ❌ | ❌ | ⚠️ Requiere aprobación | ⚠️ Requiere aprobación | ❌ | ✅ |
| Publicar noticias | ❌ | ❌ | ⚠️ Requiere aprobación | ⚠️ Requiere aprobación | ❌ | ✅ |
| Publicar convocatorias | ❌ | ❌ | ⚠️ Requiere aprobación | ✅ | ❌ | ✅ |
| Aprobar contenido | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Administrar catálogos | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Ver estadísticas | ❌ | ❌ | ❌ | ⚠️ Solo propias | ❌ | ✅ |

**Middleware de autorización** (Node.js ejemplo):

```javascript
const checkPermission = (requiredPermission) => {
  return async (req, res, next) => {
    const { user } = req;
    
    const userRoles = await UserRole.findAll({
      where: { user_id: user.id }
    });
    
    const roleNames = userRoles.map(r => r.role_name);
    
    const hasPermission = permissionMatrix[requiredPermission]
      .some(allowedRole => roleNames.includes(allowedRole));
    
    if (!hasPermission) {
      return res.status(403).json({
        error: 'No tienes permiso para realizar esta acción'
      });
    }
    
    next();
  };
};

// Uso en rutas
router.post('/eventos', 
  authenticate, 
  checkPermission('publicar_eventos'), 
  crearEvento
);
```

---

## 9. FEATURE FLAG: CONSUMIDOR

### 9.1 Configuración

```javascript
// config/features.js
module.exports = {
  ENABLE_CONSUMER_REGISTRATION: process.env.ENABLE_CONSUMERS === 'true',
  ENABLE_EVENT_SUBSCRIPTIONS: true,
  ENABLE_MARKETPLACE: false // Para el futuro
};
```

### 9.2 Implementación Frontend

```jsx
import { features } from '@/config/features';

// En Paso 0
const userTypes = [
  { id: 'emprendimiento', label: 'Emprendedor', icon: '🚀' },
  { id: 'empresa', label: 'Empresa', icon: '🏢' },
  { id: 'organizacion', label: 'Organización', icon: '🏛️' },
  { id: 'institucion', label: 'Institución Pública', icon: '🏢' },
];

// Solo mostrar consumidor si está habilitado
if (features.ENABLE_CONSUMER_REGISTRATION) {
  userTypes.push({
    id: 'consumidor',
    label: 'Consumidor Local',
    icon: '🛍️'
  });
}
```

### 9.3 Validación Backend

```javascript
router.post('/auth/registro/paso-0', async (req, res) => {
  const { member_type } = req.body;
  
  // Validar que consumidor esté habilitado
  if (member_type === 'consumidor' && !features.ENABLE_CONSUMER_REGISTRATION) {
    return res.status(400).json({
      error: 'El registro de consumidores no está disponible actualmente'
    });
  }
  
  // ...continuar
});
```

---

## 10. REQUISITOS UX

### 10.1 Diseño Mobile-First

**Principios**:
- Máximo 4 campos por pantalla
- Botones grandes (mínimo 44x44px)
- Inputs con labels flotantes
- Validación en tiempo real
- Feedback visual inmediato

**Breakpoints**:
```css
/* Mobile */
@media (max-width: 640px) {
  .form-step {
    padding: 1rem;
  }
  
  .field-group {
    margin-bottom: 1.5rem;
  }
  
  input, select, textarea {
    font-size: 16px; /* Evitar zoom en iOS */
    padding: 12px;
    height: 48px;
  }
  
  button {
    width: 100%;
    height: 48px;
    margin-top: 1rem;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .form-step {
    max-width: 600px;
    margin: 0 auto;
  }
  
  .field-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
}
```

### 10.2 Barra de Progreso

```jsx
const ProgressBar = ({ currentStep, totalSteps }) => {
  const progress = (currentStep / totalSteps) * 100;
  
  return (
    <div className="progress-container">
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="progress-text">
        Paso {currentStep} de {totalSteps} • {Math.round(progress)}% completado
      </div>
    </div>
  );
};
```

### 10.3 Validaciones Amigables

```jsx
const ValidationMessage = ({ error, field }) => {
  if (!error) return null;
  
  return (
    <div className="validation-error animate-shake">
      <span className="error-icon">⚠️</span>
      <span className="error-text">{error}</span>
      {field === 'email' && error.includes('ya existe') && (
        <a href="/login" className="error-link">
          ¿Ya tienes cuenta? Inicia sesión
        </a>
      )}
    </div>
  );
};
```

### 10.4 Navegación entre Pasos

```jsx
const StepNavigation = ({ onBack, onNext, onSkip, canSkip, isFirst, isLast }) => {
  return (
    <div className="step-navigation">
      {!isFirst && (
        <button type="button" onClick={onBack} className="btn-back">
          ← Atrás
        </button>
      )}
      
      <div className="flex-spacer" />
      
      {canSkip && (
        <button type="button" onClick={onSkip} className="btn-skip">
          Completar después
        </button>
      )}
      
      <button type="submit" onClick={onNext} className="btn-next">
        {isLast ? 'Finalizar' : 'Siguiente →'}
      </button>
    </div>
  );
};
```

---

## 11. CONTINUACIÓN DEL PERFIL

### 11.1 Detectar Perfil Incompleto

```javascript
// Middleware para rutas protegidas
const checkProfileCompletion = async (req, res, next) => {
  const { user } = req;
  
  const profile = await ProfileProgress.findOne({
    where: { user_id: user.id }
  });
  
  if (profile.completion_percentage < 100) {
    // Redirigir al paso pendiente
    return res.json({
      profileIncomplete: true,
      nextStep: profile.current_step,
      completionPercentage: profile.completion_percentage,
      message: 'Completa tu perfil para acceder a todas las funciones'
    });
  }
  
  next();
};
```

### 11.2 Banner de Perfil Incompleto

```jsx
const ProfileCompletionBanner = ({ completion, onContinue }) => {
  if (completion >= 100) return null;
  
  return (
    <div className="completion-banner">
      <div className="banner-icon">📋</div>
      <div className="banner-content">
        <h3>Tu perfil está {completion}% completo</h3>
        <p>Completa tu información para acceder a más oportunidades</p>
        <ProgressBar percentage={completion} />
      </div>
      <button onClick={onContinue} className="banner-cta">
        Continuar
      </button>
    </div>
  );
};
```

---

## CONCLUSIÓN

Esta arquitectura proporciona:
- ✅ Registro rápido (menos de 2 minutos)
- ✅ Experiencia mobile-friendly
- ✅ Flexibilidad para completar después
- ✅ Personalización según tipo de usuario
- ✅ Escalabilidad para nuevas features
- ✅ Inclusión (no requiere documentos formales)
- ✅ Trazabilidad (perfil progresivo medible)

**Próximos pasos**:
1. Migración de base de datos
2. Implementación de endpoints API
3. Desarrollo de componentes frontend
4. Testing en dispositivos móviles
5. Deploy y monitoreo


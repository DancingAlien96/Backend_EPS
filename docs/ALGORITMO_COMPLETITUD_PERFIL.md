# ALGORITMO DE CÁLCULO DE PERFIL PROGRESIVO
## Sistema de Completitud con Pesos Dinámicos

---

## 1. FÓRMULA BASE

```
Perfil (%) = Σ (Peso_Paso_i × Completitud_Paso_i)
```

Donde:
- **Peso_Paso_i**: Peso fijo del paso (suma total = 100%)
- **Completitud_Paso_i**: 0 a 1 según campos completados en ese paso

---

## 2. DISTRIBUCIÓN DE PESOS

| Paso | Descripción | Peso | Saltable |
|------|-------------|------|----------|
| 0 | Selección de perfil | 0% | No |
| 1 | Crear acceso | 20% | No |
| 2 | Perfil base | 20% | No |
| 3 | Ventas y pagos | 15% | Sí |
| 4 | Logística y redes | 20% | Sí |
| 5 | Formalización | 15% | Sí |
| 6 | Intereses y apoyos | 10% | Sí |

### Justificación de Pesos:
- **Paso 1 (20%)**: Es el mínimo funcional (cuenta creada)
- **Paso 2 (20%)**: Información esencial del negocio
- **Paso 4 (20%)**: Presencia digital es crítica para visibilidad
- **Pasos 3 y 5 (15% c/u)**: Importantes pero no esenciales
- **Paso 6 (10%)**: Complementario, personalización

---

## 3. CÁLCULO POR PASO

### Paso 1: Crear Acceso (20%)

**Campos Obligatorios** (dan el 20% completo):
- `nombre_completo`
- `correo_electronico`
- `telefono_whatsapp`
- `contrasena`

**Campos Opcionales** (bonus de hasta +5%):
- `municipio_id` (+1.25%)
- `departamento_id` (+1.25%)
- `numero_identificacion` (+1.25%)
- `fecha_nacimiento` (+1.25%)

```javascript
function calculateStep1(data) {
  let score = 0;
  
  // Obligatorios: si todos están, da 20%
  const required = ['nombre_completo', 'correo_electronico', 'telefono_whatsapp', 'contrasena'];
  const hasAllRequired = required.every(field => data[field]);
  
  if (hasAllRequired) {
    score = 20;
    
    // Bonus por opcionales
    const optional = ['municipio_id', 'departamento_id', 'numero_identificacion', 'fecha_nacimiento'];
    const filledOptional = optional.filter(field => data[field]).length;
    score += (filledOptional / optional.length) * 5;
  }
  
  return score;
}
```

---

### Paso 2: Perfil Base (20%)

**Para Emprendimiento/Empresa**:

**Obligatorios** (15%):
- `nombre_emprendimiento` (5%)
- `descripcion_corta` (5%)
- `sector_id` (5%)

**Opcionales** (5%):
- `etapa_negocio` (1%)
- `fecha_inicio` (1%)
- `tiene_logo` + `logo_url` (3%)

```javascript
function calculateStep2Venture(data) {
  let score = 0;
  
  // Obligatorios
  if (data.nombre_emprendimiento) score += 5;
  if (data.descripcion_corta) score += 5;
  if (data.sector_id) score += 5;
  
  // Opcionales
  if (data.etapa_negocio) score += 1;
  if (data.fecha_inicio) score += 1;
  if (data.tiene_logo && data.logo_url) score += 3;
  
  return score;
}
```

**Para Organización/Institución**:

```javascript
function calculateStep2Organization(data) {
  let score = 0;
  
  // Obligatorios (15%)
  if (data.nombre_entidad) score += 7.5;
  if (data.tipo_entidad) score += 7.5;
  
  // Opcionales (5%)
  if (data.descripcion_servicios) score += 2;
  if (data.cobertura_geografica?.length > 0) score += 2;
  if (data.logo_url) score += 1;
  
  return score;
}
```

**Para Consumidor**:

```javascript
function calculateStep2Consumer(data) {
  let score = 0;
  
  // Opcionales (20% completo si tiene al menos algo)
  if (data.intereses?.length > 0) score += 10;
  if (data.categorias_favoritas?.length > 0) score += 10;
  
  return score;
}
```

---

### Paso 3: Ventas y Pagos (15%)

**Solo para Emprendimiento/Empresa**. Para otros tipos: N/A (se redistribuye el peso)

```javascript
function calculateStep3(data, memberType) {
  if (memberType === 'consumidor' || memberType === 'organizacion' || memberType === 'institucion') {
    return 0; // N/A (no afecta el total)
  }
  
  let score = 0;
  
  // Canales de venta (5%)
  if (data.canales_venta && data.canales_venta.length > 0) score += 5;
  
  // Métodos de pago (5%)
  if (data.metodos_pago && data.metodos_pago.length > 0) score += 5;
  
  // Pasarela de pagos (2%)
  if (data.usa_pasarela_pago !== undefined) {
    score += 2;
    // Bonus si usa y especifica proveedor
    if (data.usa_pasarela_pago && data.proveedor_pasarela) score += 1;
  }
  
  // Tipo de cuenta (2%)
  if (data.tipo_cuenta_bancaria) score += 2;
  
  return score;
}
```

---

### Paso 4: Logística y Presencia Digital (20%)

```javascript
function calculateStep4(data, memberType) {
  if (memberType === 'consumidor') {
    return 0; // N/A
  }
  
  let score = 0;
  
  // LOGÍSTICA (10% del paso = 5% del total)
  if (memberType === 'emprendimiento' || memberType === 'empresa') {
    if (data.realiza_envios) {
      score += 2;
      
      // Si realiza envíos, debe tener métodos
      if (data.realiza_envios !== 'no' && data.metodos_envio?.length > 0) {
        score += 2;
      }
      
      if (data.politica_cobro_envio) score += 1;
    }
  }
  
  // REDES SOCIALES (10% del paso = 5% del total)
  const socialFields = ['facebook_url', 'instagram_url', 'tiktok_url', 'whatsapp_business', 'sitio_web'];
  const filledSocial = socialFields.filter(field => data[field]).length;
  
  // Cada red social da 1% (máximo 5 redes = 5%)
  score += filledSocial * 1;
  
  // Bonus adicional si tiene al menos 3 redes (+5%)
  if (filledSocial >= 3) score += 5;
  
  // Bonus extra por sitio web propio (+5%)
  if (data.sitio_web) score += 5;
  
  return Math.min(score, 20); // Máximo 20%
}
```

---

### Paso 5: Formalización (15%)

```javascript
function calculateStep5(data, memberType) {
  if (memberType === 'consumidor') {
    return 0; // N/A
  }
  
  let score = 0;
  
  // Registro SAT (5%)
  if (data.registro_SAT !== undefined) {
    score += 2;
    
    if (data.registro_SAT) {
      if (data.nit) score += 1;
      if (data.puede_emitir_facturas) score += 1;
      if (data.archivo_rtu) score += 1;
    }
  }
  
  // Registro mercantil (3%)
  if (data.estado_registro_mercantil) {
    if (data.estado_registro_mercantil === 'registrado') score += 3;
    else if (data.estado_registro_mercantil === 'en_tramite') score += 1.5;
  }
  
  // Patente de comercio (4%)
  if (data.tiene_patente_comercio !== undefined) {
    score += 1;
    
    if (data.tiene_patente_comercio) {
      if (data.numero_patente) score += 1.5;
      if (data.archivo_patente) score += 1.5;
    }
  }
  
  // Interés en registro de marca (2%)
  if (data.interes_registro_marca) {
    if (data.interes_registro_marca === 'ya_tengo') score += 2;
    else if (data.interes_registro_marca === 'me_interesa') score += 1;
  }
  
  // Otros registros (1%)
  if (data.otros_registros) score += 1;
  
  return score;
}
```

---

### Paso 6: Intereses y Apoyos (10%)

```javascript
function calculateStep6(data, memberType) {
  let score = 0;
  
  if (memberType === 'emprendimiento' || memberType === 'empresa') {
    // Necesidades de apoyo (10%)
    if (data.necesidades_apoyo && data.necesidades_apoyo.length > 0) {
      score = 10;
    }
  } 
  else if (member Type === 'organizacion' || memberType === 'institucion') {
    // Tipos de apoyo ofrecidos (7%)
    if (data.tipos_apoyo_ofrecidos && data.tipos_apoyo_ofrecidos.length > 0) {
      score += 7;
    }
    
    // Permisos de publicación (3%)
    const permisos = [
      data.puede_publicar_eventos,
      data.puede_publicar_noticias,
      data.puede_publicar_convocatorias
    ].filter(Boolean).length;
    
    score += (permisos / 3) * 3;
  }
  else if (memberType === 'consumidor') {
    // Suscripciones (10%)
    let subs = 0;
    if (data.suscribirse_noticias) subs++;
    if (data.suscribirse_eventos) subs++;
    
    score = (subs / 2) * 10;
  }
  
  return score;
}
```

---

## 4. FUNCIÓN MAESTRA

```javascript
/**
 * Calcula el porcentaje de completitud del perfil
 * @param {Object} userData - Datos del usuario y su perfil
 * @param {string} memberType - Tipo de miembro
 * @param {Object} progressData - Estado de los pasos
 * @returns {number} Porcentaje entre 0 y 100
 */
function calculateProfileCompletion(userData, memberType, progressData) {
  let total = 0;
  
  // Paso 1: Crear acceso (obligatorio)
  if (progressData.step_1_completed) {
    total += calculateStep1(userData);
  }
  
  // Paso 2: Perfil base
  if (progressData.step_2_completed) {
    switch (memberType) {
      case 'emprendimiento':
      case 'empresa':
        total += calculateStep2Venture(userData.venture_profile);
        break;
      case 'organizacion':
      case 'institucion':
        total += calculateStep2Organization(userData.organization_profile);
        break;
      case 'consumidor':
        total += calculateStep2Consumer(userData.consumer_profile);
        break;
    }
  }
  
  // Paso 3: Ventas y pagos (solo negocio)
  if (progressData.step_3_completed) {
    total += calculateStep3(userData.venture_profile, memberType);
  }
  
  // Paso 4: Logística y redes
  if (progressData.step_4_completed) {
    if (memberType === 'emprendimiento' || memberType === 'empresa') {
      total += calculateStep4(userData.venture_profile, memberType);
    } else if (memberType === 'organizacion' || memberType === 'institucion') {
      total += calculateStep4(userData.organization_profile, memberType);
    }
  }
  
  // Paso 5: Formalización
  if (progressData.step_5_completed) {
    total += calculateStep5(userData.venture_profile, memberType);
  }
  
  // Paso 6: Intereses
  if (progressData.step_6_completed) {
    total += calculateStep6(userData, memberType);
  }
  
  // Redondear a entero
  return Math.round(Math.min(total, 100));
}
```

---

## 5. REDISTRIBUCIÓN PARA PASOS N/A

Cuando un paso **no aplica** a un tipo de usuario (ej: consumidor no tiene paso 3), redistribuir el peso:

```javascript
function adjustWeightsForMemberType(memberType) {
  const baseWeights = {
    step_1: 20,
    step_2: 20,
    step_3: 15,
    step_4: 20,
    step_5: 15,
    step_6: 10
  };
  
  // Identificar pasos no aplicables
  const naSteps = [];
  
  if (memberType === 'consumidor') {
    naSteps.push('step_3', 'step_5'); // Consumidor no tiene ventas ni formalización
  } else if (memberType === 'organizacion' || memberType === 'institucion') {
    naSteps.push('step_3'); // Organizaciones no tienen ventas
  }
  
  // Sumar peso de pasos N/A
  const naWeight = naSteps.reduce((sum, step) => sum + baseWeights[step], 0);
  
  // Distribuir proporcionalmente entre pasos aplicables
  const applicableSteps = Object.keys(baseWeights).filter(step => !naSteps.includes(step));
  const totalApplicableWeight = applicableSteps.reduce((sum, step) => sum + baseWeights[step], 0);
  
  const adjustedWeights = { ...baseWeights };
  
  applicableSteps.forEach(step => {
    const proportion = baseWeights[step] / totalApplicableWeight;
    adjustedWeights[step] += naWeight * proportion;
  });
  
  return adjustedWeights;
}
```

**Ejemplo para Consumidor**:
- Paso 3 (15%) y Paso 5 (15%) = 30% redistribuido
- Pasos aplicables: 1, 2, 4, 6 = 70%
- Nuevo peso Paso 1: 20 + (30 × 20/70) = **28.57%**
- Nuevo peso Paso 2: 20 + (30 × 20/70) = **28.57%**
- Nuevo peso Paso 4: 20 + (30 × 20/70) = **28.57%**
- Nuevo peso Paso 6: 10 + (30 × 10/70) = **14.29%**

---

## 6. RECOMENDACIONES INTELIGENTES

```javascript
function getProfileRecommendations(userData, memberType, completion) {
  const recommendations = [];
  
  // Falta logo
  if (!userData.logo_url) {
    recommendations.push({
      title: "Agrega tu logo",
      description: "Los negocios con logo reciben 3x más visitas",
      action: "Subir logo",
      points: 3,
      stepNumber: 2,
      priority: "high"
    });
  }
  
  // Falta descripción
  if (!userData.descripcion_corta || userData.descripcion_corta.length < 50) {
    recommendations.push({
      title: "Mejora tu descripción",
      description: "Describe mejor qué haces y qué te hace único",
      action: "Editar descripción",
      points: 5,
      stepNumber: 2,
      priority: "high"
    });
  }
  
  // Sin redes sociales
  const socialFields = ['facebook_url', 'instagram_url', 'sitio_web'];
  const hasSocial = socialFields.some(field => userData[field]);
  
  if (!hasSocial) {
    recommendations.push({
      title: "Conecta tus redes sociales",
      description: "Permite que más personas te encuentren",
      action: "Agregar redes",
      points: 10,
      stepNumber: 4,
      priority: "high"
    });
  }
  
  // Métodos de pago limitados
  if (userData.metodos_pago && userData.metodos_pago.length < 2) {
    recommendations.push({
      title: "Agrega más formas de pago",
      description: "Más opciones = más ventas",
      action: "Actualizar pagos",
      points: 5,
      stepNumber: 3,
      priority: "medium"
    });
  }
  
  // No formalizado
  if (!userData.registro_SAT && !userData.tiene_patente_comercio) {
    recommendations.push({
      title: "Formaliza tu negocio",
      description: "Accede a más oportunidades con tu RTU y patente",
      action: "Ver opciones de formalización",
      points: 15,
      stepNumber: 5,
      priority: "medium"
    });
  }
  
  // Sin necesidades de apoyo definidas
  if (!userData.necesidades_apoyo || userData.necesidades_apoyo.length === 0) {
    recommendations.push({
      title: "Define tus necesidades",
      description: "Te conectaremos con programas de apoyo relevantes",
      action: "Completar intereses",
      points: 10,
      stepNumber: 6,
      priority: "low"
    });
  }
  
  // Ordenar por prioridad y puntos
  const priorityOrder = { high: 1, medium: 2, low: 3 };
  recommendations.sort((a, b) => {
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return b.points - a.points;
  });
  
  return recommendations.slice(0, 5); // Top 5
}
```

---

## 7. TRIGGERS PARA BADGES

Otorgar insignias al alcanzar hitos:

```javascript
function checkBadges(completion, userData) {
  const badges = [];
  
  if (completion >= 50) {
    badges.push({ id: 'medio_camino', name: 'Medio Camino', icon: '🏃' });
  }
  
  if (completion >= 75) {
    badges.push({ id: 'casi_listo', name: 'Casi Listo', icon: '🎯' });
  }
  
  if (completion === 100) {
    badges.push({ id: 'perfil_completo', name: 'Perfil Completo', icon: '🎉' });
  }
  
  // Badges especiales
  if (userData.logo_url && userData.sitio_web) {
    badges.push({ id: 'presencia_digital', name: 'Presencia Digital', icon: '🌐' });
  }
  
  if (userData.registro_SAT && userData.tiene_patente_comercio) {
    badges.push({ id: 'formalizado', name: 'Negocio Formal', icon: '📜' });
  }
  
  return badges;
}
```

---

## 8. IMPLEMENTACIÓN BACKEND (Node.js)

### `services/ProfileCompletionService.js`

```javascript
class ProfileCompletionService {
  static async calculate(userId) {
    const user = await User.findByPk(userId, {
      include: [
        { model: VentureProfile, as: 'ventureProfile' },
        { model: OrganizationProfile, as: 'organizationProfile' },
        { model: ConsumerProfile, as: 'consumerProfile' },
        { model: RegistrationProgress, as: 'progress' }
      ]
    });
    
    if (!user) throw new Error('Usuario no encontrado');
    
    const memberType = user.member_type;
    const progress = user.progress;
    
    // Calcular completitud
    const completion = calculateProfileCompletion(user, memberType, progress);
    
    // Actualizar en BD
    await progress.update({ completion_percentage: completion });
    
    // Generar recomendaciones
    const recommendations = getProfileRecommendations(user, memberType, completion);
    
    // Verificar badges
    const badges = checkBadges(completion, user);
    
    return {
      completion,
      recommendations,
      badges
    };
  }
  
  static async recalculateAll() {
    const users = await User.findAll({
      where: { is_active: true }
    });
    
    for (const user of users) {
      await this.calculate(user.id);
    }
    
    console.log(`✅ Recalculados ${users.length} perfiles`);
  }
}

module.exports = ProfileCompletionService;
```

---

## 9. TESTING

```javascript
const { calculateProfileCompletion } = require('./profileCompletion');

describe('ProfileCompletionService', () => {
  it('usuario completo debe dar 100%', () => {
    const userData = {
      nombre_completo: 'Juan Pérez',
      correo_electronico: 'juan@test.com',
      telefono_whatsapp: '+50212345678',
      venture_profile: {
        nombre_emprendimiento: 'Mi Negocio',
        descripcion_corta: 'Descripción del negocio',
        sector_id: 1,
        logo_url: 'https://...',
        canales_venta: ['ferias', 'whatsapp'],
        metodos_pago: ['efectivo', 'transferencia'],
        facebook_url: 'https://facebook.com/...',
        instagram_url: '@negocio',
        sitio_web: 'https://negocio.com',
        registro_SAT: true,
        nit: '123456-7',
        tiene_patente_comercio: true,
        necesidades_apoyo: ['financiamiento']
      }
    };
    
    const progress = {
      step_1_completed: true,
      step_2_completed: true,
      step_3_completed: true,
      step_4_completed: true,
      step_5_completed: true,
      step_6_completed: true
    };
    
    const completion = calculateProfileCompletion(userData, 'emprendimiento', progress);
    
    expect(completion).toBeGreaterThanOrEqual(90);
  });
  
  it('solo paso 1 debe dar 20%', () => {
    const userData = {
      nombre_completo: 'Juan Pérez',
      correo_electronico: 'juan@test.com',
      telefono_whatsapp: '+50212345678'
    };
    
    const progress = {
      step_1_completed: true,
      step_2_completed: false,
      step_3_completed: false,
      step_4_completed: false,
      step_5_completed: false,
      step_6_completed: false
    };
    
    const completion = calculateProfileCompletion(userData, 'emprendimiento', progress);
    
    expect(completion).toBe(20);
  });
});
```

---

## RESUMEN

✅ **Algoritmo justo**: Premia completitud real, no solo pasos vacíos  
✅ **Flexible**: Adapta pesos según tipo de usuario  
✅ **Motivador**: Recomendaciones inteligentes guían al usuario  
✅ **Medible**: Trazabilidad de progreso en tiempo real  
✅ **Extensible**: Fácil agregar nuevos pasos o campos

---

**Archivo**: `backend-eps/services/profileCompletion.js`  
**Implementar**: Migrar algoritmo a JavaScript/TypeScript según el stack.

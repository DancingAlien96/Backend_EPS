# Database Setup

## 🐳 Instalación con Docker

El archivo `init.sql` contiene **TODA** la estructura de la base de datos, incluyendo el sistema de registro progresivo completo.

### Crear/Reconstruir el contenedor:

```bash
# Reconstruir completamente la base de datos
docker-compose down -v
docker-compose up -d

# El init.sql se ejecuta automáticamente
```

⚠️ **Advertencia**: `docker-compose down -v` elimina todos los datos. Haz backup antes de reconstruir.

---

## Nuevas Tablas Agregadas

### Sistema de Registro Progresivo:

1. **`users`** - Autenticación (email, password, tipo de miembro)
2. **`registration_progress`** - Tracking de pasos completados
3. **`venture_profiles`** - Perfiles de emprendimientos y empresas
4. **`organization_profiles`** - Perfiles de organizaciones e instituciones
5. **`consumer_profiles`** - Perfiles de consumidores
6. **`user_roles`** - Roles y permisos dinámicos
7. **`profile_change_log`** - Auditoría de cambios

### Triggers:
- `after_user_insert` - Auto-crea perfil y progreso al registrar usuario

### Vistas:
- `v_users_with_progress` - Usuarios con su progreso de registro
- `v_pending_approvals` - Usuarios pendientes de aprobación

---

## Verificar Instalación

```sql
-- Entrar a MySQL
mysql -u root -p sistema_emprendedores_chiquimula

-- Ver tablas nuevas
SHOW TABLES LIKE '%user%';
SHOW TABLES LIKE '%profile%';

-- Ver trigger
SHOW TRIGGERS WHERE `Table` = 'users';

-- Probar vista
SELECT * FROM v_users_with_progress LIMIT 5;
```

---

## Relacionamiento con Tablas Existentes

Las nuevas tablas se relacionan con:
- `municipios_gt` - Para ubicación del usuario (Paso 1)
- `departamentos_gt` - Para ubicación (Paso 1)
- `sectores_economicos` - Para sector del negocio (Paso 2)
- `usuarios` - Tabla de admins que aprueban registros

---

## Archivo en esta carpeta

**`init.sql`** - Schema completo de la base de datos con el sistema de registro progresivo integrado.

---

## Migración de Datos Antiguos (Opcional)

Si tienes datos en la tabla antigua `solicitudes_emprendedor`, puedes migrarlos:

```sql
-- Ejemplo de migración (ajustar según necesidad)
INSERT INTO users (
  email, password_hash, nombre_completo, telefono_whatsapp, member_type, created_at
)
SELECT 
  correo_electronico,
  '$2b$10$defaulthash', -- Reset contraseñas
  nombre_completo,
  telefono,
  CASE tipo_persona
    WHEN 'individual' THEN 'emprendimiento'
    WHEN 'organizacion' THEN 'organizacion'
    WHEN 'entidad' THEN 'institucion'
  END,
  fecha_solicitud
FROM solicitudes_emprendedor
WHERE estado_solicitud = 'aprobada';
```

⚠️ **Nota**: Después de migrar, los usuarios deberán crear nueva contraseña.

---

## Documentación Completa

Ver carpeta `docs/` para arquitectura completa:
- `docs/ARQUITECTURA_REGISTRO_PROGRESIVO.md`
- `docs/API_ENDPOINTS_REGISTRO.md`
- `docs/PLAN_IMPLEMENTACION.md`

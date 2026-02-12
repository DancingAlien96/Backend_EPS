-- =====================================================
-- SCRIPT DE CREACIÓN DE BASE DE DATOS
-- Sistema de Gestión de Información de Emprendedores
-- Departamento de Chiquimula, Guatemala
-- =====================================================

USE sistema_emprendedores_chiquimula;

-- =====================================================
-- TABLA: usuarios
-- Descripción: Almacena los usuarios del sistema (superusuario, administradores y emprendedores)
-- =====================================================
CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre_completo VARCHAR(200) NOT NULL COMMENT 'Nombre completo del usuario del sistema',
    correo_electronico VARCHAR(150) NOT NULL UNIQUE COMMENT 'Email para login, debe ser único',
    contrasena_hash VARCHAR(255) NOT NULL COMMENT 'Contraseña encriptada con bcrypt',
    rol ENUM(
        'superusuario', 
        'administrador', 
        'emprendedor_informal',
        'emprendedor_mipyme',
        'entidad_publica',
        'organizacion_privada',
        'usuario'
    ) NOT NULL DEFAULT 'usuario' COMMENT 'Tipo de usuario: superusuario (dueño sistema), administrador (gestores), emprendedor_informal (sin patente), emprendedor_mipyme (formalizado), entidad_publica (gobierno), organizacion_privada (ONG/fundaciones), usuario (visitantes)',
    tipo_perfil ENUM('emprendedor', 'mipyme', 'entidad_publica', 'organizacion_privada') NULL COMMENT 'Tipo de perfil asociado al usuario',
    institucion VARCHAR(200) NULL COMMENT 'Nombre de la institución a la que pertenece (ej: MINECO, Municipalidad de Chiquimula)',
    telefono VARCHAR(20) NULL COMMENT 'Teléfono de contacto',
    foto_perfil VARCHAR(255) NULL COMMENT 'URL de la foto de perfil en Cloudinary',
    estado ENUM('activo', 'inactivo') NOT NULL DEFAULT 'activo' COMMENT 'Si el usuario puede o no acceder al sistema',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Cuándo se creó este usuario',
    ultimo_acceso TIMESTAMP NULL COMMENT 'Última vez que inició sesión',
    creado_por INT NULL COMMENT 'ID del usuario que creó esta cuenta',
    FOREIGN KEY (creado_por) REFERENCES usuarios(id_usuario) ON DELETE SET NULL,
    INDEX idx_tipo_perfil (tipo_perfil)
) COMMENT='Usuarios del sistema (administradores y emprendedores con autenticación Firebase)';

-- =====================================================
-- TABLA: municipios
-- Descripción: Los 11 municipios del departamento de Chiquimula
-- Catálogo fijo que se usa en varios lugares del sistema
-- =====================================================
CREATE TABLE municipios (
    id_municipio INT AUTO_INCREMENT PRIMARY KEY,
    nombre_municipio VARCHAR(100) NOT NULL UNIQUE COMMENT 'Nombre oficial del municipio',
    descripcion TEXT NULL COMMENT 'Información adicional sobre el municipio (opcional)'
) COMMENT='Catálogo de los 11 municipios de Chiquimula';

-- =====================================================
-- TABLA: departamentos_gt
-- Descripción: Catálogo de los 22 departamentos de Guatemala
-- =====================================================
CREATE TABLE departamentos_gt (
    id_departamento INT AUTO_INCREMENT PRIMARY KEY,
    nombre_departamento VARCHAR(100) NOT NULL UNIQUE COMMENT 'Nombre oficial del departamento'
) COMMENT='Listado de departamentos de Guatemala';

-- Poblado base de departamentos de Guatemala
INSERT INTO departamentos_gt (nombre_departamento) VALUES
('Alta Verapaz'),
('Baja Verapaz'),
('Chimaltenango'),
('Chiquimula'),
('El Progreso'),
('Escuintla'),
('Guatemala'),
('Huehuetenango'),
('Izabal'),
('Jalapa'),
('Jutiapa'),
('Petén'),
('Quetzaltenango'),
('Quiché'),
('Retalhuleu'),
('Sacatepéquez'),
('San Marcos'),
('Santa Rosa'),
('Sololá'),
('Suchitepéquez'),
('Totonicapán'),
('Zacapa');

-- =====================================================
-- TABLA: municipios_gt
-- Descripción: Catálogo completo de municipios de Guatemala (340 municipios)
-- =====================================================
CREATE TABLE municipios_gt (
    id_municipio INT AUTO_INCREMENT PRIMARY KEY,
    nombre_municipio VARCHAR(150) NOT NULL COMMENT 'Nombre oficial del municipio',
    id_departamento INT NOT NULL COMMENT 'Departamento al que pertenece',
    UNIQUE KEY uq_municipio_departamento (nombre_municipio, id_departamento),
    FOREIGN KEY (id_departamento) REFERENCES departamentos_gt(id_departamento) ON DELETE CASCADE
) COMMENT='Catálogo de municipios de Guatemala con referencia a su departamento';

-- Poblado base de municipios por departamento
INSERT INTO municipios_gt (nombre_municipio, id_departamento) VALUES
-- Alta Verapaz (1)
('Cobán', 1),
('Santa Cruz Verapaz', 1),
('San Cristóbal Verapaz', 1),
('Tactic', 1),
('Tamahú', 1),
('Tucurú', 1),
('Panzós', 1),
('Senahú', 1),
('San Pedro Carchá', 1),
('San Juan Chamelco', 1),
('Lanquín', 1),
('Santa María Cahabón', 1),
('Chisec', 1),
('Fray Bartolomé de las Casas', 1),
('Chahal', 1),
('Santa Catarina La Tinta', 1),
('Raxruhá', 1),
-- Baja Verapaz (2)
('Salamá', 2),
('San Miguel Chicaj', 2),
('Rabinal', 2),
('Cubulco', 2),
('Granados', 2),
('Purulhá', 2),
('San Jerónimo', 2),
('Santa Cruz El Chol', 2),
-- Chimaltenango (3)
('Chimaltenango', 3),
('San José Poaquil', 3),
('San Martín Jilotepeque', 3),
('San Juan Comalapa', 3),
('Santa Apolonia', 3),
('Tecpán Guatemala', 3),
('Patzún', 3),
('Pochuta', 3),
('Patzicía', 3),
('Santa Cruz Balanyá', 3),
('Acatenango', 3),
('San Pedro Yepocapa', 3),
('San Andrés Itzapa', 3),
('Parramos', 3),
('Zaragoza', 3),
('El Tejar', 3),
-- Chiquimula (4)
('Chiquimula', 4),
('San José La Arada', 4),
('San Juan Ermita', 4),
('Camotán', 4),
('Jocotán', 4),
('Esquipulas', 4),
('Concepción Las Minas', 4),
('Quezaltepeque', 4),
('Olopa', 4),
('Ipala', 4),
('San Jacinto', 4),
-- El Progreso (5)
('Guastatoya', 5),
('Morazán', 5),
('San Agustín Acasaguastlán', 5),
('San Cristóbal Acasaguastlán', 5),
('El Jícaro', 5),
('Sansare', 5),
('Sanarate', 5),
('San Antonio La Paz', 5),
-- Escuintla (6)
('Escuintla', 6),
('Santa Lucía Cotzumalguapa', 6),
('La Democracia', 6),
('Siquinalá', 6),
('Masagua', 6),
('Tiquisate', 6),
('La Gomera', 6),
('Guanagazapa', 6),
('Puerto San José', 6),
('Iztapa', 6),
('Palín', 6),
('San Vicente Pacaya', 6),
('Nueva Concepción', 6),
('Sipacate', 6),
-- Guatemala (7)
('Guatemala', 7),
('Santa Catarina Pinula', 7),
('San José Pinula', 7),
('San José del Golfo', 7),
('Palencia', 7),
('Chinautla', 7),
('San Pedro Ayampuc', 7),
('Mixco', 7),
('San Pedro Sacatepéquez', 7),
('San Juan Sacatepéquez', 7),
('San Raymundo', 7),
('Chuarrancho', 7),
('Fraijanes', 7),
('Amatitlán', 7),
('Villa Nueva', 7),
('Villa Canales', 7),
('San Miguel Petapa', 7),
-- Huehuetenango (8)
('Huehuetenango', 8),
('Chiantla', 8),
('Malacatancito', 8),
('Cuilco', 8),
('Nentón', 8),
('San Pedro Necta', 8),
('Jacaltenango', 8),
('Soloma', 8),
('San Ildefonso Ixtahuacán', 8),
('Santa Bárbara', 8),
('La Libertad', 8),
('La Democracia', 8),
('San Miguel Acatán', 8),
('San Rafael La Independencia', 8),
('Todos Santos Cuchumatán', 8),
('San Juan Atitán', 8),
('Santa Eulalia', 8),
('San Mateo Ixtatán', 8),
('Colotenango', 8),
('San Sebastián Huehuetenango', 8),
('Tectitán', 8),
('Concepción Huista', 8),
('San Juan Ixcoy', 8),
('San Antonio Huista', 8),
('San Sebastián Coatán', 8),
('Santa Cruz Barillas', 8),
('Aguacatán', 8),
('San Rafael Petzal', 8),
('San Gaspar Ixchil', 8),
('Santiago Chimaltenango', 8),
('Santa Ana Huista', 8),
('Unión Cantinil', 8),
-- Izabal (9)
('Puerto Barrios', 9),
('Livingston', 9),
('El Estor', 9),
('Morales', 9),
('Los Amates', 9),
-- Jalapa (10)
('Jalapa', 10),
('San Pedro Pinula', 10),
('San Luis Jilotepeque', 10),
('San Manuel Chaparrón', 10),
('San Carlos Alzatate', 10),
('Monjas', 10),
('Mataquescuintla', 10),
-- Jutiapa (11)
('Jutiapa', 11),
('El Progreso', 11),
('Santa Catarina Mita', 11),
('Agua Blanca', 11),
('Asunción Mita', 11),
('Yupiltepeque', 11),
('Atescatempa', 11),
('Jerez', 11),
('El Adelanto', 11),
('Zapotitlán', 11),
('Jalpatagua', 11),
('Comapa', 11),
('Quesada', 11),
('Conguaco', 11),
('Moyuta', 11),
('Pasaco', 11),
('San José Acatempa', 11),
-- Petén (12)
('Flores', 12),
('San José', 12),
('San Benito', 12),
('San Andrés', 12),
('La Libertad', 12),
('San Francisco', 12),
('Santa Ana', 12),
('Dolores', 12),
('San Luis', 12),
('Sayaxché', 12),
('Melchor de Mencos', 12),
('Poptún', 12),
('Las Cruces', 12),
('El Chal', 12),
-- Quetzaltenango (13)
('Quetzaltenango', 13),
('Salcajá', 13),
('Olintepeque', 13),
('San Carlos Sija', 13),
('Sibilia', 13),
('Cabricán', 13),
('Cajolá', 13),
('San Miguel Sigüilá', 13),
('Ostuncalco', 13),
('San Mateo', 13),
('Concepción Chiquirichapa', 13),
('San Martín Sacatepéquez', 13),
('Almolonga', 13),
('Cantel', 13),
('Huitán', 13),
('Zunil', 13),
('Colomba', 13),
('San Francisco La Unión', 13),
('El Palmar', 13),
('Coatepeque', 13),
('Génova', 13),
('Flores Costa Cuca', 13),
('La Esperanza', 13),
('Palestina de Los Altos', 13),
-- Quiché (14)
('Santa Cruz del Quiché', 14),
('Chiché', 14),
('Chinique', 14),
('Zacualpa', 14),
('Chajul', 14),
('Santo Tomás Chichicastenango', 14),
('Patzité', 14),
('San Antonio Ilotenango', 14),
('San Pedro Jocopilas', 14),
('Cunén', 14),
('San Juan Cotzal', 14),
('Joyabaj', 14),
('Nebaj', 14),
('San Andrés Sajcabajá', 14),
('Uspantán', 14),
('Sacapulas', 14),
('San Bartolomé Jocotenango', 14),
('Canillá', 14),
('Chicamán', 14),
('Ixcán', 14),
('Playa Grande', 14),
-- Retalhuleu (15)
('Retalhuleu', 15),
('San Sebastián', 15),
('Santa Cruz Muluá', 15),
('San Martín Zapotitlán', 15),
('San Felipe', 15),
('San Andrés Villa Seca', 15),
('Champerico', 15),
('Nuevo San Carlos', 15),
('El Asintal', 15),
-- Sacatepéquez (16)
('Antigua Guatemala', 16),
('Jocotenango', 16),
('Pastores', 16),
('Sumpango', 16),
('Santiago Sacatepéquez', 16),
('San Bartolomé Milpas Altas', 16),
('San Lucas Sacatepéquez', 16),
('Santa Lucía Milpas Altas', 16),
('Magdalena Milpas Altas', 16),
('Santa María de Jesús', 16),
('Ciudad Vieja', 16),
('San Miguel Dueñas', 16),
('Alotenango', 16),
('San Antonio Aguas Calientes', 16),
('Santa Catarina Barahona', 16),
('Santo Domingo Xenacoj', 16),
-- San Marcos (17)
('San Marcos', 17),
('Ayutla', 17),
('Catarina', 17),
('Comitancillo', 17),
('Concepción Tutuapa', 17),
('El Quetzal', 17),
('El Rodeo', 17),
('El Tumbador', 17),
('Ixchiguán', 17),
('La Reforma', 17),
('Malacatán', 17),
('Nuevo Progreso', 17),
('Ocós', 17),
('Pajapita', 17),
('Río Blanco', 17),
('San Antonio Sacatepéquez', 17),
('San Cristóbal Cucho', 17),
('San José Ojetenam', 17),
('San Lorenzo', 17),
('San Miguel Ixtahuacán', 17),
('San Pablo', 17),
('San Pedro Sacatepéquez', 17),
('San Rafael Pie de la Cuesta', 17),
('Sibinal', 17),
('Sipacapa', 17),
('Tacaná', 17),
('Tajumulco', 17),
('Tejutla', 17),
('Esquipulas Palo Gordo', 17),
-- Santa Rosa (18)
('Cuilapa', 18),
('Barberena', 18),
('Santa Rosa de Lima', 18),
('Casillas', 18),
('San Rafael Las Flores', 18),
('Oratorio', 18),
('San Juan Tecuaco', 18),
('Chiquimulilla', 18),
('Taxisco', 18),
('Santa María Ixhuatán', 18),
('Guazacapán', 18),
('Santa Cruz Naranjo', 18),
('Pueblo Nuevo Viñas', 18),
('Nueva Santa Rosa', 18),
-- Sololá (19)
('Sololá', 19),
('San José Chacayá', 19),
('Santa María Visitación', 19),
('Santa Lucía Utatlán', 19),
('Nahualá', 19),
('Santa Catarina Ixtahuacán', 19),
('Santa Clara La Laguna', 19),
('Concepción', 19),
('San Andrés Semetabaj', 19),
('Panajachel', 19),
('Santa Catarina Palopó', 19),
('San Antonio Palopó', 19),
('San Lucas Tolimán', 19),
('Santa Cruz La Laguna', 19),
('San Pablo La Laguna', 19),
('San Marcos La Laguna', 19),
('San Juan La Laguna', 19),
('San Pedro La Laguna', 19),
('Santiago Atitlán', 19),
-- Suchitepéquez (20)
('Mazatenango', 20),
('Cuyotenango', 20),
('San Francisco Zapotitlán', 20),
('San Bernardino', 20),
('San José El Ídolo', 20),
('Santo Domingo Suchitepéquez', 20),
('San Lorenzo', 20),
('Samayac', 20),
('San Pablo Jocopilas', 20),
('San Antonio Suchitepéquez', 20),
('San Miguel Panán', 20),
('San Gabriel', 20),
('Chicacao', 20),
('Patulul', 20),
('Santa Bárbara', 20),
('San Juan Bautista', 20),
('Santo Tomás La Unión', 20),
('Pueblo Nuevo', 20),
('Río Bravo', 20),
('Zunilito', 20),
('Nueva Santa Rosa', 20),
-- Totonicapán (21)
('Totonicapán', 21),
('San Cristóbal Totonicapán', 21),
('San Francisco El Alto', 21),
('San Andrés Xecul', 21),
('Momostenango', 21),
('Santa María Chiquimula', 21),
('Santa Lucía La Reforma', 21),
('San Bartolo', 21),
-- Zacapa (22)
('Zacapa', 22),
('Estanzuela', 22),
('Río Hondo', 22),
('Gualán', 22),
('Teculután', 22),
('Usumatlán', 22),
('Cabañas', 22),
('San Diego', 22),
('La Unión', 22),
('Huité', 22),
('San Jorge', 22);

-- =====================================================
-- TABLA: sectores_economicos
-- Descripción: Categorías de negocios (artesanías, agricultura, servicios, etc.)
-- Se usa para clasificar los emprendimientos
-- =====================================================
CREATE TABLE sectores_economicos (
    id_sector INT AUTO_INCREMENT PRIMARY KEY,
    nombre_sector VARCHAR(100) NOT NULL UNIQUE COMMENT 'Nombre del sector económico',
    descripcion TEXT NULL COMMENT 'Descripción del tipo de negocios que incluye',
    icono VARCHAR(50) NULL COMMENT 'Nombre del ícono para mostrar en el frontend (opcional)'
) COMMENT='Categorías de emprendimientos (agricultura, artesanías, tecnología, etc.)';

-- =====================================================
-- TABLA: organizaciones
-- Descripción: Organizaciones o asociaciones de emprendedores
-- Grupos formales de emprendedores que trabajan juntos
-- =====================================================
CREATE TABLE organizaciones (
    id_organizacion INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL COMMENT 'Nombre de la organización',
    telefono VARCHAR(20) NULL COMMENT 'Teléfono de contacto',
    direccion TEXT NULL COMMENT 'Dirección física de la organización',
    id_municipio INT NOT NULL COMMENT 'Municipio donde se ubica',
    departamento VARCHAR(100) NOT NULL DEFAULT 'Chiquimula' COMMENT 'Departamento (por defecto Chiquimula)',
    id_sector INT NULL COMMENT 'Sector económico al que pertenece',
    descripcion_producto_servicios TEXT NULL COMMENT 'Descripción de productos o servicios que ofrece',
    numero_asociados INT DEFAULT 0 COMMENT 'Número de miembros/asociados',
    correo_electronico VARCHAR(150) NULL COMMENT 'Correo de contacto',
    sitio_web VARCHAR(255) NULL COMMENT 'Sitio web o redes sociales',
    fecha_constitucion DATE NULL COMMENT 'Fecha de constitución legal',
    registro_legal VARCHAR(100) NULL COMMENT 'Número de registro o personería jurídica',
    estado ENUM('activa', 'inactiva') NOT NULL DEFAULT 'activa' COMMENT 'Estado de la organización',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    registrado_por INT NOT NULL COMMENT 'Usuario que registró la organización',
    ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_municipio) REFERENCES municipios(id_municipio) ON DELETE RESTRICT,
    FOREIGN KEY (id_sector) REFERENCES sectores_economicos(id_sector) ON DELETE SET NULL,
    FOREIGN KEY (registrado_por) REFERENCES usuarios(id_usuario) ON DELETE RESTRICT
) COMMENT='Organizaciones o asociaciones de emprendedores';

-- =====================================================
-- TABLA: entidades
-- Descripción: Entidades que brindan apoyo al sector empresarial
-- Instituciones gubernamentales, ONGs, etc. que apoyan emprendedores
-- =====================================================
CREATE TABLE entidades (
    id_entidad INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL COMMENT 'Nombre de la entidad',
    responsable VARCHAR(200) NULL COMMENT 'Nombre del responsable o contacto principal',
    correo_electronico VARCHAR(150) NOT NULL COMMENT 'Correo electrónico de contacto',
    telefono VARCHAR(20) NULL COMMENT 'Teléfono de contacto',
    id_municipio INT NULL COMMENT 'Municipio donde se ubica',
    departamento VARCHAR(100) NOT NULL DEFAULT 'Chiquimula' COMMENT 'Departamento',
    direccion TEXT NULL COMMENT 'Dirección física',
    descripcion_programas_proyectos TEXT NULL COMMENT 'Descripción de programas y proyectos de apoyo al sector empresarial',
    tipo_entidad ENUM('gubernamental', 'ong', 'privada', 'academica', 'otra') NULL COMMENT 'Tipo de entidad',
    sitio_web VARCHAR(255) NULL COMMENT 'Sitio web oficial',
    estado ENUM('activa', 'inactiva') NOT NULL DEFAULT 'activa',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    registrado_por INT NOT NULL COMMENT 'Usuario que registró la entidad',
    ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_municipio) REFERENCES municipios(id_municipio) ON DELETE SET NULL,
    FOREIGN KEY (registrado_por) REFERENCES usuarios(id_usuario) ON DELETE RESTRICT
) COMMENT='Entidades que brindan apoyo al sector empresarial';

-- =====================================================
-- TABLA: emprendedores
-- Descripción: Información personal y del emprendimiento principal de cada emprendedor registrado
-- Pueden tener cuenta activa para acceder al sistema con Firebase Auth
-- =====================================================
CREATE TABLE emprendedores (
    id_emprendedor INT AUTO_INCREMENT PRIMARY KEY,
    tipo_emprendedor ENUM('informal', 'mipyme') NOT NULL DEFAULT 'informal' COMMENT 'Tipo: informal (sin patente) o mipyme (formalizado)',
    nombre_completo VARCHAR(200) NOT NULL COMMENT 'Nombre completo del emprendedor',
    dpi VARCHAR(13) NULL UNIQUE COMMENT 'Documento Personal de Identificación (13 dígitos)',
    fecha_nacimiento DATE NULL COMMENT 'Fecha de nacimiento para calcular edad',
    genero ENUM('masculino', 'femenino', 'otro') NULL COMMENT 'Género del emprendedor',
    telefono VARCHAR(20) NULL COMMENT 'Número de teléfono principal',
    telefono_secundario VARCHAR(20) NULL COMMENT 'Teléfono alternativo (opcional)',
    correo_electronico VARCHAR(150) NULL COMMENT 'Email de contacto (opcional)',
    firebase_uid VARCHAR(128) NULL UNIQUE COMMENT 'UID de Firebase Auth',
    tiene_cuenta BOOLEAN DEFAULT FALSE COMMENT 'Indica si el emprendedor tiene cuenta activa',
    cuenta_activa BOOLEAN DEFAULT TRUE COMMENT 'Si la cuenta está habilitada para login',
    fecha_ultimo_acceso TIMESTAMP NULL COMMENT 'Última vez que inició sesión',
    id_municipio INT NULL COMMENT 'Municipio donde reside',
    direccion_detallada TEXT NULL COMMENT 'Dirección completa (aldea, colonia, etc.)',
    nombre_emprendimiento VARCHAR(200) NULL COMMENT 'Nombre comercial del emprendimiento principal',
    razon_social VARCHAR(255) NULL COMMENT 'Razón social registrada en SAT (solo MIPYME)',
    nit VARCHAR(20) NULL COMMENT 'NIT del negocio (solo MIPYME)',
    descripcion_emprendimiento TEXT NULL COMMENT 'Descripción breve del negocio que opera',
    id_sector INT NULL COMMENT 'Sector económico del emprendimiento',
    id_departamento_emprendimiento INT NULL COMMENT 'Departamento donde opera el negocio',
    fase_emprendimiento ENUM('idea', 'puesta_en_marcha_o_mayor_de_1_ano', 'aceleracion') NULL COMMENT 'Etapa actual del proyecto: idea, puesta en marcha o mayor de 1 año, aceleración',
    fecha_inicio_emprendimiento DATE NULL COMMENT 'Fecha en la que inició operaciones el negocio',
    fecha_constitucion DATE NULL COMMENT 'Fecha de constitución legal del negocio (solo MIPYME)',
    numero_empleados INT NULL DEFAULT 0 COMMENT 'Número de personas que colaboran en el negocio',
    facturacion_anual_aproximada DECIMAL(15,2) NULL COMMENT 'Facturación anual en quetzales (solo MIPYME)',
    categoria_mipyme ENUM('micro', 'pequena', 'mediana') NULL COMMENT 'Categoría según tamaño (solo MIPYME)',
    formalizacion_estado ENUM('formal', 'informal') NULL DEFAULT 'informal' COMMENT 'Estado de formalización declarado',
    tiene_patente BOOLEAN DEFAULT FALSE COMMENT 'Indica si cuenta con patente de comercio',
    numero_patente VARCHAR(50) NULL COMMENT 'Número de patente de comercio (solo MIPYME)',
    patente_archivo VARCHAR(255) NULL COMMENT 'Ruta o nombre de archivo de la patente cargada',
    inscrito_sat BOOLEAN DEFAULT FALSE COMMENT 'Indica si está inscrito en la SAT',
    numero_registro_comercial VARCHAR(100) NULL COMMENT 'Número de registro comercial (si aplica)',
    rtu_pdf VARCHAR(255) NULL COMMENT 'URL del archivo RTU en formato PDF',
    telefono_negocio VARCHAR(20) NULL COMMENT 'Teléfono de contacto del negocio',
    correo_negocio VARCHAR(150) NULL COMMENT 'Correo del negocio',
    sitio_web VARCHAR(255) NULL COMMENT 'Sitio web o red social del negocio',
    logotipo_negocio VARCHAR(255) NULL COMMENT 'Ruta o URL del logotipo del negocio',
    catalogo_pdf VARCHAR(255) NULL COMMENT 'Ruta o URL de un catálogo en PDF',
    necesidades_detectadas TEXT NULL COMMENT 'Principales necesidades identificadas durante el acompañamiento',
    foto_perfil VARCHAR(255) NULL COMMENT 'Ruta de la foto del emprendedor',
    observaciones TEXT NULL COMMENT 'Notas adicionales del administrador',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Cuándo se registró en el sistema',
    registrado_por INT NOT NULL COMMENT 'ID del administrador que lo registró',
    ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_correo_electronico (correo_electronico),
    INDEX idx_tipo_emprendedor (tipo_emprendedor),
    INDEX idx_nit (nit),
    INDEX idx_firebase_uid (firebase_uid),
    FOREIGN KEY (id_municipio) REFERENCES municipios_gt(id_municipio) ON DELETE RESTRICT,
    FOREIGN KEY (id_departamento_emprendimiento) REFERENCES departamentos_gt(id_departamento) ON DELETE SET NULL,
    FOREIGN KEY (id_sector) REFERENCES sectores_economicos(id_sector) ON DELETE SET NULL,
    FOREIGN KEY (registrado_por) REFERENCES usuarios(id_usuario) ON DELETE RESTRICT
) COMMENT='Datos personales y del emprendimiento principal de cada emprendedor';

-- =====================================================
-- TABLA: programas_apoyo
-- Descripción: Programas, convocatorias o capacitaciones ofrecidas por instituciones
-- Los administradores publican estos programas
-- =====================================================
CREATE TABLE programas_apoyo (
    id_programa INT AUTO_INCREMENT PRIMARY KEY,
    nombre_programa VARCHAR(200) NOT NULL COMMENT 'Título del programa o convocatoria',
    descripcion TEXT NOT NULL COMMENT 'Descripción completa del programa',
    institucion_responsable VARCHAR(200) NOT NULL COMMENT 'Quién ofrece el programa (MINECO, Municipalidad, etc.)',
    tipo_apoyo ENUM('capacitacion', 'financiamiento', 'asesoria', 'otro') NOT NULL COMMENT 'Tipo de apoyo que ofrece',
    id_sector INT NULL COMMENT 'Sector específico al que va dirigido (NULL = todos)',
    requisitos TEXT NULL COMMENT 'Requisitos para participar',
    beneficios TEXT NULL COMMENT 'Qué se obtiene al participar',
    fecha_inicio DATE NOT NULL COMMENT 'Cuándo inicia el programa',
    fecha_cierre DATE NOT NULL COMMENT 'Fecha límite para aplicar',
    cupo_maximo INT NULL COMMENT 'Número máximo de participantes (NULL = sin límite)',
    documento_adjunto VARCHAR(255) NULL COMMENT 'Ruta de documento PDF con más información',
    estado ENUM('abierto', 'cerrado', 'finalizado') NOT NULL DEFAULT 'abierto' COMMENT 'Estado actual del programa',
    fecha_publicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    publicado_por INT NOT NULL COMMENT 'Administrador que publicó el programa',
    FOREIGN KEY (id_sector) REFERENCES sectores_economicos(id_sector) ON DELETE SET NULL,
    FOREIGN KEY (publicado_por) REFERENCES usuarios(id_usuario) ON DELETE RESTRICT
) COMMENT='Programas y convocatorias publicadas por instituciones de apoyo';

-- =====================================================
-- TABLA: solicitudes_emprendedor
-- Descripción: Solicitudes de personas que quieren aparecer en el directorio
-- Los visitantes llenan un formulario y queda pendiente de aprobación
-- =====================================================
CREATE TABLE solicitudes_emprendedor (
    id_solicitud INT AUTO_INCREMENT PRIMARY KEY,
    -- Tipo de persona (si es individual, organización o entidad)
    tipo_persona ENUM('individual', 'organizacion', 'entidad') NULL COMMENT 'Tipo de persona que solicita',
    -- Datos personales del solicitante
    nombre_completo VARCHAR(200) NOT NULL,
    dpi VARCHAR(13) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    genero ENUM('masculino', 'femenino', 'otro') NULL,
    telefono VARCHAR(20) NOT NULL,
    telefono_secundario VARCHAR(20) NULL COMMENT 'Teléfono alternativo (opcional)',
    correo_electronico VARCHAR(150) NULL,
    id_municipio INT NOT NULL,
    id_departamento_emprendimiento INT NULL COMMENT 'Departamento donde opera el negocio',
    direccion_detallada TEXT NULL COMMENT 'Dirección completa (aldea, colonia, etc.)',
    observaciones TEXT NULL COMMENT 'Observaciones adicionales del solicitante',
    foto_perfil VARCHAR(255) NULL COMMENT 'URL de la foto del solicitante',
    -- Datos del emprendimiento
    nombre_emprendimiento VARCHAR(200) NOT NULL,
    descripcion_emprendimiento TEXT NOT NULL,
    id_sector INT NOT NULL,
    fase_emprendimiento ENUM('idea', 'puesta_en_marcha_o_mayor_de_1_ano', 'aceleracion') NOT NULL,
    fecha_inicio_emprendimiento DATE NULL COMMENT 'Fecha en la que inició operaciones',
    numero_empleados INT NULL COMMENT 'Número de empleados',
    -- Datos de formalización
    formalizacion_estado ENUM('formal', 'informal') NULL DEFAULT 'informal' COMMENT 'Estado de formalización del negocio',
    tiene_patente BOOLEAN DEFAULT FALSE COMMENT 'Indica si cuenta con patente de comercio',
    patente_archivo VARCHAR(255) NULL COMMENT 'Ruta o nombre de archivo de la patente cargada',
    inscrito_sat BOOLEAN DEFAULT FALSE COMMENT 'Indica si está inscrito en la SAT',
    numero_registro_comercial VARCHAR(100) NULL COMMENT 'Número de registro comercial (si aplica)',
    rtu_pdf VARCHAR(255) NULL COMMENT 'URL del archivo RTU en formato PDF',
    -- Datos adicionales del negocio
    telefono_negocio VARCHAR(20) NULL COMMENT 'Teléfono de contacto del negocio',
    correo_negocio VARCHAR(150) NULL COMMENT 'Correo del negocio',
    sitio_web VARCHAR(255) NULL COMMENT 'Sitio web o red social del negocio',
    logotipo_negocio VARCHAR(255) NULL COMMENT 'URL del logotipo del negocio',
    catalogo_pdf VARCHAR(255) NULL COMMENT 'URL de un catálogo en PDF',
    necesidades_detectadas TEXT NULL COMMENT 'Principales necesidades identificadas',
    -- Control de la solicitud
    estado_solicitud ENUM('pendiente', 'aprobada', 'rechazada') NOT NULL DEFAULT 'pendiente' COMMENT 'Estado de la solicitud',
    motivo_rechazo TEXT NULL COMMENT 'Razón por la que se rechazó (si aplica)',
    fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Cuándo se envió la solicitud',
    fecha_revision TIMESTAMP NULL COMMENT 'Cuándo fue revisada',
    revisado_por INT NULL COMMENT 'Administrador que revisó la solicitud',
    id_emprendedor_creado INT NULL COMMENT 'Si fue aprobada, ID del emprendedor creado',
    id_organizacion_creada INT NULL COMMENT 'Si fue aprobada como organización, ID de la organización creada',
    id_entidad_creada INT NULL COMMENT 'Si fue aprobada como entidad, ID de la entidad creada',
    FOREIGN KEY (id_municipio) REFERENCES municipios(id_municipio) ON DELETE RESTRICT,
    FOREIGN KEY (id_departamento_emprendimiento) REFERENCES departamentos_gt(id_departamento) ON DELETE SET NULL,
    FOREIGN KEY (id_sector) REFERENCES sectores_economicos(id_sector) ON DELETE RESTRICT,
    FOREIGN KEY (revisado_por) REFERENCES usuarios(id_usuario) ON DELETE SET NULL,
    FOREIGN KEY (id_emprendedor_creado) REFERENCES emprendedores(id_emprendedor) ON DELETE SET NULL,
    FOREIGN KEY (id_organizacion_creada) REFERENCES organizaciones(id_organizacion) ON DELETE SET NULL,
    FOREIGN KEY (id_entidad_creada) REFERENCES entidades(id_entidad) ON DELETE SET NULL
) COMMENT='Solicitudes de personas que quieren aparecer como emprendedores';

-- =====================================================
-- TABLA: postulaciones_programa
-- Descripción: Registro de emprendedores que se postulan a programas
-- NO es automático, los administradores los postulan
-- =====================================================
CREATE TABLE postulaciones_programa (
    id_postulacion INT AUTO_INCREMENT PRIMARY KEY,
    id_programa INT NOT NULL COMMENT 'A qué programa se postula',
    id_emprendedor INT NOT NULL COMMENT 'Quién se postula',
    estado_postulacion ENUM('postulado', 'en_revision', 'seleccionado', 'no_seleccionado') NOT NULL DEFAULT 'postulado',
    fecha_postulacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    observaciones TEXT NULL COMMENT 'Notas del administrador sobre la postulación',
    postulado_por INT NOT NULL COMMENT 'Administrador que realizó la postulación',
    FOREIGN KEY (id_programa) REFERENCES programas_apoyo(id_programa) ON DELETE CASCADE,
    FOREIGN KEY (id_emprendedor) REFERENCES emprendedores(id_emprendedor) ON DELETE CASCADE,
    FOREIGN KEY (postulado_por) REFERENCES usuarios(id_usuario) ON DELETE RESTRICT,
    UNIQUE KEY unique_postulacion (id_programa, id_emprendedor) COMMENT 'Un emprendedor solo puede postularse una vez al mismo programa'
) COMMENT='Registro de emprendedores postulados a programas de apoyo';

-- =====================================================
-- TABLA: eventos
-- Descripción: Eventos, talleres, ferias donde participan emprendedores
-- Publicados por administradores
-- =====================================================
CREATE TABLE eventos (
    id_evento INT AUTO_INCREMENT PRIMARY KEY,
    nombre_evento VARCHAR(200) NOT NULL,
    descripcion TEXT NOT NULL,
    tipo_evento ENUM('taller', 'capacitacion', 'feria', 'networking', 'otro') NOT NULL,
    fecha_evento DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NULL,
    lugar VARCHAR(255) NOT NULL COMMENT 'Dónde se realizará el evento',
    id_municipio INT NULL COMMENT 'Municipio donde se realiza',
    cupo_maximo INT NULL,
    requiere_inscripcion BOOLEAN DEFAULT TRUE,
    contacto_responsable VARCHAR(200) NULL,
    telefono_contacto VARCHAR(20) NULL,
    imagen_evento VARCHAR(255) NULL COMMENT 'Banner o imagen del evento',
    estado ENUM('proximo', 'en_curso', 'finalizado', 'cancelado') NOT NULL DEFAULT 'proximo',
    fecha_publicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    publicado_por INT NOT NULL,
    FOREIGN KEY (id_municipio) REFERENCES municipios(id_municipio) ON DELETE SET NULL,
    FOREIGN KEY (publicado_por) REFERENCES usuarios(id_usuario) ON DELETE RESTRICT
) COMMENT='Eventos y actividades para emprendedores';

-- =====================================================
-- TABLA: inscripciones_evento
-- Descripción: Registro de emprendedores inscritos a eventos
-- =====================================================
CREATE TABLE inscripciones_evento (
    id_inscripcion INT AUTO_INCREMENT PRIMARY KEY,
    id_evento INT NOT NULL,
    id_emprendedor INT NOT NULL,
    estado_inscripcion ENUM('inscrito', 'asistio', 'no_asistio', 'cancelado') NOT NULL DEFAULT 'inscrito',
    fecha_inscripcion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notas TEXT NULL,
    FOREIGN KEY (id_evento) REFERENCES eventos(id_evento) ON DELETE CASCADE,
    FOREIGN KEY (id_emprendedor) REFERENCES emprendedores(id_emprendedor) ON DELETE CASCADE,
    UNIQUE KEY unique_inscripcion (id_evento, id_emprendedor)
) COMMENT='Emprendedores inscritos a eventos';

-- =====================================================
-- TABLA: noticias
-- Descripción: Noticias o historias de éxito de emprendedores
-- Para mostrar en la sección de noticias del sitio
-- =====================================================
CREATE TABLE noticias (
    id_noticia INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    contenido TEXT NOT NULL,
    resumen VARCHAR(500) NULL COMMENT 'Resumen corto para mostrar en listados',
    id_emprendedor INT NULL COMMENT 'Emprendedor relacionado con la noticia (opcional)',
    imagen_principal VARCHAR(255) NULL,
    autor VARCHAR(200) NULL COMMENT 'Quién escribió la noticia',
    fecha_publicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('borrador', 'publicado', 'archivado') NOT NULL DEFAULT 'borrador',
    publicado_por INT NOT NULL,
    FOREIGN KEY (id_emprendedor) REFERENCES emprendedores(id_emprendedor) ON DELETE SET NULL,
    FOREIGN KEY (publicado_por) REFERENCES usuarios(id_usuario) ON DELETE RESTRICT
) COMMENT='Noticias y historias de éxito para el sitio web';

-- =====================================================
-- TABLA: mensajes_contacto
-- Descripción: Mensajes enviados desde el formulario de contacto del sitio
-- Para que visitantes puedan contactar a administradores
-- =====================================================
CREATE TABLE mensajes_contacto (
    id_mensaje INT AUTO_INCREMENT PRIMARY KEY,
    nombre_remitente VARCHAR(200) NOT NULL,
    correo_remitente VARCHAR(150) NOT NULL,
    telefono_remitente VARCHAR(20) NULL,
    asunto VARCHAR(200) NOT NULL,
    mensaje TEXT NOT NULL,
    estado ENUM('nuevo', 'leido', 'respondido') NOT NULL DEFAULT 'nuevo',
    fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_lectura TIMESTAMP NULL,
    notas_respuesta TEXT NULL COMMENT 'Notas internas sobre la respuesta dada'
) COMMENT='Mensajes del formulario de contacto del sitio';

-- =====================================================
-- TABLA: logs_actividad
-- Descripción: Registro de acciones importantes en el sistema
-- Para auditoría y seguimiento
-- =====================================================
CREATE TABLE logs_actividad (
    id_log INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NULL COMMENT 'Usuario que realizó la acción',
    tipo_accion VARCHAR(100) NOT NULL COMMENT 'crear_emprendedor, editar_programa, aprobar_solicitud, etc.',
    tabla_afectada VARCHAR(100) NULL COMMENT 'Nombre de la tabla donde se hizo el cambio',
    id_registro_afectado INT NULL COMMENT 'ID del registro que se modificó',
    descripcion TEXT NULL COMMENT 'Descripción detallada de la acción',
    ip_usuario VARCHAR(45) NULL COMMENT 'Dirección IP desde donde se hizo',
    fecha_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE SET NULL
) COMMENT='Registro de actividad del sistema para auditoría';

-- =====================================================
-- SISTEMA DE SEGUIMIENTO DE EMPRENDEDORES
-- =====================================================

-- =====================================================
-- TABLA: tipos_seguimiento
-- Descripción: Catálogo de tipos de actividad de seguimiento
-- Ejemplos: Visita de Asesoría, Seguimiento de Necesidades, Registro Inicial, etc.
-- =====================================================
CREATE TABLE tipos_seguimiento (
    id_tipo_seguimiento INT AUTO_INCREMENT PRIMARY KEY,
    nombre_tipo VARCHAR(100) NOT NULL UNIQUE COMMENT 'Ej: Visita de Asesoría, Seguimiento de Necesidades, Llamada de Seguimiento',
    descripcion TEXT NULL,
    color_etiqueta VARCHAR(7) NULL COMMENT 'Color hex para mostrar en timeline (#4A90E2)',
    icono VARCHAR(50) NULL
) COMMENT='Catálogo de tipos de seguimiento';

-- =====================================================
-- TABLA: historial_seguimiento
-- Descripción: Timeline/historial de todas las actividades con emprendedores
-- Similar al ejemplo: "Visita de Asesoría", "Seguimiento de Necesidades", "Registro Inicial"
-- =====================================================
CREATE TABLE historial_seguimiento (
    id_seguimiento INT AUTO_INCREMENT PRIMARY KEY,
    id_emprendedor INT NOT NULL COMMENT 'Emprendedor al que se le hace seguimiento',
    id_tipo_seguimiento INT NOT NULL COMMENT 'Tipo de actividad (Visita de Asesoría, Seguimiento, etc.)',
    fecha_seguimiento DATE NOT NULL COMMENT 'Fecha de la actividad',
    titulo VARCHAR(200) NOT NULL COMMENT 'Título de la actividad (ej: "Visita de Asesoría")',
    descripcion TEXT NOT NULL COMMENT 'Descripción de lo realizado (ej: "Se revisó el avance en la fase de Mercadotecnia...")',
    notas TEXT NULL COMMENT 'Notas adicionales o resultados',
    archivos_adjuntos TEXT NULL COMMENT 'JSON con rutas de archivos (fotos, documentos)',
    registrado_por INT NOT NULL COMMENT 'Usuario del sistema que registró la actividad',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Cuándo se registró en el sistema',
    FOREIGN KEY (id_emprendedor) REFERENCES emprendedores(id_emprendedor) ON DELETE CASCADE,
    FOREIGN KEY (id_tipo_seguimiento) REFERENCES tipos_seguimiento(id_tipo_seguimiento) ON DELETE RESTRICT,
    FOREIGN KEY (registrado_por) REFERENCES usuarios(id_usuario) ON DELETE RESTRICT,
    INDEX idx_fecha_seguimiento (fecha_seguimiento DESC),
    INDEX idx_emprendedor_fecha (id_emprendedor, fecha_seguimiento DESC)
) COMMENT='Historial/timeline de seguimiento de emprendedores';

-- =====================================================
-- TABLA: necesidades_detectadas
-- Descripción: Necesidades identificadas durante el seguimiento
-- Para dar seguimiento a problemas/necesidades y su resolución
-- =====================================================
CREATE TABLE necesidades_detectadas (
    id_necesidad INT AUTO_INCREMENT PRIMARY KEY,
    id_emprendedor INT NOT NULL,
    id_seguimiento INT NULL COMMENT 'Seguimiento donde se detectó (puede ser NULL)',
    tipo_necesidad ENUM('capacitacion', 'financiamiento', 'materia_prima', 'equipo', 'espacio_fisico', 'asesoria_tecnica', 'legalizacion', 'marketing', 'otro') NOT NULL,
    titulo_necesidad VARCHAR(200) NOT NULL,
    descripcion TEXT NOT NULL COMMENT 'Descripción detallada de la necesidad',
    prioridad ENUM('baja', 'media', 'alta', 'urgente') NOT NULL DEFAULT 'media',
    estado_necesidad ENUM('identificada', 'en_gestion', 'resuelta', 'no_resuelta') NOT NULL DEFAULT 'identificada',
    fecha_identificacion DATE NOT NULL,
    fecha_resolucion DATE NULL COMMENT 'Cuándo se resolvió',
    solucion_aplicada TEXT NULL COMMENT 'Cómo se resolvió la necesidad',
    costo_estimado DECIMAL(10, 2) NULL COMMENT 'Costo estimado de resolver la necesidad',
    responsable_gestion INT NULL COMMENT 'Usuario responsable de gestionar la necesidad',
    notas TEXT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_emprendedor) REFERENCES emprendedores(id_emprendedor) ON DELETE CASCADE,
    FOREIGN KEY (id_seguimiento) REFERENCES historial_seguimiento(id_seguimiento) ON DELETE SET NULL,
    FOREIGN KEY (responsable_gestion) REFERENCES usuarios(id_usuario) ON DELETE SET NULL,
    INDEX idx_estado (estado_necesidad),
    INDEX idx_prioridad (prioridad)
) COMMENT='Necesidades detectadas durante el seguimiento';


CREATE TABLE documentos_emprendedor (
    id_documento INT AUTO_INCREMENT PRIMARY KEY,
    id_emprendedor INT NOT NULL,
    nombre_documento VARCHAR(200) NOT NULL,
    tipo_documento ENUM('contrato', 'certificado', 'permiso', 'licencia', 'acta', 'otro') NOT NULL,
    descripcion TEXT NULL,
    ruta_archivo VARCHAR(255) NOT NULL COMMENT 'Ubicación del archivo en el servidor',
    tamaño_archivo INT NULL COMMENT 'Tamaño en bytes',
    tipo_mime VARCHAR(100) NULL COMMENT 'Tipo MIME del archivo',
    fecha_emision DATE NULL COMMENT 'Fecha del documento',
    fecha_vencimiento DATE NULL COMMENT 'Si el documento expira',
    estado_documento ENUM('vigente', 'por_vencer', 'vencido', 'anulado') NOT NULL DEFAULT 'vigente',
    confidencial BOOLEAN DEFAULT FALSE COMMENT 'Si es un documento sensible',
    subido_por INT NOT NULL,
    fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_emprendedor) REFERENCES emprendedores(id_emprendedor) ON DELETE CASCADE,
    FOREIGN KEY (subido_por) REFERENCES usuarios(id_usuario) ON DELETE RESTRICT
) COMMENT='Documentos importantes del emprendedor';

-- =====================================================
-- TABLA: metas_emprendedor
-- Descripción: Metas y objetivos establecidos para cada emprendedor
-- Para dar seguimiento al cumplimiento de objetivos
-- =====================================================
CREATE TABLE metas_emprendedor (
    id_meta INT AUTO_INCREMENT PRIMARY KEY,
    id_emprendedor INT NOT NULL,
    titulo_meta VARCHAR(200) NOT NULL,
    descripcion TEXT NOT NULL,
    fecha_establecida DATE NOT NULL,
    fecha_limite DATE NOT NULL COMMENT 'Fecha objetivo para cumplir la meta',
    fecha_completada DATE NULL,
    estado_meta ENUM('pendiente', 'en_progreso', 'completada', 'cancelada', 'atrasada') NOT NULL DEFAULT 'pendiente',
    porcentaje_avance INT DEFAULT 0 COMMENT 'Avance en porcentaje (0-100)',
    indicador_medicion TEXT NULL COMMENT 'Cómo se mide el cumplimiento',
    resultado_final TEXT NULL COMMENT 'Resultado obtenido al completar',
    establecida_por INT NOT NULL,
    FOREIGN KEY (id_emprendedor) REFERENCES emprendedores(id_emprendedor) ON DELETE CASCADE,
    FOREIGN KEY (establecida_por) REFERENCES usuarios(id_usuario) ON DELETE RESTRICT,
    INDEX idx_fecha_limite (fecha_limite),
    INDEX idx_estado (estado_meta)
) COMMENT='Metas y objetivos de emprendedores';

-- =====================================================
-- SISTEMA DE NOTIFICACIONES
-- =====================================================

-- =====================================================
-- TABLA: tipos_notificacion
-- Descripción: Catálogo de tipos de notificaciones del sistema
-- =====================================================
CREATE TABLE tipos_notificacion (
    id_tipo_notificacion INT AUTO_INCREMENT PRIMARY KEY,
    nombre_tipo VARCHAR(100) NOT NULL UNIQUE COMMENT 'Ej: evento_proximo, solicitud_pendiente, documento_vencido',
    descripcion TEXT NULL,
    prioridad ENUM('baja', 'media', 'alta') DEFAULT 'media' COMMENT 'Nivel de importancia',
    color_notificacion VARCHAR(7) NULL COMMENT 'Color para mostrar en UI (#FF5733)',
    icono VARCHAR(50) NULL,
    puede_desactivarse BOOLEAN DEFAULT TRUE COMMENT 'Si el usuario puede desactivar este tipo de notificación'
) COMMENT='Tipos de notificaciones del sistema';

-- =====================================================
-- TABLA: notificaciones
-- Descripción: Notificaciones generadas por el sistema para usuarios
-- =====================================================
CREATE TABLE notificaciones (
    id_notificacion INT AUTO_INCREMENT PRIMARY KEY,
    id_tipo_notificacion INT NOT NULL COMMENT 'Tipo de notificación',
    id_usuario_destino INT NOT NULL COMMENT 'Usuario que recibirá la notificación',
    titulo VARCHAR(200) NOT NULL COMMENT 'Título de la notificación',
    mensaje TEXT NOT NULL COMMENT 'Contenido de la notificación',
    enlace VARCHAR(255) NULL COMMENT 'URL o ruta a la que debe ir al hacer clic',
    tabla_referencia VARCHAR(100) NULL COMMENT 'Tabla relacionada (eventos, solicitudes_emprendedor, etc.)',
    id_registro_referencia INT NULL COMMENT 'ID del registro relacionado',
    leida BOOLEAN DEFAULT FALSE COMMENT 'Si ya fue leída por el usuario',
    fecha_lectura TIMESTAMP NULL COMMENT 'Cuándo la leyó',
    archivada BOOLEAN DEFAULT FALSE COMMENT 'Si fue archivada por el usuario',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_expiracion TIMESTAMP NULL COMMENT 'Cuándo expira la notificación (para limpiar)',
    FOREIGN KEY (id_tipo_notificacion) REFERENCES tipos_notificacion(id_tipo_notificacion) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario_destino) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    INDEX idx_usuario_leida (id_usuario_destino, leida),
    INDEX idx_fecha_creacion (fecha_creacion DESC)
) COMMENT='Notificaciones para usuarios del sistema';

-- =====================================================
-- TABLA: preferencias_notificacion
-- Descripción: Preferencias de notificaciones por usuario
-- Permite que cada usuario active/desactive tipos de notificaciones
-- =====================================================
CREATE TABLE preferencias_notificacion (
    id_preferencia INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_tipo_notificacion INT NOT NULL,
    activa BOOLEAN DEFAULT TRUE COMMENT 'Si el usuario tiene activado este tipo',
    notificar_email BOOLEAN DEFAULT FALSE COMMENT 'Si se le envía por correo también',
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_tipo_notificacion) REFERENCES tipos_notificacion(id_tipo_notificacion) ON DELETE CASCADE,
    UNIQUE KEY preferencia_unica (id_usuario, id_tipo_notificacion)
) COMMENT='Preferencias de notificaciones por usuario';

-- =====================================================
-- TABLA: recordatorios
-- Descripción: Recordatorios programados (para eventos, seguimientos, etc.)
-- =====================================================
CREATE TABLE recordatorios (
    id_recordatorio INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL COMMENT 'Usuario que recibirá el recordatorio',
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT NULL,
    fecha_recordatorio DATETIME NOT NULL COMMENT 'Cuándo se debe mostrar el recordatorio',
    tabla_referencia VARCHAR(100) NULL COMMENT 'Ej: eventos, historial_seguimiento, metas_emprendedor',
    id_registro_referencia INT NULL COMMENT 'ID del registro relacionado',
    completado BOOLEAN DEFAULT FALSE COMMENT 'Si ya se completó la tarea',
    fecha_completado TIMESTAMP NULL,
    notificacion_enviada BOOLEAN DEFAULT FALSE COMMENT 'Si ya se generó la notificación',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    INDEX idx_fecha_recordatorio (fecha_recordatorio),
    INDEX idx_usuario_pendiente (id_usuario, completado, fecha_recordatorio)
) COMMENT='Recordatorios programados para usuarios';

-- =====================================================
-- INSERTAR DATOS INICIALES PARA SEGUIMIENTO
-- =====================================================

-- Tipos de seguimiento predefinidos (como en el ejemplo de la imagen)
INSERT INTO tipos_seguimiento (nombre_tipo, descripcion, color_etiqueta, icono) VALUES
('Visita de Asesoría', 'Visita presencial para revisar avances y proporcionar orientación', '#4A90E2', 'briefcase'),
('Seguimiento de Necesidades', 'Revisión y seguimiento de necesidades detectadas', '#F5A623', 'clipboard-list'),
('Registro Inicial', 'Primera inscripción del emprendedor en el programa', '#7ED321', 'user-plus'),
('Llamada de Seguimiento', 'Contacto telefónico para dar seguimiento', '#50E3C2', 'phone'),
('Capacitación', 'Participación en taller o capacitación', '#B8E986', 'graduation-cap'),
('Evaluación de Avances', 'Evaluación de progreso y cumplimiento de objetivos', '#D0021B', 'chart-line'),
('Entrega de Material', 'Entrega de materiales, herramientas o recursos', '#BD10E0', 'box'),
('Reunión de Seguimiento', 'Reunión para revisar estado general del emprendimiento', '#9013FE', 'users');

-- =====================================================
-- INSERTAR TIPOS DE NOTIFICACIÓN
-- =====================================================

INSERT INTO tipos_notificacion (nombre_tipo, descripcion, prioridad, color_notificacion, icono, puede_desactivarse) VALUES
-- Eventos
('evento_proximo', 'Evento próximo a realizarse (3 días antes)', 'media', '#4A90E2', 'calendar', TRUE),
('evento_hoy', 'Evento programado para hoy', 'alta', '#D0021B', 'calendar-check', FALSE),
('nueva_inscripcion_evento', 'Nuevo emprendedor inscrito a un evento', 'baja', '#50E3C2', 'user-check', TRUE),

-- Programas y Convocatorias
('programa_nuevo', 'Nuevo programa de apoyo publicado', 'media', '#7ED321', 'bullhorn', TRUE),
('programa_por_cerrar', 'Programa por cerrar inscripciones (5 días)', 'media', '#F5A623', 'clock', TRUE),
('nueva_postulacion', 'Nueva postulación a programa', 'baja', '#B8E986', 'file-signature', TRUE),

-- Solicitudes
('solicitud_nueva', 'Nueva solicitud de emprendedor pendiente de revisar', 'alta', '#FF6B6B', 'inbox', FALSE),
('solicitud_aprobada', 'Solicitud de emprendedor aprobada', 'baja', '#7ED321', 'check-circle', TRUE),
('solicitud_rechazada', 'Solicitud de emprendedor rechazada', 'baja', '#D0021B', 'times-circle', TRUE),

-- Seguimiento
('seguimiento_pendiente', 'Seguimiento pendiente para emprendedor', 'media', '#9013FE', 'clipboard-list', TRUE),
('necesidad_sin_resolver', 'Necesidad detectada sin resolver (más de 15 días)', 'alta', '#FF6B6B', 'exclamation-triangle', TRUE),
('meta_atrasada', 'Meta de emprendedor atrasada', 'alta', '#F5A623', 'flag', TRUE),

-- Documentos
('documento_por_vencer', 'Documento próximo a vencer (30 días)', 'media', '#F5A623', 'file-exclamation', TRUE),
('documento_vencido', 'Documento vencido', 'alta', '#D0021B', 'file-times', FALSE),

-- Sistema
('mensaje_contacto_nuevo', 'Nuevo mensaje del formulario de contacto', 'media', '#4A90E2', 'envelope', TRUE),
('noticia_publicada', 'Nueva noticia publicada', 'baja', '#50E3C2', 'newspaper', TRUE),

-- Recordatorios generales
('recordatorio_general', 'Recordatorio programado', 'media', '#9013FE', 'bell', FALSE);

-- =====================================================
-- INSERTAR DATOS INICIALES
-- =====================================================

-- Insertar los 11 municipios de Chiquimula
INSERT INTO municipios (nombre_municipio, descripcion) VALUES
('Chiquimula', 'Cabecera departamental'),
('Esquipulas', 'Ciudad del Cristo Negro'),
('Camotán', 'Municipio Ch\'orti\''),
('Jocotán', 'Región Ch\'orti\''),
('Ipala', 'Conocido por su laguna'),
('Olopa', 'Zona fronteriza'),
('Quezaltepeque', 'Producción agrícola'),
('San Juan Ermita', 'Municipio rural'),
('Concepción Las Minas', 'Zona minera'),
('San Jacinto', 'Municipio pequeño'),
('San José La Arada', 'Zona ganadera');

-- Insertar sectores económicos comunes
INSERT INTO sectores_economicos (nombre_sector, descripcion) VALUES
('Artesanías', 'Producción de artículos artesanales típicos'),
('Agricultura', 'Cultivo de productos agrícolas'),
('Ganadería', 'Crianza de animales'),
('Comercio', 'Venta de productos varios'),
('Servicios', 'Prestación de servicios diversos'),
('Alimentación', 'Preparación y venta de alimentos'),
('Textiles', 'Producción de textiles y ropa'),
('Tecnología', 'Servicios tecnológicos y digitales'),
('Turismo', 'Servicios turísticos'),
('Construcción', 'Servicios de construcción y albañilería');

-- Crear usuarios iniciales (contraseña: admin123 - CAMBIAR EN PRODUCCIÓN)
-- Hash bcrypt de "admin123" con 10 rounds
INSERT INTO usuarios (nombre_completo, correo_electronico, contrasena_hash, rol, institucion, telefono) VALUES
('Superusuario del Sistema', 'admin@sistema.com', '$2b$10$nDL4MvE8mGuhNBikSj1vq.iPe9N.K9kDNIDBd9Cgc7J7ZeVEbtVoO', 'superusuario', 'Sistema', '79421234'),
('Administrador MINECO', 'admin@mineco.gob.gt', '$2b$10$nDL4MvE8mGuhNBikSj1vq.iPe9N.K9kDNIDBd9Cgc7J7ZeVEbtVoO', 'administrador', 'Ministerio de Economía - Chiquimula', '79425678');

-- =====================================================
-- Tablas adicionales: likes y bookmarks (usuarios públicos)
-- Estas tablas permiten que usuarios registrados den like y guarden noticias.
CREATE TABLE IF NOT EXISTS likes (
    id_like INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL COMMENT 'FK a usuarios.id_usuario o a emprendedores según implementación',
    id_noticia INT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_like_usuario_noticia (id_usuario, id_noticia),
    INDEX idx_noticia (id_noticia)
);

CREATE TABLE IF NOT EXISTS bookmarks (
    id_bookmark INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_noticia INT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_bookmark_usuario_noticia (id_usuario, id_noticia),
    INDEX idx_bookmark_noticia (id_noticia)
);

-- =====================================================
-- TABLA: entidades_publicas
-- Descripción: Perfiles de entidades públicas (gobierno, municipalidades, etc.)
-- =====================================================
CREATE TABLE entidades_publicas (
    id_entidad INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL UNIQUE COMMENT 'Usuario asociado a esta entidad',
    nombre_entidad VARCHAR(255) NOT NULL COMMENT 'Nombre oficial de la entidad',
    tipo_entidad ENUM(
        'ministerio', 
        'secretaria', 
        'direccion', 
        'municipalidad', 
        'gobernacion',
        'otra'
    ) NOT NULL COMMENT 'Tipo de entidad pública',
    nit_institucional VARCHAR(20) NULL COMMENT 'NIT de la institución',
    siglas VARCHAR(20) NULL COMMENT 'Acrónimo o siglas (ej: MINECO, MAGA)',
    
    -- Persona de contacto
    nombre_contacto VARCHAR(200) NOT NULL COMMENT 'Nombre completo del responsable',
    cargo_contacto VARCHAR(150) NULL COMMENT 'Cargo del responsable',
    telefono_contacto VARCHAR(20) NOT NULL COMMENT 'Teléfono de contacto principal',
    telefono_secundario VARCHAR(20) NULL COMMENT 'Teléfono alternativo',
    correo_contacto VARCHAR(150) NOT NULL COMMENT 'Email del responsable',
    
    -- Ubicación
    id_departamento INT NULL COMMENT 'Departamento donde se ubica',
    id_municipio INT NULL COMMENT 'Municipio donde se ubica',
    direccion_completa TEXT NULL COMMENT 'Dirección oficial de la entidad',
    
    -- Información institucional
    descripcion_entidad TEXT NULL COMMENT 'Descripción de la entidad y sus funciones',
    areas_enfoque TEXT NULL COMMENT 'Áreas de trabajo o sectores que atiende',
    sitio_web VARCHAR(255) NULL COMMENT 'Sitio web oficial',
    logo_entidad VARCHAR(255) NULL COMMENT 'URL del logo oficial',
    
    -- Documento de acreditación
    documento_acreditacion VARCHAR(255) NULL COMMENT 'Documento que acredita representación oficial',
    
    -- Control
    estado ENUM('pendiente', 'activo', 'inactivo') NOT NULL DEFAULT 'pendiente' 
    COMMENT 'Estado de verificación de la entidad',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_aprobacion TIMESTAMP NULL COMMENT 'Cuándo fue aprobada la cuenta',
    aprobado_por INT NULL COMMENT 'Administrador que aprobó',
    observaciones TEXT NULL COMMENT 'Notas del administrador',
    ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_departamento) REFERENCES departamentos_gt(id_departamento) ON DELETE SET NULL,
    FOREIGN KEY (id_municipio) REFERENCES municipios_gt(id_municipio) ON DELETE SET NULL,
    FOREIGN KEY (aprobado_por) REFERENCES usuarios(id_usuario) ON DELETE SET NULL,
    INDEX idx_tipo_entidad (tipo_entidad),
    INDEX idx_estado (estado)
) COMMENT='Perfiles de entidades públicas (gobierno, municipalidades, etc.)';

-- =====================================================
-- TABLA: organizaciones_privadas
-- Descripción: Perfiles de organizaciones privadas de apoyo (ONG, fundaciones, empresas)
-- =====================================================
CREATE TABLE organizaciones_privadas (
    id_organizacion INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL UNIQUE COMMENT 'Usuario asociado a esta organización',
    nombre_organizacion VARCHAR(255) NOT NULL COMMENT 'Nombre legal de la organización',
    tipo_organizacion ENUM(
        'ong', 
        'fundacion', 
        'asociacion',
        'cooperativa',
        'empresa_privada',
        'camara_comercio',
        'gremial',
        'otra'
    ) NOT NULL COMMENT 'Tipo de organización',
    
    -- Datos legales
    razon_social VARCHAR(255) NOT NULL COMMENT 'Razón social registrada',
    nit VARCHAR(20) NULL COMMENT 'NIT de la organización',
    numero_registro VARCHAR(100) NULL COMMENT 'Número de registro (Gobernación, SAT, etc.)',
    fecha_constitucion DATE NULL COMMENT 'Fecha de constitución legal',
    documento_constitucion VARCHAR(255) NULL COMMENT 'Acta de constitución o documento legal',
    
    -- Persona de contacto
    nombre_contacto VARCHAR(200) NOT NULL COMMENT 'Nombre completo del representante',
    cargo_contacto VARCHAR(150) NULL COMMENT 'Cargo del representante',
    telefono_contacto VARCHAR(20) NOT NULL COMMENT 'Teléfono de contacto principal',
    telefono_secundario VARCHAR(20) NULL COMMENT 'Teléfono alternativo',
    correo_contacto VARCHAR(150) NOT NULL COMMENT 'Email del representante',
    
    -- Ubicación
    id_departamento INT NULL COMMENT 'Departamento donde se ubica',
    id_municipio INT NULL COMMENT 'Municipio donde se ubica',
    direccion_completa TEXT NULL COMMENT 'Dirección de oficinas',
    cobertura_geografica TEXT NULL COMMENT 'Municipios o departamentos donde trabajan',
    
    -- Información organizacional
    descripcion_organizacion TEXT NULL COMMENT 'Descripción de la organización y su misión',
    areas_enfoque TEXT NULL COMMENT 'Áreas de trabajo (empleabilidad, financiamiento, etc.)',
    sectores_atiende TEXT NULL COMMENT 'Sectores económicos que atienden',
    servicios_ofrecidos TEXT NULL COMMENT 'Servicios o programas que ofrecen',
    poblacion_objetivo TEXT NULL COMMENT 'A quién benefician (emprendedores, MIPYME, mujeres, etc.)',
    
    -- Presencia digital
    sitio_web VARCHAR(255) NULL COMMENT 'Sitio web oficial',
    facebook VARCHAR(255) NULL COMMENT 'Página de Facebook',
    instagram VARCHAR(255) NULL COMMENT 'Perfil de Instagram',
    linkedin VARCHAR(255) NULL COMMENT 'Perfil de LinkedIn',
    logo_organizacion VARCHAR(255) NULL COMMENT 'URL del logo',
    
    -- Control
    estado ENUM('pendiente', 'activo', 'inactivo') NOT NULL DEFAULT 'pendiente' 
    COMMENT 'Estado de verificación de la organización',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_aprobacion TIMESTAMP NULL COMMENT 'Cuándo fue aprobada la cuenta',
    aprobado_por INT NULL COMMENT 'Administrador que aprobó',
    observaciones TEXT NULL COMMENT 'Notas del administrador',
    ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_departamento) REFERENCES departamentos_gt(id_departamento) ON DELETE SET NULL,
    FOREIGN KEY (id_municipio) REFERENCES municipios_gt(id_municipio) ON DELETE SET NULL,
    FOREIGN KEY (aprobado_por) REFERENCES usuarios(id_usuario) ON DELETE SET NULL,
    INDEX idx_tipo_organizacion (tipo_organizacion),
    INDEX idx_estado (estado)
) COMMENT='Perfiles de organizaciones privadas de apoyo (ONG, fundaciones, empresas)';

-- =====================================================
-- TABLA: solicitudes_registro
-- Descripción: Solicitudes de registro pendientes de aprobación
-- =====================================================
CREATE TABLE solicitudes_registro (
    id_solicitud INT AUTO_INCREMENT PRIMARY KEY,
    tipo_solicitud ENUM(
        'emprendedor_informal',
        'emprendedor_mipyme',
        'entidad_publica',
        'organizacion_privada'
    ) NOT NULL COMMENT 'Tipo de registro solicitado',
    
    -- Datos del formulario (JSON para flexibilidad)
    datos_formulario JSON NOT NULL COMMENT 'Datos completos del formulario de registro',
    
    -- Archivos adjuntos
    archivos_adjuntos JSON NULL COMMENT 'URLs de documentos subidos (patente, RTU, etc.)',
    
    -- Datos de contacto principales
    correo_electronico VARCHAR(150) NOT NULL COMMENT 'Email del solicitante',
    telefono VARCHAR(20) NOT NULL COMMENT 'Teléfono del solicitante',
    nombre_solicitante VARCHAR(200) NOT NULL COMMENT 'Nombre completo o razón social',
    
    -- Estado de la solicitud
    estado ENUM('pendiente', 'en_revision', 'aprobada', 'rechazada') NOT NULL DEFAULT 'pendiente',
    motivo_rechazo TEXT NULL COMMENT 'Razón por la cual fue rechazada',
    
    -- Control
    fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_revision TIMESTAMP NULL COMMENT 'Cuándo fue revisada',
    revisada_por INT NULL COMMENT 'Administrador que revisó',
    id_usuario_creado INT NULL COMMENT 'ID del usuario creado si fue aprobada',
    
    FOREIGN KEY (revisada_por) REFERENCES usuarios(id_usuario) ON DELETE SET NULL,
    FOREIGN KEY (id_usuario_creado) REFERENCES usuarios(id_usuario) ON DELETE SET NULL,
    INDEX idx_estado (estado),
    INDEX idx_tipo_solicitud (tipo_solicitud),
    INDEX idx_correo (correo_electronico)
) COMMENT='Solicitudes de registro pendientes de aprobación';

-- =====================================================
-- TRIGGERS AUTOMÁTICOS
-- =====================================================

DELIMITER $$

-- Trigger para actualizar tipo_perfil en usuarios al crear emprendedor
CREATE TRIGGER after_emprendedor_insert
AFTER INSERT ON emprendedores
FOR EACH ROW
BEGIN
    IF NEW.firebase_uid IS NOT NULL THEN
        UPDATE usuarios 
        SET tipo_perfil = IF(NEW.tipo_emprendedor = 'mipyme', 'mipyme', 'emprendedor')
        WHERE firebase_uid = NEW.firebase_uid;
    END IF;
END$$

-- Trigger para actualizar tipo_perfil al crear entidad pública
CREATE TRIGGER after_entidad_publica_insert
AFTER INSERT ON entidades_publicas
FOR EACH ROW
BEGIN
    UPDATE usuarios 
    SET tipo_perfil = 'entidad_publica'
    WHERE id_usuario = NEW.id_usuario;
END$$

-- Trigger para actualizar tipo_perfil al crear organización privada
CREATE TRIGGER after_organizacion_privada_insert
AFTER INSERT ON organizaciones_privadas
FOR EACH ROW
BEGIN
    UPDATE usuarios 
    SET tipo_perfil = 'organizacion_privada'
    WHERE id_usuario = NEW.id_usuario;
END$$

DELIMITER ;

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================
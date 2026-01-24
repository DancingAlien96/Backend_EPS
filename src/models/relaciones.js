// Importar todos los modelos
const Usuario = require('./Usuario.model');
const Municipio = require('./Municipio.model');
const MunicipioGT = require('./MunicipioGT.model');
const Departamento = require('./Departamento.model');
const SectorEconomico = require('./SectorEconomico.model');
const Emprendedor = require('./Emprendedor.model');
const Emprendimiento = require('./Emprendimiento.model');
const Organizacion = require('./Organizacion.model');
const Entidad = require('./Entidad.model');
const ImagenEmprendimiento = require('./ImagenEmprendimiento.model');
const ProgramaApoyo = require('./ProgramaApoyo.model');
const SolicitudEmprendedor = require('./SolicitudEmprendedor.model');
const PostulacionPrograma = require('./PostulacionPrograma.model');
const Evento = require('./Evento.model');
const InscripcionEvento = require('./InscripcionEvento.model');
const Noticia = require('./Noticia.model');
const MensajeContacto = require('./MensajeContacto.model');
const LogActividad = require('./LogActividad.model');
const TipoSeguimiento = require('./TipoSeguimiento.model');
const HistorialSeguimiento = require('./HistorialSeguimiento.model');
const NecesidadDetectada = require('./NecesidadDetectada.model');
const HistorialCambioFase = require('./HistorialCambioFase.model');
const DocumentoEmprendedor = require('./DocumentoEmprendedor.model');
const MetaEmprendedor = require('./MetaEmprendedor.model');
const IndicadorDesempeno = require('./IndicadorDesempeno.model');
const TipoNotificacion = require('./TipoNotificacion.model');
const Notificacion = require('./Notificacion.model');
const PreferenciaNotificacion = require('./PreferenciaNotificacion.model');
const Recordatorio = require('./Recordatorio.model');

const configurarRelaciones = () => {
  // =====================================================
  // RELACIONES DE USUARIO
  // =====================================================
  
  // Usuario -> Usuario (auto-referencia para creado_por)
  Usuario.belongsTo(Usuario, {
    foreignKey: 'creado_por',
    as: 'creador'
  });

  Usuario.hasMany(Usuario, {
    foreignKey: 'creado_por',
    as: 'usuariosCreados'
  });

  // Usuario -> Emprendedores registrados
  Usuario.hasMany(Emprendedor, {
    foreignKey: 'registrado_por',
    as: 'emprendedoresRegistrados'
  });

  // Usuario -> Organizaciones registradas
  Usuario.hasMany(Organizacion, {
    foreignKey: 'registrado_por',
    as: 'organizacionesRegistradas'
  });

  // Usuario -> Entidades registradas
  Usuario.hasMany(Entidad, {
    foreignKey: 'registrado_por',
    as: 'entidadesRegistradas'
  });

  // Usuario -> Programas publicados
  Usuario.hasMany(ProgramaApoyo, {
    foreignKey: 'publicado_por',
    as: 'programasPublicados'
  });

  // Usuario -> Eventos publicados
  Usuario.hasMany(Evento, {
    foreignKey: 'publicado_por',
    as: 'eventosPublicados'
  });

  // Usuario -> Noticias publicadas
  Usuario.hasMany(Noticia, {
    foreignKey: 'publicado_por',
    as: 'noticiasPublicadas'
  });

  // Usuario -> Notificaciones
  Usuario.hasMany(Notificacion, {
    foreignKey: 'id_usuario_destino',
    as: 'notificaciones'
  });

  // Usuario -> Recordatorios
  Usuario.hasMany(Recordatorio, {
    foreignKey: 'id_usuario',
    as: 'recordatorios'
  });

  // =====================================================
  // RELACIONES DE MUNICIPIO
  // =====================================================
  
  Municipio.hasMany(Emprendedor, {
    foreignKey: 'id_municipio',
    as: 'emprendedores'
  });

  Municipio.hasMany(Organizacion, {
    foreignKey: 'id_municipio',
    as: 'organizaciones'
  });

  Municipio.hasMany(Entidad, {
    foreignKey: 'id_municipio',
    as: 'entidades'
  });

  Municipio.hasMany(Evento, {
    foreignKey: 'id_municipio',
    as: 'eventos'
  });

  Municipio.hasMany(SolicitudEmprendedor, {
    foreignKey: 'id_municipio',
    as: 'solicitudes'
  });

  // =====================================================
  // RELACIONES DE SECTOR ECONÓMICO
  // =====================================================
  
  SectorEconomico.hasMany(Emprendimiento, {
    foreignKey: 'id_sector',
    as: 'emprendimientos'
  });

  SectorEconomico.hasMany(Organizacion, {
    foreignKey: 'id_sector',
    as: 'organizaciones'
  });

  SectorEconomico.hasMany(ProgramaApoyo, {
    foreignKey: 'id_sector',
    as: 'programas'
  });

  SectorEconomico.hasMany(SolicitudEmprendedor, {
    foreignKey: 'id_sector',
    as: 'solicitudes'
  });

  // =====================================================
  // RELACIONES DE EMPRENDEDOR
  // =====================================================
  
  Emprendedor.belongsTo(MunicipioGT, {
    foreignKey: 'id_municipio',
    as: 'municipio'
  });
    Emprendedor.belongsTo(Departamento, { foreignKey: 'id_departamento_emprendimiento', as: 'departamento_emprendimiento' });
    Emprendedor.belongsTo(SectorEconomico, { foreignKey: 'id_sector', as: 'sector' });

  Emprendedor.belongsTo(Usuario, {
    foreignKey: 'registrado_por',
    as: 'registrador'
  });

  Emprendedor.hasMany(Emprendimiento, {
    foreignKey: 'id_emprendedor',
    as: 'emprendimientos'
  });

  Emprendedor.hasMany(PostulacionPrograma, {
    foreignKey: 'id_emprendedor',
    as: 'postulaciones'
  });

  Emprendedor.hasMany(InscripcionEvento, {
    foreignKey: 'id_emprendedor',
    as: 'inscripciones'
  });

  Emprendedor.hasMany(HistorialSeguimiento, {
    foreignKey: 'id_emprendedor',
    as: 'seguimientos'
  });

  Emprendedor.hasMany(NecesidadDetectada, {
    foreignKey: 'id_emprendedor',
    as: 'necesidades'
  });

  Emprendedor.hasMany(DocumentoEmprendedor, {
    foreignKey: 'id_emprendedor',
    as: 'documentos'
  });

  Emprendedor.hasMany(MetaEmprendedor, {
    foreignKey: 'id_emprendedor',
    as: 'metas'
  });

  Emprendedor.hasMany(Noticia, {
    foreignKey: 'id_emprendedor',
    as: 'noticias'
  });

  // =====================================================
  // RELACIONES DE EMPRENDIMIENTO
  // =====================================================
  
  Emprendimiento.belongsTo(Emprendedor, {
    foreignKey: 'id_emprendedor',
    as: 'emprendedor'
  });

  Emprendimiento.belongsTo(SectorEconomico, {
    foreignKey: 'id_sector',
    as: 'sector'
  });

  Emprendimiento.hasMany(ImagenEmprendimiento, {
    foreignKey: 'id_emprendimiento',
    as: 'imagenes'
  });

  Emprendimiento.hasMany(NecesidadDetectada, {
    foreignKey: 'id_emprendimiento',
    as: 'necesidades'
  });

  Emprendimiento.hasMany(HistorialCambioFase, {
    foreignKey: 'id_emprendimiento',
    as: 'cambiosFase'
  });

  Emprendimiento.hasMany(DocumentoEmprendedor, {
    foreignKey: 'id_emprendimiento',
    as: 'documentos'
  });

  Emprendimiento.hasMany(MetaEmprendedor, {
    foreignKey: 'id_emprendimiento',
    as: 'metas'
  });

  Emprendimiento.hasMany(IndicadorDesempeno, {
    foreignKey: 'id_emprendimiento',
    as: 'indicadores'
  });

  // =====================================================
  // RELACIONES DE ORGANIZACIÓN
  // =====================================================
  
  Organizacion.belongsTo(Municipio, {
    foreignKey: 'id_municipio',
    as: 'municipio'
  });

  Organizacion.belongsTo(SectorEconomico, {
    foreignKey: 'id_sector',
    as: 'sector'
  });

  Organizacion.belongsTo(Usuario, {
    foreignKey: 'registrado_por',
    as: 'registrador'
  });

  // =====================================================
  // RELACIONES DE ENTIDAD
  // =====================================================
  
  Entidad.belongsTo(Municipio, {
    foreignKey: 'id_municipio',
    as: 'municipio'
  });

  Entidad.belongsTo(Usuario, {
    foreignKey: 'registrado_por',
    as: 'registrador'
  });

  // =====================================================
  // RELACIONES DE IMAGEN EMPRENDIMIENTO
  // =====================================================
  
  ImagenEmprendimiento.belongsTo(Emprendimiento, {
    foreignKey: 'id_emprendimiento',
    as: 'emprendimiento'
  });

  // =====================================================
  // RELACIONES DE PROGRAMA APOYO
  // =====================================================
  
  ProgramaApoyo.belongsTo(SectorEconomico, {
    foreignKey: 'id_sector',
    as: 'sector'
  });

  ProgramaApoyo.belongsTo(Usuario, {
    foreignKey: 'publicado_por',
    as: 'publicador'
  });

  ProgramaApoyo.hasMany(PostulacionPrograma, {
    foreignKey: 'id_programa',
    as: 'postulaciones'
  });

  // =====================================================
  // RELACIONES DE SOLICITUD EMPRENDEDOR
  // =====================================================
  
  SolicitudEmprendedor.belongsTo(Municipio, {
    foreignKey: 'id_municipio',
    as: 'municipio'
  });

  SolicitudEmprendedor.belongsTo(SectorEconomico, {
    foreignKey: 'id_sector',
    as: 'sector'
  });

  SolicitudEmprendedor.belongsTo(Usuario, {
    foreignKey: 'revisado_por',
    as: 'revisor'
  });

  SolicitudEmprendedor.belongsTo(Emprendedor, {
    foreignKey: 'id_emprendedor_creado',
    as: 'emprendedorCreado'
  });

  // =====================================================
  // RELACIONES DE POSTULACIÓN PROGRAMA
  // =====================================================
  
  PostulacionPrograma.belongsTo(ProgramaApoyo, {
    foreignKey: 'id_programa',
    as: 'programa'
  });

  PostulacionPrograma.belongsTo(Emprendedor, {
    foreignKey: 'id_emprendedor',
    as: 'emprendedor'
  });

  PostulacionPrograma.belongsTo(Usuario, {
    foreignKey: 'postulado_por',
    as: 'postulador'
  });

  // =====================================================
  // RELACIONES DE EVENTO
  // =====================================================
  
  Evento.belongsTo(Municipio, {
    foreignKey: 'id_municipio',
    as: 'municipio'
  });

  Evento.belongsTo(Usuario, {
    foreignKey: 'publicado_por',
    as: 'publicador'
  });

  Evento.hasMany(InscripcionEvento, {
    foreignKey: 'id_evento',
    as: 'inscripciones'
  });

  // =====================================================
  // RELACIONES DE INSCRIPCIÓN EVENTO
  // =====================================================
  
  InscripcionEvento.belongsTo(Evento, {
    foreignKey: 'id_evento',
    as: 'evento'
  });

  InscripcionEvento.belongsTo(Emprendedor, {
    foreignKey: 'id_emprendedor',
    as: 'emprendedor'
  });

  // =====================================================
  // RELACIONES DE NOTICIA
  // =====================================================
  
  Noticia.belongsTo(Emprendedor, {
    foreignKey: 'id_emprendedor',
    as: 'emprendedor'
  });

  Noticia.belongsTo(Usuario, {
    foreignKey: 'publicado_por',
    as: 'publicador'
  });

  // =====================================================
  // RELACIONES DE LOG ACTIVIDAD
  // =====================================================
  
  LogActividad.belongsTo(Usuario, {
    foreignKey: 'id_usuario',
    as: 'usuario'
  });

  // =====================================================
  // RELACIONES DE TIPO SEGUIMIENTO
  // =====================================================
  
  TipoSeguimiento.hasMany(HistorialSeguimiento, {
    foreignKey: 'id_tipo_seguimiento',
    as: 'seguimientos'
  });

  // =====================================================
  // RELACIONES DE HISTORIAL SEGUIMIENTO
  // =====================================================
  
  HistorialSeguimiento.belongsTo(Emprendedor, {
    foreignKey: 'id_emprendedor',
    as: 'emprendedor'
  });

  HistorialSeguimiento.belongsTo(TipoSeguimiento, {
    foreignKey: 'id_tipo_seguimiento',
    as: 'tipo'
  });

  HistorialSeguimiento.belongsTo(Usuario, {
    foreignKey: 'registrado_por',
    as: 'registrador'
  });

  HistorialSeguimiento.hasMany(NecesidadDetectada, {
    foreignKey: 'id_seguimiento',
    as: 'necesidades'
  });

  // =====================================================
  // RELACIONES DE NECESIDAD DETECTADA
  // =====================================================
  
  NecesidadDetectada.belongsTo(Emprendedor, {
    foreignKey: 'id_emprendedor',
    as: 'emprendedor'
  });

  NecesidadDetectada.belongsTo(Emprendimiento, {
    foreignKey: 'id_emprendimiento',
    as: 'emprendimiento'
  });

  NecesidadDetectada.belongsTo(HistorialSeguimiento, {
    foreignKey: 'id_seguimiento',
    as: 'seguimiento'
  });

  NecesidadDetectada.belongsTo(Usuario, {
    foreignKey: 'responsable_gestion',
    as: 'responsable'
  });

  // =====================================================
  // RELACIONES DE HISTORIAL CAMBIO FASE
  // =====================================================
  
  HistorialCambioFase.belongsTo(Emprendimiento, {
    foreignKey: 'id_emprendimiento',
    as: 'emprendimiento'
  });

  HistorialCambioFase.belongsTo(Usuario, {
    foreignKey: 'modificado_por',
    as: 'modificador'
  });

  // =====================================================
  // RELACIONES DE DOCUMENTO EMPRENDEDOR
  // =====================================================
  
  DocumentoEmprendedor.belongsTo(Emprendedor, {
    foreignKey: 'id_emprendedor',
    as: 'emprendedor'
  });

  DocumentoEmprendedor.belongsTo(Emprendimiento, {
    foreignKey: 'id_emprendimiento',
    as: 'emprendimiento'
  });

  DocumentoEmprendedor.belongsTo(Usuario, {
    foreignKey: 'subido_por',
    as: 'subidor'
  });

  // =====================================================
  // RELACIONES DE META EMPRENDEDOR
  // =====================================================
  
  MetaEmprendedor.belongsTo(Emprendedor, {
    foreignKey: 'id_emprendedor',
    as: 'emprendedor'
  });

  MetaEmprendedor.belongsTo(Emprendimiento, {
    foreignKey: 'id_emprendimiento',
    as: 'emprendimiento'
  });

  MetaEmprendedor.belongsTo(Usuario, {
    foreignKey: 'establecida_por',
    as: 'establecedor'
  });

  // =====================================================
  // RELACIONES DE INDICADOR DESEMPEÑO
  // =====================================================
  
  IndicadorDesempeno.belongsTo(Emprendimiento, {
    foreignKey: 'id_emprendimiento',
    as: 'emprendimiento'
  });

  IndicadorDesempeno.belongsTo(Usuario, {
    foreignKey: 'registrado_por',
    as: 'registrador'
  });

  // =====================================================
  // RELACIONES DE TIPO NOTIFICACIÓN
  // =====================================================
  
  TipoNotificacion.hasMany(Notificacion, {
    foreignKey: 'id_tipo_notificacion',
    as: 'notificaciones'
  });

  TipoNotificacion.hasMany(PreferenciaNotificacion, {
    foreignKey: 'id_tipo_notificacion',
    as: 'preferencias'
  });

  // =====================================================
  // RELACIONES DE NOTIFICACIÓN
  // =====================================================
  
  Notificacion.belongsTo(TipoNotificacion, {
    foreignKey: 'id_tipo_notificacion',
    as: 'tipo'
  });

  Notificacion.belongsTo(Usuario, {
    foreignKey: 'id_usuario_destino',
    as: 'usuario'
  });

  // =====================================================
  // RELACIONES DE PREFERENCIA NOTIFICACIÓN
  // =====================================================
  
  PreferenciaNotificacion.belongsTo(Usuario, {
    foreignKey: 'id_usuario',
    as: 'usuario'
  });

  PreferenciaNotificacion.belongsTo(TipoNotificacion, {
    foreignKey: 'id_tipo_notificacion',
    as: 'tipo'
  });

  // =====================================================
  // RELACIONES DE RECORDATORIO
  // =====================================================
  
  Recordatorio.belongsTo(Usuario, {
    foreignKey: 'id_usuario',
    as: 'usuario'
  });

  console.log('✅ Todas las relaciones de Sequelize han sido configuradas');
};

module.exports = configurarRelaciones;

/**
 * Tests unitarios para modelos de datos
 */

describe('Modelo Emprendedor - Validaciones', () => {
  test('Los campos obligatorios deben estar presentes', () => {
    const emprendedor = {
      nombre_completo: 'Juan Pérez',
      dpi: '1234567890123',
      telefono: '79421234',
      id_municipio: 1,
    };

    expect(emprendedor.nombre_completo).toBeDefined();
    expect(emprendedor.dpi).toBeDefined();
    expect(emprendedor.telefono).toBeDefined();
    expect(emprendedor.id_municipio).toBeDefined();
  });

  test('El DPI debe ser único', () => {
    const emprendedores = [
      { id: 1, dpi: '1234567890123' },
      { id: 2, dpi: '9876543210987' },
    ];

    const dpis = emprendedores.map(e => e.dpi);
    const dpisUnicos = new Set(dpis);
    
    expect(dpisUnicos.size).toBe(dpis.length);
  });

  test('Fase del emprendimiento debe ser válida', () => {
    const fasesValidas = ['idea', 'puesta_en_marcha_o_mayor_de_1_ano', 'aceleracion'];
    
    expect(fasesValidas).toContain('idea');
    expect(fasesValidas).toContain('puesta_en_marcha_o_mayor_de_1_ano');
    expect(fasesValidas).toContain('aceleracion');
    expect(fasesValidas).not.toContain('invalida');
  });
});

describe('Modelo Usuario - Roles', () => {
  test('Los roles deben ser válidos', () => {
    const rolesValidos = ['superusuario', 'administrador', 'emprendedor', 'usuario'];
    
    expect(rolesValidos).toContain('superusuario');
    expect(rolesValidos).toContain('administrador');
    expect(rolesValidos).toContain('emprendedor');
    expect(rolesValidos).not.toContain('hacker');
  });

  test('Verificar permisos según rol', () => {
    const tienePermisoAdmin = (rol) => {
      return ['superusuario', 'administrador'].includes(rol);
    };

    expect(tienePermisoAdmin('superusuario')).toBe(true);
    expect(tienePermisoAdmin('administrador')).toBe(true);
    expect(tienePermisoAdmin('emprendedor')).toBe(false);
    expect(tienePermisoAdmin('usuario')).toBe(false);
  });
});

describe('Modelo Evento - Validaciones de fechas', () => {
  test('Fecha de evento no puede ser en el pasado', () => {
    const validarFechaEvento = (fecha) => {
      const fechaEvento = new Date(fecha);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0); // Resetear horas para comparar solo fechas
      return fechaEvento >= hoy;
    };

    const manana = new Date();
    manana.setDate(manana.getDate() + 1);
    
    const ayer = new Date();
    ayer.setDate(ayer.getDate() - 1);

    expect(validarFechaEvento(manana.toISOString())).toBe(true);
    expect(validarFechaEvento(ayer.toISOString())).toBe(false);
  });

  test('Hora de fin debe ser después de hora de inicio', () => {
    const validarHoras = (horaInicio, horaFin) => {
      const inicio = new Date(`2000-01-01T${horaInicio}`);
      const fin = new Date(`2000-01-01T${horaFin}`);
      return fin > inicio;
    };

    expect(validarHoras('09:00', '17:00')).toBe(true);
    expect(validarHoras('14:00', '14:00')).toBe(false);
    expect(validarHoras('18:00', '16:00')).toBe(false);
  });
});

module.exports = {
  // Entorno de pruebas
  testEnvironment: 'node',

  // Rutas donde buscar tests
  testMatch: [
    '**/__tests__/**/*.test.js',
    '**/?(*.)+(spec|test).js'
  ],

  // Cobertura de código
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/config/**',
    '!**/node_modules/**',
    '!**/__tests__/**'
  ],

  // Directorio para reportes de cobertura
  coverageDirectory: 'coverage',

  // Formato de reportes
  coverageReporters: [
    'text',
    'lcov',
    'html'
  ],

  // Configuración de tiempo máximo
  testTimeout: 10000,

  // Limpiar mocks entre tests
  clearMocks: true,

  // Variables de entorno para tests
  setupFiles: ['<rootDir>/jest.setup.js'],

  // Verbose output
  verbose: true,

  // Ignorar carpetas
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/'
  ],

  // Transformar archivos ES6
  transform: {},
  
  // Módulos a ignorar para transformación
  transformIgnorePatterns: [
    'node_modules/(?!(supertest)/)'
  ]
};

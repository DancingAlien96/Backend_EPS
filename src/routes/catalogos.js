const express = require('express');
const router = express.Router();
const { obtenerMunicipios, obtenerSectores, obtenerDepartamentos } = require('../controllers/Catalogo.controller');

// Obtener municipios (público)
router.get('/municipios', obtenerMunicipios);

// Obtener sectores económicos (público)
router.get('/sectores', obtenerSectores);

// Obtener departamentos (público)
router.get('/departamentos', obtenerDepartamentos);

module.exports = router;

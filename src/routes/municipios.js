const express = require('express');
const router = express.Router();
const municipioController = require('../controllers/Municipio.controller');

router.get('/', municipioController.getAll);
router.get('/:id', municipioController.getById);
router.post('/', municipioController.create);

module.exports = router;

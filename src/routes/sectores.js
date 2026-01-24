const express = require('express');
const router = express.Router();
const sectorController = require('../controllers/Sector.controller');

router.get('/', sectorController.getAll);
router.get('/:id', sectorController.getById);
router.post('/', sectorController.create);

module.exports = router;

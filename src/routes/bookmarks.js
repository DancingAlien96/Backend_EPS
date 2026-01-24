const express = require('express');
const router = express.Router();
const { verificarTokenFirebase } = require('../middleware/firebaseAuth');
const { crearBookmark, quitarBookmark, listarBookmarksUsuario } = require('../controllers/Bookmarks.controller');

router.post('/', verificarTokenFirebase, crearBookmark);
router.delete('/:id', verificarTokenFirebase, quitarBookmark);
router.get('/user', verificarTokenFirebase, listarBookmarksUsuario);

module.exports = router;

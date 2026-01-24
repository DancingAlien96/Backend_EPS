const express = require('express');
const router = express.Router();
const { verificarTokenFirebase } = require('../middleware/firebaseAuth');
const { crearLike, quitarLike, listarLikesUsuario, contarLikesNoticia } = require('../controllers/Likes.controller');

// Proteger rutas con verificarTokenFirebase
router.post('/', verificarTokenFirebase, crearLike);
router.delete('/:id', verificarTokenFirebase, quitarLike);
router.get('/user', verificarTokenFirebase, listarLikesUsuario);
router.get('/noticia/:id_noticia/count', contarLikesNoticia);

module.exports = router;

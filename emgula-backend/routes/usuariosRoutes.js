const express = require('express');
const { registerUsuario, loginUsuario, verifyToken } = require('../controllers/usuariosController');

const router = express.Router();

router.post('/register', registerUsuario);

router.post('/login', loginUsuario);

router.get('/perfil', verifyToken, (req, res) => {
  res.json({ message: 'Acesso autorizado', userId: req.userId });
});

module.exports = router;

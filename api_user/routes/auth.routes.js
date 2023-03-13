const { Router } = require('express');
const { check } = require('express-validator');
const { login, validateToken } = require('../controllers/auth.controller');

const { validateFields, validateJWT } = require('../middlewares');

const router = Router();

router.post('/login', [
    check('email_or_username', 'El correo o usuario es obligatorio').not().isEmpty(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validateFields
], login )

router.get('/',[
    validateJWT
], validateToken );

module.exports = router;

const { Router } = require('express');
const { check } = require('express-validator');

const { validateFields, 
        validateJWT,
        hasRole } = require('../middlewares')

const { isValidRole, existEmailByAdmService, existAdmServiceById } = require('../helpers/db-validators');

const { admServicesGet, admServicesPut, admServicesPost, admServicesDelete } = require('../controllers/admServices.controller');


const router = Router();

router.get('/', admServicesGet )


router.post('/', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe ser más de 6 letras').isLength({ min: 6 }),
    check('email', 'El correo no es válido').isEmail(),
    check('email').custom( existEmailByAdmService ),
    check('dni', 'El DNI es obligatorio').not().isEmpty(),
    check('phone', 'El telefono es obligatorio').not().isEmpty(),
    // check('role', 'No es un rol válido').isIn(['ADMIN_ROLE','USER_ROLE']),
    check('role').custom( isValidRole ),
    validateFields
], admServicesPost )


router.put('/:id', [
    validateJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existAdmServiceById ),
    check('role').custom( isValidRole ),
    validateFields
], admServicesPut )


router.delete('/:id', [
    validateJWT,
    hasRole('ADMIN_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existAdmServiceById ),
    validateFields
], admServicesDelete );

module.exports = router;
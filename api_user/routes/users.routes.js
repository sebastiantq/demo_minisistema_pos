
const { Router } = require('express');
const { check } = require('express-validator');

const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');

const { usersGet, usersPointsRestart, usersPointsUpdate, usersPointsWinner,
        usersPut, usersPost, usersDelete, usersPutPassword, usersPutPoints } = require('../controllers/users.controller');
const { existEmailByUser, existUserById } = require('../helpers/db-validators');

const router = Router();

router.get('/', usersGet)

router.put('/update_points/:id', usersPointsUpdate);

// Endpoint para obtener todos los clientes ordenados por puntos de forma descendente
router.get('/points/winner/', usersPointsWinner);

// Endpoint para reiniciar los puntos de todos los clientes a 0
router.put('/points/restart/', usersPointsRestart);

// Create user      
router.post('/', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe ser más de 6 letras').isLength({ min: 6 }),
    check('email', 'El correo no es válido').isEmail(),
    check('email').custom( existEmailByUser ),
    validateFields
], usersPost )

router.put('/:id/', [
    validateJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existUserById ),
    validateFields
], usersPut )

router.put('/password/:id/', [
    validateJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existUserById ),
    validateFields
], usersPutPassword )

/*router.put('/update_points/:id', async (req, res) => {
    validateJWT
}, usersPutPoints)*/

router.delete('/:id/', [
    validateJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existUserById ),
    validateFields
], usersDelete );

module.exports = router;
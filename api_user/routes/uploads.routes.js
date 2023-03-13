const { Router } = require('express');
const { check } = require('express-validator');


const { uploadFile, showsImage, updateImageCloudinary } = require('../controllers/uploads.controller');
const { allowedCollections } = require('../helpers');
const { validateFields, validateFileUpload } = require('../middlewares');


const router = Router();

router.post('/', validateFileUpload, uploadFile );

router.put('/:collection/:id', [
    validateFileUpload,
    check('id','El id debe ser de mongo').isMongoId(),
    check('collection').custom( c => allowedCollections( c, ['users', 'admServices'] ) ),
    validateFields
], updateImageCloudinary )
// ], updateImage )

router.get('/:collection/:id', [
    check('id','El id debe ser de mongo').isMongoId(),
    check('collection').custom( c => allowedCollections( c, ['users', 'admServices'] ) ),
    validateFields
], showsImage)

module.exports = router;
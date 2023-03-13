const { response } = require('express');
const bcryptjs = require('bcryptjs');

const AdmService = require('../models/admService');

const admServicesGet = async (req, res = response) => {

    const [ total, admServices ] = await Promise.all([
        AdmService.countDocuments({ state: true }),
        AdmService.find({ state: true })
    ]);
        
    res.json({
        total,
        admServices
    })
} 


const admServicesPost = async (req, res = response) => {
        
    const { email, phone, password, dni, role, ...body } = req.body;

    const name = body.name.toUpperCase();

    const admService = new AdmService({ name, email, phone, password, dni, role });

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    admService.password = bcryptjs.hashSync( password, salt );

    // Guardar en BD
    await admService.save();
    
    res.status(202).json({
        admService 
    });
} 


const admServicesPut = async (req, res = response) => {
   
    const { id } = req.params;
    const { _id, password, email, ... rest } = req.body;

    // TODO validar contrase base de datos
    if ( password ) {
        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync(); 
        rest.password = bcryptjs.hashSync( password, salt );
    }

    const admService = await AdmService.findByIdAndUpdate( id, rest )

    res.json({
        msg: 'Se han modificado los datos',
        admService
    })
} 


const admServicesDelete = async (req, res = response) => {
        
    const { id } = req.params;

    const admService = await AdmService.findByIdAndUpdate( id, { state: false } )

    const admAuth = req.admService;

    res.json({
        msg: 'Se ha eliminado el administrador de servicios',
        admService,
        admAuth
    })
} 


module.exports = {
    admServicesGet,
    admServicesPut,
    admServicesPost,
    admServicesDelete
}

const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const AdmService = require('../models/admService');

const validateJWT = async ( req = request, res = response, next ) => {

    const token = req.header('x-token');

    if ( !token ) {
        return res.status(401).json({
            code: 401,
            message: 'No hay token en la petición'
        });
    }

    try {
        
        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );
          
        
        // Lee usuario que corresponde al uid
        const [ admService, user ]  = await Promise.all([
            AdmService.findById( uid ),
            User.findById( uid ),
        ]);

        // Verificar si el token-uid existe
        if ( !admService && !user ) {
            return res.status(401).json({
                code: 401,
                message: 'Token no válido - usuario no existe en DB'
            })
        }

        // Verificar si el estado del adm Servicio (uid) está borrado (false)
        if ( admService != null ) {
            // Si el administrador está activo
            if ( !admService.state )
                return res.status(401).json({
                    code: 401,
                    message: 'Token no válido - Administrador Servicios con estado false'
            });
              
            req.admService = admService;
        }

        next();
    } catch (error) {
        console.log(error);
        
        res.status(401).json({
            code: 401,
            message: 'Token no válido'
        })
    }

}

module.exports = {
    validateJWT
}
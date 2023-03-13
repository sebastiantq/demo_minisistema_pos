const { response } = require("express");
const bcryptjs = require("bcryptjs")

const { generateJWT } = require("../helpers/generate-jwt");
const { Associate, Driver, AdmService, User } = require("../models");


const login = async (req, res = response) => {
    const  { email_or_username, password } = req.body;

    try {
        let [ user ] = await Promise.all([
            User.findOne({ email: email_or_username })
        ]);

        // Verificar si el email existe
        if ( !user ) {
            [ user ] = await Promise.all([
                User.findOne({ username: email_or_username })
            ]);
        }

        // Verificar si el email existe
        if ( !user ) {
            return res.status(400).json({
                code: 400,
                message: 'El usuario o correo no existe',
                user
            });
        }

        // Autentificación de los Usuarios
        // Si el pwd es correcto
        const validPassword = bcryptjs.compareSync( password, user.password )
        if ( !validPassword )

        return res.status(400).json({
            code: 400,
            message: 'La contraseña no es correcta'
        });

        // Generar el JWT
        const token = await generateJWT( user.id )

        res.json({ 
            user,
            token
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ 
            code: 500,
            message: 'Hable con el administrador'
        })
    }
}

const validateToken = async (req, res = response ) => {
    // Generar el JWT
    if( req.user ){
        const token = req.header('x-token');
        
        res.json({
            user: req.user,
            token: token,
        })
    }

    if( req.admService ){
        
        const token = req.header('x-token');
        
        res.json({
            admService: req.admService,
            token: token,
        })
    }
}

module.exports = {
    login,
    validateToken
}
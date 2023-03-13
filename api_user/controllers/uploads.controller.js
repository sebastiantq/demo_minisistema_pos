const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;
cloudinary.config( process.env.CLOUDINARY_URL );

const { response } = require("express");
const { loadFile } = require("../helpers");


const { User, Associate, AdmService, Driver } = require("../models");

// Subir archivo de imagen mediante el middleware loadFile (Como prueba)
const uploadFile = async (req, res = response) => {

    try {

        const fullPath = await loadFile( req.files, undefined, 'imgs' );
        res.json({ name: fullPath })

    } catch (msg) {
        res.status(400).json({ msg })
    }
}

const updateImage = async (req, res= response) => {

    const { id, collection } = req.params;

    let model;

    switch ( collection ) {
        case 'users':
            model = await User.findById(id);
            if ( !model ) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                });
            }
        
        break;

        case 'admServices':
            model = await AdmService.findById(id);
            if ( !model ) {
                return res.status(400).json({
                    msg: `No existe un asociado con el id ${ id }`
                });
            }
        
        break;

        case 'associates':
            model = await Associate.findById(id);
            if ( !model ) {
                return res.status(400).json({
                    msg: `No existe un asociado con el id ${ id }`
                });
            }
        
        break;

        case 'drivers':
            model = await Driver.findById(id);
            if ( !model ) {
                return res.status(400).json({
                    msg: `No existe un asociado con el id ${ id }`
                });
            }
        
        break;
    
        default:
            return res.status(500).json({ msg: 'Se me olvidó validar esto'})
    }

    // Limpiar imagenes previas 
    if ( model.img ) {
        // Hay que borrar la imagen del servidor
        const pathImage = path.join( __dirname, '../uploads', collection, model.img );
        if ( fs.existsSync( pathImage ) ) {
            fs.unlinkSync( pathImage );
        }
    }

    const nameImg = await loadFile( req.files, undefined, collection );
    model.img = nameImg;

    await model.save()

    res.json( model )
}



const updateImageCloudinary = async (req, res= response) => {

    const { id, collection } = req.params;

    let model;

    switch ( collection ) {
        case 'users':
            model = await User.findById(id);
            if ( !model ) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                });
            }
        
        break;

        case 'admServices':
            model = await AdmService.findById(id);
            if ( !model ) {
                return res.status(400).json({
                    msg: `No existe un asociado con el id ${ id }`
                });
            }
        
        break;

        case 'associates':
            model = await Associate.findById(id);
            if ( !model ) {
                return res.status(400).json({
                    msg: `No existe un asociado con el id ${ id }`
                });
            }
        
        break;

        case 'drivers':
            model = await Driver.findById(id);
            if ( !model ) {
                return res.status(400).json({
                    msg: `No existe un asociado con el id ${ id }`
                });
            }
        
        break;
    
        default:
            return res.status(500).json({ msg: 'Se me olvidó validar esto'})
    }

    // Limpiar imagenes previas 
    if ( model.img ) {
        // Hay que borrar la imagen del servidor
        const pathImage = path.join( __dirname, '../uploads', collection, model.img );
        if ( fs.existsSync( pathImage ) ) {
            fs.unlinkSync( pathImage );
        }
    }

    // Limpiar imagenes previas de cloudinary
    if ( model.img ) {
        const nameArr = model.img.split('/');
        const name    = nameArr[ nameArr.length - 1 ];
        const [ public_id ] = name.split('.')
        await cloudinary.uploader.destroy( public_id );
    }

    const { tempFilePath } = req.files.file
    const { secure_url } = await cloudinary.uploader.upload( tempFilePath )
    model.img = secure_url;  

    await model.save()

    res.json( model )
}



// Mostrar imagen
const showsImage = async (req, res = response ) => {
    
    const { id, collection } = req.params;

    let model;

    switch ( collection ) {
        case 'users':
            model = await User.findById(id);
            if ( !model ) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                });
            }
        
        break;

        case 'admServices':
            model = await AdmService.findById(id);
            if ( !model ) {
                return res.status(400).json({
                    msg: `No existe un asociado con el id ${ id }`
                });
            }
        
        break;

        case 'associates':
            model = await Associate.findById(id);
            if ( !model ) {
                return res.status(400).json({
                    msg: `No existe un asociado con el id ${ id }`
                });
            }
        
        break;

        case 'drivers':
            model = await Driver.findById(id);
            if ( !model ) {
                return res.status(400).json({
                    msg: `No existe un asociado con el id ${ id }`
                });
            }
        
        break;
    
        default:
            return res.status(500).json({ msg: 'Se me olvidó validar esto'})
    }

    // Ver imagen previa 
    if ( model.img ) {
        // Hay que enviar ruta de la imagen
        const pathImage = path.join( __dirname, '../uploads', collection, model.img );
        if ( fs.existsSync( pathImage ) ) {
            return res.sendFile( pathImage );
        }
    }


    const pathImagen = path.join(__dirname, '../assets/no-image.jpg');
    res.sendFile( pathImagen )
}

module.exports = {
    uploadFile,
    updateImage,
    showsImage,
    updateImageCloudinary
}
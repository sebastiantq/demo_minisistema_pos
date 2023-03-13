const { response } = require("express")
const { ObjectId } = require('mongoose').Types;

const { User, Vehicle, Associate, AdmService } = require("../models")


const allowedCollections = [
    'admServices',
    'users',
    'associates',
    'vehicles',
    'roles'
];


const searchAdmServices = async ( term = '', res = response) => {

    const isMongoId = ObjectId.isValid( term ); // TRUE

    if ( isMongoId ) {
        const admServices = await AdmService.findById(term);
        return res.json({
            results: ( admServices ) ? [ admServices ] : []
        });
    }

    const regexp = new RegExp( term, 'i')

    // User.count({...}) para contar los condicionales
    const admServices = await AdmService.find({
        $or: [{ name: regexp },{ email: regexp }],
        $and: [{ state: true }]
    });

    res.json({
        results: admServices
    });
}

const searchUsers = async ( term = '', res = response) => {

    const isMongoId = ObjectId.isValid( term ); // TRUE

    if ( isMongoId ) {
        const user = await User.findById(term);
        return res.json({
            results: ( user ) ? [ user ] : []
        });
    }

    const regexp = new RegExp( term, 'i')

    // User.count({...}) para contar los condicionales
    const users = await User.find({
        $or: [{ name: regexp },{ email: regexp }],
        $and: [{ state: true }]
    });

    res.json({
        results: users
    });
}

const searchAssociates = async ( term = '', res = response ) => {

    const isMongoId = ObjectId.isValid( term ); // TRUE

    if ( isMongoId ) {
        const associate = await Associate.findById(term).populate('admService','name');
        return res.json({
            results: ( associate ) ? [ associate ] : []
        });
    }

    const regexp = new RegExp( term, 'i')

    // User.count({...}) para contar los condicionales
    const associates = await Associate.find({
        $or: [{ name: regexp },{ email: regexp }],
        $and: [{ state: true }]
    }).populate('admService','name');

    res.json({
        results: associates
    });
}

const searchVehicles = async ( term = '', res = response ) => {
    
    const isMongoId = ObjectId.isValid( term ); // TRUE

    if ( isMongoId ) {
        const vehicle = await Vehicle.findById(term).populate('admService','name').populate('associate','name');
        return res.json({
            results: ( vehicle ) ? [ vehicle ] : []
        });
    }

    const regexp = new RegExp( term, 'i')

    // User.count({...}) para contar los condicionales
    const vehicles = await Vehicle.find({
        $or: [{ registerId: regexp }],
        $and: [{ state: true }]
    }).populate('admService','name').populate('associate','name');

    res.json({
        results: vehicles
    });
}

const search = ( req, res = response ) => {

    const { collection, term } = req.params;

    if ( !allowedCollections.includes( collection ) ) {
        return res.status(400).json({ 
            msg: `Las colecciones permitidas son: ${ allowedCollections }`
        })
    }

    switch (collection) {
        case 'admServices':
            searchAdmServices(term, res);
        break;
        case 'users':
            searchUsers(term, res);
        break;
        case 'associates':
            searchAssociates(term, res);
        break;
        case 'vehicles':
            searchVehicles(term, res);
        break;

        default:
            res.status(500).json({ 
                msg: 'Se le olvidó hacer esta busqueda'
            })
    }

}

module.exports = {
    search
}
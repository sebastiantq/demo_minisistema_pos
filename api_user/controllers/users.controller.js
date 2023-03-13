const { response } = require('express');
const bcryptjs = require('bcryptjs')

const User = require('../models/user');
const { generateJWT } = require('../helpers');

const usersGet = async (req, res = response) => {
    const [total, users] = await Promise.all([
        User.countDocuments(),
        User.find()
    ]);

    res.json({
        code: 200,
        total,
        users
    })
}

const usersPointsRestart = async (req, res) => {
    try {
        await User.updateMany({}, { $set: { points: 0 } });
        res.json({
            code: 200,
            message: 'Puntos reiniciados exitosamente'
        });
    } catch (err) {
        res.json({
            code: 400,
            message: err.message
        });
    }
}

const usersPointsUpdate = async (req, res) => {
    const { id } = req.params;
    const { points } = req.body;
  
    try {
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { points },
            { new: true }
        );

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const usersPointsWinner = async (req, res) => {
    try {
        const clientes = await User.find().sort({ points: -1 });
        res.json({
            code: 200,
            message: clientes
        });
    } catch (err) {
        res.json({
            code: 400,
            message: err.message
        });
    }
}

const usersPost = async (req, res = response) => {
    var { name, lastname, username, dni, email, phone, rol, password } = req.body;

    const user = new User({ name, lastname, username, dni, email, phone, rol, password });

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password, salt);

    // Guardar en BD
    await user.save();

    const token = await generateJWT(user.id);

    res.status(202).json({
        code: 202,
        user,
        token
    });
}

// Actualiza el perfil
const usersPut = async (req, res = response) => {
    const { id } = req.params;
    const { _id, password, ...rest } = req.body;

    const user = await User.findByIdAndUpdate(id, rest)

    res.json({
        code: 200,
        user
    })
}

// Actualiza solo la contraseña
const usersPutPassword = async (req, res = response) => {
    const { id } = req.params;
    const { ...rest } = req.body;

    if (rest.password) {
        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        rest.password = bcryptjs.hashSync(rest.password, salt);
    }

    const user = await User.findByIdAndUpdate(id, rest)

    res.json({
        code: 200,
        user
    })
}

const usersPutPoints = async (req, res = response) => {
    const { id } = req.params;
    const { points } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { points },
            { new: true }
        );

        res.json({
            code: 200,
            message: 'Los puntos se han actualizado correctamente',
            updatedUser
        });
    } catch (error) {
        res.json({
            code: 400,
            message: error.message
        });
    }
}

const usersDelete = async (req, res = response) => {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(id, { state: false })

    const userAuthenticated = req.user;

    res.json({
        code: 200,
        message: 'Se ha eliminado el usuario',
        user,
        userAuthenticated
    })
}


module.exports = {
    usersGet,
    usersPointsRestart,
    usersPointsUpdate,
    usersPointsWinner,
    usersPut,
    usersPutPassword,
    usersPutPoints,
    usersPost,
    usersDelete
}

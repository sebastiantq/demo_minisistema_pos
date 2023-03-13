const { Schema, model } = require('mongoose');

const UserSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: false
    },
    lastname: {
        type: String,
        required: false,
        unique: false
    },
    username: {
        type: String,
        required: true,
        unique: [true, 'El usuario ya está registrado']
    },
    dni: {
        type: Number,
        required: true,
        unique: [true, 'El DNI ya está asociado a otro usuario']
    },
    email: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: [true, 'El correo ya está registrado']
    },
    phone: {
        type: Number,
        required: [true, 'Al menos un número de teléfono es obligatorio']
    },
    rol: {
        type: String,
        required: [true, 'Se debe especificar el rol del usuario']
    },
    points: {
        type:Number,
        default: 0
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    }
});

UserSchema.methods.toJSON = function() {
    const { __v, password, _id, ...user } = this.toObject();
    user.uid = _id;
    return user;
}

module.exports = model('User', UserSchema );
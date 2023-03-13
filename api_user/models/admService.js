const { Schema, model } = require('mongoose');

const AdmServiceSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: false
    },
    email: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    dni: {
        type: String,
        required: [true, 'El dni es obligatorio']
    },
    phone: {
        type: String,
        required: [true, 'Al menos un número de teléfono es obligatorio']
    },
    img: {
        type: String,
    },
    role: {
        type: String,
        required: [true, 'El role es obligatorio'],
        enum: ['ADMIN_ROLE', 'USER_ROLE']
    },
    state: {
        type: Boolean,
        default: true,
    },
     
}); 

// Se excluyen parametros JSON, sólo son necesarios en la DB
AdmServiceSchema.methods.toJSON = function() {
    const { __v, password, _id, ...admService } = this.toObject();
    admService.uid = _id;
    return admService;
}

module.exports = model('AdmService', AdmServiceSchema );
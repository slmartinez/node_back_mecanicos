const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let rolesValidos = {
    values: ['MECANICO_ROLE', 'USER_ROLE', 'ADMINISTRADOR_ROLE', ''],
    message: '{VALUE} no es un rol, válido'
};

let usuarioSchema = new Schema({
    // documentoIdentidad: {
    //     type: String,
    //     unique: true,
    //     required: [true, 'el documento de identidad es requerido']
    // },
    nombre: {
        type: String
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es requerido']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es requerida']
    },
    telefono: {
        type: String,
        default: ''
    },

    img: {
        type: String,
        required: false,
        default: ''
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        default: '',
        enum: rolesValidos
    }, //default: 'USER_ROLE'
    calificacion: {
        type: String,
        default: ''
    },
    municipio: {
        type: Number,
        default: null
    },
    departamento: {
        type: Number,
        default: null
    },
    barrio: {
        type: String,
        default: ''
    },
    direccion: {
        type: String,
        default: ''
    }

});

usuarioSchema.methods.toJSON = function () {
    let userObject = this.toObject();
    delete userObject.password;
    return userObject;
}

usuarioSchema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser único'
});

module.exports = mongoose.model('Usuario', usuarioSchema);
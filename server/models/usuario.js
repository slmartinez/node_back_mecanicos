const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let rolesValidos = {
    values: ['MECANICO_ROLE', 'MECANICO_USER', ''],
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
        type: String
    },
    direccion: {
        type: String
    },
    img: {
        type: String,
        required: false
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
    } //default: 'USER_ROLE'
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
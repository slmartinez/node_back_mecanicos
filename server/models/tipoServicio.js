const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let tipoServicio = new Schema({
    nombreServicio: {
        type: String,
        unique: true,
        required: [true, 'el tipo del servicio es requerido']
    },
});


tipoServicio.plugin(uniqueValidator, {
    message: '{PATH} debe de ser único'
});

module.exports = mongoose.model('TipoServicio', tipoServicio);
const mongoose = require('mongoose');
let Schema = mongoose.Schema;
// const uniqueValidator = require('mongoose-unique-validator');

let ofertaTalleresMes = new Schema({

    descripcionCorta: {
        type: String,
        required: [true, 'la descripcion corta es requerida'],
    },

    porcentajeDescuento: {
        type: Number,
        required: [true, 'el porcentaje de descuento es requerido'],
    },

    descripcionLarga: {
        type: String,
        required: [true, 'la descripcion larga es requerida'],
    },

    cantidadCupones: {
        type: Number,
        required: [true, 'la descripcion larga es requerida'],
    },

    mapa: {
        type: String,
        default: 'por Definir',
        // required: [true, 'mapa requerido'],
    },
    emailTaller: {
        type: String,
        unique: true,
        required: [true, 'El correo es requerido']
    },
    nombreTaller: {
        type: String,
        required: [true, 'el nombre del taller es requerido'],
    },

    urlImagen: {
        type: String,
        required: [true, 'La imagen es requerida'],
    },
    //para mostrar u ocultar en el home
    estado: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('ofertaTallere', ofertaTalleresMes);
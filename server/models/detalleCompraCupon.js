const mongoose = require('mongoose');
let Schema = mongoose.Schema;
// const uniqueValidator = require('mongoose-unique-validator');

let detalleCompraCupon = new Schema({

    idUsuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },

    idOfertaTaller: { type: Schema.Types.ObjectId, ref: 'ofertaTallere' },

    estado: {
        type: Boolean,
        default: true
    },
    fechaCreacion: {
        type: Date
    },
    fechaActualizacion: {
        type: Date
    },
    fechaEliminacion: {
        type: Date
    }
});

module.exports = mongoose.model('detalleCompraCupon', detalleCompraCupon);
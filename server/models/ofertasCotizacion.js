const mongoose = require('mongoose');
let Schema = mongoose.Schema;
// const uniqueValidator = require('mongoose-unique-validator');

var ofertasCotizacion = new Schema({

    idUsuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },

    costoRevision: {
        type: Number,
        required: [true, 'El de la revision es requerido']
    },

    rangoDesde: {
        type: Number,
        required: [true, 'El rango inicial es requerido']
    },

    rangoHasta: {
        type: Number,
        required: [true, 'El rango final es requerido']
    },

    activo: {
        type: Boolean,
        default: true,
    },

    idCotizacion: {
        type: Schema.Types.ObjectId,
        required: [true, 'el id para la cotización es requerido']
    },

    observaciones: {
        type: String
    },

    enProgreso: {
        type: Boolean,
        default: false,
    },

    terminado: {
        type: Boolean,
        default: false,
    },

}, { toJSON: { virtuals: true } });

ofertasCotizacion.virtual('usuarios', {
    ref: 'Usuario',
    localField: 'idUsuario',
    foreignField: '_id'
});


module.exports = mongoose.model('OfertaCotizacione', ofertasCotizacion);


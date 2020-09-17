const mongoose = require('mongoose');
let Schema = mongoose.Schema;
// const uniqueValidator = require('mongoose-unique-validator');

var cotizacionNotificacionShema = new Schema({

    cotizacions: {
        type: Schema.Types.ObjectId,
        ref: 'Cotizacion'
    },
    usuariosNotificados: [{
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
    }],

    usuarioCotizacion: {
        type: String,
        required: [true, 'el id para el campo usuarioCotizacion es requerido']
    },

    usuariosNotificacionAbierta: [{
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        default: []
    }]
}, { toJSON: { virtuals: true } });

cotizacionNotificacionShema.virtual('usuarios', {
    ref: 'Usuario',
    localField: 'usuarioCotizacion',
    foreignField: '_id'
});


module.exports = mongoose.model('NotificacionCotizaciones', cotizacionNotificacionShema);


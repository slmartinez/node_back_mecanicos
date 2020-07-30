const mongoose = require('mongoose');
let Schema = mongoose.Schema;
// const uniqueValidator = require('mongoose-unique-validator');

let cotizacionNotificacionShema = new Schema({

    cotizacions: {
        type: Schema.Types.ObjectId,
        ref: 'Cotizacion'
    },
    usuarios: [{
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
    }],
});


module.exports = mongoose.model('NotificacionCotizaciones', cotizacionNotificacionShema);


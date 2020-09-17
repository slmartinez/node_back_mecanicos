const mongoose = require('mongoose');
let Schema = mongoose.Schema;
// const uniqueValidator = require('mongoose-unique-validator');

let cotizacion = new Schema({
    tiposervicios: [{
        type: Schema.Types.ObjectId,
        ref: 'TipoServicio',
    }],
    marcavehiculos: {
        type: Schema.Types.ObjectId,
        ref: 'MarcaVehiculo'
    },
    tipomarcas: {
        type: Schema.Types.ObjectId,
        ref: 'TipoMarca'
    },
    modeloVehiculo: {
        type: Number,
        required: [true, 'El modelo del vehiculo es requerido']
    },
    kilometrajeVehiculo: {
        type: Number,
        required: [true, 'El modelo del vehiculo es requerido']
    },
    observaciones: {
        type: String,
    },
    fechaCreacion: {
        type: String
    },
});


module.exports = mongoose.model('Cotizacion', cotizacion);


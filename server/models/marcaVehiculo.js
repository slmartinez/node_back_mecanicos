const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let marcaVehiculoSchema = new Schema({
    marca: {
        type: String,
        unique: true,
        required: [true, 'El correo es requerido']
    },
});


marcaVehiculoSchema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser único'
});

module.exports = mongoose.model('MarcaVehiculo', marcaVehiculoSchema);
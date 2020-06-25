const mongoose = require('mongoose');
let Schema = mongoose.Schema;
// const uniqueValidator = require('mongoose-unique-validator');

let tipoMarca = new Schema({
    descripcion: {
        type: String,
        unique: true,
        required: [true, 'El tipo de marca es requerido']
    },
    //nombre de la coleccion para populate
    marcavehiculos: {
        type: Schema.Types.ObjectId,
        ref: 'MarcaVehiculo'
    }
});


module.exports = mongoose.model('TipoMarca', tipoMarca);


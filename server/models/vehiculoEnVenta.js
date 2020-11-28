const mongoose = require('mongoose');
let Schema = mongoose.Schema;
// const uniqueValidator = require('mongoose-unique-validator');

let vehiculosEnVenta = new Schema({

    marcaVehiculo: {
        type: String,
        required: [true, 'la descripcion corta es requerida'],
    },

    precio: {
        type: Number,
        required: [true, 'el precio es requerido'],
    },

    kilometraje: {
        type: String,
        required: [true, 'kilometraje requerido'],
    },

    ciudad: {
        type: Number,
        required: [true, 'la ciudad es requerida'],
    },


    nombreAnunciante: {
        type: String,
        required: [true, 'el contacto es requerido'],
    },

    urlImagenPrincipal: {
        type: String,
        required: [true, 'La imagen principal es requerida'],
    },

    imagenesDetalles: [{
        type: String,
        required: [true, 'debe almacenar al menos una imagen'],
    }],

    //para mostrar u ocultar en el home
    estado: {
        type: Boolean,
        default: true
    },
    modelo: {
        type: Number,
        required: [true, 'debe ingresar el modelo el vehículo'],
    },
    fechaCreacion: {
        type: Date
    },
    fechaActualizacion: {
        type: Date
    },
    fechaEliminación: {
        type: Date
    }
});

module.exports = mongoose.model('vehiculosEnVenta', vehiculosEnVenta);
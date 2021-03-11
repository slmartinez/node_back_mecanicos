const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let departamento = new Schema({
    departamentoId: {
        type: String,
    },
    departamentoNombre: {
        type: String,
    },
});

module.exports = mongoose.model('departamento', departamento);
const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let municipio = new Schema({
    municipioId: {
        type: String,
    },
    municipioNombre: {
        type: String,
    },
    departamentoId: {
        type: String
    }
});

module.exports = mongoose.model('municipio', municipio);
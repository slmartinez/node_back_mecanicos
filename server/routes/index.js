const express = require('express');
const app = express();

app.use(require('./usuario'));
app.use(require('./login'));
app.use(require('./marcaVehiculo'));
app.use(require('./tipoMarcaVehiculo'));
app.use(require('./tipoServicio'));
app.use(require('./cotizacion'));

module.exports = app;
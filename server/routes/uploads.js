const express = require('express');
const expressfileUpload = require('express-fileupload');

const { fileUpload } = require('../middlewares/uploads');

const app = express();
app.use(expressfileUpload());

app.post('/:tipo/:id', fileUpload);

module.exports = app;
const express = require('express');
const _ = require('underscore');
const departamento = require('../models/departamento');
const cors = require('cors');
const app = express();
app.use(cors());


app.get('/mostrarDepartamentos', (req, res) => {
    departamento.find({}, '')
        .exec((err, departamentosBD) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }


            res.json({
                ok: true,
                departamentosBD
            });
        });
});


module.exports = app;
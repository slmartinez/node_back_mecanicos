const express = require('express');
const _ = require('underscore');
const municipio = require('../models/municipio');
const cors = require('cors');
const app = express();
app.use(cors());

//Devuelve todos los municipios
app.get('/mostrarMunicipio', (req, res) => {
    municipio.find({})
        .exec((err, municipioBD) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.status(200).json({
                ok: true,
                municipioBD: municipioBD
            });
        });
});

//Devuelve los Municips segund su departamentoId
app.get('/mostrarMunicipio/:id', (req, res) => {
    let id = req.params.id;
    municipio.find({ departamentoId: id }, '')
        .exec((err, municipioBD) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.status(200).json({
                ok: true,
                municipioBD: municipioBD
            });
        });
});


module.exports = app;
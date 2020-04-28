const express = require('express');
const Usuario = require('../models/usuario');

const app = express();

app.get('/usuario', function (req, res) {
    res.json('get usuario local');
});

app.get('/mari', function (req, res) {
    res.json('hey tu !!! aún los detalles no acaban , feliz noche !! :)');
})

app.post('/usuario', function (req, res) {
    let body = req.body;

    let usuario = new Usuario({
        documentoIdentidad: body.documentoIdentidad,
        nombre: body.nombre,
        email: body.email,
        password: body.password,
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        
        if (err) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        } 
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

app.put('/usuario/:id', function (req, res) {
    let id = req.params.id;
    res.json({
        id
    })
});

app.delete('/usuario', function (req, res) {
    res.json('delete usuario')
});

module.exports = app;
const express = require('express');
const _ = require('underscore');
const ofertaTallere = require('../models/ofertaTalleresMes');
const { verificaToken } = require('../middlewares/autenticacion');

const cors = require('cors');
const app = express();
app.use(cors());

app.post('/crearOfertaTalleres', (req, res) => {
    let body = req.body;

    let ofertaTalleres = new ofertaTallere({
        descripcionCorta: body.descripcionCorta,
        porcentajeDescuento: body.porcentajeDescuento,
        descripcionLarga: body.descripcionLarga,
        cantidadCupones: body.cantidadCupones,
        mapa: body.mapa,
        nombreTaller: body.nombreTaller,
        urlImagen: body.urlImagen,
        estado: body.estado
    });

    ofertaTalleres.save((err, ofertaTalleresDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }

        res.json({
            ok: true,
            res: ofertaTalleresDB
        });
    });
});


app.get('/mostrarOfertasTalleres', (req, res) => {
    ofertaTallere.find({ estado: true }, '')
        .exec((err, ofertasTalleresBD) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            // MarcaVehiculo.countDocuments({}, (err, conteo) => {
            res.json({
                ok: true,
                ofertasTalleresBD
            });
            // });
        });
});


module.exports = app;
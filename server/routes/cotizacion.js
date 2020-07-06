const express = require('express');
const _ = require('underscore');
const Cotizacion = require('../models/cotizacion');
const { verificaToken } = require('../middlewares/autenticacion');

const cors = require('cors');
const app = express();
app.use(cors());


//RECORDARRRRRRRRRR VERIFICARRRRRRR EL TOKENNNNNNNNNNNN

app.post('/crearCotizacion', (req, res) => {
    let body = req.body;

    console.log("marca vehiculossss", body);

    let cotizacion = new Cotizacion({
        tiposervicios: body.tipoServicio,
        marcavehiculos: body.idMarca,
        tipomarcas: body.idtipoMarca,
        modeloVehiculo: body.modeloVehiculo,
        kilometrajeVehiculo: body.kilometrajeVehiculo,
        observaciones: body.observaciones
    });

    cotizacion.save((err, cotizacionBd) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            });
        }

        // if (err) {
        //     return res.status(400).json({
        //         ok: false,
        //         error: err
        //     });
        // }

        res.json({
            ok: true,
            cotizacion: cotizacionBd
        });
    });
});


//RECORDARRRRRRRRRR VERIFICARRRRRRR EL TOKENNNNNNNNNNNN
app.get('/mostrarCotizaciones', (req, res) => {

    Cotizacion.find({})
        .populate('tiposervicios')
        .populate('marcavehiculos')
        .populate('tipomarcas')
        .exec((err, cotizacionBd) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Cotizacion.countDocuments({}, (err, conteo) => {
                res.json({
                    ok: true,
                    data: cotizacionBd,
                    cuantos: conteo
                });
            });
        });
});


module.exports = app;
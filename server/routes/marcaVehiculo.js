const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const MarcaVehiculo = require('../models/marcaVehiculo');
const { verificaToken } = require('../middlewares/autenticacion');

const cors = require('cors');
const app = express();
app.use(cors());



//RECORDARRRRRRRRRR VERIFICARRRRRRR EL TOKENNNNNNNNNNNN

app.post('/crearMarcaVehiculo', (req, res) => {
    let body = req.body;

    console.log("marca vehiculossss", body);

    let marcaVehiculo = new MarcaVehiculo({
        marca: body.marca
    });

    marcaVehiculo.save((err, marcaVehiculoBd) => {


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
            marcaVehiculo: marcaVehiculoBd
        });
    });
});


//RECORDARRRRRRRRRR VERIFICARRRRRRR EL TOKENNNNNNNNNNNN
app.get('/mostrarMarcaVehiculos', (req, res) => {

    MarcaVehiculo.find({}, '')
        .exec((err, marcavehiculos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            MarcaVehiculo.countDocuments({}, (err, conteo) => {
                res.json({
                    ok: true,
                    marcavehiculos,
                    cuantos: conteo
                });
            });
        });
});


module.exports = app;
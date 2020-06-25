const express = require('express');
const _ = require('underscore');
const TipoMarcaVehiculo = require('../models/tipoMarcaVehiculo');
// const { verificaToken } = require('../middlewares/autenticacion');

const cors = require('cors');
const app = express();
app.use(cors());


app.post('/crearTipoMarcaVehiculo', (req, res) => {
    let body = req.body;

    console.log("marca vehiculossss", body);

    let tipoMarcaVehiculo = new TipoMarcaVehiculo({
        descripcion: body.descripcion,
        //nombre de la coleccion
        marcavehiculos: body.idMarcaVehiculo
    });

    tipoMarcaVehiculo.save((err, tipoMarcaVehiculoBd) => {


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
            tipoMarca: tipoMarcaVehiculoBd
        });
    });
});


app.get('/mostrarTipoMarcaVehiculo', (req, res) => {

    TipoMarcaVehiculo.find({})
        .populate('marcavehiculos')
        .exec((err, tipoMarcaVehiculo) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            TipoMarcaVehiculo.countDocuments({}, (err, conteo) => {
                res.json({
                    ok: true,
                    tipoMarcaVehiculo,
                    cuantos: conteo
                });
            });
        });
});

module.exports = app;
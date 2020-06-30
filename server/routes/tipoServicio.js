const express = require('express');
const _ = require('underscore');
const TipoServicio = require('../models/tipoServicio');
const { verificaToken } = require('../middlewares/autenticacion');

const cors = require('cors');
const app = express();
app.use(cors());



//RECORDARRRRRRRRRR VERIFICARRRRRRR EL TOKENNNNNNNNNNNN

app.post('/crearTipoServicio', (req, res) => {
    let body = req.body;


    let tipoServicio = new TipoServicio({
        nombreServicio: body.nombreServicio
    });

    tipoServicio.save((err, tipoServicioBd) => {


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
            nombreServicio: tipoServicioBd
        });
    });
});


//RECORDARRRRRRRRRR VERIFICARRRRRRR EL TOKENNNNNNNNNNNN
app.get('/mostrarTipoServicio', (req, res) => {

    TipoServicio.find({}, '')
        .exec((err, tipoServicios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            TipoServicio.countDocuments({}, (err) => {
                res.json({
                    ok: true,
                    tipoServicios,
                });
            });
        });
});


module.exports = app;
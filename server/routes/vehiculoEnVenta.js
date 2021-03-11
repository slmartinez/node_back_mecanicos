const express = require('express');
const _ = require('underscore');
const vehiculosEnVenta = require('../models/vehiculoEnVenta');
const { verificaToken } = require('../middlewares/autenticacion');

const cors = require('cors');
const app = express();
app.use(cors());

app.post('/vehiculoEnVenta', (req, res) => {
    let body = req.body;

    let vehiculosEnVentas = new vehiculosEnVenta({
        marcaVehiculo: body.marcaVehiculo,
        precio: body.precio,
        kilometraje: body.kilometraje,
        ciudad: body.ciudad,
        nombreAnunciante: body.nombreAnunciante,
        urlImagenPrincipal: body.urlImagenPrincipal,
        imagenesDetalles: body.imagenesDetalles,
        estado: body.estado,
        modelo: body.modelo,
        fechaCreacion: new Date(),
        fechaActualizacion: new Date()
    });

    console.log(vehiculosEnVentas);

    vehiculosEnVentas.save((err, vehiculosEnVentasDB) => {
        console.log('entro');
        if (err) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }

        res.json({
            ok: true,
            res: vehiculosEnVentasDB
        });
    });
});

app.get('/mostrarVehiculoEnVenta', (req, res) => {
    vehiculosEnVenta.find({ estado: true }, '')
        .exec((err, vehiculoEnVentaBD) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }


            res.json({
                ok: true,
                vehiculoEnVentaBD
            });
        });
});


module.exports = app;
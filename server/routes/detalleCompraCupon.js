const express = require('express');
const _ = require('underscore');
const detalleCompraCupon = require('../models/detalleCompraCupon');
const { verificaToken } = require('../middlewares/autenticacion');
const cors = require('cors');
const app = express();
app.use(cors());

const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'sistemas2@tyb.co', // generated ethereal user
        pass: 'adminKondors2020.', // generated ethereal password
    },
});

transporter.verify().then(() => {
    console.log('metodo listo');
})
app.post('/crearDetalleCompraCupon', (req, res) => {
    let body = req.body;
    let email = body.email;
    let nombre = body.nombre;
    let detalleCupon = body.detalleCupon;

    let detalleCompraCupones = new detalleCompraCupon({
        idUsuario: body.idUsuario,
        idOfertaTaller: body.idOfertaTaller,
        estado: true,
        fechaCreacion: new Date(),
        fechaActualizacion: new Date(),

    });

    detalleCompraCupones.save((err, detalleCompraCuponDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }

        // send mail with defined transport object
        transporter.sendMail({
            from: '"sistemas2@tyb.co', // sender address
            to: email, // list of receivers
            subject: `Hello ✔${nombre}`, // Subject line
            html: `<b>Realizando prueba desde el backend</b><br>${detalleCupon}`, // html body
        });

        res.json({
            ok: true,
            res: detalleCompraCuponDB
        });
    });
});

///Obtener todos los detalle compra cupon
app.get("/mostrarDetalleCompraCupon", (req, res) => {
    detalleCompraCupon.find({ estado: true })
        .populate('idUsuario', 'documentoIdentidad nombre')
        .populate('idOfertaTaller', 'nombreTaller idOfertaTaller descripcionLarga descripcionCorta cantidadCupones porcentajeDescuento')
        .exec((err, detalleCompraCuponDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    errors: err,
                });
            }
            res.status(200).json({
                ok: true,
                detalleCompraCuponDB: detalleCompraCuponDB,
            });
        });
});




module.exports = app;
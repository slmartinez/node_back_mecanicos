const express = require('express');
const app = express();
const _ = require('underscore');
const cors = require('cors');
app.use(cors());

const ofertaTalleres = require('../models/ofertaTalleresMes');
const detalleCompraCupon = require('../models/detalleCompraCupon');
const { verificaToken } = require('../middlewares/autenticacion');

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

app.post('/crearDetalleCompraCupon/:id', (req, res) => {

    let idTallerOferta = req.params.id;

    let body = req.body;
    let cantidadCupones = _.pick(req.body, ['cantidadCupones']);
    let email = body.email;
    let nombre = body.nombre;
    let detalleCupon = body.detalleCupon;
    console.log(cantidadCupones);
    console.log(idTallerOferta);
    let detalleCompraCupones = new detalleCompraCupon({
        idUsuario: body.idUsuario,
        idOfertaTaller: body.idOfertaTaller,
        estado: true,
        fechaCreacion: new Date(),
        fechaActualizacion: new Date(),

    });

    ofertaTalleres.findByIdAndUpdate(idTallerOferta, cantidadCupones, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        } else {
            detalleCompraCupones.save((err, detalleCompraCuponDB) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        error: err
                    });
                } else {
                    if (detalleCupon != undefined && nombre != undefined && email != undefined) {
                        // send mail with defined transport object
                        transporter.sendMail({
                            from: '"sistemas2@tyb.co', // sender address
                            to: email, // list of receivers
                            subject: `${nombre}`, // Subject line
                            html: `${detalleCupon}`, // html body
                        });
                        res.json({
                            ok: true,
                            res: detalleCompraCuponDB,
                            cupon: usuarioDB.cantidadCupones
                        });
                    } else {
                        res.json({
                            ok: false,
                            mensaje: "Error al crear la compra del cupon"
                        })
                    }
                }

            });
        }
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
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
    //información del usuario
    let idTallerOferta = req.params.id;
    let body = req.body;
    let cantidadCuponesRes = _.pick(req.body, ['cantidadCupones']);
    let email = body.email;
    let nombre = body.nombre;
    let detalleCupon = body.detalleCupon;


    //Detalle de la compra de cupones
    let detalleCompraCupones = new detalleCompraCupon({
        idUsuario: body.idUsuario,
        idOfertaTaller: body.idOfertaTaller,
        estado: true,
        fechaCreacion: new Date(),
        fechaActualizacion: new Date(),
    });

    //Busca la cantidad de cupones actuales disponibles
    ofertaTalleres.find({ _id: idTallerOferta }, '')
        .exec((err, ofertataller) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            } else {
                if (ofertataller[0].cantidadCupones === 0) {
                    return res.status(400).json({
                        ok: false,
                        err: "No hay cupones disponibles"
                    });
                }
                if (cantidadCuponesRes.cantidadCupones > ofertataller[0].cantidadCupones) {
                    return res.status(400).json({
                        ok: false,
                        err: `No hay suficientes cupones para su compra que es de ${cantidadCuponesRes.cantidadCupones} solo nos quedan ${ofertataller[0].cantidadCupones}`
                    });
                }
                let totalCuponesRestantes = {
                    cantidadCupones: ofertataller[0].cantidadCupones - cantidadCuponesRes.cantidadCupones
                };

                //Actualiza el total de cupones disponibles
                ofertaTalleres.findByIdAndUpdate(idTallerOferta, totalCuponesRestantes, { new: true, runValidators: true }, (err, usuarioDB) => {
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            err
                        });
                    } else {
                        //Guarda el detalle de compra del cupon
                        detalleCompraCupones.save((err, detalleCompraCuponDB) => {
                            if (err) {
                                return res.status(400).json({
                                    ok: false,
                                    err: err
                                });
                            } else {
                                if (detalleCupon != undefined && nombre != undefined && email != undefined) {
                                    //Configuración para enviar el correo
                                    transporter.sendMail({
                                        from: '"sistemas2@tyb.co', // sender address
                                        to: email, // list of receivers
                                        subject: `${nombre}`, // Subject line
                                        html: `${detalleCupon}`, // html body
                                    });
                                    res.json({
                                        ok: true,
                                        res: detalleCompraCuponDB,
                                        cupon: usuarioDB.cantidadCupones,
                                        mensaje: 'Compra exitosa'
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
                    err: err,
                });
            }
            res.status(200).json({
                ok: true,
                detalleCompraCuponDB: detalleCompraCuponDB,
            });
        });
});

module.exports = app;
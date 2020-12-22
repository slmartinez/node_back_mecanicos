const express = require('express');
const _ = require('underscore');
const Cotizacion = require('../models/cotizacion');
const NotificacionCotizaciones = require('../models/cotizacionNotificacion');
const Usuario = require('../models/usuario');
const { verificaToken } = require('../middlewares/autenticacion');
const moment = require('moment-timezone');


const cors = require('cors');
const twilio = require('twilio');
const app = express();
app.use(cors());

//implementacion twilio

const accountSid = 'AC19c8410b2bb04f351967ddf35f051c49';
const authToken = '675472619492e9ea897d5b7578d2c73a';
const client = require('twilio')(accountSid, authToken);


//RECORDARRRRRRRRRR VERIFICARRRRRRR EL TOKENNNNNNNNNNNN

app.post('/crearCotizacion', (req, res) => {
    let body = req.body;
    let id = body.datosUsuario.id_usuario;
    console.log('aqui estamos');
    console.log(body);
    console.log(id);

    const date = moment.tz(Date.now(), "America/Bogota").format('MM/DD/YYYY h:mm:ssa');

    let cotizacion = new Cotizacion({
        tiposervicios: body.tipoServicio,
        marcavehiculos: body.idMarca,
        tipomarcas: body.idtipoMarca,
        modeloVehiculo: body.modeloVehiculo,
        kilometrajeVehiculo: body.kilometrajeVehiculo,
        observaciones: body.observaciones,
        fechaCreacion: date
    });
    console.log(cotizacion);


    let updateDataUser = {
        nombre: body.datosUsuario.nombre,
        telefono: body.datosUsuario.telefono,
        municipio: body.datosUsuario.municipio,
        departamento: body.datosUsuario.departamento,
        barrio: body.datosUsuario.barrio,
        direccion: body.datosUsuario.complementoDireccion,
        documentoIdentidad: body.datosUsuario.identificacion
    }


    //el new lo que hace es enviar el nuevo objeto actualizado
    Usuario.findByIdAndUpdate(id, { $set: updateDataUser }, { new: true, runValidators: true, context: 'query' }, (err, usuarioDB) => {

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            })
        }

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }


        cotizacion.save((errSave, cotizacionBd) => {

            console.log("este sera el id del documendo", cotizacionBd._id);
            var idUsuarios = [];

            //nombre de campos a mostrar si se quieren mostrar todos se dejan vacios
            Usuario.find({ estado: true }, 'nombre estado telefono _id')
                .exec((err, usuarios) => {

                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            err
                        });
                    }

                    (async function() {
                        for (var i = 0; i < usuarios.length; i++) {
                            idUsuarios.push(usuarios[i]._id);
                            try {
                                await new Promise(next => {
                                    client.messages
                                        .create({
                                            body: '¡Hola! se ha solicitado de tus servicios en nuestra plataforma ingresa a: https://app-front-mecanicos-app.herokuapp.com/#/home',
                                            mediaUrl: ['https://app-front-mecanicos-app.herokuapp.com/assets/img/logoFix2.png'],
                                            from: 'whatsapp:+14155238886',
                                            to: 'whatsapp:+57' + usuarios[i].telefono + ''
                                        })
                                        .then(function(message) {
                                            console.log("Successfully sent SMS notification ", message.sid);
                                            next();
                                        })
                                        .catch(error => {
                                            console.log("There was an error trying to send an SMS text message. ", error.reason);
                                        })
                                        .done();
                                })
                            } catch (error) {
                                console.log("There was an error trying to send an SMS text message. ", error.reason);
                            }
                        }
                        console.log("este es el id de las cotizaciones", idUsuarios);

                        let notificacionCotizacion = new NotificacionCotizaciones({
                            cotizacions: cotizacionBd._id,
                            usuarios: idUsuarios,
                        });

                        notificacionCotizacion.save((errSaveNotificacion, bdCotizacionNotificacion) => {

                            if (errSaveNotificacion) {
                                console.log("error en la notificacion");
                            }

                        });

                    })();

                });


            if (errSave) {
                return res.status(500).json({
                    ok: false,
                    error: errSave
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
                cotizacion: cotizacionBd._id
            });

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
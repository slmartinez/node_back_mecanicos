const express = require('express');
const _ = require('underscore');
const NotificacionCotizaciones = require('../models/cotizacionNotificacion');
const Cotizacion = require('../models/cotizacion');
const Usuario = require('../models/usuario');
const { verificaToken } = require('../middlewares/autenticacion');

const cors = require('cors');
const app = express();
app.use(cors());



//RECORDARRRRRRRRRR VERIFICARRRRRRR EL TOKENNNNNNNNNNNN

app.post('/crearNotificacionUsuario', (req, res) => {
    let idCotizacion = req.body.idCotizacion;
    let idUsuarioCliente = req.body.idUsuarioCliente;
    var idUsuarios = [];
    //nombre de campos a mostrar si se quieren mostrar todos se dejan vacios
    Usuario.find({ estado: true, role: 'MECANICO_ROLE' }, '')

        .exec((err, usuarios) => {
            if (err) {

                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            usuarios.map(function (users) {
                console.log("arreglo de usuarios", users);
                idUsuarios.push(users.id);
            });

            let notificacionCotizacion = new NotificacionCotizaciones({
                cotizacions: idCotizacion,
                usuarioCotizacion: idUsuarioCliente,
                usuariosNotificados: idUsuarios,
            });

            notificacionCotizacion.save((errSaveNotificacion, bdCotizacionNotificacion) => {
                if (errSaveNotificacion) {
                    return res.status(400).json({
                        ok: false,
                        errSaveNotificacion
                    });
                }

                res.json({
                    ok: true,
                    notificacion: "ok"
                });

            });
        });
});

app.put('/actualizarNotificaciones/:id', (req, res) => {
    let id = req.params.id;
    let idUsuario = req.body.idUsuario;
    let userOpenNotify = [];
    NotificacionCotizaciones.findOne({ _id: id })
        .then(data => {
            if (data) {
                console.log("valueeeeee", data);
                let newArrayUsuarios = data.usuariosNotificados.filter(user => user != idUsuario);
                userOpenNotify.push(idUsuario);

                if (data.usuariosNotificacionAbierta.length) {
                    data.usuariosNotificacionAbierta.map(function (data) {
                        userOpenNotify.push(data);
                    });
                }

                let updateUserNoty = {
                    usuariosNotificados: newArrayUsuarios,
                    usuariosNotificacionAbierta: userOpenNotify
                }

                NotificacionCotizaciones.findByIdAndUpdate(id, { $set: updateUserNoty }, { new: true, runValidators: true }, (err, notificacionBd) => {
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            err
                        });
                    }
                    res.json({
                        ok: true,
                        usuario: "ok"
                    });
                });

            } else {
                console.log("No document matches the provided query.");
                res.json({
                    ok: false,
                    usuario: "ha ocurrido un error"
                });
            }
        })
        .catch(err => console.error(`Failed to find documents: ${err}`))
});

app.get('/mostrarNotificaciones', (req, res) => {

    try {

        NotificacionCotizaciones.find({})
            .populate([{ path: 'cotizacions', select: '_id tiposervicios fechaCreacion', populate: { path: 'tiposervicios' } }])
            .populate('usuarios')
            .exec((err, notificacionesBd) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                let arrNotificacionCotizacion = [];
                notificacionesBd.map(function (data) {
                    let objArr = {
                        data: {
                            idCotizacion: data.cotizacions._id,
                            usuarioServicio: data.usuarios[0].nombre,
                            fechaCreacion: data.cotizacions.fechaCreacion,
                            tipoServicios: data.cotizacions.tiposervicios,
                            usuariosNotificados: data.usuariosNotificados,
                            usuariosNotificacionAbierta: data.usuariosNotificacionAbierta
                        },
                    }
                    arrNotificacionCotizacion.push(objArr);
                });

                NotificacionCotizaciones.countDocuments({}, (err, conteo) => {
                    res.json({
                        ok: true,
                        result: arrNotificacionCotizacion,
                        cuantos: conteo
                    });
                });
            });

    } catch (error) {
        console.log("catchhhhhhhhhhhhhh")
        // res.json({
        //     ok: false,
        //     result: error,
        //     cuantos: conteo
        // });
    }

});


app.get('/detalleNotificacion/:id', (req, res) => {

    let id = req.params.id;
    Cotizacion.find({ _id: id }, '')
        .populate('tipomarcas')
        .populate('marcavehiculos')
        .populate('tiposervicios')
        .exec((err, cotizacion) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Cotizacion.countDocuments({}, (err, conteo) => {
                res.json({
                    ok: true,
                    cotizacion,
                    cuantos: conteo
                });
            });
        });
});

module.exports = app;
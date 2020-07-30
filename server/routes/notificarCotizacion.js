const express = require('express');
const _ = require('underscore');
const NotificacionCotizaciones = require('../models/cotizacionNotificacion');
const Usuario = require('../models/usuario');
const { verificaToken } = require('../middlewares/autenticacion');

const cors = require('cors');
const app = express();
app.use(cors());



//RECORDARRRRRRRRRR VERIFICARRRRRRR EL TOKENNNNNNNNNNNN

app.post('/crearNotificacionUsuario', (req, res) => {
    let idCotizacion = req.body.idCotizacion;
    var idUsuarios = [];
    //nombre de campos a mostrar si se quieren mostrar todos se dejan vacios
    Usuario.find({ estado: true }, '_id')

        .exec((err, usuarios) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            usuarios.map(function (users) {
                idUsuarios.push(users.id);
            });

            let notificacionCotizacion = new NotificacionCotizaciones({
                cotizacions: idCotizacion,
                usuarios: idUsuarios,
            });


            notificacionCotizacion.save((errSaveNotificacion, bdCotizacionNotificacion) => {
                if (errSaveNotificacion) {
                    return res.status(400).json({
                        ok: false,
                        err
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
    NotificacionCotizaciones.findOne({ _id: id })
        .then(data => {
            if (data) {
                console.log("valueeeeee", data);
                let newArrayUsuarios = data.usuarios.filter(user => user != idUsuario);

                let updateUserNoty = {
                    usuarios: newArrayUsuarios,
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
            }
        })
        .catch(err => console.error(`Failed to find documents: ${err}`))
});

module.exports = app;
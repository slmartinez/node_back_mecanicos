const express = require('express');
const _ = require('underscore');

const OfertasCotizacion = require('../models/ofertasCotizacion');
const { verificaToken } = require('../middlewares/autenticacion');

const cors = require('cors');
const app = express();
app.use(cors());



//RECORDARRRRRRRRRR VERIFICARRRRRRR EL TOKENNNNNNNNNNNN

app.post('/crearOfertaCotizacion', (req, res) => {
    let body = req.body;

    let ofertaCotizacion = new OfertasCotizacion({
        idUsuario: body.idUsuario,
        costoRevision: body.costoRevision,
        rangoDesde: body.rangoDesde,
        rangoHasta: body.rangoHasta,
        idCotizacion: body.idCotizacion,
        observaciones: body.observaciones
    });

    ofertaCotizacion.save((err, ofertaCotizacionBd) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            });
        }
        res.json({
            ok: true,
            ofertaCotizacion: ofertaCotizacionBd
        });
    });
});



app.put('/actualizarOfertaCotizacion/:id', (req, res) => {
    let id = req.params.id;
    let body = req.body;

    OfertasCotizacion.findOne({ _id: id })
        .then(data => {
            console.log("info nueva", data);
            if (data) {
                console.log("valueeeeee", data);

                if (!data.activo) {

                    let actualizarOferta = {
                        costoRevision: body.costoRevision,
                        rangoDesde: body.rangoDesde,
                        rangoHasta: body.rangoHasta,
                        observaciones: body.observaciones
                    }

                    OfertasCotizacion.findByIdAndUpdate(id, { $set: actualizarOferta }, { new: true, runValidators: true }, (err, notificacionBd) => {
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
                    res.json({
                        ok: false,
                        oferta: "no es posible actualizar el registro ya que se encuentra en curso"
                    });
                }

            } else {
                console.log("No document matches the provided query.");
                res.json({
                    ok: false,
                    res: "documento no existe"
                });
            }
        })
        .catch(err => console.error(`Failed to find documents: ${err}`))
});



// app.get('/mostrarNotificaciones', (req, res) => {

//     try {

//         NotificacionCotizaciones.find({})
//             .populate([{ path: 'cotizacions', select: '_id tiposervicios fechaCreacion', populate: { path: 'tiposervicios' } }])
//             .populate('usuarios')
//             .exec((err, notificacionesBd) => {
//                 if (err) {
//                     return res.status(400).json({
//                         ok: false,
//                         err
//                     });
//                 }

//                 console.log("pruebaaaaaaaaaaa", notificacionesBd);

//                 let arrNotificacionCotizacion = [];
//                 notificacionesBd.map(function (data) {
//                     let objArr = {
//                         data: {
//                             idNotificacion: data._id,
//                             idCotizacion: data.cotizacions._id,
//                             usuarioServicio: data.usuarios[0].nombre,
//                             fechaCreacion: data.cotizacions.fechaCreacion,
//                             tipoServicios: data.cotizacions.tiposervicios,
//                             usuariosNotificados: data.usuariosNotificados,
//                             usuariosNotificacionAbierta: data.usuariosNotificacionAbierta
//                         },
//                     }
//                     arrNotificacionCotizacion.push(objArr);
//                 });

//                 NotificacionCotizaciones.countDocuments({}, (err, conteo) => {
//                     res.json({
//                         ok: true,
//                         result: arrNotificacionCotizacion,
//                         cuantos: conteo
//                     });
//                 });
//             });

//     } catch (error) {
//         console.log("catchhhhhhhhhhhhhh")
//         // res.json({
//         //     ok: false,
//         //     result: error,
//         //     cuantos: conteo
//         // });
//     }

// });


// app.get('/detalleNotificacion/:id', (req, res) => {

//     let id = req.params.id;
//     Cotizacion.find({ _id: id }, '')
//         .populate('tipomarcas')
//         .populate('marcavehiculos')
//         .populate('tiposervicios')
//         .exec((err, cotizacion) => {
//             if (err) {
//                 return res.status(400).json({
//                     ok: false,
//                     err
//                 });
//             }
//             Cotizacion.countDocuments({}, (err, conteo) => {
//                 res.json({
//                     ok: true,
//                     cotizacion,
//                     cuantos: conteo
//                 });
//             });
//         });
// });

module.exports = app;
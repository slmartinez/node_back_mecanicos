const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');
const OfertasCotizacion = require('../models/ofertasCotizacion');
const { verificaToken } = require('../middlewares/autenticacion');

const cors = require('cors');
const app = express();
app.use(cors());

// app.get('/covid', function (req, res) {
//     res.json('¡¡¡ATENCION!!! #MateoCovid19 @TEOFLOW ¡¡DENUNCIE!! NO TENER ACERCAMIENTOS ¡¡ATENCIÓN!');
// })

app.post('/usuario', verificaToken, (req, res) => {
    let body = req.body;

    let usuario = new Usuario({
        // documentoIdentidad: body.documentoIdentidad,
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,

    });

    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }


        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});
// verificaToken
app.get('/usuario', (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5
    limite = Number(limite);
    //nombre de campos a mostrar si se quieren mostrar todos se dejan vacios
    Usuario.find({ estado: true }, 'nombre estado telefono')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.countDocuments({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });
            });
        });
});

//ojooooooooo este si vaaaaaaaaa
// app.put('/usuario/:id', verificaToken, (req, res) => {

app.put('/usuario/:id', (req, res) => {

    let id = req.params.id;
    //SOLO PERMITO ACTUALIZAR ESTOS CAMPOS DEL ARREGLO
    let body = _.pick(req.body, ['nombre', 'email', 'role', 'estado', 'direccion', 'barrio', 'municipio', 'departamento', 'tiposervicios','telefono']);

    //el new lo que hace es enviar el nuevo objeto actualizado
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

});

app.delete('/usuario/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    //de esta manera borro toda una coleccion de la bd
    // Usuario.findByIdAndDelete(id, (err, usuarioEliminado) => {

    let cambiaEstado = {
        estado: false
    }

    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioEliminado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioEliminado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            })
        }
        res.json({
            ok: true,
            usuario: usuarioEliminado
        });
    });
});

app.get('/perfilUsuario/:id', (req, res) => {

    let id = req.params.id;
    OfertasCotizacion.find({
        idUsuario: id
    }, '')
        .exec((err, data) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            console.log("esta es la data del documento", data);
            let enSubasta = [];
            let enReparacion = [];
            let finalizados = [];

            data.map(function (res) {
                // console.log("arreglo de usuarios", users);
                if (res.activo && !res.enProgreso && !res.terminado) {
                    enSubasta.push(res);
                } else if (res.activo && res.enProgreso && !res.terminado) {
                    enReparacion.push(res);
                } else {
                    finalizados.push(res);
                }
            });

            res.json({
                ok: true,
                subasta: enSubasta,
                reparacion: enReparacion,
                finalizados: finalizados,
            });



            // Cotizacion.countDocuments({}, (err, conteo) => {
            //     res.json({
            //         ok: true,
            //         cotizacion,
            //         cuantos: conteo
            //     });
            // });
        });
});


app.get('/perfilUsuarioGeneral/:id', (req, res) => {

    let id = req.params.id;
    Usuario.find({
        _id: id
    }, '')
        .exec((err, data) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            console.log("si señoresssssssssss", data);

            res.json({
                ok: true,
                res: data[0]
            });

        });
});


module.exports = app;
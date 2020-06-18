const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');
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
        role: body.role
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

app.get('/usuario', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5
    limite = Number(limite);
    //nombre de campos a mostrar si se quieren mostrar todos se dejan vacios
    Usuario.find({ estado: true }, 'nombre estado')
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

app.put('/usuario/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    //SOLO PERMITO ACTUALIZAR ESTOS CAMPOS DEL ARREGLO
    let body = _.pick(req.body, ['nombre', 'email', 'role', 'estado']);

    console.log("este es el body ingresado", body);

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



module.exports = app;
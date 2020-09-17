const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
const Usuario = require('../models/usuario');

const cors = require('cors');
const app = express();
app.use(cors());

app.post('/login', (req, res) => {


    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) o contraseña incorrectos'
                }
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o (contraseña) incorrectos'
                }
            });
        }

        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED_KEY, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            ok: true,
            usuario: usuarioDB,
            token: token
        });
    });
});


//Configuraciones de google

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

app.post('/google', async (req, res) => {
    console.log("respuestaaaaaaaaaa", req.body.idToken);
    let token = req.body.idToken;
    let googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                err: 'Token no valido'
            });
        });

    if (res.statusCode !== 403) {
        Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    error: err
                });
            }

            if (usuarioDB) {
                if (!usuarioDB.google) {
                    return res.status(400).json({
                        ok: false,
                        err: {
                            message: 'Tu primer autenticación no se realizo por google, ingresa por el formulario'
                        }
                    });
                } else {

                    let token = jwt.sign({
                        usuario: usuarioDB
                    }, process.env.SEED_KEY, { expiresIn: process.env.CADUCIDAD_TOKEN });

                    return res.json({
                        ok: true,
                        usuario: usuarioDB,
                        token,
                    });

                }
            } else {
                //si el usuario no existe en la base de datos
                let usuario = new Usuario();

                usuario.nombre = googleUser.nombre;
                usuario.email = googleUser.email;
                usuario.img = googleUser.img;
                usuario.google = true;
                usuario.password = ':)';

                usuario.save((err, usuarioDB) => {

                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            error: err
                        });
                    }

                    let token = jwt.sign({
                        usuario: usuarioDB
                    }, process.env.SEED_KEY, { expiresIn: process.env.CADUCIDAD_TOKEN });

                    return res.json({
                        ok: true,
                        usuario: usuarioDB,
                        token,
                    });
                });

            }

        });
    }


});



module.exports = app;
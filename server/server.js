require('./config/config');
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.get('/usuario', function (req, res) {
    res.json('app')
});

app.get('/mari', function (req, res) {
    res.json('hey tu !!! aún los detalles no acaban , feliz noche !! :)');
})

app.post('/usuario', function (req, res) {
    let body = req.body;

    if (!body.nombre) {
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es necesario'
        });
    } else {
        res.json({
            persona: body
        });
    }

});



app.put('/usuario/:id', function (req, res) {
    let id = req.params.id;
    res.json({
        id
    })
});

app.delete('/usuario', function (req, res) {
    res.json('delete usuario')
});

 mongoose.connect('mongodb://localhost:27017/mecanicos', (err,res) => {
    if (err) throw err;
    console.log('Base de datos ONLINE');
});

app.listen(process.env.PORT,()=> {
    console.log("escuchando puerto: " +process.env.PORT+ "");
} )
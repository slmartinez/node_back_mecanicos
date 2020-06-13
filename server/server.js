require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//configuracion global de rutas
app.use(require('./routes/index.js'));

// var whiteList = ['http://localhost:4200/'];

// var corsOptions = {
//     origin: function (origin, callback) {
//         if (whiteList.indexOf(origin !== -1)) {
//             callback(null, true);
//         } else {
//             callback(new Error('Not allowed by Cors'));
//         }
//     }
// }


// mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }).then(
    () => {
        console.log("conexion realizada");
    },
    err => {
        console.log("error de conexion", err);
    }
);


//  mongoose.connect('mongodb://localhost:27017/mecanicos', (err,res) => {
//     if (err) throw err;
//     console.log('Base de datos ONLINE');
// });


//habilitar la carpeta public

app.use(express.static(path.resolve(__dirname, '../public')));
app.use(cors());
app.listen(process.env.PORT, () => {
    console.log("escuchando puerto: " + process.env.PORT + "");
})
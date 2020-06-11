// =========
//puerto
//==========

process.env.PORT = process.env.PORT || 3000;


// =========
//entorno
//==========

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';



// =========
//Vencimiento del token
//==========

process.env.CADUCIDAD_TOKEN = 20000 * 60;

// =========
//SEED de autenticacion
//==========


process.env.SEED_KEY = process.env.SEED_KEY || "este-es-el-secret";


// =========
//Base de datos
//==========

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/mecanicos';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;


// =========
//Google Client
//==========


process.env.CLIENT_ID = process.env.CLIENT_ID || '531797251979-gdisd5qm0gennfch06mpobk0e5918lej.apps.googleusercontent.com';


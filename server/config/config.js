// =========
//puerto
//==========

process.env.PORT = process.env.PORT || 3000;


// =========
//entorno
//==========

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// =========
//Base de datos
//==========

let urlDB;

//if (process.env.NODE_ENV === 'dev') {
 //   urlDB = 'mongodb://localhost:27017/mecanicos';
//} else {
urlDB = 'mongodb+srv://rootmecanicos:Mecanicos2020.@cluster0-wk7zr.mongodb.net/mecanicos';
//}

process.env.URLDB = urlDB;



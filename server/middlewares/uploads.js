const fs = require('fs');

const { response } = require('express');
const { v4: uuidv4 } = require('uuid');

//Rutas
const Usuario = require('../models/usuario');
const talleres = require('../models/ofertaTalleresMes');
const vehiculos = require('../models/vehiculoEnVenta');

const fileUpload = (req, res = response) => {
    const tipo = req.params.tipo;
    const id = req.params.id;
    console.log(tipo);
    const tiposValidos = ['talleres', 'usuarios', 'vehiculos'];

    if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No es taller, usuario o vehiculo'
        });
    }

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No hay ningun archivo'
        });
    }

    const file = req.files.imagen;

    console.log(file);

    const nombreCortado = file.name.split('.');
    const extensionArchivo = nombreCortado[nombreCortado.length - 1];

    //validar extension
    const estensionesValida = ['png', 'jpg', 'jpeg', 'gif'];
    if (!estensionesValida.includes(extensionArchivo)) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No es una extensión permitida'
        });
    }

    //Generar el nombre del archivo
    const nombreArchivo = `${uuidv4()}.${extensionArchivo}`;

    //path para guardar la imagen
    const path = `./uploads/${tipo}/${nombreArchivo}`;

    //Mover la imagen
    file.mv(path, (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover la imagen'
            });
        }

        //Actualizar base de datos
        actualizarImagen(tipo, id, path, nombreArchivo);
        res.json({
            ok: true,
            mensaje: 'Archivo subido',
            nombreArchivo
        });
    });

    // res.json({
    //     ok: true,
    //     nombreArchivo
    // })

}

const actualizarImagen = async(tipo, id, nombreArchivo) => {
    console.log('Actualizando imagen');
    switch (tipo) {
        case 'talleres':
            break;
        case 'usuarios':
            const usuario = await Usuario.findById(id);
            console.log('aquiii');
            console.log(usuario.img);
            if (!usuario) {
                console.log('No es un usuario');
                return false;
            }
            const pathViejo = `./uploads/usuarios/${usuario.img}`
            console.log(pathViejo);
            console.log(fs.existsSync(pathViejo));
            if (fs.existsSync(pathViejo)) {
                //Borrar la imagen anterior
                fs.unlinkSync(pathViejo);
            }

            Usuario.img = nombreArchivo;
            await usuario.save();
            return true;

            break;
        case 'vehiculos':
            break;
    }
}

module.exports = {
    fileUpload
}
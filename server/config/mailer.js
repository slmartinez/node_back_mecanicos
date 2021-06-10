const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'sistemas2@tyb.co', // generated ethereal user
        pass: 'Kondors2020', // generated ethereal password
    },
});

const enviarCorreoCupon = (email, nombre, detalleCupon) => {
    //Configuración para enviar el correo
    transporter.sendMail({
        from: '"sistemas2@tyb.co', // sender address
        to: email, // list of receivers
        subject: `${nombre}`, // Subject line
        html: `${detalleCupon}`, // html body
    });

}

module.exports = {
    enviarCorreoCupon
}
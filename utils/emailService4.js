const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Verificación ÚNICA al iniciar
transporter.verify((error, success) => {
    if (error) {
        console.error('⚠️ Nota: La verificación inicial falló, pero los emails pueden enviarse igualmente');
    } else {
        console.log('✅ Servidor de email listo');
    }
});

const sendContactEmail = async (data) => {
    const { nombre, email, telefono, asunto, mensaje } = data;
    
    // Elimina el try-catch de verify aquí
    
    const mailOptions = {
        from: `"Servicios Eléctricos" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        replyTo: email,
        subject: `Nuevo mensaje de contacto: ${asunto}`,
        html: `
            <h2>Nuevo mensaje de contacto</h2>
            <p><strong>Nombre:</strong> ${nombre}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Teléfono:</strong> ${telefono}</p>
            <p><strong>Asunto:</strong> ${asunto}</p>
            <p><strong>Mensaje:</strong></p>
            <p>${mensaje}</p>
        `
    };
    
    return await transporter.sendMail(mailOptions);
};

module.exports = {
    sendContactEmail
};
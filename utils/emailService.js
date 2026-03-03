const nodemailer = require('nodemailer');
const dns = require('dns');

// Forzar IPv4 (importante para evitar problemas de conexión)
dns.setDefaultResultOrder('ipv4first');

// Configuración SIMPLE que SÍ funciona
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Logs para verificar
console.log('📧 EMAIL_USER:', process.env.EMAIL_USER);
console.log('📧 EMAIL_PASS existe:', !!process.env.EMAIL_PASS);

const sendContactEmail = async (data) => {
    const { nombre, email, telefono, asunto, mensaje } = data;
    
    const mailOptions = {
        from: `"Servicios Eléctricos" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        replyTo: email,
        subject: `Contacto: ${asunto}`,
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

// Enviar email de testimonio
const sendTestimonioEmail = async (data) => {
    const { nombre, email, servicio, calificacion, mensaje } = data;
    
    const mailOptions = {
        from: `"Servicios Eléctricos" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        replyTo: email,
        subject: 'Nuevo testimonio recibido',
        html: `
            <h2>Nuevo testimonio</h2>
            <p><strong>Nombre:</strong> ${nombre}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Servicio:</strong> ${servicio}</p>
            <p><strong>Calificación:</strong> ${'⭐'.repeat(calificacion)}</p>
            <p><strong>Testimonio:</strong></p>
            <p>${mensaje}</p>
        `
    };
    
    return await transporter.sendMail(mailOptions);
};

module.exports = {
    sendContactEmail,
    sendTestimonioEmail
};
const nodemailer = require('nodemailer');
const dns = require('dns');

// FORZAR IPv4 - SOLUCIÓN PARA RAILWAY
dns.setDefaultResultOrder('ipv4first'); // <--- LÍNEA CRÍTICA

// Configurar transporte de email con opciones específicas
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true para 465, false para 587
    requireTLS: true,
    auth: {
        user: process.env.EMAIL_USER || 'tu-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'tu-contraseña'
    },
    tls: {
        rejectUnauthorized: false, // No rechazar certificados autofirmados
        ciphers: 'SSLv3'
    },
    connectionTimeout: 30000, // 30 segundos
    greetingTimeout: 30000,
    socketTimeout: 60000
});

// Enviar email de contacto
const sendContactEmail = async (data) => {
    const { nombre, email, telefono, asunto, mensaje } = data;
    
    // Verificar conexión antes de enviar
    try {
        await transporter.verify();
        console.log('✅ Transporter verificado');
    } catch (verifyError) {
        console.log('⚠️ Error en verificación:', verifyError.message);
    }
    
    const mailOptions = {
        from: `"Servicios Eléctricos" <${process.env.EMAIL_USER || 'tu-email@gmail.com'}>`,
        to: process.env.EMAIL_USER || 'tu-email@gmail.com',
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

// Enviar email de testimonio
const sendTestimonioEmail = async (data) => {
    const { nombre, email, servicio, calificacion, mensaje } = data;
    
    const mailOptions = {
        from: `"Servicios Eléctricos" <${process.env.EMAIL_USER || 'tu-email@gmail.com'}>`,
        to: process.env.EMAIL_USER || 'tu-email@gmail.com',
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
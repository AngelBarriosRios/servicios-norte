// importar la libreria 
const express = require('express');
const dotenv =require('dotenv');



require('dotenv').config();
const { sendContactEmail } = require('./utils/emailService');
// VERIFICACIÓN TEMPORAL - Agrega esto
console.log('🔍 Verificando variables de entorno:');
console.log('EMAIL_USER:', process.env.EMAIL_USER ? '✓ Definido: ' + process.env.EMAIL_USER : '✗ No definido');
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '✓ Definido (longitud: ' + process.env.EMAIL_PASS.length + ')' : '✗ No definido');
console.log('EMAIL_PASS primeros 4 caracteres:', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.substring(0,4) : 'N/A');
// Objetos para llamar los metodos de express
const app = express();
const port = process.env.PORT || 5500;
//configuraciones
app.set("view engine", "ejs");


//middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true })); // ¡PARA FORMULARIOS! (DEBE IR ANTES DE LAS RUTAS)
app.use(express.json());   




app.use((req, res, next) => {
    // Solo aplicar CSP en producción o desarrollo (ajusta según necesites)
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'self'; " +                       // Permitir recursos del mismo origen
        "connect-src 'self' http://localhost:5500; " + // Permitir conexiones
        "form-action 'self'; " +                        // Permitir envío de formularios
        "font-src 'self' https://cdnjs.cloudflare.com https://fonts.googleapis.com https://fonts.gstatic.com; " +
        "style-src 'self' https://cdnjs.cloudflare.com https://fonts.googleapis.com 'unsafe-inline'; " +
        "script-src 'self' https://cdnjs.cloudflare.com; " + // Para JavaScript si lo necesitas
        "img-src 'self' data:;"                           // Para imágenes
    );
    next();
});


// RUTAS DE PÁGINAS ESTÁTICAS
app.get('/', (req, res) => {
    res.render('index', { 
        titulo: 'Servicios Eléctricos - Inicio',
        pagina: 'inicio'
    });
});

app.get('/services', (req, res) => {
    res.render('services', { 
        titulo: 'Servicios Eléctricos - Nuestros Servicios',
        pagina: 'servicios'
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        titulo: 'Servicios electricos - sobre mi',
        pagina: 'about'
    });
});

app.get('/politica', (req, res) => {
    res.render('politica', {
        titulo: 'Servicios electricos - politica',
        pagina: 'politica' 
    });
});

app.get('/testimonios', (req, res) => {
    res.render('testimonios', {
        titulo: 'Servicios electricos - Testimonios',
        pagina: 'testimonios'
    });
});

app.get('/dejar-testimonio', (req, res) => {
    res.render('dejar-testimonio', {
        titulo: 'Servicios electricos - comparte tu testimonio',
        pagina: 'testimonios'
    });
});
app.get('/contact', (req,res)=>{
    res.render('contact',{
        titulo:'Servicios electricos - contacto',
        pagina:'contact'
    });
});

/// ruta post para formulario

app.post("/enviar-contacto",async(req,res)=>{
    try{
        const {nombre, email, telefono, asunto, mensaje, privacidad} = req.body;
        
        const errors =[];
        if(!nombre) errors.push("el nombre es requerido");
        if(!email) errors.push("EL email es requerido");
        if (!telefono) errors.push("El teléfono es requerido");
        if (!mensaje) errors.push("El mensaje es requerido");
        if (!privacidad) errors.push("Debes aceptar la política de privacidad");

        if(errors.length> 0 ){
            return res.render('contact',{
                title:"Servicios Electricos - contacto",
                page: 'contact',
                errors: errors,
                datos: req.body
            });
        }

        await sendContactEmail(req.body);
        res.render('contact',{
            titulo: "Servicios Eléctricos - Contacto",
            pagina: 'contact',
            errors: [],
            datos: {},
            mensajeExito: "¡Mensaje enviado correctamente! Te contactaremos pronto."
        });

    }catch(error){
        console.error('Error al enviar email',error);
        res.render('contact',{
            titulo: "Servicios Eléctricos - Contacto",
            pagina: 'contact',
            errores: ["Error al enviar el mensaje. Intenta nuevamente."],
            datos: req.body
        });
    }
})

// redirigimos las rutas
app.get('/contact.html',(req,res)=> res.redirect('/contact'));
app.get('/about.html', (req, res) => res.redirect('/about'));
app.get('/Services.html', (req, res) => res.redirect('/services'));
app.get('/politica.html', (req, res) => res.redirect('/politica'));
app.get('/testimonios.html', (req, res) => res.redirect('/testimonios'));
app.get('/dejar-testimonio.html', (req, res) => res.redirect('/dejar-testimonio'));


//configurar el puerto usadp para el servidor local
app.listen(port,function(){
    console.log(`El servidor es http://localhost:${port}`);
})
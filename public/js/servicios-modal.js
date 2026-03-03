/**
 * MÓDULO DE MODALES PARA SERVICIOS
 * Versión: 1.0 - CORREGIDA
 */

console.log('✅ servicios-modal.js cargado correctamente');

// ============================================
// 1. CONFIGURACIÓN Y DATOS DE SERVICIOS
// ============================================
const SERVICIOS_CONFIG = {
    'Instalaciones-Eléctricas': {
        titulo: 'Instalaciones Eléctricas Profesionales',
        descripcionLarga: 'Realizamos instalaciones eléctricas completas para hogares y negocios, cumpliendo con todas las normativas de seguridad vigentes.',
        caracteristicas: [
            'Instalación de cuadros eléctricos',
            'Cableado estructurado',
            'Sistemas de puesta a tierra',
            'Certificaciones oficiales',
            'Garantía de 5 años'
        ],
        precioBase: '300€',
        icono: 'fa-bolt',
        imagenes: [],
        preguntasFrecuentes: [
            { pregunta: '¿Cuánto tiempo lleva una instalación?', respuesta: 'Depende del tamaño, pero suele ser de 2-3 días.' }
        ]
    },
    'Reparaciones': {
        titulo: 'Reparaciones Eléctricas Urgentes',
        descripcionLarga: 'Servicio de reparación eléctrica 24/7. Diagnosticamos y solucionamos cualquier avería.',
        caracteristicas: [
            'Servicio urgente 24 horas',
            'Diagnóstico gratuito',
            'Reparación en el día',
            'Garantía de 2 años'
        ],
        precioBase: '50€',
        icono: 'fa-tools',
        imagenes: [],
        preguntasFrecuentes: [
            { pregunta: '¿Atienden emergencias?', respuesta: 'Sí, 24/7 los 365 días.' }
        ]
    },
    'Energía Solar': {
        titulo: 'Instalación de Paneles Solares',
        descripcionLarga: 'Ahorra hasta un 70% en tu factura de luz con nuestros sistemas de energía solar.',
        caracteristicas: [
            'Paneles de alta eficiencia',
            'Inversores de última generación',
            'Baterías de litio',
            'Ayudas y subvenciones'
        ],
        precioBase: '4.500€',
        icono: 'fa-solar-panel',
        imagenes: [],
        preguntasFrecuentes: [
            { pregunta: '¿Necesito permiso?', respuesta: 'Nosotros gestionamos todos los permisos.' }
        ]
    },
    'Iluminación': {
        titulo: 'Diseño de Iluminación LED',
        descripcionLarga: 'Creamos ambientes únicos con sistemas de iluminación eficientes.',
        caracteristicas: [
            'Iluminación LED',
            'Sistemas domóticos',
            'Iluminación exterior',
            'Diseño personalizado'
        ],
        precioBase: '200€',
        icono: 'fa-lightbulb',
        imagenes: [],
        preguntasFrecuentes: [
            { pregunta: '¿Control por móvil?', respuesta: 'Sí, totalmente.' }
        ]
    },
    'Cargadores': {
        titulo: 'Puntos de Carga para Vehículos Eléctricos',
        descripcionLarga: 'Instalación de cargadores para vehículos eléctricos.',
        caracteristicas: [
            'Cargadores rápidos',
            'Instalación homologada',
            'Gestión de potencia',
            'Certificado oficial'
        ],
        precioBase: '800€',
        icono: 'fa-charging-station',
        imagenes: [],
        preguntasFrecuentes: [
            { pregunta: '¿Qué potencia necesito?', respuesta: 'Hacemos estudio gratuito.' }
        ]
    },
    'Protecciones': {
        titulo: 'Sistemas de Protección Eléctrica',
        descripcionLarga: 'Protege tu hogar con sistemas avanzados de seguridad eléctrica.',
        caracteristicas: [
            'Protección contra sobretensiones',
            'Diferenciales avanzados',
            'Pararrayos',
            'Mantenimiento preventivo'
        ],
        precioBase: '150€',
        icono: 'fa-shield-alt',
        imagenes: [],
        preguntasFrecuentes: [
            { pregunta: '¿Cada cuánto revisarlo?', respuesta: 'Recomendamos revisión anual.' }
        ]
    }
};

// ============================================
// 2. CLASE PRINCIPAL DEL MODAL
// ============================================
class ServiciosModal {
    constructor() {
        this.modal = null;
        this.overlay = null;
        this.initialized = false;
    }
    
    init() {
        if (this.initialized) return;
        console.log('🔄 Inicializando modales...');
        
        this.crearEstructuraModal();
        this.configurarEventListeners();
        this.initialized = true;
        console.log('✅ Modales listos');
    }
    
    crearEstructuraModal() {
        // Crear overlay
        this.overlay = document.createElement('div');
        this.overlay.className = 'modal-overlay';
        document.body.appendChild(this.overlay);
        
        // Crear modal
        this.modal = document.createElement('div');
        this.modal.className = 'servicio-modal';
        this.modal.id = 'servicioModal';
        this.modal.innerHTML = `
            <div class="modal-contenido">
                <button class="modal-cerrar" aria-label="Cerrar modal">
                    <i class="fas fa-times"></i>
                </button>
                <div class="modal-body">
                    <!-- Contenido dinámico -->
                </div>
            </div>
        `;
        document.body.appendChild(this.modal);
        console.log('📦 Estructura modal creada');
    }
    
    configurarEventListeners() {
        const tarjetas = document.querySelectorAll('.service-card');
        console.log(`🔍 Encontradas ${tarjetas.length} tarjetas`);
        
        tarjetas.forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('👆 Click en tarjeta:', card.id);
                this.abrirModal(card.id);
            });
        });
        
        const cerrarBtn = this.modal.querySelector('.modal-cerrar');
        if (cerrarBtn) {
            cerrarBtn.addEventListener('click', () => this.cerrarModal());
        }
        
        this.overlay.addEventListener('click', () => this.cerrarModal());
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('activo')) {
                this.cerrarModal();
            }
        });
    }
    
    abrirModal(servicioId) {
        const datos = SERVICIOS_CONFIG[servicioId];
        if (!datos) {
            console.error('❌ Servicio no encontrado:', servicioId);
            return;
        }
        
        console.log('📊 Abriendo modal para:', servicioId);
        
        const contenido = this.generarContenidoModal(datos, servicioId);
        this.modal.querySelector('.modal-body').innerHTML = contenido;
        
        this.modal.classList.add('activo');
        this.overlay.classList.add('activo');
        document.body.style.overflow = 'hidden';
    }
    
    generarContenidoModal(datos, servicioId) {
        const caracteristicasHTML = datos.caracteristicas
            .map(c => `<li><i class="fas fa-check-circle" style="color: #28a745;"></i> ${c}</li>`)
            .join('');
        
        const preguntasHTML = datos.preguntasFrecuentes
            .map(p => `
                <div class="modal-pregunta">
                    <h4><i class="fas fa-question-circle" style="color: #f5b342;"></i> ${p.pregunta}</h4>
                    <p>${p.respuesta}</p>
                </div>
            `)
            .join('');
        
        return `
            <div class="modal-grid">
                <div class="modal-info" style="grid-column: span 2;">
                    <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 20px;">
                        <div style="background: #f5b342; width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                            <i class="fas ${datos.icono}" style="font-size: 2.5rem; color: white;"></i>
                        </div>
                        <h2 style="color: #0a4b7a; margin: 0;">${datos.titulo}</h2>
                    </div>
                    
                    <div style="background: linear-gradient(135deg, #0a4b7a, #063357); color: white; padding: 20px; border-radius: 15px; margin-bottom: 20px;">
                        <span style="font-size: 2.5rem; font-weight: bold;">${datos.precioBase}</span>
                        <span style="margin-left: 10px;">IVA incluido</span>
                    </div>
                    
                    <p style="font-size: 1.1rem; line-height: 1.6; color: #666; margin-bottom: 20px;">
                        ${datos.descripcionLarga}
                    </p>
                    
                    <div style="background: #f8f9fa; padding: 25px; border-radius: 15px; margin-bottom: 20px;">
                        <h3 style="color: #0a4b7a; margin-bottom: 15px;">✓ Características</h3>
                        <ul style="list-style: none; padding: 0; display: grid; grid-template-columns: repeat(2,1fr); gap: 10px;">
                            ${caracteristicasHTML}
                        </ul>
                    </div>
                    
                    ${preguntasHTML ? `
                        <div style="padding: 25px; border: 1px solid #e0e0e0; border-radius: 15px; margin-bottom: 20px;">
                            <h3 style="color: #0a4b7a; margin-bottom: 15px;">❓ Preguntas frecuentes</h3>
                            ${preguntasHTML}
                        </div>
                    ` : ''}
                    
                    <div style="display: flex; gap: 15px; margin-top: 20px;">
                        <a href="/contacto?servicio=${encodeURIComponent(servicioId)}" 
                           style="flex: 2; background: #0a4b7a; color: white; text-decoration: none; padding: 15px 25px; border-radius: 12px; text-align: center; font-weight: 600;">
                            <i class="fas fa-calendar-check"></i> Solicitar presupuesto
                        </a>
                        <a href="tel:+34900123456" 
                           style="flex: 1; background: #f5b342; color: white; text-decoration: none; padding: 15px 25px; border-radius: 12px; text-align: center; font-weight: 600;">
                            <i class="fas fa-phone-alt"></i> Llamar
                        </a>
                    </div>
                </div>
            </div>
        `;
    }
    
    cerrarModal() {
        this.modal.classList.remove('activo');
        this.overlay.classList.remove('activo');
        document.body.style.overflow = '';
    }
}

// ============================================
// 3. INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM cargado, iniciando modales...');
    const modal = new ServiciosModal();
    modal.init();
    window.serviciosModal = modal; // Para debug
});
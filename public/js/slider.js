/* 
MÓDULO 1: CLASE PRINCIPAL DEL SLIDER

Encapsulamos toda la funcionalidad en una clase
para mejor organización y reutilización
*/
class HeroSlider {
    
    /* 

    MÓDULO 2: CONSTRUCTOR

    Inicializa las propiedades y elementos del DOM
    */
    constructor() {
        // Elementos del DOM
        this.slides = document.querySelectorAll('.slide');
        this.dots = document.querySelectorAll('.slider-dot');
        this.prevBtn = document.querySelector('.prev');
        this.nextBtn = document.querySelector('.next');
        this.progressBar = document.querySelector('.progress-bar');
        this.sliderContainer = document.querySelector('.hero-slider');
        
        // Estado del slider
        this.currentSlide = 0;
        this.slideInterval = null;
        this.progressInterval = null;
        this.isPlaying = true;
        this.progress = 0;
        
        // Configuración (puedes modificar estos valores)
        this.config = {
            slideDuration: 5000,      // 5 segundos por slide
            transitionTime: 800,       // 0.8 segundos de transición
            autoplay: true,            // Activar autoplay
            pauseOnHover: true,        // Pausar al hacer hover
            keyboardNavigation: true    // Navegación por teclado
        };
        
        // Inicializar el slider
        this.init();
    }
    
    /* 
    ============================================
    MÓDULO 3: INICIALIZACIÓN
    ============================================
    Configura todos los event listeners y arranca el slider
    */
    init() {
        this.validateElements();      // Verificamos que existan los elementos
        
        // Configurar event listeners
        this.setupEventListeners();
        
        // Iniciar autoplay si está activado
        if (this.config.autoplay) {
            this.startAutoplay();
            this.startProgressBar();
        }
        
        // Aplicar ARIA labels para accesibilidad
        this.setupAriaLabels();
        
        console.log('✅ Slider inicializado correctamente');
    }
    
    /* 
    ============================================
    MÓDULO 4: VALIDACIÓN DE ELEMENTOS
    ============================================
    Verifica que todos los elementos necesarios existan
    */
    validateElements() {
        if (!this.slides.length) {
            console.error('❌ No se encontraron slides');
            return;
        }
        
        if (!this.dots.length) {
            console.warn('⚠️ No se encontraron dots de navegación');
        }
        
        if (!this.prevBtn || !this.nextBtn) {
            console.warn('⚠️ No se encontraron botones de navegación');
        }
    }
    
    /* 
    ============================================
    MÓDULO 5: CONFIGURACIÓN DE EVENTOS
    ============================================
    Añade todos los event listeners necesarios
    */
    setupEventListeners() {
        // Eventos para botones de navegación
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }
        
        // Eventos para dots
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Evento de hover (pausar/reanudar)
        if (this.config.pauseOnHover && this.sliderContainer) {
            this.sliderContainer.addEventListener('mouseenter', () => this.pauseSlider());
            this.sliderContainer.addEventListener('mouseleave', () => this.playSlider());
        }
        
        // Navegación por teclado
        if (this.config.keyboardNavigation) {
            document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        }
        
        // Evento de resize para mantener proporciones
        window.addEventListener('resize', () => this.handleResize());
    }
    
    /* 
    ============================================
    MÓDULO 6: ACCESIBILIDAD (ARIA)
    ============================================
    Mejora la accesibilidad para lectores de pantalla
    */
    setupAriaLabels() {
        // Marcar el contenedor principal
        this.sliderContainer.setAttribute('aria-roledescription', 'carrusel');
        
        // Configurar cada slide
        this.slides.forEach((slide, index) => {
            slide.setAttribute('aria-roledescription', 'slide');
            slide.setAttribute('aria-label', `${index + 1} de ${this.slides.length}`);
        });
    }
    
    /* 

    MÓDULO 7: NAVEGACIÓN POR TECLADO

    Maneja las flechas del teclado
    */
    handleKeyboard(e) {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            this.prevSlide();
        }
        
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            this.nextSlide();
        }
    }
    
/* 

MÓDULO 8: MOSTRAR SLIDE ESPECÍFICA - VERSIÓN OPTIMIZADA

Muestra la slide correspondiente al índice
CON EFECTO CIRCULAR Y BARRA DE PROGRESO OPTIMIZADA
*/
showSlide(index) {
    const previousIndex = this.currentSlide; 
    
    // Validación de índice circular
    if (index < 0) {
        index = this.slides.length - 1;
        console.log('↺ Volviendo a la última slide');
    } else if (index >= this.slides.length) {
        index = 0;
        console.log('↻ Volviendo al inicio');
    }
    
    // Validación adicional de seguridad
    if (index < 0 || index >= this.slides.length) {
        console.error('❌ Índice de slide inválido:', index);
        return;
    }
    
    // Solo proceder si el índice es diferente al actual
    if (previousIndex === index) {
        console.log('⏸️ Ya estamos en esta slide');
        return;
    }
    
    // DETENER LA BARRA DE PROGRESO ANTES DE CAMBIAR
    this.stopProgressBar();
    
    // Remover clase active de todas las slides
    this.slides.forEach(slide => {
        slide.classList.remove('active');
        slide.setAttribute('aria-hidden', 'true');
    });
    
    // Remover clase active de todos los dots
    this.dots.forEach(dot => {
        dot.classList.remove('active');
        dot.setAttribute('aria-selected', 'false');
    });
    
    // Activar slide actual
    this.slides[index].classList.add('active');
    this.slides[index].setAttribute('aria-hidden', 'false');
    
    // Activar dot actual (con verificación de existencia)
    if (this.dots && this.dots[index]) {
        this.dots[index].classList.add('active');
        this.dots[index].setAttribute('aria-selected', 'true');
    }
    
    // Actualizar índice actual
    this.currentSlide = index;
    
    // Mostrar información de navegación (útil para debugging)
    console.log(`📸 Slide: ${previousIndex + 1} → ${index + 1} de ${this.slides.length}`);
    
    // Disparar evento personalizado
    this.dispatchSlideChangeEvent(index);
    
    // REINICIAR BARRA DE PROGRESO Y REANUDAR SOLO SI ESTÁ REPRODUCIENDO
    this.resetProgress();
    
    // REINICIAR EL INTERVALO DE AUTOPLAY PARA MANTENER SINCRONIZACIÓN
    if (this.isPlaying && this.config.autoplay) {
        this.restartAutoplay(); // Necesitamos este nuevo método
    }
}
    
    /* 

    MÓDULO 9: NAVEGACIÓN

    Métodos para moverse entre slides
    */
    nextSlide() {
        this.showSlide(this.currentSlide + 1);
    }
    
    prevSlide() {
        this.showSlide(this.currentSlide - 1);
    }
    
    goToSlide(index) {
        if (index >= 0 && index < this.slides.length) {
            this.showSlide(index);
        }
    }
    
    /* 

    MÓDULO 10: EVENTO PERSONALIZADO

    Permite que otros scripts escuchen cambios en el slider
    */
    dispatchSlideChangeEvent(index) {
        const event = new CustomEvent('slideChange', {
            detail: {
                currentSlide: index,
                totalSlides: this.slides.length
            }
        });
        this.sliderContainer.dispatchEvent(event);
    }
    
    /* 

    MÓDULO 11: CONTROL DE AUTOPLAY
 
    Inicia, pausa y reanuda la reproducción automática
    */
    startAutoplay() {
        this.stopAutoplay();
        
        this.slideInterval = setInterval(() => {
            this.nextSlide();
        }, this.config.slideDuration);
    }
    
    stopAutoplay() {
        if (this.slideInterval) {
            clearInterval(this.slideInterval);
            this.slideInterval = null;
        }
    }
    
    pauseSlider() {
        if (this.isPlaying) {
            this.isPlaying = false;
            this.stopAutoplay();
            this.stopProgressBar();
            this.sliderContainer.classList.add('paused');
        }
    }
    
    playSlider() {
        if (!this.isPlaying) {
            this.isPlaying = true;
            if (this.config.autoplay) {
                this.startAutoplay();
                this.startProgressBar();
            }
            this.sliderContainer.classList.remove('paused');
        }
    }
    
    /* 

    MÓDULO 12: BARRA DE PROGRESO

    Controla la animación de la barra de progreso
    */
    startProgressBar() {
        this.stopProgressBar();
        this.progress = 0;
        
        const incrementStep = 100 / (this.config.slideDuration / 100);
        
        this.progressInterval = setInterval(() => {
            if (this.progress < 100) {
                this.progress = Math.min(this.progress + incrementStep, 100);
                this.updateProgressBar();
            }
        }, 100);
    }
    
    stopProgressBar() {
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
        }
    }
    
    resetProgress() {
        this.progress = 0;
        this.updateProgressBar();
        this.stopProgressBar();
        if (this.isPlaying && this.config.autoplay) {
            this.startProgressBar();
        }
    }
    
    updateProgressBar() {
        if (this.progressBar) {
            this.progressBar.style.width = `${this.progress}%`;
            this.progressBar.setAttribute('aria-valuenow', this.progress);
        }
    }
    
    /* 

    MÓDULO 13: RESIZE HANDLER

    Maneja cambios en el tamaño de la ventana
    */
    handleResize() {
        // Podemos añadir lógica específica si es necesaria
        // Por ejemplo, recargar imágenes de alta resolución
    }
    
    /* 

    MÓDULO 14: MÉTODOS PÚBLICOS

    API pública para controlar el slider desde fuera
    */
    goToFirst() {
        this.goToSlide(0);
    }
    
    goToLast() {
        this.goToSlide(this.slides.length - 1);
    }
    
    toggleAutoplay() {
        this.config.autoplay = !this.config.autoplay;
        if (this.config.autoplay) {
            this.playSlider();
        } else {
            this.pauseSlider();
        }
    }
    
    getCurrentSlide() {
        return this.currentSlide;
    }
    
    /* 

    MÓDULO 15: DESTRUCTOR

    Limpia recursos cuando el slider se destruye
    */
    destroy() {
        this.stopAutoplay();
        this.stopProgressBar();
        
        // Remover event listeners
        window.removeEventListener('resize', this.handleResize);
        
        console.log('🧹 Slider destruido y recursos liberados');
    }
}

/* 

MÓDULO 16: INICIALIZACIÓN

Esperamos a que el DOM esté listo y creamos el slider
*/
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Crear instancia del slider
        const slider = new HeroSlider();
        
        // Exponer slider globalmente para debugging (opcional)
        window.slider = slider;
        
        // Ejemplo de cómo escuchar cambios en el slider
        document.querySelector('.hero-slider').addEventListener('slideChange', (e) => {
            console.log(`📸 Slide cambiada a: ${e.detail.currentSlide + 1}/${e.detail.totalSlides}`);
        });
        
    } catch (error) {
        console.error('❌ Error al inicializar el slider:', error);
    }
});

/* 

MÓDULO 17: PREVENCIÓN DE MEMORY LEAKS

Limpiamos todo si la página se descarga
*/
window.addEventListener('beforeunload', () => {
    if (window.slider) {
        window.slider.destroy();
    }
});
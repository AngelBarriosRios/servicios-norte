/**
 * HeroSlider - Slider principal para la página de inicio
 * Versión: 2.0
 */

class HeroSlider {
    constructor(config = {}) {
        // Configuración por defecto
        this.config = {
            selector: '.hero-slider',
            autoplay: true,
            autoplaySpeed: 5000,
            transitionSpeed: 500,
            pauseOnHover: true,
            progressBar: true,
            keyboardNav: true,
            ...config
        };

        // Elementos del DOM
        this.slider = document.querySelector(this.config.selector);
        if (!this.slider) {
            console.error('❌ No se encontró el slider');
            return;
        }

        this.wrapper = this.slider.querySelector('.slider-wrapper');
        this.slides = this.slider.querySelectorAll('.slide');
        this.prevBtn = this.slider.querySelector('.slider-arrow.prev');
        this.nextBtn = this.slider.querySelector('.slider-arrow.next');
        this.dots = this.slider.querySelectorAll('.slider-dot');
        this.progressBar = this.slider.querySelector('.progress-bar');

        // Estado
        this.currentIndex = 0;
        this.totalSlides = this.slides.length;
        this.autoplayInterval = null;
        this.isTransitioning = false;
        this.progressWidth = 0;
        this.progressInterval = null;

        // Inicializar
        this.init();
    }

    init() {
        if (this.totalSlides === 0) {
            console.warn('⚠️ No hay slides para mostrar');
            return;
        }

        console.log('✅ Slider inicializado correctamente');
        console.log(`📊 Total slides: ${this.totalSlides}`);

        // Mostrar primer slide
        this.showSlide(0);

        // Configurar eventos
        this.setupEventListeners();

        // Iniciar autoplay
        if (this.config.autoplay) {
            this.startAutoplay();
        }

        // Iniciar barra de progreso
        if (this.config.progressBar && this.progressBar) {
            this.startProgressBar();
        }

        // Pausar en hover
        if (this.config.pauseOnHover) {
            this.setupHoverEvents();
        }
    }

    showSlide(index) {
        if (this.isTransitioning) return;
        
        // Validar índice
        if (index < 0) index = this.totalSlides - 1;
        if (index >= this.totalSlides) index = 0;

        this.isTransitioning = true;

        // Actualizar slides
        this.slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });

        // Actualizar dots
        this.dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });

        this.currentIndex = index;
        
        console.log(`📸 Slide: ${this.currentIndex + 1} → ${index + 1} de ${this.totalSlides}`);

        // Resetear transición después de la animación
        setTimeout(() => {
            this.isTransitioning = false;
        }, this.config.transitionSpeed);

        // Reiniciar barra de progreso
        if (this.config.progressBar && this.progressBar) {
            this.resetProgressBar();
        }

        // ✅ NUEVO: Reiniciar autoplay
        this.restartAutoplay();
    }

    // ✅ NUEVO MÉTODO: restartAutoplay
    restartAutoplay() {
        if (this.config.autoplay) {
            this.stopAutoplay();
            this.startAutoplay();
        }
    }

    nextSlide() {
        if (this.isTransitioning) return;
        this.showSlide(this.currentIndex + 1);
        console.log(`📸 Slide cambiada a: ${this.currentIndex + 1}/${this.totalSlides}`);
    }

    prevSlide() {
        if (this.isTransitioning) return;
        this.showSlide(this.currentIndex - 1);
        console.log(`📸 Slide cambiada a: ${this.currentIndex + 1}/${this.totalSlides}`);
    }

    startAutoplay() {
        if (!this.config.autoplay) return;
        
        this.stopAutoplay();
        this.autoplayInterval = setInterval(() => {
            this.nextSlide();
        }, this.config.autoplaySpeed);
        
        console.log(`▶️ Autoplay iniciado (${this.config.autoplaySpeed}ms)`);
    }

    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
            console.log('⏸️ Autoplay detenido');
        }
    }

    startProgressBar() {
        if (!this.progressBar) return;

        this.progressWidth = 0;
        this.progressBar.style.width = '0%';
        
        const step = 100 / (this.config.autoplaySpeed / 100); // Incremento cada 100ms

        this.progressInterval = setInterval(() => {
            if (!this.config.autoplay) return;
            
            this.progressWidth += step;
            if (this.progressWidth >= 100) {
                this.progressWidth = 0;
            }
            this.progressBar.style.width = `${this.progressWidth}%`;
        }, 100);
    }

    resetProgressBar() {
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
        }
        this.progressWidth = 0;
        if (this.progressBar) {
            this.progressBar.style.width = '0%';
        }
        if (this.config.autoplay && this.config.progressBar) {
            this.startProgressBar();
        }
    }

    setupEventListeners() {
        // Botones prev/next
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => {
                this.prevSlide();
                this.restartAutoplay(); // Reiniciar autoplay al hacer clic
            });
        }

        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => {
                this.nextSlide();
                this.restartAutoplay(); // Reiniciar autoplay al hacer clic
            });
        }

        // Dots
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                if (this.currentIndex !== index) {
                    this.showSlide(index);
                    this.restartAutoplay(); // Reiniciar autoplay al hacer clic
                }
            });
        });

        // Teclado
        if (this.config.keyboardNav) {
            document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') {
                    this.prevSlide();
                    this.restartAutoplay();
                } else if (e.key === 'ArrowRight') {
                    this.nextSlide();
                    this.restartAutoplay();
                }
            });
        }
    }

    setupHoverEvents() {
        this.slider.addEventListener('mouseenter', () => {
            this.stopAutoplay();
            if (this.progressInterval) {
                clearInterval(this.progressInterval);
            }
        });

        this.slider.addEventListener('mouseleave', () => {
            if (this.config.autoplay) {
                this.startAutoplay();
                if (this.config.progressBar) {
                    this.startProgressBar();
                }
            }
        });
    }

    // Método para destruir el slider (limpiar recursos)
    destroy() {
        this.stopAutoplay();
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
        }
        // Remover event listeners si es necesario
        console.log('🗑️ Slider destruido');
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Buscar sliders en la página
    const sliders = document.querySelectorAll('.hero-slider');
    
    if (sliders.length === 0) {
        console.warn('⚠️ No se encontraron sliders en la página');
        return;
    }

    // Inicializar cada slider encontrado
    sliders.forEach((slider, index) => {
        console.log(`🎯 Inicializando slider ${index + 1}/${sliders.length}`);
        
        // Puedes personalizar la configuración por slider usando data attributes
        const autoplaySpeed = slider.dataset.autoplaySpeed || 5000;
        
        new HeroSlider({
            selector: `.hero-slider:nth-of-type(${index + 1})`,
            autoplay: true,
            autoplaySpeed: parseInt(autoplaySpeed),
            pauseOnHover: true,
            progressBar: true,
            keyboardNav: true
        });
    });
});

// Para uso en desarrollo (opcional)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HeroSlider;
}
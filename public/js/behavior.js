document.addEventListener('DOMContentLoaded', function(){
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-container ul');

    if(navToggle && navMenu ){
        navToggle.addEventListener('click', function(e){
            e.stopPropagation();
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
                /* close*/
        navMenu.querySelectorAll('a').forEach(link=>{
            link.addEventListener('click',function(e){
                e.stopPropagation();
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        document.addEventListener('click',(e)=>{
            if(!navToggle.contains(e.target) && !navMenu.contains(e.target)){
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
});


/* Script para animación de contadores */

document.addEventListener('DOMContentLoaded', () => {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200;

    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-target'));
        let count = 0;
        
        const updateCount = () => {
            const increment = target / speed;
            
            if (count < target) {
                count += increment;
                counter.innerText = Math.ceil(count);
                setTimeout(updateCount, 1);
            } else {
                counter.innerText = target + '+';
            }
        };
        
        updateCount();
    };

    // Intersection Observer para activar animación cuando sea visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
});


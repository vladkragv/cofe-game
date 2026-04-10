// ============================================
// ANIMATIONS.JS - Уникальные анимации при скроллинге
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initializeScrollAnimations();
    initializeMagicEffects();
    initializeFantasyParticles();
});

function initializeScrollAnimations() {
    // threshold: 0 — иначе очень высокие блоки (напр. .page-reveal-section со всей сеткой карт)
    // могут не достигать 10% видимой площади при первом кадре, и страница остаётся opacity:0
    // до первого скролла.
    const options = {
        threshold: 0,
        rootMargin: '0px 0px -50px 0px'
    };

    const animationMap = {
        'stat-item': 'mysticalBounce 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'point-item': 'slideInWithGlow 0.8s cubic-bezier(0.19, 1, 0.22, 1) forwards',
        'tip-item': 'fadeInWithRotation 0.7s ease-out forwards',
        'faq-item': 'expandFromCenter 0.8s ease-out forwards',
        'card-container': 'enigmaticReveal 0.9s ease-out forwards',
        'gallery-item': 'scaleIn 0.6s ease forwards',
        'about-section': 'fadeInWithMist 0.9s ease-out forwards',
        'page-reveal-section': 'fadeInWithMist 0.9s ease-out forwards',
        'rules-subsection': 'slideInWithMist 0.8s ease-out forwards'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Найти подходящую анимацию
                let animation = 'fadeInUp 0.8s ease forwards';
                for (const [className, anim] of Object.entries(animationMap)) {
                    if (element.classList.contains(className)) {
                        animation = anim;
                        break;
                    }
                }
                
                // Добавить задержку для стеклянного эффекта
                element.style.animation = animation;
                const animDelay = Number(element.dataset.animDelay || 0);
                // Для галереи героев задержка считается по рядам (синхронное появление ряда)
                element.style.animationDelay = `${animDelay}s`;
                // Фолбэк видимости: если для элемента задана стартовая opacity: 0
                // и анимация не сработает, он всё равно останется видимым.
                element.style.opacity = '1';
                element.classList.add('animated');
                
                observer.unobserve(element);
            }
        });
    }, options);

    // Применить observer к элементам
    const animatedElements = document.querySelectorAll(
        '.stat-item, .point-item, .tip-item, .faq-item, .card-container, ' +
        '.about-section, .page-reveal-section, .rules-subsection, .gallery-item, .card-item, ' +
        '.rule-block, .example-block, .table-of-contents'
    );

    animatedElements.forEach((element, index) => {
        let delay = (index % 4) * 0.08;

        if (element.classList.contains('gallery-item')) {
            const parent = element.parentElement;
            const siblingItems = parent ? Array.from(parent.querySelectorAll('.gallery-item')) : [];
            const itemIndex = siblingItems.indexOf(element);
            const columns = parent
                ? Math.max(1, getComputedStyle(parent).gridTemplateColumns.split(' ').filter(Boolean).length)
                : 4;
            const row = itemIndex >= 0 ? Math.floor(itemIndex / columns) : 0;
            const inHeroGallery = Boolean(element.closest('.cards-gallery'));
            if (inHeroGallery) {
                const col = itemIndex >= 0 ? itemIndex % columns : 0;
                /* Волна: слева направо, затем следующий ряд — под стиль «колоды» */
                delay = col * 0.076 + row * 0.11;
            } else {
                delay = row * 0.24;
            }
        }

        element.dataset.animDelay = String(delay);
        if (element.classList.contains('gallery-item') && element.closest('.cards-gallery')) {
            element.style.setProperty('--hero-reveal-delay', `${delay}s`);
        }
        observer.observe(element);
    });
}

// Инициализировать магические эффекты
function initializeMagicEffects() {
    let lastScrollTop = 0;
    let isAutoScrolling = false;
    
    // Эффект мистического свечения при скроллинге
    document.addEventListener('scroll', () => {
        if (isAutoScrolling) return;
        
        const scrolled = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = scrolled / maxScroll;
        
        // Обновить цвет фонового свечения в зависимости от позиции скролла
        const hue = 210 + (scrollPercent * 30);
        document.documentElement.style.setProperty('--scroll-hue', hue);
        
        // Параллакс для hero отключен, чтобы не появлялись швы по краям.
        
        // Смарт-скролл функция для главной страницы (отключен)
        // handleSmartScroll(scrolled);
        lastScrollTop = scrolled;
    }, { passive: true });
    
    // Функция смарт-скролла
    function handleSmartScroll(scrolled) {
        const gameDescSection = document.querySelector('.game-description');
        if (!gameDescSection) return; // Не на главной странице
        
        const scrollDirection = scrolled > lastScrollTop ? 'down' : 'up';
        const heroHeight = window.innerHeight * 1.2; // Примерная высота героя
        const gameDescTop = gameDescSection.getBoundingClientRect().top + scrolled;
        
        // Если скроллим вниз в пределах героя, автоскроллим до "О игре"
        if (scrollDirection === 'down' && scrolled < heroHeight && scrolled > 0) {
            isAutoScrolling = true;
            smoothScrollTo(gameDescTop - 100, 800);
            setTimeout(() => { isAutoScrolling = false; }, 850);
        }
        
        // Если скроллим вверх в пределах "О игре", автоскроллим в начало
        if (scrollDirection === 'up' && scrolled < gameDescTop - 50 && scrolled > heroHeight - 100) {
            isAutoScrolling = true;
            smoothScrollTo(0, 800);
            setTimeout(() => { isAutoScrolling = false; }, 850);
        }
    }
    
    // Функция плавного скролла
    function smoothScrollTo(target, duration = 800) {
        const start = window.scrollY;
        const distance = target - start;
        let startTime = null;
        
        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (cubic-in-out)
            const easeProgress = progress < 0.5 
                ? 4 * progress * progress * progress 
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;
            
            window.scrollTo(0, start + distance * easeProgress);
            
            if (progress < 1) {
                requestAnimationFrame(animation);
            }
        }
        
        requestAnimationFrame(animation);
    }
    
    // Добавить интерактивное свечение к элементам
    document.addEventListener('mousemove', (e) => {
        const elements = document.querySelectorAll('.card-container, .card-preview, .stat-item');
        
        elements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const distance = Math.hypot(
                e.clientX - (rect.left + rect.width / 2),
                e.clientY - (rect.top + rect.height / 2)
            );
            
            const maxDistance = 300;
            const intensity = Math.max(0, 1 - distance / maxDistance);
            
            if (intensity > 0) {
                element.style.boxShadow = `
                    0 0 20px rgba(212, 165, 116, ${intensity * 0.6}),
                    0 0 40px rgba(125, 187, 170, ${intensity * 0.3}),
                    inset 0 0 20px rgba(212, 165, 116, ${intensity * 0.2})
                `;
            }
        });
    }, { passive: true });
}

function initializeFantasyParticles() {
    const canvas = document.createElement('canvas');
    canvas.className = 'global-particles-canvas';
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    document.body.appendChild(canvas);

    /** С ширины 1024px — как на десктопе; уже — только дрейф, без притяжения к «курсору» */
    const PARTICLES_WIDE_MIN = 1024;

    let w = 0;
    let h = 0;
    let raf = null;
    const cursor = { x: 0, y: 0, active: false };
    const particles = Array.from({ length: 180 }).map(() => ({
        x: Math.random() * 1,
        y: Math.random() * 1,
        vx: (Math.random() - 0.5) * 0.0001,
        vy: (Math.random() - 0.5) * 0.0001,
        ax: (Math.random() - 0.5) * 0.0000026,
        ay: (Math.random() - 0.5) * 0.0000026,
        r: Math.random() * 2.2 + 0.75
    }));
    let lastCursorX = 0;
    let lastCursorY = 0;
    let cursorSpeed = 0;
    let hasCursorSample = false;
    let lastResizeNarrow = null;

    function resize() {
        const prevNarrow = lastResizeNarrow;
        w = Math.max(1, window.innerWidth);
        h = Math.max(1, window.innerHeight);
        canvas.width = w;
        canvas.height = h;
        const narrowNow = w < PARTICLES_WIDE_MIN;
        if (prevNarrow === true && !narrowNow) {
            hasCursorSample = false;
            cursor.active = false;
            cursorSpeed = 0;
        }
        lastResizeNarrow = narrowNow;
    }

    function tick() {
        ctx.clearRect(0, 0, w, h);
        const isMinigameOpen = document.body.classList.contains('minigame-open');
        if (isMinigameOpen) {
            cursor.active = false;
            cursorSpeed = 0;
        }

        const narrow = w < PARTICLES_WIDE_MIN;
        const useCursor = cursor.active && !isMinigameOpen && !narrow;
        const driftJitter = narrow ? 0.00000125 : 0.0000006;
        const damp = narrow ? 0.9972 : 0.995;
        const radiusScale = narrow ? 0.38 : 1;
        const blurScale = narrow ? 0.32 : 1;
        const alphaScale = narrow ? 0.82 : 1;

        particles.forEach(p => {
            // Хаотичный дрейф; на узком экране чуть сильнее, чтобы не казалось «падением»
            p.ax += (Math.random() - 0.5) * driftJitter;
            p.ay += (Math.random() - 0.5) * driftJitter;
            p.ax = Math.max(-0.0000038, Math.min(0.0000038, p.ax));
            p.ay = Math.max(-0.0000038, Math.min(0.0000038, p.ay));

            if (useCursor) {
                const px = p.x * w;
                const py = p.y * h;
                const dx = cursor.x - px;
                const dy = cursor.y - py;
                const dist = Math.hypot(dx, dy) || 1;

                // Легкое "сгущение" у курсора, когда движение спокойное
                const attract = Math.max(0, 1 - dist / 110) * 0.00008;
                p.vx += (dx / dist) * attract;
                p.vy += (dy / dist) * attract;

                // Чувствительный разлет при движении курсора (сингулярный "всплеск")
                const repelPower = Math.min(cursorSpeed / 17, 2.2);
                const repel = Math.max(0, 1 - dist / 260) * (0.00052 * repelPower);
                p.vx -= (dx / dist) * repel;
                p.vy -= (dy / dist) * repel;
            }

            p.vx += p.ax;
            p.vy += p.ay;
            p.vx *= damp;
            p.vy *= damp;
            p.x += p.vx;
            p.y += p.vy;

            if (narrow) {
                const edge = 0.018;
                if (p.x < edge) {
                    p.x = edge;
                    p.vx = Math.max(p.vx, 0.000055) + (Math.random() - 0.5) * 0.00002;
                } else if (p.x > 1 - edge) {
                    p.x = 1 - edge;
                    p.vx = Math.min(p.vx, -0.000055) + (Math.random() - 0.5) * 0.00002;
                }
                if (p.y < edge) {
                    p.y = edge;
                    p.vy = Math.max(p.vy, 0.000055) + (Math.random() - 0.5) * 0.00002;
                } else if (p.y > 1 - edge) {
                    p.y = 1 - edge;
                    p.vy = Math.min(p.vy, -0.000055) + (Math.random() - 0.5) * 0.00002;
                }
                p.x = Math.min(1 - edge, Math.max(edge, p.x));
                p.y = Math.min(1 - edge, Math.max(edge, p.y));
            } else {
                if (p.x < 0 || p.x > 1) p.vx *= -1;
                if (p.y < 0 || p.y > 1) p.vy *= -1;
                p.x = Math.min(1, Math.max(0, p.x));
                p.y = Math.min(1, Math.max(0, p.y));
            }

            const drawR = p.r * radiusScale;
            let alpha = (0.08 + (p.r / 3.2) * 0.24) * alphaScale;
            if (narrow) alpha = Math.min(alpha, 0.34);
            const shadowBlur = (8 + p.r * 3.5) * blurScale;
            ctx.shadowBlur = shadowBlur;
            ctx.shadowColor = `rgba(240, 208, 140, ${Math.min(alpha * 1.8, 0.45)})`;
            ctx.beginPath();
            ctx.fillStyle = `rgba(240, 208, 140, ${alpha})`;
            ctx.arc(p.x * w, p.y * h, drawR, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        });

        raf = requestAnimationFrame(tick);
    }

    function samplePointer(clientX, clientY) {
        if (!hasCursorSample) {
            lastCursorX = clientX;
            lastCursorY = clientY;
            hasCursorSample = true;
            cursorSpeed = 0;
        } else {
            const dx = clientX - lastCursorX;
            const dy = clientY - lastCursorY;
            cursorSpeed = Math.hypot(dx, dy);
            lastCursorX = clientX;
            lastCursorY = clientY;
        }
        cursor.x = clientX;
        cursor.y = clientY;
        cursor.active = true;
    }

    window.addEventListener('mousemove', (e) => {
        if (document.body.classList.contains('minigame-open')) return;
        if (w < PARTICLES_WIDE_MIN) return;
        samplePointer(e.clientX, e.clientY);
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        if (document.body.classList.contains('minigame-open')) return;
        if (w < PARTICLES_WIDE_MIN) return;
        const touch = e.touches && e.touches[0];
        if (!touch) return;
        samplePointer(touch.clientX, touch.clientY);
    }, { passive: true });

    window.addEventListener('touchend', () => {
        cursor.active = false;
        cursorSpeed = 0;
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
        cursor.active = false;
        cursorSpeed = 0;
    }, { passive: true });

    resize();
    tick();
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('beforeunload', () => {
        if (raf) cancelAnimationFrame(raf);
    });
}

// Функция для принудительного запуска анимаций
function triggerAnimations(container = document) {
    const elements = container.querySelectorAll(
        '.stat-item, .point-item, .tip-item, .faq-item, .card-container, ' +
        '.about-section, .rules-subsection, .gallery-item'
    );

    let delay = 0;
    elements.forEach(element => {
        const randomAnims = [
            'mysticalBounce 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
            'slideInWithGlow 0.8s cubic-bezier(0.19, 1, 0.22, 1) forwards',
            'expandFromCenter 0.8s ease-out forwards'
        ];
        
        const randomAnim = randomAnims[Math.floor(Math.random() * randomAnims.length)];
        
        setTimeout(() => {
            element.style.animation = randomAnim;
        }, delay);
        
        delay += 80;
    });
}

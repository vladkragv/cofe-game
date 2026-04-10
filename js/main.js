// ============================================
// MAIN.JS - Основная функциональность
// ============================================

// Мобильное меню
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const headerEl = document.querySelector('.header');
const headerContentEl = document.querySelector('.header-content');
const navMenuEl = document.querySelector('.nav-menu');
const gameSelectorEl = document.querySelector('.game-selector');
let isPageTransitioning = false;
let pageTransitionFallbackTimer = null;

function ensurePageTransitionScreen() {
    let screen = document.getElementById('pageTransitionScreen');
    if (!screen) {
        screen = document.createElement('div');
        screen.id = 'pageTransitionScreen';
        screen.className = 'page-transition-screen';
        document.body.appendChild(screen);
    }
    return screen;
}

function navigateWithTransition(href) {
    if (!href || isPageTransitioning) return;
    isPageTransitioning = true;
    const screen = ensurePageTransitionScreen();
    if (pageTransitionFallbackTimer) {
        window.clearTimeout(pageTransitionFallbackTimer);
    }
    document.body.classList.add('page-leaving');
    screen.classList.add('active');

    // В редких случаях браузер может отменить навигацию — снимаем блокировку.
    pageTransitionFallbackTimer = window.setTimeout(() => {
        isPageTransitioning = false;
        document.body.classList.remove('page-leaving');
        screen.classList.remove('active');
    }, 1200);

    window.setTimeout(() => {
        window.location.assign(href);
    }, 340);
}

function initializePageTransitions() {
    const screen = ensurePageTransitionScreen();
    requestAnimationFrame(() => {
        document.body.classList.add('page-entering');
        window.setTimeout(() => {
            document.body.classList.remove('page-entering');
            screen.classList.remove('active');
        }, 320);
    });

    document.addEventListener('click', (event) => {
        if (event.defaultPrevented) return;
        // Не перехватываем служебные клики (новая вкладка/окно и т.д.).
        if (event.button !== 0) return;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

        const target = event.target;
        if (!(target instanceof Element)) return;
        const link = target.closest('a');
        if (!link) return;
        const href = link.getAttribute('href') || '';
        if (!href || href.startsWith('#')) return;
        if (link.hasAttribute('download')) return;
        if (link.target === '_blank') return;
        if (/^(mailto:|tel:|javascript:)/i.test(href)) return;

        // Не анимируем переход на текущую страницу/якорь (избегаем "мигания").
        try {
            const currentUrl = new URL(window.location.href);
            const nextUrl = new URL(href, currentUrl);
            const samePath =
                nextUrl.origin === currentUrl.origin &&
                nextUrl.pathname === currentUrl.pathname &&
                nextUrl.search === currentUrl.search;
            if (samePath) return;
        } catch (e) {
            return;
        }

        if (/^https?:\/\//i.test(href)) {
            const currentOrigin = window.location.origin;
            try {
                const url = new URL(href, currentOrigin);
                if (url.origin !== currentOrigin) return;
            } catch (e) {
                return;
            }
        }
        event.preventDefault();
        navigateWithTransition(href);
    });

    // Возврат из bfcache (назад/вперед): гарантируем корректное состояние.
    window.addEventListener('pageshow', (event) => {
        if (event.persisted || document.body.classList.contains('page-leaving')) {
            isPageTransitioning = false;
            document.body.classList.remove('page-leaving');
            document.body.classList.remove('page-entering');
            screen.classList.remove('active');
        }
    });
}

function closeMobileMenuAnimated() {
    if (!mobileMenu || !menuToggle) return;
    if (!mobileMenu.classList.contains('active')) return;
    if (mobileMenu.classList.contains('mobile-menu--closing')) return;

    let settled = false;
    const finish = () => {
        if (settled) return;
        settled = true;
        mobileMenu.removeEventListener('animationend', onAnimEnd);
        mobileMenu.classList.remove('mobile-menu--closing');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('mobile-menu-open');
    };

    const onAnimEnd = (e) => {
        if (e.target !== mobileMenu) return;
        const name = String(e.animationName || '');
        if (!name.includes('mobileMenuHide')) return;
        finish();
    };

    mobileMenu.classList.remove('active');
    mobileMenu.classList.add('mobile-menu--closing');
    menuToggle.classList.remove('is-active');
    mobileMenu.addEventListener('animationend', onAnimEnd);
    window.setTimeout(finish, 420);
}

function openMobileMenu() {
    if (!mobileMenu || !menuToggle) return;
    mobileMenu.classList.remove('mobile-menu--closing');
    mobileMenu.classList.add('active');
    menuToggle.classList.add('is-active');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('mobile-menu-open');
}

if (menuToggle) {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-controls', 'mobileMenu');

    menuToggle.addEventListener('click', () => {
        if (!mobileMenu) return;
        if (mobileMenu.classList.contains('active')) {
            closeMobileMenuAnimated();
        } else {
            openMobileMenu();
        }
    });
}

// Закрытие мобильного меню при клике на ссылку
const mobileLinks = document.querySelectorAll('.mobile-nav-link');
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        closeMobileMenuAnimated();
    });
});

document.addEventListener('click', (event) => {
    if (!mobileMenu || !menuToggle) return;
    if (!mobileMenu.classList.contains('active')) return;
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (mobileMenu.contains(target) || menuToggle.contains(target)) return;

    closeMobileMenuAnimated();
});

document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (mobileMenu && menuToggle && mobileMenu.classList.contains('active')) {
        closeMobileMenuAnimated();
        return;
    }
    const gs = document.querySelector('.game-selector.open');
    if (gs) gs.classList.remove('open');
});

// Кнопка "Наверх"
const backToTop = document.getElementById('backToTop');
if (backToTop) {
    backToTop.addEventListener('click', () => {
        if (typeof window.siteScrollToY === 'function') {
            window.siteScrollToY(0);
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    const updateBackToTop = () => {
        // Скрываем кнопку, если пользователь на самом верху страницы.
        // На страницах с коротким контентом (например, краткие правила) скролла может не быть.
        const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
        const maxScroll = (document.documentElement.scrollHeight - window.innerHeight) || 0;
        const canScroll = maxScroll > 5;

        const show = canScroll && scrollTop > 20;
        backToTop.classList.toggle('is-visible', show);
    };

    // На старте (важно для "кратких правил", где страница может не скроллиться)
    document.addEventListener('DOMContentLoaded', updateBackToTop);
    updateBackToTop();

    // Показываем кнопку только при скролле вниз
    window.addEventListener('scroll', () => {
        updateBackToTop();
    }, { passive: true });

    window.addEventListener('resize', () => {
        updateBackToTop();
    }, { passive: true });
}

function scrollToClearFixedHeader(el) {
    if (!el) return;
    updateHeaderHeightVar();
    requestAnimationFrame(() => {
        updateHeaderHeightVar();
        if (typeof window.siteScrollToElement === 'function') {
            window.siteScrollToElement(el);
            return;
        }
        const cs = getComputedStyle(document.documentElement);
        const headerH = parseFloat(cs.getPropertyValue('--header-h')) || 64;
        const gap = parseFloat(cs.getPropertyValue('--anchor-header-gap')) || 16;
        const y = el.getBoundingClientRect().top + window.pageYOffset - headerH - gap;
        window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
    });
}

/** Главная: прокрутка к блоку «О игре» — заголовок у верхнего края видимой области под шапкой (моб. и ПК) */
function scrollToAboutGameHeading() {
    const heading = document.querySelector('.game-description h2');
    const mainContent = document.querySelector('.main-content');
    updateHeaderHeightVar();
    requestAnimationFrame(() => {
        updateHeaderHeightVar();
        if (typeof window.siteScrollToElement === 'function') {
            if (heading) {
                window.siteScrollToElement(heading);
            } else if (mainContent) {
                window.siteScrollToElement(mainContent);
            }
            return;
        }
        if (heading) {
            const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            heading.scrollIntoView({
                behavior: reduced ? 'auto' : 'smooth',
                block: 'start'
            });
        } else if (mainContent) {
            scrollToClearFixedHeader(mainContent);
        }
    });
}

// Кнопка «вниз» на главной (hero): скрывается с анимацией по клику или при прокрутке вниз;
// снова появляется с анимацией, когда пользователь на самом верху страницы.
const heroScrollHint = document.getElementById('heroScrollHint');
const heroSection = document.querySelector('.hero');
const mainContentEl = document.querySelector('.main-content');
const HERO_HINT_TOP_PX = 36;
const HERO_HINT_SCROLL_CLEAR_LOCK_PX = 10;
const HERO_HINT_CLICK_FALLBACK_MS = 900;

let heroHintLockUntilScrollAway = false;
let heroHintHideEndListener = null;
let heroHintRevealEndListener = null;

function getScrollTop() {
    return window.scrollY || document.documentElement.scrollTop || 0;
}

function heroHintMotionReduced() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function clearHeroHintRevealEndListener() {
    if (!heroScrollHint || !heroHintRevealEndListener) return;
    heroScrollHint.removeEventListener('animationend', heroHintRevealEndListener);
    heroHintRevealEndListener = null;
}

function clearHeroHintHideEndListener() {
    if (!heroScrollHint || !heroHintHideEndListener) return;
    heroScrollHint.removeEventListener('animationend', heroHintHideEndListener);
    heroHintHideEndListener = null;
}

function beginHeroHintHide() {
    if (!heroScrollHint) return;
    if (heroScrollHint.classList.contains('is-hidden')) return;
    if (heroScrollHint.classList.contains('hero-scroll-hint--hiding')) return;

    clearHeroHintRevealEndListener();
    heroScrollHint.classList.remove('hero-scroll-hint--revealing');

    if (heroHintMotionReduced()) {
        heroScrollHint.classList.add('is-hidden');
        return;
    }

    clearHeroHintHideEndListener();
    heroScrollHint.classList.add('hero-scroll-hint--hiding');

    heroHintHideEndListener = function onHeroHintHideEnd(ev) {
        if (ev.target !== heroScrollHint) return;
        if (ev.animationName !== 'heroScrollHintHide') return;
        heroScrollHint.classList.add('is-hidden');
        heroScrollHint.classList.remove('hero-scroll-hint--hiding');
        clearHeroHintHideEndListener();
    };
    heroScrollHint.addEventListener('animationend', heroHintHideEndListener);
}

function beginHeroHintReveal() {
    if (!heroScrollHint) return;

    clearHeroHintHideEndListener();
    clearHeroHintRevealEndListener();

    heroScrollHint.classList.remove('is-hidden', 'hero-scroll-hint--hiding');

    if (heroHintMotionReduced()) {
        return;
    }

    heroScrollHint.classList.remove('hero-scroll-hint--revealing');
    void heroScrollHint.offsetWidth;
    heroScrollHint.classList.add('hero-scroll-hint--revealing');

    heroHintRevealEndListener = function onHeroHintRevealEnd(ev) {
        if (ev.target !== heroScrollHint) return;
        if (ev.animationName !== 'heroScrollHintReveal') return;
        heroScrollHint.classList.remove('hero-scroll-hint--revealing');
        clearHeroHintRevealEndListener();
    };
    heroScrollHint.addEventListener('animationend', heroHintRevealEndListener);
}

function syncHeroScrollHint() {
    if (!heroScrollHint || !heroSection || !mainContentEl) return;

    const y = getScrollTop();
    if (y > HERO_HINT_SCROLL_CLEAR_LOCK_PX) {
        heroHintLockUntilScrollAway = false;
    }

    const atTop = y <= HERO_HINT_TOP_PX;
    const shouldShow = atTop && !heroHintLockUntilScrollAway;
    const isHidden = heroScrollHint.classList.contains('is-hidden');
    const isHiding = heroScrollHint.classList.contains('hero-scroll-hint--hiding');

    if (shouldShow) {
        if (isHidden || isHiding) {
            beginHeroHintReveal();
        }
    } else if (!isHidden && !isHiding) {
        beginHeroHintHide();
    }
}

if (heroScrollHint && heroSection && mainContentEl) {
    heroScrollHint.addEventListener('click', () => {
        heroHintLockUntilScrollAway = true;
        syncHeroScrollHint();
        scrollToAboutGameHeading();
        window.setTimeout(() => {
            if (getScrollTop() <= HERO_HINT_TOP_PX) {
                heroHintLockUntilScrollAway = false;
            }
            syncHeroScrollHint();
        }, HERO_HINT_CLICK_FALLBACK_MS);
    });

    syncHeroScrollHint();
    window.addEventListener('scroll', syncHeroScrollHint, { passive: true });
    window.addEventListener('resize', syncHeroScrollHint, { passive: true });
}

// Кастомный курсор для десктопа
function initializeCustomCursor() {
    const canUseCustomCursor = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!canUseCustomCursor) return;

    const dot = document.createElement('div');
    const ring = document.createElement('div');
    dot.className = 'custom-cursor-dot';
    ring.className = 'custom-cursor-ring';
    document.body.appendChild(ring);
    document.body.appendChild(dot);
    document.body.classList.add('custom-cursor-enabled');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let rafId = null;
    let lastFrameTs = 0;

    const showCursor = () => {
        dot.style.opacity = '1';
        ring.style.opacity = '1';
    };

    const hideCursor = () => {
        dot.style.opacity = '0';
        ring.style.opacity = '0';
    };

    const animateRing = (ts) => {
        // Стабильная скорость на разных FPS (без дерганий при просадках)
        const dt = lastFrameTs ? Math.min((ts - lastFrameTs) / 16.67, 2) : 1;
        lastFrameTs = ts;
        const smoothing = Math.min(0.24 * dt, 0.45);
        ringX += (mouseX - ringX) * smoothing;
        ringY += (mouseY - ringY) * smoothing;

        dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
        ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
        rafId = requestAnimationFrame(animateRing);
    };

    document.addEventListener('mousemove', (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
        showCursor();
    }, { passive: true });

    // Не скрываем курсор на mouseout:
    // нативные select/dropdown могут отдавать relatedTarget = null,
    // из-за чего курсор "пропадает" над контролами фильтра/сортировки.

    // Контекстное меню правой кнопкой иногда сбивает рендер курсора в браузере.
    // Мягко переинициализируем видимость после открытия/закрытия меню.
    document.addEventListener('contextmenu', () => {
        showCursor();
    });

    window.addEventListener('blur', hideCursor);
    window.addEventListener('focus', showCursor);

    if (!rafId) {
        rafId = requestAnimationFrame(animateRing);
    }
}

// Активная ссылка навигации
function setActiveNav() {
    const path = window.location.pathname.replace(/\/+$/, '');
    const rawPage = path.split('/').pop() || 'index.html';
    const currentPage = rawPage.replace(/\.html$/i, '');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    
    navLinks.forEach(link => {
        let href = link.getAttribute('href');
        const normalizedHref = (href === '/' ? 'index' : (href || ''))
            .replace(/^\//, '')
            .replace(/\/+$/, '')
            .replace(/\.html$/i, '');
        if ((currentPage === '' && normalizedHref === 'index') || normalizedHref === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/** Псевдослучайные длительности и смена «органической» формы свечения hero (только главная, .page-home). */
function initializeHeroGoldGlow() {
    const glow = document.querySelector('body.page-home .hero-gold-glow');
    if (!glow) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function randomBetween(min, max) {
        return min + Math.random() * (max - min);
    }

    function pickBlobRadius() {
        const pick = () => 40 + Math.random() * 18;
        return `${pick()}% ${pick()}% ${pick()}% ${pick()}% / ${pick()}% ${pick()}% ${pick()}% ${pick()}%`;
    }

    function applyTiming() {
        glow.style.setProperty('--hero-gold-ambient-dur', `${randomBetween(18, 32)}s`);
        glow.style.setProperty('--hero-gold-pulse-dur', `${randomBetween(4, 7.5)}s`);
        glow.style.setProperty('--hero-gold-ambient-delay', `${randomBetween(0, 2.8)}s`);
        glow.style.setProperty('--hero-gold-pulse-delay', `${randomBetween(0, 1.5)}s`);
    }

    function morphShape() {
        glow.style.borderRadius = pickBlobRadius();
    }

    if (reduced) {
        morphShape();
        return;
    }

    applyTiming();
    morphShape();

    function scheduleNextShape() {
        window.setTimeout(() => {
            morphShape();
            scheduleNextShape();
        }, randomBetween(10000, 20000));
    }

    function scheduleNextTiming() {
        window.setTimeout(() => {
            applyTiming();
            scheduleNextTiming();
        }, randomBetween(62000, 98000));
    }

    scheduleNextShape();
    scheduleNextTiming();
}

document.addEventListener('DOMContentLoaded', () => {
    initializePageTransitions();
    setActiveNav();
    initializeCustomCursor();
    updateMobileLogoTextVisibility();
    updateHeaderLayout();
    updateHeaderHeightVar();
    requestAnimationFrame(() => {
        updateHeaderHeightVar();
        initializeHeroGoldGlow();
    });
});

// ВЫБОР ИГРЫ
const selectorBtn = document.querySelector('.selector-btn');
const selectorDropdown = document.querySelector('.selector-dropdown');
const gameSelector = document.querySelector('.game-selector');
const selectorItems = document.querySelectorAll('.selector-item');

if (selectorBtn && selectorDropdown && gameSelector) {
    const openDropdown = () => gameSelector.classList.add('open');
    const closeDropdown = () => gameSelector.classList.remove('open');

    /* Мышь: открытие/закрытие через :hover на .game-selector в CSS; класс .open — для клавиатуры */
    selectorBtn.addEventListener('focus', openDropdown);
    selectorBtn.addEventListener('blur', (e) => {
        const r = e.relatedTarget;
        if (r instanceof Node && gameSelector.contains(r)) return;
        closeDropdown();
    });
    gameSelector.addEventListener('focusout', (e) => {
        const r = e.relatedTarget;
        if (r instanceof Node && gameSelector.contains(r)) return;
        closeDropdown();
    });
}

if (selectorItems) {
    selectorItems.forEach(item => {
        item.addEventListener('click', (e) => {
            if (item.classList.contains('disabled')) {
                e.preventDefault();
                return;
            }
            const href = item.getAttribute('href');
            if (href && !href.startsWith('#')) {
                e.preventDefault();
                navigateWithTransition(href);
            }
        });
    });
}

// НАВИГАЦИЯ НА ГЛАВНУЮ СО ЛОГОТИПА И НАЗВАНИЯ
const logo = document.querySelector('.logo');
const logoImage = document.querySelector('.logo-image');

if (logo) {
    logo.addEventListener('click', (e) => {
        e.preventDefault();
        navigateWithTransition('index.html');
    });
    logo.style.cursor = 'pointer';
}

if (logoImage) {
    logoImage.addEventListener('click', (e) => {
        e.preventDefault();
        navigateWithTransition('index.html');
    });
    logoImage.style.cursor = 'pointer';
}

function updateMobileLogoTextVisibility() {
    const headerContent = document.querySelector('.header-content');
    const logoText = document.querySelector('.logo-text');
    if (!headerContent || !logoText) return;

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (!isMobile) {
        document.body.classList.remove('hide-mobile-logo-text');
        return;
    }

    const logoImage = document.querySelector('.logo-image');
    const menuToggle = document.getElementById('menuToggle');
    const leftBlock = (logoImage ? logoImage.offsetWidth : 44) + 12;
    const rightBlock = (menuToggle ? menuToggle.offsetWidth : 46) + 22;
    const available = headerContent.clientWidth - leftBlock - rightBlock;
    const needsHide = logoText.scrollWidth > Math.max(available, 0);
    document.body.classList.toggle('hide-mobile-logo-text', needsHide);
}

window.addEventListener('resize', updateMobileLogoTextVisibility, { passive: true });

function ensureMobileSelector() {
    if (!mobileMenu || !gameSelectorEl) return;
    let mobileSelector = mobileMenu.querySelector('.mobile-selector');
    if (!mobileSelector) {
        mobileSelector = document.createElement('div');
        mobileSelector.className = 'mobile-selector';
        mobileMenu.prepend(mobileSelector);
    }
    const lang = localStorage.getItem('siteLanguage') || 'ru';
    const mobileSelectorText = {
        ru: { title: 'Хроники забытых империй', soon: 'Скоро...' },
        en: { title: 'Chronicles of Forgotten Empires', soon: 'Coming soon...' },
        kk: { title: 'Ұмытылған империялар шежіресі', soon: 'Жақында...' },
        uk: { title: 'Хроніки забутих імперій', soon: 'Скоро...' },
        be: { title: 'Хронікі забытых імперый', soon: 'Хутка...' },
        zh: { title: '遗忘帝国编年史', soon: '即将推出' }
    };
    const copy = mobileSelectorText[lang] || mobileSelectorText.ru;
    mobileSelector.innerHTML = `
        <a href="index.html" class="mobile-selector-link active">${copy.title}</a>
        <div class="mobile-selector-link disabled">${copy.soon}</div>
    `;
}

window.addEventListener('site-language-changed', () => {
    if (window.matchMedia('(max-width: 1023px)').matches) {
        ensureMobileSelector();
    }
});

function updateHeaderLayout() {
    if (!headerContentEl) return;

    // Сначала пытаемся показать "полную" шапку и измерить реальную ширину
    document.body.classList.remove('header-compact');
    if (menuToggle) menuToggle.style.display = 'none';
    if (navMenuEl) navMenuEl.style.display = '';
    if (gameSelectorEl) gameSelectorEl.style.display = '';

    // Небольшой defer чтобы DOM успел применить стили
    requestAnimationFrame(() => {
        const forceDesktopFull = window.matchMedia('(min-width: 1024px)').matches;
        const shouldCompact = !forceDesktopFull;

        document.body.classList.toggle('header-compact', shouldCompact);

        if (menuToggle) {
            menuToggle.style.display = shouldCompact ? 'inline-flex' : 'none';
        }

        if (navMenuEl) {
            navMenuEl.style.display = shouldCompact ? 'none' : '';
        }

        if (gameSelectorEl) {
            // На компактном режиме кнопка "Выбор настолки" уезжает внутрь ☰
            gameSelectorEl.style.display = shouldCompact ? 'none' : '';
            if (shouldCompact) ensureMobileSelector();
        }

        // Если меню открыто, но мы вышли из compact — закрываем его
        if (!shouldCompact && mobileMenu) {
            mobileMenu.classList.remove('active', 'mobile-menu--closing');
            if (menuToggle) {
                menuToggle.classList.remove('is-active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
            document.body.classList.remove('mobile-menu-open');
        }

        if (typeof window.relocateLangSwitcher === 'function') {
            window.relocateLangSwitcher();
        }
        updateMobileLogoTextVisibility();
    });
}

function updateHeaderHeightVar() {
    if (!headerEl) return;
    const h = Math.max(0, headerEl.getBoundingClientRect().height);
    document.documentElement.style.setProperty('--header-h', `${h}px`);
    document.body.classList.toggle('page-has-hero', !!document.querySelector('.hero'));
}

window.addEventListener('resize', () => {
    updateHeaderLayout();
    updateHeaderHeightVar();
}, { passive: true });


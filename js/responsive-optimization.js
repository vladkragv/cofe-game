// ============================================
// RESPONSIVE-OPTIMIZATION.JS
// Оптимизация адаптивности и мобильного интерфейса
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initializeResponsiveOptimizations();
    optimizeHeaderForMobile();
    optimizeCardsLayout();
    optimizeRulesLayout();
});

// Оптимизация для мобильных устройств
function initializeResponsiveOptimizations() {
    const isMobile = window.innerWidth <= 768;
    const isSmall = window.innerWidth <= 480;
    
    // Применить оптимизации
    if (isMobile) {
        document.body.classList.add('mobile-optimized');
    }
    
    if (isSmall) {
        document.body.classList.add('small-screen-optimized');
    }

    // Слушание изменения размера окна
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            updateResponsiveState();
        }, 250);
    });
}

// Обновление состояния при изменении размера
function updateResponsiveState() {
    const isMobile = window.innerWidth <= 768;
    const isSmall = window.innerWidth <= 480;
    
    document.body.classList.toggle('mobile-optimized', isMobile);
    document.body.classList.toggle('small-screen-optimized', isSmall);
    
    // Пересчитать макеты
    optimizeCardsLayout();
}

// Оптимизация хедера для мобильных
function optimizeHeaderForMobile() {
    const header = document.querySelector('.header');
    const headerContent = document.querySelector('.header-content');
    
    if (!header || !headerContent) return;

    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Мобильная версия - использовать компактный макет
        headerContent.style.gridTemplateColumns = 'auto 1fr auto';
        headerContent.style.gap = '0.5rem';
        
        // Скрыть логотип если нет места
        const logoText = document.querySelector('.logo-text');
        if (logoText && window.innerWidth <= 480) {
            const availableWidth = window.innerWidth - 100; // примерно для логотипа и кнопки
            if (availableWidth < 200) {
                document.body.classList.add('hide-mobile-logo-text');
            }
        }
    } else {
        document.body.classList.remove('hide-mobile-logo-text');
    }
}

// Оптимизация размещения карточек героев
function optimizeCardsLayout() {
    const galleryGrid = document.querySelector('.gallery-grid');
    if (!galleryGrid) return;

    const width = window.innerWidth;
    let columns = 4; // По умолчанию для ПК

    if (width >= 1200) {
        columns = 4;
        galleryGrid.style.gridTemplateColumns = 'repeat(4, minmax(0, 1fr))';
    } else if (width >= 768) {
        columns = 3; // Планшеты
        galleryGrid.style.gridTemplateColumns = 'repeat(3, minmax(0, 1fr))';
    } else if (width >= 480) {
        columns = 2; // Мобильные
        galleryGrid.style.gridTemplateColumns = 'repeat(2, minmax(0, 1fr))';
    } else {
        columns = 1; // Очень маленькие экраны
        galleryGrid.style.gridTemplateColumns = '1fr';
    }

    // Обновить задержки анимации для новой сетки
    const items = galleryGrid.querySelectorAll('.gallery-item');
    items.forEach((item, index) => {
        const row = Math.floor(index / columns);
        const delay = row * 0.12;
        item.dataset.animDelay = String(delay);
    });
}

// Оптимизация размещения карточек правил
function optimizeRulesLayout() {
    const keyPoints = document.querySelector('.key-points');
    if (!keyPoints) return;

    const width = window.innerWidth;
    
    if (width >= 1024) {
        keyPoints.style.gridTemplateColumns = 'repeat(3, minmax(0, 1fr))';
    } else if (width >= 768) {
        keyPoints.style.gridTemplateColumns = 'repeat(2, minmax(0, 1fr))';
    } else if (width >= 480) {
        keyPoints.style.gridTemplateColumns = 'repeat(2, minmax(0, 1fr))';
    } else {
        keyPoints.style.gridTemplateColumns = '1fr';
    }

    // Оглавление на несколько рядов для мобильных
    const tableOfContents = document.querySelector('.table-of-contents ul');
    if (tableOfContents) {
        if (width <= 768) {
            tableOfContents.style.columnCount = '1';
        } else if (width <= 1024) {
            tableOfContents.style.columnCount = '2';
        } else {
            tableOfContents.style.columnCount = '2';
        }
    }
}

// Оптимизация размера кнопок
function optimizeButtonSizes() {
    const buttons = document.querySelectorAll('.btn');
    const width = window.innerWidth;
    
    if (width <= 480) {
        buttons.forEach(btn => {
            btn.style.padding = '0.5rem 0.8rem';
            btn.style.fontSize = '0.85rem';
        });
    } else if (width <= 768) {
        buttons.forEach(btn => {
            btn.style.padding = '0.6rem 1rem';
            btn.style.fontSize = '0.9rem';
        });
    }
}

// Инициализация при загрузке + обновление при resize
window.addEventListener('load', () => {
    optimizeButtonSizes();
    optimizeCardsLayout();
    optimizeRulesLayout();
});

window.addEventListener('resize', () => {
    optimizeButtonSizes();
});

// Оптимизация селектора "Выбор настолки" для мобильных
function optimizeSelectorButton() {
    const selectorBtn = document.querySelector('.selector-btn');
    const width = window.innerWidth;
    
    if (width <= 768 && selectorBtn) {
        // На мобильных скрыть эту кнопку
        selectorBtn.style.display = 'none';
    }
}

document.addEventListener('load', optimizeSelectorButton);
window.addEventListener('resize', optimizeSelectorButton);

// Оптимизация карточек игровых карт (для страницы карт)
function optimizeCardsTabs() {
    const cardsGrid = document.querySelector('.cards-grid');
    if (!cardsGrid) return;

    const width = window.innerWidth;
    let minSize = '180px';
    
    if (width >= 1200) {
        minSize = '180px';
        cardsGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(180px, 1fr))';
    } else if (width >= 768) {
        minSize = '160px';
        cardsGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(160px, 1fr))';
    } else if (width >= 480) {
        minSize = '140px';
        cardsGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(140px, 1fr))';
        // На мобилях по 2 карточки в ряд
        cardsGrid.style.gridTemplateColumns = 'repeat(2, minmax(0, 1fr))';
    } else {
        minSize = '100%';
        cardsGrid.style.gridTemplateColumns = '1fr';
    }
}

window.addEventListener('load', optimizeCardsTabs);
window.addEventListener('resize', optimizeCardsTabs);

// Оптимизация размеров текста в зависимости от экрана
function optimizeTypography() {
    const width = window.innerWidth;
    const root = document.documentElement;
    
    if (width <= 480) {
        root.style.setProperty('--font-size-base', '14px');
        root.style.setProperty('--font-size-large', '18px');
    } else if (width <= 768) {
        root.style.setProperty('--font-size-base', '15px');
        root.style.setProperty('--font-size-large', '20px');
    } else {
        root.style.setProperty('--font-size-base', '16px');
        root.style.setProperty('--font-size-large', '22px');
    }
}

window.addEventListener('load', optimizeTypography);
window.addEventListener('resize', optimizeTypography);

// Оптимизация отступов контейнера
function optimizeContainerPadding() {
    const containers = document.querySelectorAll('.container');
    const width = window.innerWidth;
    
    containers.forEach(container => {
        if (width <= 480) {
            container.style.padding = '0 10px';
        } else if (width <= 768) {
            container.style.padding = '0 15px';
        } else {
            container.style.padding = '0 20px';
        }
    });
}

window.addEventListener('load', optimizeContainerPadding);
window.addEventListener('resize', optimizeContainerPadding);

// Инициализация перспективы карточек в зависимости от устройства
function initializeCardPerspective() {
    const cards = document.querySelectorAll('.card-preview');
    const width = window.innerWidth;
    
    cards.forEach(card => {
        if (width <= 768) {
            // На мобилях уменьшить перспективу
            card.style.perspective = '800px';
        } else {
            card.style.perspective = '1200px';
        }
    });
}

window.addEventListener('load', initializeCardPerspective);
window.addEventListener('resize', initializeCardPerspective);

// Экспортирование функций
window.ResponsiveOptimization = {
    updateResponsiveState,
    optimizeCardsLayout,
    optimizeRulesLayout,
    optimizeCardsTabs,
    optimizeTypography,
    optimizeContainerPadding,
    initializeCardPerspective
};

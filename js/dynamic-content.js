// ============================================
// DYNAMIC-CONTENT.JS - Динамическая загрузка контента из localStorage
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    loadDynamicContent();
});

function loadDynamicContent() {
    // Загрузить информацию об игре
    const gameInfo = getGameInfo();
    
    if (gameInfo) {
        // Обновить логотип и название в заголовке
        const logoIcon = document.querySelector('.logo-icon');
        const logoText = document.querySelector('.logo-text');
        
        if (logoIcon) logoIcon.textContent = gameInfo.logo || '⚔️';
        if (logoText) logoText.textContent = gameInfo.title || 'Хроники забытых империй';
        
        // Обновить название страницы
        document.title = gameInfo.title + ' - Настольная Карточная Игра';
    }

    // Загрузить данные в зависимости от страницы
    const path = window.location.pathname.replace(/\/+$/, '');
    const rawPage = path.split('/').pop() || 'index.html';
    const currentPage = rawPage.replace(/\.html$/i, '');
    
    if (currentPage === '') {
        loadHomePage();
    } else if (currentPage === 'rules') {
        loadRulesPage();
    } else if (currentPage === 'about') {
        loadAboutPage();
    } else if (currentPage === 'cards') {
        loadCardsPage();
    }
}

function loadHomePage() {
    const gameInfo = getGameInfo();
    
    if (gameInfo) {
        // Обновить заголовок и описание
        const heroTitle = document.querySelector('.hero-title');
        const heroSubtitle = document.querySelector('.hero-subtitle');
        const gameDescription = document.querySelector('.game-description p');
        
        if (heroTitle) heroTitle.textContent = gameInfo.title;
        if (heroSubtitle) heroSubtitle.textContent = gameInfo.subtitle;
        if (gameDescription) gameDescription.textContent = gameInfo.description;
    }

    // Обновить галерею героев (всегда показываем до 12 героев)
    const galleryGrid = document.querySelector('.gallery-grid');
    if (galleryGrid) {
        const cards = getStorageCards() || [];
        const heroCards = cards
            .filter(c => c.type === 'heroes')
            .sort((a, b) => a.id - b.id)
            .slice(0, 12);

        galleryGrid.innerHTML = '';
        const lang =
            typeof window.getCardLang === 'function' ? window.getCardLang() : 'ru';

        heroCards.forEach((card) => {
            const fields =
                typeof window.getLocalizedCardFields === 'function'
                    ? window.getLocalizedCardFields(card, lang)
                    : { name: card.name };
            const heroName = fields.name || card.name;
            const div = document.createElement('div');
            div.className = 'gallery-item';
            div.innerHTML = `
                <div class="card-preview">
                    <img src="images/cards/${card.image}" alt="${heroName}" class="card-image" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22180%22 height=%22250%22%3E%3Crect fill=%22%232d241f%22 width=%22180%22 height=%22250%22/%3E%3Ctext x=%2290%22 y=%22125%22 text-anchor=%22middle%22 fill=%22%23e8dcc8%22 font-size=%2216%22%3E${heroName}%3C/text%3E%3C/svg%3E'">
                </div>
                <p class="card-name">${heroName}</p>
            `;
            galleryGrid.appendChild(div);
        });
    }
}

function loadRulesPage() {
    const rules = getRules();
    
    if (rules) {
        // Обновить краткие правила
        const quickRulesSection = document.getElementById('quick-rules');
        if (quickRulesSection && rules.quick) {
            const keyPointsSection = quickRulesSection.querySelector('.key-points');
            if (keyPointsSection) {
                // Убедитесь, что есть содержимое
                const flowSection = quickRulesSection.querySelector('.infographic-flow');
                if (flowSection && !flowSection.querySelector('.flow-step p')) {
                    // Можно добавить логику для обновления правил здесь
                }
            }
        }

        // Обновить подробные правила
        const detailedRulesSection = document.getElementById('detailed-rules');
        if (detailedRulesSection && rules.detailed) {
            // Логика для обновления подробных правил
        }
    }
}

function loadAboutPage() {
    const about = getAboutGame();
    
    if (about) {
        // Обновить историю
        const historySection = document.querySelector('.about-section');
        if (historySection) {
            const historyContent = historySection.querySelector('.about-content');
            if (historyContent && about.history) {
                historyContent.innerHTML = `<p>${about.history}</p>`;
            }
        }

        // Обновить концепцию
        const conceptSections = document.querySelectorAll('.about-section');
        if (conceptSections.length > 1 && about.concept) {
            const conceptContent = conceptSections[1].querySelector('.about-content');
            if (conceptContent) {
                conceptContent.innerHTML = `<p>${about.concept}</p>`;
            }
        }
    }
}

function loadCardsPage() {
    // Карты загружаются из localStorage через cards.js
    // Обновить данные при первой загрузке
    const cards = getStorageCards();
    
    // Если карты были изменены в localStorage, они уже будут обновлены там
    // cards.js автоматически загрузит их
}

// Обновить цвета в CSS переменных из localStorage
function updateCSSColors() {
    const colors = getColors();
    if (colors) {
        const root = document.documentElement;
        Object.entries(colors).forEach(([key, color]) => {
            root.style.setProperty(`--color-${key}`, color);
        });
    }
}

// Вызвать при загрузке
updateCSSColors();

// Функция для форсированного обновления контента (может быть вызвана извне)
function refreshAllContent() {
    location.reload();
}

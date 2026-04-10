// ============================================
// CARDS.JS - Функциональность страницы карт
// ============================================

let currentCards = [];
let currentFilter = '';
let currentSort = 'name';

const CARD_ICONS_BASE = 'images/icons/cards';

function escapeHtmlCards(s) {
    if (s == null) return '';
    return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function cardIcon(name, extraClass) {
    const cls = extraClass ? `card-stat-icon ${extraClass}` : 'card-stat-icon';
    return `<img src="${CARD_ICONS_BASE}/${name}.svg" alt="" class="${cls}" width="17" height="17" decoding="async">`;
}

function getCardsUiCopy() {
    const lang =
        typeof window.getCardLang === 'function' ? window.getCardLang() : localStorage.getItem('siteLanguage') || 'ru';
    const labels = {
        ru: { atk: 'АТК', damage: 'Урон', hp: 'ХР', mana: 'МР', qty: 'Кол-во', attack: 'Атака', life: 'Жизнь', manaCost: 'Стоимость МР', inDeck: 'В колоде', pcs: 'шт.', hybrid: 'Эта карта считается' },
        en: { atk: 'ATK', damage: 'Damage', hp: 'HP', mana: 'Mana', qty: 'Qty', attack: 'Attack', life: 'Health', manaCost: 'Mana cost', inDeck: 'In deck', pcs: 'pcs', hybrid: 'This card counts as' },
        kk: { atk: 'ATK', damage: 'Зиян', hp: 'HP', mana: 'Мана', qty: 'Саны', attack: 'Шабуыл', life: 'Өмір', manaCost: 'Мана құны', inDeck: 'Колодада', pcs: 'дана', hybrid: 'Бұл карта саналады' },
        uk: { atk: 'ATK', damage: 'Шкода', hp: 'HP', mana: 'Мана', qty: 'К-сть', attack: 'Атака', life: 'Життя', manaCost: 'Вартість мани', inDeck: 'У колоді', pcs: 'шт.', hybrid: 'Ця картка вважається' },
        be: { atk: 'ATK', damage: 'Шкода', hp: 'HP', mana: 'Мана', qty: 'К-ць', attack: 'Атака', life: 'Жыццё', manaCost: 'Кошт маны', inDeck: 'У калодзе', pcs: 'шт.', hybrid: 'Гэта карта лічыцца' },
        zh: { atk: '攻击', damage: '伤害', hp: '生命', mana: '法力', qty: '数量', attack: '攻击', life: '生命值', manaCost: '法力消耗', inDeck: '牌库数量', pcs: '张', hybrid: '此卡视为' }
    };
    return labels[lang] || labels.ru;
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    loadCardsFromStorage();
    renderCards(currentCards);
    setupEventListeners();
});

// Загрузить карты из localStorage
function loadCardsFromStorage() {
    currentCards = getStorageCards();
    if (!currentCards || currentCards.length === 0) {
        currentCards = [...CARDS_DATABASE];
    }
}

// Обновить карты при изменениях в localStorage
function updateCardsFromStorage() {
    loadCardsFromStorage();
    currentCards = getCardsByType(currentFilter);
    currentCards = sortCards(currentCards, currentSort);
    renderCards(currentCards);
}

// Отслеживать изменения в localStorage
window.addEventListener('storage', () => {
    updateCardsFromStorage();
});

// Установка обработчиков событий
function setupEventListeners() {
    // Поиск
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value;
            if (query) {
                currentCards = searchCards(query);
                currentFilter = '';
                document.querySelectorAll('.card-tab-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                document.querySelector('[data-type=""]').classList.add('active');
            } else {
                currentCards = getCardsByType(currentFilter);
            }
            renderCards(currentCards);
        });
    }

    // Фильтры по типу
    const filterType = document.getElementById('filterType');
    if (filterType) {
        filterType.addEventListener('change', (e) => {
            currentFilter = e.target.value;
            
            // Очистить поиск
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.value = '';
            }
            
            // Обновить активную вкладку
            const cardTabBtns = document.querySelectorAll('.card-tab-btn');
            cardTabBtns.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.type === currentFilter);
            });
            
            currentCards = getCardsByType(currentFilter);
            currentCards = sortCards(currentCards, currentSort);
            renderCards(currentCards);
        });
    }

    // Сортировка
    const sortBy = document.getElementById('sortBy');
    if (sortBy) {
        sortBy.addEventListener('change', (e) => {
            currentSort = e.target.value;
            currentCards = sortCards(currentCards, currentSort);
            renderCards(currentCards);
        });
    }

    // Вкладки типов карт
    const cardTabBtns = document.querySelectorAll('.card-tab-btn');
    cardTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentFilter = btn.dataset.type;
            
            // Очистить поиск
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.value = '';
            }
            
            // Обновить фильтр селекта
            const filterType = document.getElementById('filterType');
            if (filterType) {
                filterType.value = currentFilter;
            }
            
            currentCards = getCardsByType(currentFilter);
            currentCards = sortCards(currentCards, currentSort);
            
            // Обновить активную вкладку
            cardTabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            renderCards(currentCards);
        });
    });

    // Кнопка сброса фильтров
    const resetBtn = document.getElementById('resetFilters');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            currentFilter = '';
            currentSort = 'name';
            const searchInput = document.getElementById('searchInput');
            if (searchInput) searchInput.value = '';
            const filterType = document.getElementById('filterType');
            if (filterType) filterType.value = '';
            const sortBy = document.getElementById('sortBy');
            if (sortBy) sortBy.value = 'name';
            
            cardTabBtns.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.type === '');
            });
            
            currentCards = getCardsByType('');
            currentCards = sortCards(currentCards, 'name');
            renderCards(currentCards);
        });
    }

    // Закрытие модала
    const modalClose = document.getElementById('modalClose');
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    const backToList = document.getElementById('backToList');
    if (backToList) {
        backToList.addEventListener('click', closeModal);
    }

    // Закрытие модала при клике вне его
    const modal = document.getElementById('cardModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
}

// Рендер карт
function renderCards(cards) {
    const cardsGrid = document.getElementById('cardsGrid');
    const catacombs = document.getElementById('catacombs-special');
    const noResults = document.getElementById('noResults');
    
    if (!cardsGrid) return;

    // Фильтруем Входы в катакомбы для отдельного отображения
    let displayCards = cards.filter(card => card.type !== 'catacombs');
    let hasEntrance = cards.some(card => card.type === 'catacombs');

    if (displayCards.length === 0 && !hasEntrance) {
        cardsGrid.innerHTML = '';
        catacombs.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }

    noResults.style.display = 'none';
    catacombs.style.display = hasEntrance ? 'grid' : 'none';

    cardsGrid.innerHTML = displayCards.map(card => createCardElement(card)).join('');

    // Добавить обработчики кликов через data атрибут
    document.querySelectorAll('.card-container').forEach((element) => {
        element.addEventListener('click', () => {
            const cardId = parseInt(element.dataset.cardId);
            const allCards = getStorageCards();
            const card = allCards.find(c => c.id === cardId);
            if (card) openCardModal(card);
        });
    });

    // Добавить обработчик клика для карты Входа в Катакомбы
    const catacombsCard = document.querySelector('#catacombs-special .card-container');
    if (catacombsCard) {
        catacombsCard.addEventListener('click', () => {
            const cardId = parseInt(catacombsCard.dataset.cardId);
            const allCards = getStorageCards();
            const card = allCards.find(c => c.id === cardId);
            if (card) openCardModal(card);
        });
    }
}

// Создать элемент карты
function createCardElement(card) {
    const lang =
        typeof window.getCardLang === 'function' ? window.getCardLang() : localStorage.getItem('siteLanguage') || 'ru';
    const display = typeof window.localizeCard === 'function' ? window.localizeCard(card, lang) : card;
    const typeLabel =
        typeof window.getCardTypeLabel === 'function'
            ? window.getCardTypeLabel(card.type, lang)
            : CARD_TYPES[card.type] || card.type;
    const typeClass = `type-${card.type}`;
    const ui = getCardsUiCopy();
    
    let statsHtml = '';
    if (card.atk > 0) {
        statsHtml += `<span class="card-stat-row">${cardIcon('stat-atk')}<span class="card-stat-text">${ui.atk}: ${card.atk}</span></span>`;
    }
    if (card.damage > 0) {
        statsHtml += `<span class="card-stat-row">${cardIcon('stat-damage')}<span class="card-stat-text">${ui.damage}: ${card.damage}</span></span>`;
    }
    if (card.hp > 0) {
        statsHtml += `<span class="card-stat-row">${cardIcon('stat-hp')}<span class="card-stat-text">${ui.hp}: ${card.hp}</span></span>`;
    }
    if (card.mana > 0) {
        statsHtml += `<span class="card-stat-row">${cardIcon('stat-mana')}<span class="card-stat-text">${ui.mana}: ${card.mana}</span></span>`;
    }
    if (card.quantity) {
        statsHtml += `<span class="card-stat-row">${cardIcon('stat-qty')}<span class="card-stat-text">${ui.qty}: ${card.quantity}</span></span>`;
    }

    // Для гибридных карт показываем обе роли
    let typeHtml = '';
    if (card.hybrid && card.hybridTypes && card.hybridTypes.length > 0) {
        typeHtml = `<div class="card-type-hybrid">
            <span class="card-type ${typeClass}">${typeLabel}</span>
            ${card.hybridTypes.map((hybridType) => {
                const hLabel =
                    typeof window.getCardTypeLabel === 'function'
                        ? window.getCardTypeLabel(hybridType, lang)
                        : CARD_TYPES[hybridType];
                return `<span class="card-type type-${hybridType}">${hLabel}</span>`;
            }).join('')}
        </div>`;
    } else {
        typeHtml = `<p class="card-type ${typeClass}">${typeLabel}</p>`;
    }

    let hybridNote = '';
    if (card.hybrid && card.hybridTypes) {
        const hybridTypes = card.hybridTypes
            .map((t) => (typeof window.getCardTypeLabel === 'function' ? window.getCardTypeLabel(t, lang) : CARD_TYPES[t]))
            .join(', ');
        hybridNote = `<p class="card-note card-note--hybrid">${cardIcon('stat-hybrid')}<span class="card-note-hybrid-text">${escapeHtmlCards(ui.hybrid)}: ${escapeHtmlCards(hybridTypes)}</span></p>`;
    }

    return `
        <div class="card-item">
            <div class="card-container" data-card-id="${card.id}">
                <img src="images/cards/${card.image}" alt="${display.name}" class="card-img" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22180%22 height=%22200%22%3E%3Crect fill=%22%23334155%22 width=%22180%22 height=%22200%22/%3E%3Ctext x=%2290%22 y=%22100%22 text-anchor=%22middle%22 fill=%22%23f1f5f9%22 font-size=%2214%22%3E${display.name}%3C/text%3E%3C/svg%3E'">
                <div class="card-info">
                    <h4>${display.name}</h4>
                    ${typeHtml}
                    <div class="card-stats">
                        ${statsHtml}
                    </div>
                    <p class="card-description">${display.ability}</p>
                    ${hybridNote}
                </div>
            </div>
        </div>
    `;
}

// Открыть модал с картой
function openCardModal(card) {
    const modal = document.getElementById('cardModal');
    const modalCardImage = document.getElementById('modalCardImage');
    const modalCardName = document.getElementById('modalCardName');
    const modalCardType = document.getElementById('modalCardType');
    const modalCardStats = document.getElementById('modalCardStats');
    const modalCardAbility = document.getElementById('modalCardAbility');
    const modalCardNote = document.getElementById('modalCardNote');

    if (!modal) return;

    const lang =
        typeof window.getCardLang === 'function' ? window.getCardLang() : localStorage.getItem('siteLanguage') || 'ru';
    const display = typeof window.localizeCard === 'function' ? window.localizeCard(card, lang) : card;
    const typeLabel =
        typeof window.getCardTypeLabel === 'function'
            ? window.getCardTypeLabel(card.type, lang)
            : CARD_TYPES[card.type] || card.type;
    const typeClass = `type-${card.type}`;
    const ui = getCardsUiCopy();

    modalCardImage.src = `images/cards/${card.image}`;
    modalCardImage.onerror = function() {
        this.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23334155%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%22200%22 y=%22150%22 text-anchor=%22middle%22 fill=%22%23f1f5f9%22 font-size=%2220%22%3E' + display.name + '%3C/text%3E%3C/svg%3E';
    };
    
    modalCardName.textContent = display.name;
    modalCardType.textContent = typeLabel;
    modalCardType.className = `card-type ${typeClass}`;
    modalCardAbility.textContent = display.ability;

    // Статистика
    let statsHtml = '';
    if (card.atk > 0) {
        statsHtml += `<span class="modal-card-stat-line"><span class="modal-stat-label">${cardIcon('stat-atk')}<strong>${escapeHtmlCards(ui.attack)}:</strong></span><span>${card.atk}</span></span>`;
    }
    if (card.damage > 0) {
        statsHtml += `<span class="modal-card-stat-line"><span class="modal-stat-label">${cardIcon('stat-damage')}<strong>${escapeHtmlCards(ui.damage)}:</strong></span><span>${card.damage}</span></span>`;
    }
    if (card.hp > 0) {
        statsHtml += `<span class="modal-card-stat-line"><span class="modal-stat-label">${cardIcon('stat-hp')}<strong>${escapeHtmlCards(ui.life)}:</strong></span><span>${card.hp}</span></span>`;
    }
    if (card.mana > 0) {
        statsHtml += `<span class="modal-card-stat-line"><span class="modal-stat-label">${cardIcon('stat-mana')}<strong>${escapeHtmlCards(ui.manaCost)}:</strong></span><span>${card.mana}</span></span>`;
    }
    if (card.quantity) {
        statsHtml += `<span class="modal-card-stat-line"><span class="modal-stat-label">${cardIcon('stat-qty')}<strong>${escapeHtmlCards(ui.inDeck)}:</strong></span><span>${escapeHtmlCards(String(card.quantity))} ${escapeHtmlCards(ui.pcs)}</span></span>`;
    }

    modalCardStats.innerHTML = statsHtml;

    // Гибридная карта
    if (card.hybrid && card.hybridTypes) {
        const hybridSep = { en: ' & ', zh: ' / ', uk: ' та ', be: ' і ', kk: ' және ' };
        const hybridTypes = card.hybridTypes
            .map((t) => (typeof window.getCardTypeLabel === 'function' ? window.getCardTypeLabel(t, lang) : CARD_TYPES[t]))
            .join(hybridSep[lang] || ' · ');
        modalCardNote.className = 'card-note card-note--hybrid';
        modalCardNote.innerHTML = `${cardIcon('stat-hybrid')}<span>${escapeHtmlCards(ui.hybrid)} ${escapeHtmlCards(hybridTypes)}</span>`;
        modalCardNote.style.display = 'flex';
    } else {
        modalCardNote.className = 'card-note';
        modalCardNote.textContent = '';
        modalCardNote.style.display = 'none';
    }

    modal.classList.remove('closing');
    modal.classList.add('active');
}

// Закрыть модал
function closeModal() {
    const modal = document.getElementById('cardModal');
    if (!modal || !modal.classList.contains('active')) return;
    modal.classList.add('closing');
    setTimeout(() => {
        modal.classList.remove('active');
        modal.classList.remove('closing');
    }, 220);
}

// Закрытие модала по Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

window.addEventListener('site-language-changed', () => {
    renderCards(currentCards);
});

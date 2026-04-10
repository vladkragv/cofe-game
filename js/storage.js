// ============================================
// STORAGE.JS - Система хранения данных в localStorage
// ============================================

const STORAGE_KEY = 'nastolka_game_data';
const REMOVED_CARD_NAMES = ['Призрак боли', 'Погребённый', 'Дух мёртвого воина'];

// Инициализация хранилища
function initializeStorage() {
    if (!localStorage.getItem(STORAGE_KEY)) {
        const initialData = {
            cards: JSON.parse(JSON.stringify(CARDS_DATABASE)),
            gameInfo: {
                title: 'Хроники забытых империй',
                subtitle: 'Эпическая настольная карточная игра о вызове судьбе',
                description: '«Хроники забытых империй» — стратегическая карточная игра для 2 - 6 игроков, где вы выбираете уникального героя и ведёте его через опасные подземелья, собирая артефакты и противостоя врагам. Каждая партия занимает 30–60 минут и требует как удачи, так и тактического мышления. Комбинируйте способности карт, управляйте ресурсами маны и стройте правильную стратегию атаки, чтобы остаться последним выжившим!',
                logo: '⚔️',
                companyName: 'ЭНТУЗИАСТ',
                videoUrl: '' // URL видео для фона (можно добавить позже)
            },
            heroNames: [
                'Воин Света',
                'Тёмный Маг',
                'Охотница',
                'Паладин',
                'Некромант',
                'Волшебник',
                'Защитник',
                'Убийца',
                'Жрица',
                'Варвар',
                'Чародей',
                'Паруса Ветра'
            ],
            rules: {
                quick: 'Каждый вытягивает героя и начинает с 3 МР. В свой ход: добави карты (максимум 3 в руке), разыгрывай существ (потратив МР), атакуй противников, восстанови 3 МР. Герой, у которого осталось 0 ХП, выбывает. Последний выживший герой побеждает!',
                detailed: 'Полное описание правил...'
            },
            aboutGame: {
                history: '«Хроники забытых империй» появились как результат долгого развития идеи о создании карточной игры, которая сочетала бы простоту правил с глубокой стратегией. Вдохновение пришло из классических фэнтези-произведений и видеоигр с похожей тематикой.',
                concept: 'Мир «Хроники забытых империй» — это мрачный фэнтези-сеттинг, где разрушенная цивилизация оставила после себя сложную систему подземелий, артефактов и магии.',
                tips: []
            },
            colors: {
                heroes: '#22c55e',
                beasts: '#f97316',
                demons: '#dc2626',
                spirits: '#8b5cf6',
                undead: '#6366f1',
                dragons: '#d97706',
                orcs: '#14b8a6',
                weapons: '#0ea5e9',
                traps: '#71717a',
                artifacts: '#a855f7',
                spells: '#3b82f6',
                catacombs: '#a855f7'
            }
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    } else {
        // Применяем миграции к уже сохранённым данным
        const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (migrateCardsData(data)) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        }
    }
}

function migrateCardsData(data) {
    if (!data || !Array.isArray(data.cards)) return false;

    let changed = false;
    const filteredCards = data.cards.filter(card => !REMOVED_CARD_NAMES.includes(card.name));
    if (filteredCards.length !== data.cards.length) {
        data.cards = filteredCards;
        changed = true;
    }

    data.cards.forEach(card => {
        if (card.name === 'Баллиста' && card.damage !== 4) {
            card.damage = 4;
            changed = true;
        }
        if (card.name === 'Мортира' && card.damage !== 3) {
            card.damage = 3;
            changed = true;
        }
    });

    return changed;
}

// Получить все данные
function getAllData() {
    initializeStorage();
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
}

// Получить карты
function getStorageCards() {
    const data = getAllData();
    return data.cards;
}

// Обновить карту
function updateCard(cardId, updates) {
    const data = getAllData();
    const cardIndex = data.cards.findIndex(c => c.id === cardId);
    if (cardIndex !== -1) {
        data.cards[cardIndex] = { ...data.cards[cardIndex], ...updates };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return data.cards[cardIndex];
    }
    return null;
}

// Добавить карту
function addCard(card) {
    const data = getAllData();
    const newId = Math.max(...data.cards.map(c => c.id), 0) + 1;
    card.id = newId;
    data.cards.push(card);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return card;
}

// Удалить карту
function deleteCard(cardId) {
    const data = getAllData();
    data.cards = data.cards.filter(c => c.id !== cardId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Обновить информацию об игре
function updateGameInfo(updates) {
    const data = getAllData();
    data.gameInfo = { ...data.gameInfo, ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return data.gameInfo;
}

// Получить информацию об игре
function getGameInfo() {
    const data = getAllData();
    return data.gameInfo;
}

// Obновить правила
function updateRules(updates) {
    const data = getAllData();
    data.rules = { ...data.rules, ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return data.rules;
}

// Получить правила
function getRules() {
    const data = getAllData();
    return data.rules;
}

// Обновить информацию об игре (About)
function updateAboutGame(updates) {
    const data = getAllData();
    data.aboutGame = { ...data.aboutGame, ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return data.aboutGame;
}

// Получить информацию об игре (About)
function getAboutGame() {
    const data = getAllData();
    return data.aboutGame;
}

// Обновить цвета ролей
function updateColors(colorUpdates) {
    const data = getAllData();
    data.colors = { ...data.colors, ...colorUpdates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return data.colors;
}

// Получить цвета
function getColors() {
    const data = getAllData();
    return data.colors;
}

// Обновить имена героев
function updateHeroNames(names) {
    const data = getAllData();
    data.heroNames = names;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return names;
}

// Получить имена героев
function getHeroNames() {
    const data = getAllData();
    return data.heroNames;
}

// Экспортировать все данные (для загрузки)
function exportData() {
    const data = getAllData();
    return JSON.stringify(data, null, 2);
}

// Импортировать данные (для восстановления)
function importData(jsonString) {
    try {
        const data = JSON.parse(jsonString);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return true;
    } catch (e) {
        console.error('Ошибка при импорте данных:', e);
        return false;
    }
}

// ============================================
// Работа с блоками правил
// ============================================

const QUICK_RULE_ICON_SRC = {
    'quick-decks': 'images/icons/rules-quick/quick-decks.svg',
    'quick-setup': 'images/icons/rules-quick/quick-setup.svg',
    'quick-counters-start': 'images/icons/rules-quick/quick-counters-start.svg',
    'quick-turn': 'images/icons/rules-quick/quick-turn.svg',
    'quick-draw': 'images/icons/rules-quick/quick-draw.svg',
    'quick-creatures': 'images/icons/rules-quick/quick-creatures.svg',
    'quick-fatigue': 'images/icons/rules-quick/quick-fatigue.svg',
    'quick-spells': 'images/icons/rules-quick/quick-spells.svg',
    'quick-catacombs': 'images/icons/rules-quick/quick-catacombs.svg',
    'quick-artifacts-traps': 'images/icons/rules-quick/quick-artifacts-traps.svg',
    'quick-combat': 'images/icons/rules-quick/quick-combat.svg',
    'quick-win': 'images/icons/rules-quick/quick-win.svg'
};

function enrichQuickRuleIcons(quick) {
    if (!Array.isArray(quick)) return [];
    return quick.map((b) => {
        if (!b || !b.id) return b;
        const def = QUICK_RULE_ICON_SRC[b.id];
        if (!def) return b;
        return { ...b, iconSrc: b.iconSrc || def };
    });
}

// Получить все блоки краткие правил
function getQuickRuleBlocks() {
    const data = getAllData();
    const defaultQuick = [
        {
            id: 'quick-decks',
            title: 'Колоды и элементы',
            iconSrc: QUICK_RULE_ICON_SRC['quick-decks'],
            text: 'В игре 3 колоды карт: Герои, игровая колода и Катакомбы. Также нужны счётчики ХР, счётчики МР и кубик d6.'
        },
        {
            id: 'quick-setup',
            title: 'Подготовка и старт',
            iconSrc: QUICK_RULE_ICON_SRC['quick-setup'],
            text: 'В начале игры каждый игрок вытягивает по 1 карте из колоды Героя — это персонаж на столе. По карте выставьте базовую АТК (левый верхний угол) и ХР (правый верхний угол). Затем все бросают d6: чей результат выше — ходит первым.'
        },
        {
            id: 'quick-counters-start',
            title: 'Счётчики ХР и МР',
            iconSrc: QUICK_RULE_ICON_SRC['quick-counters-start'],
            text: 'Установите счётчик ХР на значение жизни Героя. Установите счётчик МР на 3. В течение партии следите за текущим уровнем ресурсов.'
        },
        {
            id: 'quick-turn',
            title: 'Ход игрока',
            iconSrc: QUICK_RULE_ICON_SRC['quick-turn'],
            text: 'В конце каждого своего хода восстанавливайте +3 уровня МР.'
        },
        {
            id: 'quick-draw',
            title: 'Рука',
            iconSrc: QUICK_RULE_ICON_SRC['quick-draw'],
            text: 'В начале у каждого игрока по 3 карты в руке. В конце хода добирайте карты так, чтобы снова было 3.'
        },
        {
            id: 'quick-creatures',
            title: 'Существа на столе',
            iconSrc: QUICK_RULE_ICON_SRC['quick-creatures'],
            text: 'Существа имеют стоимость МР (верх по центру). Вытянув существо, вы можете выложить его на стол, потратив указанное МР. Каждое Существо имеет особенность, АТК и ХР. После атаки кладите карту в усталость (рубашкой вверх) до следующего хода; такие карты атаковать нельзя.'
        },
        {
            id: 'quick-fatigue',
            title: 'Усталость и запрет атаки',
            iconSrc: QUICK_RULE_ICON_SRC['quick-fatigue'],
            text: 'Эффект усталости: после атаки карту кладут рубашкой вверх до следующего хода. Карту с эффектом усталости атаковать нельзя.'
        },
        {
            id: 'quick-spells',
            title: 'Заклинания',
            iconSrc: QUICK_RULE_ICON_SRC['quick-spells'],
            text: 'Заклинание берётся в руку и используется во время поединка для атаки или защиты. При использовании тратите МР в размере, указанном на карте. После использования карта уходит в сброс.'
        },
        {
            id: 'quick-catacombs',
            title: 'Катакомбы',
            iconSrc: QUICK_RULE_ICON_SRC['quick-catacombs'],
            text: 'В Катакомбы можно попасть, вытянув карту «Вход в Катакомбы» из игровой колоды и используя её, потратив 1 МР. При входе вы берёте 1 карту из колоды Катакомб.'
        },
        {
            id: 'quick-artifacts-traps',
            title: 'Артефакты и ловушки',
            iconSrc: QUICK_RULE_ICON_SRC['quick-artifacts-traps'],
            text: 'В колоде Катакомб есть артефакты и ловушки. Артефакты кладутся рядом с Герое́м и действуют до конца игры. Ловушки берутся в руку и используются в любое время по описанию ловушки.'
        },
        {
            id: 'quick-combat',
            title: 'Атака и урон',
            iconSrc: QUICK_RULE_ICON_SRC['quick-combat'],
            text: 'При атаке существа и карты героев наносят выбранной цели урон в размере базовой АТК атакующей карты. Если урон >= ХР — цель умирает. Героя можно атаковать, только если у противника нет своих существ на столе или они в усталости. Если у атакуемой цели АТК >= АТК вашей карты — ваша карта умирает, иначе получает усталость. Можно атаковать 2 или 3 картами одновременно по одной цели (суммируйте АТК).'
        },
        {
            id: 'quick-win',
            title: 'Победа и опции',
            iconSrc: QUICK_RULE_ICON_SRC['quick-win'],
            text: 'Проигрывает тот, у кого Герой потеряет все ХР. Последний оставшийся в живых Герой побеждает. Можно добровольно пропустить ход и дополнительно восстановить 3 МР помимо основного восстановления.'
        }
    ];

    // Если localStorage уже содержит данные, но они старого формата (или совсем пустые) —
    // подменяем дефолт на актуальный.
    if (!data.rulesBlocks) {
        data.rulesBlocks = { quick: defaultQuick, detailed: [] };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return enrichQuickRuleIcons(data.rulesBlocks.quick);
    }

    const quick = Array.isArray(data.rulesBlocks.quick) ? data.rulesBlocks.quick : [];
    const hasNewDefaultIds = quick.some(b => b && b.id === 'quick-setup') &&
        quick.some(b => b && b.id === 'quick-artifacts-traps') &&
        quick.some(b => b && b.id === 'quick-turn') &&
        quick.some(b => b && b.id === 'quick-counters-start') &&
        quick.some(b => b && b.id === 'quick-fatigue');
    
    const looksLikeOldDefault = quick.some(b => b && (b.id === 'quick-start' || b.id === 'quick-turn' || b.id === 'quick-victory')) ||
        !hasNewDefaultIds;
    const tooShort = quick.length < 5;

    if (looksLikeOldDefault || tooShort) {
        data.rulesBlocks.quick = defaultQuick;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    return enrichQuickRuleIcons(data.rulesBlocks.quick || []);
}

// Получить блок правил по ID
function getQuickRuleBlock(blockId) {
    const blocks = getQuickRuleBlocks();
    return blocks.find(b => b.id === blockId);
}

// Обновить блок краткие правил
function updateQuickRuleBlock(blockId, updates) {
    const data = getAllData();
    if (!data.rulesBlocks) data.rulesBlocks = { quick: [], detailed: [] };
    
    const blockIndex = data.rulesBlocks.quick.findIndex(b => b.id === blockId);
    if (blockIndex !== -1) {
        data.rulesBlocks.quick[blockIndex] = { ...data.rulesBlocks.quick[blockIndex], ...updates };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return data.rulesBlocks.quick[blockIndex];
    }
    return null;
}

// Добавить блок кратких правил
function addQuickRuleBlock(block) {
    const data = getAllData();
    if (!data.rulesBlocks) data.rulesBlocks = { quick: [], detailed: [] };
    
    // Генерировать уникальный ID
    const newId = `quick-block-${Date.now()}`;
    block.id = newId;
    data.rulesBlocks.quick.push(block);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return block;
}

// Удалить блок кратких правил
function deleteQuickRuleBlock(blockId) {
    const data = getAllData();
    if (!data.rulesBlocks) data.rulesBlocks = { quick: [], detailed: [] };
    
    data.rulesBlocks.quick = data.rulesBlocks.quick.filter(b => b.id !== blockId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Получить изображение для блока (если добавлено)
function getRuleBlockImage(blockId) {
    const data = getAllData();
    if (!data.ruleBlockImages) data.ruleBlockImages = {};
    return data.ruleBlockImages[blockId] || null;
}

// Сохранить изображение для блока правил
function setRuleBlockImage(blockId, imageUrl) {
    const data = getAllData();
    if (!data.ruleBlockImages) data.ruleBlockImages = {};
    
    data.ruleBlockImages[blockId] = imageUrl;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Сбросить на значения по умолчанию
function resetToDefault() {
    localStorage.removeItem(STORAGE_KEY);
    initializeStorage();
}

// Инициализировать при загрузке
initializeStorage();

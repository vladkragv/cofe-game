// ============================================
// DATA.JS - База данных карт
// ============================================

const CARDS_DATABASE = [
    // ===== ГЕРОИ (12) =====
    { id: 1, name: 'Орк-Берсерк', type: 'heroes', atk: 4, hp: 28, mana: 0, ability: 'Первый урон в бою по Орку каждый раунд уменьшается на 2 (мин. 1). Орки при атаке восстанавливают 1 HP герою.', image: 'hero-1.jpg' },
    { id: 2, name: 'Ассасин', type: 'heroes', atk: 3, hp: 24, mana: 0, ability: 'Атакуя бросает d6. 1-3: двойной урон; 4-6: обычный урон. Стоимость: 3 МАНЫ. Атака по Нежити +1 АТК.', image: 'hero-2.jpg' },
    { id: 3, name: 'Некромант', type: 'heroes', atk: 3, hp: 24, mana: 0, ability: 'Наносит цели d6 урона и лечит себя на половину нанесенного урона. Стоимость: 3 МАНЫ. Нежить стоит на -1 МР.', image: 'hero-3.jpg' },
    { id: 4, name: 'Маг Эльф', type: 'heroes', atk: 3, hp: 25, mana: 0, ability: 'Базовая атака 1 цели, затем скачет на 2 другие цели. Каждой цели d6 урона. Стоимость: 5 МАНЫ. Духи получают +1 атаку', image: 'hero-4.jpg' },
    { id: 5, name: 'Маг Лекарь', type: 'heroes', atk: 2, hp: 20, mana: 0, ability: 'Лечит одну цель на d6 HP. Снимает негативный эффект. Стоимость: 3 МАНЫ. Все заклинания стоят 1 МР', image: 'hero-5.jpg' },
    { id: 6, name: 'Стрелок Лучник', type: 'heroes', atk: 3, hp: 20, mana: 0, ability: 'Если его атакуют, бросает d6. 1-2: избегает урона; 3-4: избегает де-баффы; 5-6: урон без эффектов. Атакуя, не получает урон', image: 'hero-6.jpg' },
    { id: 7, name: 'Паладин', type: 'heroes', atk: 2, hp: 32, mana: 0, ability: 'Наносит d6 урона по цели Тьмы (Некромант, Темный маг, Нежить). По другим целям d6 урона. Стоимость: 3 МАНЫ. Орудия неуязвимы от атак Нежити', image: 'hero-7.jpg' },
    { id: 8, name: 'Темный Маг', type: 'heroes', atk: 4, hp: 25, mana: 0, ability: 'Атака по площади. Все герои получают d6 урона. Стоимость: 5 МАНЫ. Демоны +1 АТК', image: 'hero-8.jpg' },
    { id: 9, name: 'Чародей', type: 'heroes', atk: 3, hp: 24, mana: 0, ability: 'Один раз за раунд может перебросить любой свой или чужой d6. При перебросе своего d6 лечит лечит себя на 2 HP', image: 'hero-9.jpg' },
    { id: 10, name: 'Гладиатор', type: 'heroes', atk: 4, hp: 26, mana: 0, ability: 'Бросает d6 при атаке. 1-3: базовый урон; 4-6: 2 атаки (можно по разным целям). Вызов на поединок на d6. Победитель наносит базовый урон', image: 'hero-10.jpg' },
    { id: 11, name: 'Друид', type: 'heroes', atk: 3, hp: 25, mana: 0, ability: 'Бросает d6. 1-2: призывает "корни" и цель теряет ход (оглушение); 3-4: призывает волка и наносит 4 урона; 5-6: пропал. Стоимость: 3 МАНЫ. При атаке зверя лечит себя на 1 HP', image: 'hero-11.jpg' },
    { id: 12, name: 'Наездник Дракона', type: 'heroes', atk: 2, hp: 26, mana: 0, ability: 'Наездник выбирает одну цель и наносит удар: базовая атака + d6 урона, затем может "перепрыгнуть" на другую цель и нанести ещё d6 урона. Стоимость: 3 МАНЫ. Драконы могут атаковать героя напрямую', image: 'hero-12.jpg' },

    // ===== ЗВЕРИ (7) =====
    { id: 13, name: 'Стая волков', type: 'beasts', atk: 3, hp: 5, mana: 2, ability: 'При атаке цели вместе с другим зверем +1 АТК', image: 'beast-1.jpg' },
    { id: 14, name: 'Стадо буйволов', type: 'beasts', atk: 3, hp: 9, mana: 5, ability: 'Переверни карту и карта пропускает ход. В следующий ход +2 АТК', image: 'beast-2.jpg' },
    { id: 15, name: 'Боевой медведь', type: 'beasts', atk: 4, hp: 8, mana: 4, ability: 'При атаке топает по земле и шокирует 3 цели на выбор (не могут действовать 1 след. раунд)', image: 'beast-3.jpg' },
    { id: 16, name: 'Кобра', type: 'beasts', atk: 1, hp: 3, mana: 1, ability: 'Кусает цель кроме героя (карту поместить возле цели). Если цель в свой ход не уберет дэ-бафф - то цель умирает', image: 'beast-4.jpg' },
    { id: 17, name: 'Летучие мыши', type: 'beasts', atk: 2, hp: 3, mana: 2, ability: 'При нанесении урона восстанавливают 1 HР герою', image: 'beast-5.jpg' },
    { id: 18, name: 'Кровожадный енот', type: 'beasts', atk: 2, hp: 4, mana: 3, ability: 'При атаке по зверям наносит +2 АТК', image: 'beast-6.jpg' },
    { id: 19, name: 'Боевая крыса', type: 'beasts', atk: 2, hp: 3, mana: 2, ability: 'При убийстве цели её хозяин (герой) получает 2 урона', image: 'beast-7.jpg' },

    // ===== ГИБРИДНАЯ КАРТА: Зверь-Демон (1) =====
    { id: 20, name: 'Цербер', type: 'beasts', hybridTypes: ['demons'], atk: 3, hp: 7, mana: 4, ability: 'При атаке наносит урон по 3 разным целям по 3 урона (если есть рядом)', image: 'hybrid-1.jpg', hybrid: true },

    // ===== ДЕМОНЫ (2) =====
    { id: 21, name: 'Огненный Голем', type: 'demons', atk: 4, hp: 9, mana: 5, ability: 'При получении урона наносит атакующему 1 урон', image: 'demon-1.jpg' },
    { id: 22, name: 'Жнец с косой', type: 'demons', atk: 3, hp: 4, mana: 4, ability: 'd: 1-3 базовый урон; 4-6: уничтожает цель', image: 'demon-2.jpg' },

    // ===== ГИБРИДНАЯ КАРТА: Демон-Дух (2) =====
    { id: 23, name: 'Гаргона', type: 'demons', hybridTypes: ['spirits'], atk: 2, hp: 7, mana: 3, ability: 'При атаке по цели превращает её в камень (цель пропускает 1 ход)', image: 'hybrid-2.jpg', hybrid: true },

    // ===== ДУХИ (1) =====
    { id: 25, name: 'Дриада', type: 'spirits', atk: 0, hp: 4, mana: 2, ability: 'В свой ход исцеляет своего героя на 2 HP (Если герой Друид - на 3 HP), либо снимает дэ-баффы', image: 'spirit-1.jpg' },

    // ===== ГИБРИДНЫЕ КАРТЫ: Нежить-Дух (2) и Демон-Дух (уже выше) =====
    { id: 26, name: 'Банши', type: 'spirits', hybridTypes: ['undead'], atk: 0, hp: 4, mana: 2, ability: 'В свой ход наносит 2 атаки всем вражеским героям', image: 'hybrid-4.jpg', hybrid: true },

    // ===== НЕЖИТЬ (3) =====
    { id: 28, name: 'Всадник без головы', type: 'undead', atk: 4, hp: 7, mana: 4, ability: 'Если убивает цель, сразу атакует следующую цель с -1 АТК', image: 'undead-1.jpg' },
    { id: 29, name: 'Скелеты', type: 'undead', atk: 2, hp: 4, mana: 2, ability: 'При первой гибели возврвщается вновь', image: 'undead-2.jpg' },
    { id: 30, name: 'Мумия', type: 'undead', atk: 4, hp: 9, mana: 5, ability: 'При атаке если не убивает цель, возвращается в руку', image: 'undead-3.jpg' },

    // ===== ГИБРИДНАЯ КАРТА: Нежить-Дух (уже выше) =====

    // ===== ДРАКОНЫ (4) =====
    { id: 32, name: 'Гарпия', type: 'dragons', atk: 3, hp: 4, mana: 2, ability: 'Во время атаки можно использовать заклинание бесплатно', image: 'dragon-1.jpg' },
    { id: 33, name: 'Призрак дракона', type: 'dragons', atk: 5, hp: 6, mana: 2, ability: 'После атаки скинуть карту в сброс', image: 'dragon-2.jpg' },
    { id: 34, name: 'Яйцо дракона', type: 'dragons', atk: 4, hp: 6, mana: 3, ability: 'При появлении эффект слабости, в следующий ход возрождается', image: 'dragon-3.jpg' },
    { id: 35, name: 'Череп с маной', type: 'dragons', atk: 3, hp: 4, mana: 2, ability: 'При атаке восстанавливает 1 МР. Наездник дракона 2 MP', image: 'dragon-4.jpg' },

    // ===== ОРКИ (4) =====
    { id: 36, name: 'Отряд троллей', type: 'orcs', atk: 4, hp: 3, mana: 4, ability: 'При атаке орудий наносит двойной урон', image: 'orc-1.jpg' },
    { id: 37, name: 'Слон в броне', type: 'orcs', atk: 5, hp: 7, mana: 4, ability: 'После атаки не испытывает эффект усталости', image: 'orc-2.jpg' },
    { id: 38, name: 'Отряд орков', type: 'orcs', atk: 4, hp: 5, mana: 3, ability: 'Атакует цель. Если убивает не испытывает эффект усталости', image: 'orc-3.jpg' },
    { id: 39, name: 'Орк Стрелок', type: 'orcs', atk: 2, hp: 4, mana: 2, ability: 'Атакуя цель наносит 1 урон герою. Не получает урон при атаке.', image: 'orc-4.jpg' },

    // ===== ОРУДИЯ (5) =====
    { id: 40, name: 'Троянский конь', type: 'weapons', hp: 9, mana: 5, ability: 'При смерти призывает одно существо из руки бесплатно', image: 'weapon-1.jpg' },
    { id: 41, name: 'Баллиста', type: 'weapons', damage: 4, hp: 7, mana: 4, ability: 'Может атаковать героя игнорируя переднюю линию', image: 'weapon-2.jpg' },
    { id: 42, name: 'Стена с щитами', type: 'weapons', hp: 12, mana: 4, ability: 'Пока стоит стена враг не может атаковать другую цель', image: 'weapon-3.jpg' },
    { id: 43, name: 'Мортира', type: 'weapons', damage: 3, hp: 7, mana: 4, ability: 'Атакует 2 цели по 3 урона (на выбор существам или герою', image: 'weapon-4.jpg' },
    { id: 44, name: 'Лучники на стене', type: 'weapons', hp: 6, mana: 4, ability: 'Если у вас есть Стена с щитами, получают +2 АТК', image: 'weapon-5.jpg' },

    // ===== ЛОВУШКИ (5) =====
    { id: 45, name: 'Яма с шипами', type: 'traps', hp: 0, mana: 0, ability: 'Когда вражеское существо впервые в ход атакует оно получает 2 урона до атаки', image: 'trap-1.jpg' },
    { id: 46, name: 'Проклетая печать', type: 'traps', hp: 0, mana: 0, ability: 'При розыграше артефакта противником артефакт не срабатывает и отправляется в сброс', image: 'trap-2.jpg' },
    { id: 47, name: 'Руна немоты', type: 'traps', hp: 0, mana: 0, ability: 'При попытке использовать активную способность героем противника: способность не срабатывает.', image: 'trap-3.jpg' },
    { id: 48, name: 'Газовая ловушка', type: 'traps', hp: 0, mana: 0, ability: 'Когда противник "исследует" катакомбы, 2 его существа получают эффект слабости.', image: 'trap-4.jpg' },
    { id: 49, name: 'Обвал коридора', type: 'traps', hp: 0, mana: 0, ability: 'Когда противник "исследует" катакомбы, он получает 2 урона', image: 'trap-5.jpg' },

    // ===== АРТЕФАКТЫ (11) =====
    { id: 50, name: 'Меч древних', type: 'artifacts', hp: 0, mana: 0, ability: '+2 АТК к герою', image: 'artifact-1.jpg' },
    { id: 51, name: 'Амулет маны', type: 'artifacts', hp: 0, mana: 0, ability: 'В начале хода восстанавливаешь +1 МР дополнительно', image: 'artifact-2.jpg' },
    { id: 52, name: 'Кольцо Вапмира', type: 'artifacts', hp: 0, mana: 0, ability: 'При нанесении урона базовой атакой лечишься на 1 HР', image: 'artifact-3.jpg' },
    { id: 53, name: 'Щит забытого короля', type: 'artifacts', hp: 0, mana: 0, ability: 'Раз за бой можно полностью игнорировать одну атаку', image: 'artifact-4.jpg' },
    { id: 54, name: 'Плащ теней', type: 'artifacts', hp: 0, mana: 0, ability: 'Один раз за игру можно украсть артефакт у противника', image: 'artifact-5.jpg' },
    { id: 55, name: 'Кольцо некромантки', type: 'artifacts', hp: 0, mana: 0, ability: 'Каждый раз, когда умирает существо (любое в игре), вы восстанавливаете 1 HP', image: 'artifact-6.jpg' },
    { id: 56, name: 'Амулет жизни', type: 'artifacts', hp: 0, mana: 0, ability: 'Сбросьте амулет, чтобы мгновенно восстановить 6 HP', image: 'artifact-7.jpg' },
    { id: 57, name: 'Кинжал Тени', type: 'artifacts', hp: 0, mana: 0, ability: 'Герой получает +1 АТК (Ассасин при броске d6: 6 - мгновенное убийство существа)', image: 'artifact-8.jpg' },
    { id: 58, name: 'Щит дракона', type: 'artifacts', hp: 0, mana: 0, ability: '-1 входящего урона от всех атак герою', image: 'artifact-9.jpg' },
    { id: 59, name: 'Посох Архимага', type: 'artifacts', hp: 0, mana: 0, ability: 'Стоимость всех ваших заклинаний -1 МР', image: 'artifact-10.jpg' },
    { id: 60, name: 'Щит света', type: 'artifacts', hp: 0, mana: 0, ability: '-1 от атак заклинаний (для всех союзников)', image: 'artifact-11.jpg' },

    // ===== ВХОДЫ В КАТАКОМБЫ =====
    { id: 61, name: 'Вход в Катакомбы', type: 'catacombs', hp: 0, mana: 1, ability: 'Возьмите 1 карту из колоды Катакомб. [В колоде 10 шт.]', image: 'catacombs-entrance.jpg', quantity: 10 },

    // ===== ЗАКЛИНАНИЯ (21) =====
    { id: 62, name: 'Огненный шар', type: 'spells', hp: 0, mana: 2, ability: '4 урона существу или герою. d6: 4-6 +2 урона', image: 'spell-1.jpg' },
    { id: 63, name: 'Защитный купол', type: 'spells', hp: 0, mana: 2, ability: 'Отразите следующую атаку противника', image: 'spell-2.jpg' },
    { id: 64, name: 'Ледяной смерч', type: 'spells', hp: 0, mana: 3, ability: 'Все противники возвращают 1 карту в руку', image: 'spell-3.jpg' },
    { id: 65, name: 'Цепная молния', type: 'spells', hp: 0, mana: 2, ability: 'Шокирует 3 любые цели (цели пропускают ход)', image: 'spell-4.jpg' },
    { id: 66, name: 'Ледяной барьер', type: 'spells', hp: 0, mana: 2, ability: 'Выбранное существо блокирует базовый урон (кроме заклинаний)', image: 'spell-5.jpg' },
    { id: 67, name: 'Слово исцеления', type: 'spells', hp: 0, mana: 2, ability: 'Лечит героя на d6 или снимает дэ-бафф с любой цели', image: 'spell-6.jpg' },
    { id: 68, name: 'Парирование', type: 'spells', hp: 0, mana: 3, ability: 'При получении урона d6: 4-6 урон блокируется', image: 'spell-7.jpg' },
    { id: 69, name: 'Грозовой удар', type: 'spells', hp: 0, mana: 3, ability: 'Переместите ваше или враждебное существо в его руку', image: 'spell-8.jpg' },
    { id: 70, name: 'Барьер маны', type: 'spells', hp: 0, mana: 2, ability: 'Когда противник разыгрывает заклинание, бросает d6: 1-3 заклинание отменяется, 4-6 работает как заклинание', image: 'spell-9.jpg' },
    { id: 71, name: 'Благославение силы', type: 'spells', hp: 0, mana: 2, ability: 'Одно ваше существо получает +3 АТК до конца хода', image: 'spell-10.jpg' },
    { id: 72, name: 'Луч благодати', type: 'spells', hp: 0, mana: 0, ability: 'Лечит героя на +2 HP и +2 МР', image: 'spell-11.jpg' },
    { id: 73, name: 'Ледяная стрела', type: 'spells', hp: 0, mana: 2, ability: '3 урона герою и он не атакует в следующий ход (карту крепим к герою)', image: 'spell-12.jpg' },
    { id: 74, name: 'Тьма пожирающая', type: 'spells', hp: 0, mana: 4, ability: '4 урона герою + сброс 1 карты существа. Если ваш герой Темный маг +2 урона', image: 'spell-13.jpg' },
    { id: 75, name: 'Призыв Элементаля', type: 'spells', hp: 0, mana: 2, ability: 'Встает на защиту атакуемой цели. Заставляет скинуть атакующую карту в сброс', image: 'spell-14.jpg' },
    { id: 76, name: 'Проклятие слабости', type: 'spells', hp: 0, mana: 2, ability: 'Существо получает -2 АТК до конца игры (карту крепим к цели)', image: 'spell-15.jpg' },
    { id: 77, name: 'Медитация', type: 'spells', hp: 0, mana: 2, ability: 'Снимает все дэ-баффы с вашего героя и его союзников', image: 'spell-16.jpg' },
    { id: 78, name: 'Сокрушительный удар', type: 'spells', hp: 0, mana: 2, ability: 'Герой получает +3 АТК до конца хода', image: 'spell-17.jpg' },
    { id: 79, name: 'Двойной выстрел', type: 'spells', hp: 0, mana: 2, ability: 'Атакует 2 выбранные цели базовой атакой героя', image: 'spell-18.jpg' },
    { id: 80, name: 'Ядовитая стрела', type: 'spells', hp: 0, mana: 2, ability: 'Атакуя отравляет цель до конца хода. Если цель совершает атаку - умирает (карту крепим к цели)', image: 'spell-19.jpg' },
    { id: 81, name: 'Уклонение', type: 'spells', hp: 0, mana: 2, ability: 'd6: 1-3 уклон от базовой атаки; 4-6 от любой атаки', image: 'spell-20.jpg' },
    { id: 82, name: 'Корни удержания', type: 'spells', hp: 0, mana: 2, ability: 'Выбранная цель не может атаковать до следующего хода', image: 'spell-21.jpg' },
];

// Типы карт для фильтрации
const CARD_TYPES = {
    heroes: 'Герои',
    beasts: 'Звери',
    demons: 'Демоны',
    spirits: 'Духи',
    undead: 'Нежить',
    dragons: 'Драконы',
    orcs: 'Орки',
    weapons: 'Орудия',
    traps: 'Ловушки',
    artifacts: 'Артефакты',
    catacombs: 'Входы в катакомбы',
    spells: 'Заклинания'
};

// Получить все карты определённого типа
function getCardsByType(type) {
    // Получить карты из storage, если они есть
    let cards = getStorageCards();
    if (!cards || cards.length === 0) {
        cards = CARDS_DATABASE;
    }
    
    if (!type) {
        return cards;
    }
    
    let filteredCards = cards.filter(card => card.type === type);
    
    // Для гибридных карт, добавляем их к обоим типам
    if (type === 'beasts' || type === 'demons' || type === 'spirits' || type === 'undead') {
        const hybridCards = cards.filter(card => card.hybrid && card.hybridTypes && card.hybridTypes.includes(type));
        filteredCards = filteredCards.concat(hybridCards);
    }
    
    return filteredCards;
}

// Функция поиска
function searchCards(query) {
    // Получить карты из storage, если они есть
    let cards = getStorageCards();
    if (!cards || cards.length === 0) {
        cards = CARDS_DATABASE;
    }

    const lang =
        typeof window !== 'undefined' && typeof window.getCardLang === 'function' ? window.getCardLang() : 'ru';
    const lowerQuery = query.toLowerCase();
    return cards.filter((card) => {
        const c =
            typeof window !== 'undefined' && window.localizeCard && lang !== 'ru'
                ? window.localizeCard(card, lang)
                : card;
        return c.name.toLowerCase().includes(lowerQuery) || c.ability.toLowerCase().includes(lowerQuery);
    });
}

// Функция сортировки
function sortCards(cards, sortType) {
    const sorted = [...cards];
    const lang =
        typeof window !== 'undefined' && typeof window.getCardLang === 'function' ? window.getCardLang() : 'ru';
    const loc = (c) =>
        typeof window !== 'undefined' && window.localizeCard && lang !== 'ru' ? window.localizeCard(c, lang) : c;
    const localeTag =
        lang === 'zh' ? 'zh-Hans' : lang === 'kk' ? 'kk' : lang === 'uk' ? 'uk' : lang === 'be' ? 'be' : lang === 'en' ? 'en' : 'ru';

    switch (sortType) {
        case 'name':
            sorted.sort((a, b) => loc(a).name.localeCompare(loc(b).name, localeTag, { sensitivity: 'base' }));
            break;
        case 'atk':
            sorted.sort((a, b) => b.atk - a.atk);
            break;
        case 'hp':
            sorted.sort((a, b) => b.hp - a.hp);
            break;
        case 'mana':
            sorted.sort((a, b) => b.mana - a.mana);
            break;
    }
    
    return sorted;
}

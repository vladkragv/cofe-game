(function () {
    const STORAGE_KEY = 'siteLanguage';
    const SUPPORTED_LANGS = ['ru', 'en', 'kk', 'uk', 'be', 'zh'];
    const CARD_MANA_STAT_ICON = 'images/icons/cards/stat-mana.svg';

    function escapeHtmlI18n(s) {
        if (s == null) return '';
        return String(s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    const DICT = {
        ru: {
            langLabel: 'Язык',
            nav: ['ГЛАВНАЯ', 'ПРАВИЛА', 'КАРТЫ', 'ОБ ИГРЕ'],
            mobileNav: ['Главная', 'Правила игры', 'Игровые карты', 'Об этой игре'],
            selectorBtn: 'Выбор настолки',
            selectorSoon: 'Скоро...',
            footerBuy: 'Купить игру на «Авито»',
            backToTopAria: 'Наверх',
            scrollDownAria: 'Прокрутить страницу вниз к содержимому',
            ariaLangSwitcher: 'Смена языка сайта',
            index: {
                pageTitle: 'Хроники забытых империй — настольная карточная игра',
                heroTitle: 'Хроники забытых империй',
                heroSub: 'Эпическая настольная карточная игра о вызове судьбе',
                heroBuy: 'Купить настольную игру на «Авито»',
                heroMini: 'Войти в Катакомбы: Мини-игра',
                aboutTitle: 'О игре',
                aboutBody:
                    '«Хроники забытых империй» — стратегическая карточная игра для 2–6 игроков: вы выбираете героя, исследуете подземелья, собираете артефакты и сражаетесь с соперниками. Партия обычно 30–60 минут; нужны и удача, и тактика. Комбинируйте способности, управляйте маной и атакуйте вовремя, чтобы остаться последним в игре.',
                galleryTitle: '12 УНИКАЛЬНЫХ ГЕРОЕВ',
                galleryAlt: 'Герой',
                allCards: 'Все карты —',
                stats: ['Героев', 'Карт', 'Игроков', 'Минут']
            },
            cards: {
                pageTitle: 'Карты — Хроники забытых империй',
                title: 'Каталог карт',
                search: 'Поиск по названию или способности...',
                type: 'Тип карты:',
                sort: 'Сортировка:',
                reset: 'Сбросить',
                noResult: 'Карты по вашему запросу не найдены.',
                back: '← Назад к списку',
                typeAll: 'Все',
                sortName: 'По алфавиту',
                sortAtk: 'По АТК',
                sortHp: 'По HР',
                sortMana: 'По стоимости МР',
                filterOptions: [
                    'Все',
                    'Герои',
                    'Звери',
                    'Демоны',
                    'Духи',
                    'Нежить',
                    'Драконы',
                    'Орки',
                    'Орудия',
                    'Ловушки',
                    'Артефакты',
                    'Входы в катакомбы',
                    'Заклинания'
                ],
                tabs: [
                    'Все карты',
                    'Герои (12)',
                    'Звери (8)',
                    'Демоны (4)',
                    'Духи (3)',
                    'Нежить (4)',
                    'Драконы (4)',
                    'Орки (4)',
                    'Орудия (5)',
                    'Ловушки (5)',
                    'Артефакты (11)',
                    'Заклинания (21)',
                    'Входы в Катакомбы (10)'
                ],
                catacombs: {
                    imgAlt: 'Вход в катакомбы',
                    h4: 'Вход в Катакомбы',
                    typeLine: 'Вход в подземелье',
                    manaLine: 'Стоимость МР: 1',
                    descHtml:
                        'В игровой колоде содержится <strong>10 идентичных карт</strong> «Вход в Катакомбы».',
                    ability: 'При использовании: возьмите 1 карту из колоды Катакомб (артефакт или ловушка).'
                }
            }
        },
        en: {
            langLabel: 'Language',
            nav: ['HOME', 'RULES', 'CARDS', 'ABOUT'],
            mobileNav: ['Home', 'Game Rules', 'Card Catalog', 'About'],
            selectorBtn: 'Select game',
            selectorSoon: 'Coming soon...',
            footerBuy: 'Buy on Avito',
            backToTopAria: 'Back to top',
            scrollDownAria: 'Scroll down to content',
            ariaLangSwitcher: 'Change site language',
            index: {
                pageTitle: 'Chronicles of Forgotten Empires — board card game',
                heroTitle: 'Chronicles of Forgotten Empires',
                heroSub: 'A fantasy card duel where every turn matters',
                heroBuy: 'Buy the board game on Avito',
                heroMini: 'Enter the Catacombs: mini-game',
                aboutTitle: 'About the game',
                aboutBody:
                    'Chronicles of Forgotten Empires is a strategy card game for 2–6 players: pick a hero, delve into dungeons, collect artifacts, and outplay your opponents. Matches usually run 30–60 minutes and reward both luck and tactics. Chain abilities, pace your mana, and time attacks to be the last hero standing.',
                galleryTitle: '12 UNIQUE HEROES',
                galleryAlt: 'Hero',
                allCards: 'Browse all cards',
                stats: ['Heroes', 'Cards', 'Players', 'Minutes']
            },
            cards: {
                pageTitle: 'Cards — Chronicles of Forgotten Empires',
                title: 'Card catalog',
                search: 'Search by name or ability...',
                type: 'Card type:',
                sort: 'Sort:',
                reset: 'Reset',
                noResult: 'No cards match your search.',
                back: '← Back to list',
                typeAll: 'All',
                sortName: 'A–Z',
                sortAtk: 'By ATK',
                sortHp: 'By HP',
                sortMana: 'By mana cost',
                filterOptions: [
                    'All',
                    'Heroes',
                    'Beasts',
                    'Demons',
                    'Spirits',
                    'Undead',
                    'Dragons',
                    'Orcs',
                    'Weapons',
                    'Traps',
                    'Artifacts',
                    'Catacombs entrances',
                    'Spells'
                ],
                tabs: ['All cards', 'Heroes (12)', 'Beasts (8)', 'Demons (4)', 'Spirits (3)', 'Undead (4)', 'Dragons (4)', 'Orcs (4)', 'Weapons (5)', 'Traps (5)', 'Artifacts (11)', 'Spells (21)', 'Catacombs (10)'],
                catacombs: {
                    imgAlt: 'Catacombs entrance',
                    h4: 'Catacombs Entrance',
                    typeLine: 'Dungeon entrance',
                    manaLine: 'Mana cost: 1',
                    descHtml: 'The main deck includes <strong>10 identical</strong> “Catacombs Entrance” cards.',
                    ability: 'On use: draw 1 card from the Catacombs deck (artifact or trap).'
                }
            },
            about: {
                world: 'Game world',
                history: 'Game history',
                concept: 'Setting & concept',
                tips: 'Strategy tips',
                faq: 'FAQ',
                contacts: 'Contacts',
                pageTitle: 'About the game — Chronicles of Forgotten Empires',
                ctaBuy: 'Buy on Avito',
                ctaTg: 'Message on Telegram',
                ctaVk: 'Open VK',
                legalName: 'Full name',
                legalTax: 'Tax ID',
                legalMail: 'Email'
            }
        },
        kk: {
            langLabel: 'Тіл',
            nav: ['БАСТЫ БЕТ', 'ЕРЕЖЕЛЕР', 'КАРТАЛАР', 'ОЙЫН ТУРАЛЫ'],
            mobileNav: ['Басты бет', 'Ойын ережесі', 'Карталар', 'Ойын туралы'],
            selectorBtn: 'Ойынды таңдау',
            selectorSoon: 'Жақында...',
            footerBuy: 'Avito-дан сатып алу',
            backToTopAria: 'Жоғарыға',
            scrollDownAria: 'Мазмұнға төмен айналдыру',
            ariaLangSwitcher: 'Сайт тілін өзгерту',
            index: {
                pageTitle: 'Ұмытылған империялар шежіресі — үстел карталық ойыны',
                heroTitle: 'Ұмытылған империялар шежіресі',
                heroSub: 'Әр жүріс маңызды болатын фэнтези карталық дуэль',
                heroBuy: 'Avito арқылы үстел ойынын сатып алу',
                heroMini: 'Катакомбаларға кіру: мини-ойын',
                aboutTitle: 'Ойын туралы',
                aboutBody:
                    'Бұл 2–6 ойыншыға арналған стратегиялық карталық ойын: кейіпкерді таңдап, жерастыға түсесіз, артефактілер жинайсыз және қарсыластармен күресесіз. Партия әдетте 30–60 минут; сәттілік пен тактика қажет. Қабілеттерді үйлестіріп, мананы үнемдеп, соңғы тірі кейіпкер болыңыз.',
                galleryTitle: '12 БІРЕГЕЙ КЕЙІПКЕР',
                galleryAlt: 'Кейіпкер',
                allCards: 'Барлық карталар',
                stats: ['Кейіпкер', 'Карта', 'Ойыншы', 'Минут']
            },
            cards: {
                pageTitle: 'Карталар — Ұмытылған империялар шежіресі',
                title: 'Карталар каталогы',
                search: 'Атауы не қабілеті бойынша іздеу...',
                type: 'Карта түрі:',
                sort: 'Сұрыптау:',
                reset: 'Тазарту',
                noResult: 'Сұрауға сай карта табылмады.',
                back: '← Тізімге оралу',
                typeAll: 'Барлығы',
                sortName: 'Әліпби',
                sortAtk: 'ATK бойынша',
                sortHp: 'HP бойынша',
                sortMana: 'Мана бағасы',
                filterOptions: [
                    'Барлығы',
                    'Кейіпкерлер',
                    'Жануарлар',
                    'Жындар',
                    'Рухтар',
                    'Өлілер',
                    'Айдаһарлар',
                    'Орктар',
                    'Қару',
                    'Тұзақтар',
                    'Артефактілер',
                    'Катакомбаларға кірулер',
                    'Сиқырлар'
                ],
                tabs: ['Барлығы', 'Кейіпкерлер (12)', 'Жануарлар (8)', 'Жындар (4)', 'Рухтар (3)', 'Өлілер (4)', 'Айдаһарлар (4)', 'Орктар (4)', 'Қару (5)', 'Тұзақтар (5)', 'Артефактілер (11)', 'Сиқырлар (21)', 'Катакомбалар (10)'],
                catacombs: {
                    imgAlt: 'Катакомбаларға кіру',
                    h4: 'Катакомбаларға кіру',
                    typeLine: 'Жерастыға кіру',
                    manaLine: 'Мана құны: 1',
                    descHtml: 'Негізгі колодада <strong>10 бірдей</strong> «Катакомбаларға кіру» картасы бар.',
                    ability: 'Қолданғанда: Катакомбалар колодасынан 1 карта алыңыз (артефакт немесе тұзақ).'
                }
            },
            about: {
                world: 'Ойын әлемі',
                history: 'Ойын тарихы',
                concept: 'Тұжырымдама және әлем',
                tips: 'Стратегия кеңестері',
                faq: 'ЖҚС',
                contacts: 'Байланыс',
                pageTitle: 'Ойын туралы — Ұмытылған империялар шежіресі',
                ctaBuy: 'Avito-дан сатып алу',
                ctaTg: 'Telegram-ға жазу',
                ctaVk: 'VK ашу',
                legalName: 'Аты-жөні',
                legalTax: 'ЖСН/ИНН',
                legalMail: 'mail'
            }
        },
        uk: {
            langLabel: 'Мова',
            nav: ['ГОЛОВНА', 'ПРАВИЛА', 'КАРТКИ', 'ПРО ГРУ'],
            mobileNav: ['Головна', 'Правила гри', 'Картки', 'Про гру'],
            selectorBtn: 'Вибір гри',
            selectorSoon: 'Скоро...',
            footerBuy: 'Купити на Avito',
            backToTopAria: 'Вгору',
            scrollDownAria: 'Прокрутити вниз до вмісту',
            ariaLangSwitcher: 'Змінити мову сайту',
            index: {
                pageTitle: 'Хроніки забутих імперій — настільна карткова гра',
                heroTitle: 'Хроніки забутих імперій',
                heroSub: 'Фентезі-дуель, де кожен хід має вагу',
                heroBuy: 'Купити настільну гру на Avito',
                heroMini: 'Увійти в Катакомби: мінігра',
                aboutTitle: 'Про гру',
                aboutBody:
                    '«Хроніки забутих імперій» — стратегічна карткова гра на 2–6 гравців: оберіть героя, досліджуйте підземелля, збирайте артефакти та перемагайте суперників. Партія зазвичай 30–60 хвилин; потрібні і вдача, і тактика. Комбінуйте здібності, керуйте маною й атакуйте вчасно, щоб залишитися останнім героєм.',
                galleryTitle: '12 УНІКАЛЬНИХ ГЕРОЇВ',
                galleryAlt: 'Герой',
                allCards: 'Усі картки',
                stats: ['Героїв', 'Карт', 'Гравців', 'Хвилин']
            },
            cards: {
                pageTitle: 'Картки — Хроніки забутих імперій',
                title: 'Каталог карток',
                search: 'Пошук за назвою або вмінням...',
                type: 'Тип картки:',
                sort: 'Сортування:',
                reset: 'Скинути',
                noResult: 'За запитом карток не знайдено.',
                back: '← Назад до списку',
                typeAll: 'Усі',
                sortName: 'За абеткою',
                sortAtk: 'За ATK',
                sortHp: 'За HP',
                sortMana: 'За ціною мани',
                filterOptions: [
                    'Усі',
                    'Герої',
                    'Звірі',
                    'Демони',
                    'Духи',
                    'Нежить',
                    'Дракони',
                    'Орки',
                    'Зброя',
                    'Пастки',
                    'Артефакти',
                    'Входи в катакомби',
                    'Закляття'
                ],
                tabs: ['Усі картки', 'Герої (12)', 'Звірі (8)', 'Демони (4)', 'Духи (3)', 'Нежить (4)', 'Дракони (4)', 'Орки (4)', 'Зброя (5)', 'Пастки (5)', 'Артефакти (11)', 'Закляття (21)', 'Катакомби (10)'],
                catacombs: {
                    imgAlt: 'Вхід у катакомби',
                    h4: 'Вхід у Катакомби',
                    typeLine: 'Вхід у підземелля',
                    manaLine: 'Вартість мани: 1',
                    descHtml: 'У основній колоді є <strong>10 однакових</strong> карт «Вхід у Катакомби».',
                    ability: 'При використанні: візьміть 1 карту з колоди Катакомб (артефакт або пастку).'
                }
            },
            about: {
                world: 'Світ гри',
                history: 'Історія гри',
                concept: 'Концепт і сетинг',
                tips: 'Поради зі стратегії',
                faq: 'Поширені запитання',
                contacts: 'Контакти',
                pageTitle: 'Про гру — Хроніки забутих імперій',
                ctaBuy: 'Купити на Avito',
                ctaTg: 'Написати у Telegram',
                ctaVk: 'Відкрити VK',
                legalName: 'ПІБ',
                legalTax: 'ІПН',
                legalMail: 'mail'
            }
        },
        be: {
            langLabel: 'Мова',
            nav: ['ГАЛОЎНАЯ', 'ПРАВІЛЫ', 'КАРТЫ', 'ПРА ГУЛЬНЮ'],
            mobileNav: ['Галоўная', 'Правілы гульні', 'Карты', 'Пра гульню'],
            selectorBtn: 'Выбар гульні',
            selectorSoon: 'Хутка...',
            footerBuy: 'Купіць на Avito',
            backToTopAria: 'Уверх',
            scrollDownAria: 'Пракруціць ніжэй да зместу',
            ariaLangSwitcher: 'Змяніць мову сайта',
            index: {
                pageTitle: 'Хронікі забытых імперый — настольная картавая гульня',
                heroTitle: 'Хронікі забытых імперый',
                heroSub: 'Фэнтэзі-дуэль, дзе кожны ход вырашае',
                heroBuy: 'Купіць настольную гульню на Avito',
                heroMini: 'Увайсці ў Катакомбы: міні-гульня',
                aboutTitle: 'Пра гульню',
                aboutBody:
                    '«Хронікі забытых імперый» — стратэгічная картавая гульня на 2–6 гульцоў: абярыце героя, даследуйце падзямеллі, збірайце артэфакты і перамагайце супернікаў. Партыя звычайна 30–60 хвілін; патрэбныя і ўдача, і тактыка. Камбінуйце здольнасці, кіруйце манай і атакуйце ў час, каб застацца апошнім героем.',
                galleryTitle: '12 УНІКАЛЬНЫХ ГЕРОЯЎ',
                galleryAlt: 'Герой',
                allCards: 'Усе карты',
                stats: ['Герояў', 'Карт', 'Гульцоў', 'Хвілін']
            },
            cards: {
                pageTitle: 'Карты — Хронікі забытых імперый',
                title: 'Каталог карт',
                search: 'Пошук па назве або здольнасці...',
                type: 'Тып карты:',
                sort: 'Сартаванне:',
                reset: 'Скінуць',
                noResult: 'Па запыце карты не знойдзены.',
                back: '← Назад да спісу',
                typeAll: 'Усе',
                sortName: 'Па алфавіце',
                sortAtk: 'Па ATK',
                sortHp: 'Па HP',
                sortMana: 'Па кошце маны',
                filterOptions: [
                    'Усе',
                    'Героі',
                    'Звяры',
                    'Дэманы',
                    'Духі',
                    'Нежыць',
                    'Цмокі',
                    'Оркі',
                    'Зброя',
                    'Пасткі',
                    'Артэфакты',
                    'Уваходы ў катакомбы',
                    'Заклёны'
                ],
                tabs: ['Усе карты', 'Героі (12)', 'Звяры (8)', 'Дэманы (4)', 'Духі (3)', 'Нежыць (4)', 'Цмокі (4)', 'Оркі (4)', 'Зброя (5)', 'Пасткі (5)', 'Артэфакты (11)', 'Заклёны (21)', 'Катакомбы (10)'],
                catacombs: {
                    imgAlt: 'Уваход у катакомбы',
                    h4: 'Уваход у Катакомбы',
                    typeLine: 'Уваход у падзямелле',
                    manaLine: 'Кошт маны: 1',
                    descHtml: 'У асноўнай калодзе ёсць <strong>10 аднолькавых</strong> карт «Уваход у Катакомбы».',
                    ability: 'Пры выкарыстанні: вазьміце 1 карту з калоды Катакомб (артэфакт або пастку).'
                }
            },
            about: {
                world: 'Свет гульні',
                history: 'Гісторыя гульні',
                concept: 'Канцэпцыя і сетынг',
                tips: 'Парады па стратэгіі',
                faq: 'FAQ',
                contacts: 'Кантакты',
                pageTitle: 'Пра гульню — Хронікі забытых імперый',
                ctaBuy: 'Купіць на Avito',
                ctaTg: 'Напісаць у Telegram',
                ctaVk: 'Перайсці ў VK',
                legalName: 'ПІБ',
                legalTax: 'УНП/ІНН',
                legalMail: 'mail'
            }
        },
        zh: {
            langLabel: '语言',
            nav: ['首页', '规则', '卡牌', '关于游戏'],
            mobileNav: ['首页', '游戏规则', '卡牌目录', '关于游戏'],
            selectorBtn: '选择游戏',
            selectorSoon: '即将推出',
            footerBuy: '在 Avito 购买',
            backToTopAria: '回到顶部',
            scrollDownAria: '向下滚动到正文内容',
            ariaLangSwitcher: '切换网站语言',
            index: {
                pageTitle: '遗忘帝国编年史 — 桌游卡牌',
                heroTitle: '遗忘帝国编年史',
                heroSub: '奇幻卡牌对决，每一步都关键',
                heroBuy: '在 Avito 购买桌游',
                heroMini: '进入地城：小游戏',
                aboutTitle: '关于游戏',
                aboutBody:
                    '《遗忘帝国编年史》是一款支持 2–6 人的策略卡牌游戏：选择英雄、探索地下城、收集神器并击败对手。单局约 30–60 分钟，既考验运气也考验战术。合理串联技能、管理法力并把握进攻时机，成为最后的幸存者。',
                galleryTitle: '12 位独特英雄',
                galleryAlt: '英雄',
                allCards: '查看全部卡牌',
                stats: ['英雄', '卡牌', '玩家', '分钟']
            },
            cards: {
                pageTitle: '卡牌 — 遗忘帝国编年史',
                title: '卡牌目录',
                search: '按名称或技能搜索...',
                type: '卡牌类型：',
                sort: '排序：',
                reset: '重置',
                noResult: '未找到匹配卡牌。',
                back: '← 返回列表',
                typeAll: '全部',
                sortName: '按名称',
                sortAtk: '按攻击',
                sortHp: '按生命',
                sortMana: '按法力消耗',
                filterOptions: [
                    '全部',
                    '英雄',
                    '野兽',
                    '恶魔',
                    '灵体',
                    '亡灵',
                    '巨龙',
                    '兽人',
                    '武器',
                    '陷阱',
                    '神器',
                    '地城入口',
                    '法术'
                ],
                tabs: ['全部卡牌', '英雄 (12)', '野兽 (8)', '恶魔 (4)', '灵体 (3)', '亡灵 (4)', '巨龙 (4)', '兽人 (4)', '武器 (5)', '陷阱 (5)', '神器 (11)', '法术 (21)', '地城入口 (10)'],
                catacombs: {
                    imgAlt: '地城入口',
                    h4: '地城入口',
                    typeLine: '进入地下城',
                    manaLine: '法力消耗：1',
                    descHtml: '主牌组中包含 <strong>10 张相同</strong>的「地城入口」牌。',
                    ability: '使用时：从地城牌组抽取 1 张牌（神器或陷阱）。'
                }
            },
            about: {
                world: '游戏世界',
                history: '游戏故事',
                concept: '设定与概念',
                tips: '策略建议',
                faq: '常见问题',
                contacts: '联系方式',
                pageTitle: '关于游戏 — 遗忘帝国编年史',
                ctaBuy: '在 Avito 购买',
                ctaTg: 'Telegram 联系',
                ctaVk: '打开 VK',
                legalName: '姓名',
                legalTax: '税号',
                legalMail: '邮箱'
            }
        }
    };

    function setText(selector, text) {
        const el = document.querySelector(selector);
        if (el && typeof text === 'string') el.textContent = text;
    }

    function setTextList(selector, values) {
        if (!Array.isArray(values)) return;
        const nodes = document.querySelectorAll(selector);
        nodes.forEach((node, idx) => {
            if (values[idx]) node.textContent = values[idx];
        });
    }

    function setPlaceholder(selector, text) {
        const el = document.querySelector(selector);
        if (el && typeof text === 'string') el.setAttribute('placeholder', text);
    }

    function setOption(selectId, value, text) {
        const option = document.querySelector(`#${selectId} option[value="${value}"]`);
        if (option && typeof text === 'string') option.textContent = text;
    }

    function getPageId() {
        const raw = window.location.pathname.split('/').pop() || 'index.html';
        return raw.replace(/\.html$/i, '') || 'index';
    }

    function getLang() {
        const saved = window.localStorage.getItem(STORAGE_KEY) || 'ru';
        return SUPPORTED_LANGS.includes(saved) ? saved : 'ru';
    }

    function applyCommon(copy) {
        setTextList('.nav-menu .nav-link', copy.nav);
        setTextList('.mobile-menu .mobile-nav-link', copy.mobileNav);
        setText('.selector-btn', copy.selectorBtn);
        setText('.selector-item.disabled', copy.selectorSoon);
        if (copy.index && copy.index.heroTitle) {
            setText('.logo-text', copy.index.heroTitle);
            const selActive = document.querySelector('.selector-dropdown a.selector-item.active');
            if (selActive) selActive.textContent = copy.index.heroTitle;
        }
        setText('.footer-lang-label', copy.langLabel);
        setText('.footer-links .footer-link:last-child', copy.footerBuy);
        const backToTop = document.getElementById('backToTop');
        if (backToTop && copy.backToTopAria) {
            backToTop.setAttribute('aria-label', copy.backToTopAria);
        }
        const heroScrollHintBtn = document.getElementById('heroScrollHint');
        if (heroScrollHintBtn && copy.scrollDownAria) {
            heroScrollHintBtn.setAttribute('aria-label', copy.scrollDownAria);
        }
        const langSw = document.getElementById('langSwitcher');
        if (langSw && copy.ariaLangSwitcher) {
            langSw.setAttribute('aria-label', copy.ariaLangSwitcher);
        }
    }

    function applyCatacombsBlock(cat) {
        if (!cat) return;
        const img = document.querySelector('#catacombs-special .card-img');
        if (img && cat.imgAlt) img.setAttribute('alt', cat.imgAlt);
        const root = document.querySelector('#catacombs-special .card-info');
        if (!root) return;
        const h4 = root.querySelector('h4');
        const typeLine = root.querySelector('.card-type');
        const stats = root.querySelector('.card-stats span');
        const desc = root.querySelector('.card-description');
        const ability = root.querySelector('.card-ability');
        if (h4) h4.textContent = cat.h4;
        if (typeLine) typeLine.textContent = cat.typeLine;
        if (stats) {
            stats.className = 'card-stat-row';
            stats.innerHTML =
                `<img src="${CARD_MANA_STAT_ICON}" alt="" class="card-stat-icon" width="17" height="17" decoding="async">` +
                `<span class="card-stat-text">${escapeHtmlI18n(cat.manaLine)}</span>`;
        }
        if (desc) desc.innerHTML = cat.descHtml;
        if (ability) ability.textContent = cat.ability;
    }

    function applyIndex(copy, lang) {
        if (!copy.index) return;
        if (copy.index.pageTitle) document.title = copy.index.pageTitle;
        if (copy.index.heroTitle) setText('.hero-title', copy.index.heroTitle);
        setText('.hero-subtitle', copy.index.heroSub);
        setText('.hero .btn-primary', copy.index.heroBuy);
        setText('#openMiniGame', copy.index.heroMini);
        setText('.game-description h2', copy.index.aboutTitle);
        const aboutP = document.querySelector('.game-description p');
        if (aboutP && copy.index.aboutBody) aboutP.textContent = copy.index.aboutBody;
        setText('.cards-gallery h2', copy.index.galleryTitle);
        setText('.cards-gallery .text-center .btn', copy.index.allCards);
        setTextList('.stats .stat-label', copy.index.stats);
        const useGalleryLocales = lang && lang !== 'ru' && typeof window.applyCardGalleryLocalization === 'function';
        if (useGalleryLocales) {
            window.applyCardGalleryLocalization(lang);
        } else if (copy.index.galleryAlt) {
            document.querySelectorAll('.cards-gallery .card-image').forEach((img) => {
                img.setAttribute('alt', copy.index.galleryAlt);
            });
        }
    }

    function applyCards(copy) {
        if (!copy.cards) return;
        if (copy.cards.pageTitle) document.title = copy.cards.pageTitle;
        setText('main h2', copy.cards.title);
        setPlaceholder('#searchInput', copy.cards.search);
        setText('label[for="filterType"]', copy.cards.type);
        setText('label[for="sortBy"]', copy.cards.sort);
        setText('#resetFilters', copy.cards.reset);
        setText('#noResults p', copy.cards.noResult);
        setText('#backToList', copy.cards.back);

        if (copy.cards.filterOptions && copy.cards.filterOptions.length) {
            const opts = document.querySelectorAll('#filterType option');
            copy.cards.filterOptions.forEach((label, idx) => {
                if (opts[idx]) opts[idx].textContent = label;
            });
        } else {
            setOption('filterType', '', copy.cards.typeAll);
        }
        setOption('sortBy', 'name', copy.cards.sortName);
        setOption('sortBy', 'atk', copy.cards.sortAtk);
        setOption('sortBy', 'hp', copy.cards.sortHp);
        setOption('sortBy', 'mana', copy.cards.sortMana);
        setTextList('.cards-tabs .card-tab-btn', copy.cards.tabs);
        if (copy.cards.catacombs) applyCatacombsBlock(copy.cards.catacombs);
    }

    const ABOUT_LONG = {
        en: {
            heroCards: [
                ['Premium board game', 'Chronicles of Forgotten Empires is a tactical card duel with tense turns, layered combos, and a fantasy vibe in every match.'],
                ['Community', 'Share builds, discuss matches, and follow updates to get new cards and releases first.']
            ],
            history: [
                'The project started as an idea: make a card game with easy onboarding but deep tactical choices.',
                'Early prototypes were tested in small tabletop circles. Mechanics, balance, and catacomb interactions were iterated many times.',
                'Today the game offers a polished duel loop for collectors and strategy fans.'
            ],
            concept: [
                'The setting is dark fantasy: ruins, relics, old magic, and dangerous underground routes.',
                'Heroes, demons, dragons, spirits, undead, and orcs all coexist in one conflict-heavy world.',
                'Magic is both weapon and survival tool, while catacombs offer power at a real risk.'
            ],
            tips: [
                ['1. Resource pacing', 'Mana is tempo. Spend with a plan and reserve points for key turns.'],
                ['2. Attack planning', 'After attacking, creatures fatigue. Avoid leaving your hero exposed.'],
                ['3. Ability timing', 'Most wins come from correct sequencing, not raw stats.'],
                ['4. Catacomb timing', 'Enter catacombs when you can survive variance, not just for value.'],
                ['5. Focus damage', 'Group attacks are strong, but they commit multiple units at once.']
            ],
            faq: [
                ['Can the hero attack right away?', 'No. Hero attacks are gated by board state and turn timing.'],
                ['What if the deck is empty?', 'Shuffle the discard pile and form a new deck.'],
                ['Can a fatigued creature be attacked?', 'No. Fatigued units are not legal attack targets.'],
                ['Can I keep a drawn creature in hand?', 'Yes. You can keep it and refill to hand limit at end of turn.'],
                ['Do artifacts remain if hero is wounded?', 'Yes. Artifacts stay active until the game ends.'],
                ['Can I cast a spell outside combat?', 'No. Spells are played during combat interactions.'],
                ['If I skip a turn, do fatigued cards recover?', 'Yes. Recovery still happens at end of your turn.'],
                ['Do hybrid cards count as both types?', 'Yes. They count as all listed types in effects and filters.'],
                ['How long is one match?', 'Usually 30-60 minutes depending on players and pace.'],
                ['Recommended age?', '10+ with basic tactical understanding.']
            ],
            contacts: [
                ['Buy game', 'Go to marketplace and place an order.', 'Open ->'],
                ['Telegram', 'Fast way to ask questions or discuss cooperation.', 'Message ->'],
                ['VK', 'News, posts, and community updates.', 'Open ->'],
                ['Email', 'For formal requests and detailed communication.', 'Write ->']
            ]
        },
        kk: {
            heroCards: [
                ['Премиум үстел ойыны', 'Бұл - әр жүрісі маңызды болатын тактикалық карталық дуэль.'],
                ['Қауымдастық', 'Тактика бөлісіп, партияларды талқылап, жаңалықтарды алғаш біліңіз.']
            ],
            history: [
                'Жоба идеядан басталды: ережесі түсінікті, бірақ терең шешімдер беретін ойын жасау.',
                'Алғашқы нұсқалар шағын ортада сыналып, баланс пен механика бірнеше рет жаңартылды.',
                'Қазір ойын стратегияны ұнататын аудиторияға ыңғайлы, жинақы форматқа жетті.'
            ],
            concept: [
                'Сеттинг - қараңғы фэнтези: қираған өркениет, артефактілер және қауіпті жерасты.',
                'Әлемде батырлар, айдаһарлар, жындар, рухтар, өлілер мен орктар қатар жүреді.',
                'Сиқыр - әрі қару, әрі қорғаныс. Катакомбаларда сыйақы да, қауіп те жоғары.'
            ],
            tips: [
                ['1. Мана ырғағы', 'Мананы алдын ала жоспармен жұмсаңыз.'],
                ['2. Шабуылды есептеу', 'Шабуылдан кейін карта шаршайды - қорғанысты ұмытпаңыз.'],
                ['3. Қабілет уақыты', 'Дұрыс кезек - жеңістің негізгі факторы.'],
                ['4. Катакомбаға кіру', 'Тәуекелді көтере алғанда ғана кірген дұрыс.'],
                ['5. Топтық соққы', 'Күшті әдіс, бірақ бірден бірнеше картаны байлап қояды.']
            ],
            faq: [
                ['Кейіпкер бірден шабуылдай ала ма?', 'Жоқ, шабуыл тақта жағдайына және жүріске тәуелді.'],
                ['Колода бітсе не болады?', 'Тастау үйіндісін араластырып, жаңа колода жасаңыз.'],
                ['Шаршаған картаға шабуыл жасауға бола ма?', 'Жоқ, ол заңды нысана емес.'],
                ['Существоны қолға қалдыруға бола ма?', 'Иә, жүріс соңында қол шегіне дейін толықтырасыз.'],
                ['Кейіпкер жараланса артефакт қалады ма?', 'Иә, артефакттар ойын соңына дейін сақталады.'],
                ['Сиқырды шайқастан тыс қолдануға бола ма?', 'Жоқ, сиқырлар ұрыс контекстінде ойналады.'],
                ['Жүрісті өткізіп жіберсем, қалпына келе ме?', 'Иә, жүріс соңындағы қалпына келу жүреді.'],
                ['Гибрид карта екі түр болып санала ма?', 'Иә, тізімдегі барлық түр болып саналады.'],
                ['Бір партия қанша уақыт?', 'Орташа 30-60 минут.'],
                ['Ұсынылатын жас?', '10+']
            ],
            contacts: [
                ['Ойынды сатып алу', 'Маркетплейске өтіп, тапсырыс беріңіз.', 'Ашу ->'],
                ['Telegram', 'Жылдам байланыс пен сұрақтарға ыңғайлы.', 'Жазу ->'],
                ['VK', 'Жаңалықтар мен қауымдастық арналары.', 'Ашу ->'],
                ['Email', 'Ресми және толық сұрауларға арналған.', 'Жазу ->']
            ]
        },
        uk: {
            heroCards: [
                ['Преміальна настілка', 'Тактична карткова дуель із напругою в кожному ході.'],
                ['Спільнота', 'Діліться тактиками, стежте за оновленнями, обговорюйте партії.']
            ],
            history: [
                'Гру створювали як формат із простим входом і глибокими рішеннями.',
                'Прототипи тестувалися в локальних спільнотах, після чого механіки неодноразово допрацьовували.',
                'У фіналі вийшла збалансована дуельна система для поціновувачів стратегії.'
            ],
            concept: [
                'Світ гри - темне фентезі з руїнами, артефактами та небезпечними підземеллями.',
                'Тут зустрічаються герої, демони, дракони, духи, нежить і орки.',
                'Магія працює як інструмент тиску й виживання, а катакомби дають ризикову перевагу.'
            ],
            tips: [
                ['1. Темп мани', 'Плануйте витрати мани наперед.'],
                ['2. План атаки', 'Після атаки істоти втомлюються - не відкривайте героя.'],
                ['3. Таймінг умінь', 'Черговість розіграшу часто важливіша за цифри.'],
                ['4. Вхід у катакомби', 'Заходьте, коли готові прийняти ризик.'],
                ['5. Фокус-удар', 'Групова атака сильна, але сильно зв\'язує стіл.']
            ],
            faq: [
                ['Герой може атакувати одразу?', 'Ні, це залежить від стану столу та фази ходу.'],
                ['Що робити, коли колода скінчилася?', 'Перемішайте скид і сформуйте нову колоду.'],
                ['Чи можна бити втомлену істоту?', 'Ні, вона не є валідною ціллю.'],
                ['Можна не розігрувати витягнуту істоту?', 'Так, карта лишається в руці.'],
                ['Артефакти зникають при пораненні героя?', 'Ні, вони діють до кінця партії.'],
                ['Можна кастувати закляття поза боєм?', 'Ні, лише в рамках бою.'],
                ['Після пропуску ходу карти відновлюються?', 'Так, відновлення відбувається.'],
                ['Гібрид рахується за два типи?', 'Так, за всі вказані типи.'],
                ['Середня тривалість партії?', 'Близько 30-60 хвилин.'],
                ['Рекомендований вік?', '10+']
            ],
            contacts: [
                ['Купити гру', 'Перейдіть на майданчик і оформіть замовлення.', 'Відкрити ->'],
                ['Telegram', 'Швидкий канал для питань і співпраці.', 'Написати ->'],
                ['VK', 'Новини та зв\'язок зі спільнотою.', 'Відкрити ->'],
                ['Email', 'Для формальних і детальних запитів.', 'Написати ->']
            ]
        },
        be: {
            heroCards: [
                ['Прэміяльная настолка', 'Тактычная карткавая дуэль з напружаным тэмпам партыі.'],
                ['Супольнасць', 'Дзяліцеся тактыкамі і сочыце за абнаўленнямі праекта.']
            ],
            history: [
                'Праект стартаваў як ідэя зрабіць гульню з простым уваходам і глыбокай стратэгіяй.',
                'Прататыпы шмат разоў тэставаліся, пасля чаго баланс і механікі шліфаваліся.',
                'У выніку атрымалася стабільная дуэльная сістэма для аматараў настолак.'
            ],
            concept: [
                'Сетынг - змрочнае фэнтэзі: руіны, магія, падземеллі і артэфакты.',
                'У свеце сутыкаюцца героі, дэманы, цмокі, духі, нежыць і оркі.',
                'Катакомбы даюць моцныя бонусы, але заўсёды з выразнай рызыкай.'
            ],
            tips: [
                ['1. Рытм маны', 'Плануйце выдаткі, каб не згубіць тэмп.'],
                ['2. Планаванне атак', 'Пасля атакі істоты стамляюцца - улічвайце абарону.'],
                ['3. Таймінг здольнасцей', 'Правільная паслядоўнасць часта вырашае бой.'],
                ['4. Уваход у катакомбы', 'Ідзіце туды, калі гатовыя да рызыкі.'],
                ['5. Групавая атака', 'Моцна, але прывязвае некалькі карт адразу.']
            ],
            faq: [
                ['Ці можа герой атакаваць адразу?', 'Не, патрэбныя ўмовы па стале і фазе ходу.'],
                ['Што рабіць, калі калода скончылася?', 'Ператасуйце скід і сфарміруйце новую калоду.'],
                ['Ці можна атакаваць стомленую істоту?', 'Не, яна не з\'яўляецца мэтай атакі.'],
                ['Ці можна пакінуць істоту ў руцэ?', 'Так, у канцы ходу дабярэце да ліміту.'],
                ['Артэфакты знікаюць пры раненнях героя?', 'Не, яны дзейнічаюць да канца гульні.'],
                ['Ці можна заклён па-за боем?', 'Не, толькі ў баявым кантэксце.'],
                ['Пры прапуску ходу карты аднаўляюцца?', 'Так, аднаўленне адбываецца.'],
                ['Гібрыд лічыцца двума тыпамі?', 'Так, усімі пазначанымі.'],
                ['Колькі доўжыцца партыя?', 'Звычайна 30-60 хвілін.'],
                ['Рэкамендаваны ўзрост?', '10+']
            ],
            contacts: [
                ['Купіць гульню', 'Перайдзіце на пляцоўку і аформіце заказ.', 'Адкрыць ->'],
                ['Telegram', 'Хуткая сувязь па пытаннях і супрацоўніцтве.', 'Напісаць ->'],
                ['VK', 'Навіны і кантакт з супольнасцю.', 'Адкрыць ->'],
                ['Email', 'Для афіцыйных і дэталёвых запытаў.', 'Напісаць ->']
            ]
        },
        zh: {
            heroCards: [
                ['高品质桌游', '这是一款节奏紧凑、决策密集的奇幻卡牌对战。'],
                ['社区', '分享思路、讨论对局、第一时间了解更新。']
            ],
            history: [
                '项目目标是做一款上手快、但策略深度足够的卡牌游戏。',
                '早期原型在小范围反复测试，机制与平衡持续迭代。',
                '现在的版本更稳定，适合喜欢博弈和构筑的玩家。'
            ],
            concept: [
                '世界观是暗黑奇幻：遗迹、魔法、神器与危险地城。',
                '英雄、恶魔、巨龙、灵体、亡灵与兽人共同构成冲突舞台。',
                '魔法既是进攻手段也是生存工具，而地城总伴随高风险。'
            ],
            tips: [
                ['1. 法力节奏', '法力要有计划地花，关键回合要留资源。'],
                ['2. 进攻规划', '生物攻击后会疲劳，注意别把英雄暴露。'],
                ['3. 技能时机', '连招顺序往往比面板数值更关键。'],
                ['4. 地城时机', '能承受波动时再进地城。'],
                ['5. 集火攻击', '强力但会一次性占用多张单位。']
            ],
            faq: [
                ['英雄开局能直接攻击吗？', '不能，需满足回合与场面条件。'],
                ['牌库抽空怎么办？', '把弃牌堆洗回去，组成新牌库。'],
                ['疲劳生物可以被攻击吗？', '不可以，它不是合法攻击目标。'],
                ['抽到生物可以先不下吗？', '可以，回合末再补到手牌上限。'],
                ['英雄受伤后神器会失效吗？', '不会，神器持续到对局结束。'],
                ['法术能在非战斗时使用吗？', '不能，仅限战斗流程内。'],
                ['跳过回合会恢复疲劳吗？', '会，回合结束时照常恢复。'],
                ['混合卡算多个类型吗？', '算，按卡面列出的所有类型结算。'],
                ['一局大概多久？', '通常约 30-60 分钟。'],
                ['建议年龄？', '建议 10 岁以上。']
            ],
            contacts: [
                ['购买游戏', '前往平台下单购买。', '打开 ->'],
                ['Telegram', '适合快速咨询与合作沟通。', '联系 ->'],
                ['VK', '查看动态并参与社区讨论。', '打开 ->'],
                ['Email', '用于正式与详细的沟通需求。', '发送 ->']
            ]
        }
    };

    const ORIGINAL = {
        about: null,
        index: null,
        cards: null
    };

    function captureOriginalPageContent() {
        const pageId = getPageId();

        if (pageId === 'index' && !ORIGINAL.index) {
            ORIGINAL.index = {
                documentTitle: document.title,
                heroTitle: document.querySelector('.hero-title')?.textContent || '',
                heroSub: document.querySelector('.hero-subtitle')?.textContent || '',
                heroBuy: document.querySelector('.hero .btn-primary')?.textContent || '',
                heroMini: document.querySelector('#openMiniGame')?.textContent || '',
                aboutH2: document.querySelector('.game-description h2')?.textContent || '',
                aboutP: document.querySelector('.game-description p')?.textContent || '',
                galleryH2: document.querySelector('.cards-gallery h2')?.textContent || '',
                allCardsBtn: document.querySelector('.cards-gallery .text-center .btn')?.textContent || '',
                statLabels: Array.from(document.querySelectorAll('.stats .stat-label')).map((el) => el.textContent),
                galleryAlts: Array.from(document.querySelectorAll('.cards-gallery .card-image')).map((el) => el.getAttribute('alt') || ''),
                galleryNames: Array.from(document.querySelectorAll('.cards-gallery .card-name')).map((el) => el.textContent)
            };
        }

        if (pageId === 'cards' && !ORIGINAL.cards) {
            const filterOpts = Array.from(document.querySelectorAll('#filterType option')).map((el) => el.textContent);
            const sortOpts = Array.from(document.querySelectorAll('#sortBy option')).map((el) => el.textContent);
            ORIGINAL.cards = {
                documentTitle: document.title,
                mainH2: document.querySelector('main h2')?.textContent || '',
                searchPlaceholder: document.querySelector('#searchInput')?.getAttribute('placeholder') || '',
                filterTypeLabel: document.querySelector('label[for="filterType"]')?.textContent || '',
                sortLabel: document.querySelector('label[for="sortBy"]')?.textContent || '',
                filterOptions: filterOpts,
                sortOptions: sortOpts,
                resetText: document.querySelector('#resetFilters')?.textContent || '',
                tabs: Array.from(document.querySelectorAll('.cards-tabs .card-tab-btn')).map((el) => el.textContent),
                noResults: document.querySelector('#noResults p')?.textContent || '',
                backToList: document.querySelector('#backToList')?.textContent || '',
                catacombsCardInfo: document.querySelector('#catacombs-special .card-info')?.innerHTML || '',
                catacombsImgAlt: document.querySelector('#catacombs-special .card-img')?.getAttribute('alt') || ''
            };
        }

        if (!ORIGINAL.about) {
            const hasAbout = document.querySelector('.about-hero-card');
            if (hasAbout) {
                ORIGINAL.about = {
                    documentTitle: document.title,
                    heroCardsH: Array.from(document.querySelectorAll('.about-hero-card h3')).map((el) => el.textContent),
                    heroCardsP: Array.from(document.querySelectorAll('.about-hero-card p')).map((el) => el.textContent),
                    history: Array.from(document.querySelectorAll('.about-section:nth-of-type(2) .about-content p')).map((el) => el.textContent),
                    concept: Array.from(document.querySelectorAll('.about-section:nth-of-type(3) .about-content p')).map((el) => el.textContent),
                    tipsH: Array.from(document.querySelectorAll('.strategy-tips .tip-item .about-item-heading__text')).map((el) => el.textContent),
                    tipsP: Array.from(document.querySelectorAll('.strategy-tips .tip-item p')).map((el) => el.textContent),
                    faqH: Array.from(document.querySelectorAll('.faq .faq-item .about-item-heading__text')).map((el) => el.textContent),
                    faqP: Array.from(document.querySelectorAll('.faq .faq-item p')).map((el) => el.textContent),
                    contactT: Array.from(document.querySelectorAll('.contact-cards .contact-title')).map((el) => el.textContent),
                    contactP: Array.from(document.querySelectorAll('.contact-cards .contact-text')).map((el) => el.textContent),
                    contactCta: Array.from(document.querySelectorAll('.contact-cards .contact-cta')).map((el) => el.textContent)
                };
                const legal = document.querySelector('.contact-legal');
                if (legal) {
                    ORIGINAL.about.legalSpans = Array.from(legal.querySelectorAll('span')).map((s) => s.textContent);
                    ORIGINAL.about.legalMailText = legal.querySelector('a')?.textContent || '';
                }
            }
        }
    }

    function restoreAboutOriginal() {
        if (!ORIGINAL.about) return;
        if (ORIGINAL.about.documentTitle) document.title = ORIGINAL.about.documentTitle;
        setTextList('.about-hero-card h3', ORIGINAL.about.heroCardsH);
        setTextList('.about-hero-card p', ORIGINAL.about.heroCardsP);
        setTextList('.about-section:nth-of-type(2) .about-content p', ORIGINAL.about.history);
        setTextList('.about-section:nth-of-type(3) .about-content p', ORIGINAL.about.concept);
        setTextList('.strategy-tips .tip-item .about-item-heading__text', ORIGINAL.about.tipsH);
        setTextList('.strategy-tips .tip-item p', ORIGINAL.about.tipsP);
        setTextList('.faq .faq-item .about-item-heading__text', ORIGINAL.about.faqH);
        setTextList('.faq .faq-item p', ORIGINAL.about.faqP);
        setTextList('.contact-cards .contact-title', ORIGINAL.about.contactT);
        setTextList('.contact-cards .contact-text', ORIGINAL.about.contactP);
        setTextList('.contact-cards .contact-cta', ORIGINAL.about.contactCta);
        const legal = document.querySelector('.contact-legal');
        if (legal && ORIGINAL.about.legalSpans) {
            const spans = legal.querySelectorAll('span');
            spans.forEach((span, idx) => {
                if (ORIGINAL.about.legalSpans[idx] !== undefined) span.textContent = ORIGINAL.about.legalSpans[idx];
            });
            const mail = legal.querySelector('a');
            if (mail && ORIGINAL.about.legalMailText) mail.textContent = ORIGINAL.about.legalMailText;
        }
    }

    function restoreIndexOriginal() {
        if (!ORIGINAL.index) return;
        document.title = ORIGINAL.index.documentTitle;
        setText('.hero-title', ORIGINAL.index.heroTitle);
        setText('.hero-subtitle', ORIGINAL.index.heroSub);
        setText('.hero .btn-primary', ORIGINAL.index.heroBuy);
        setText('#openMiniGame', ORIGINAL.index.heroMini);
        setText('.game-description h2', ORIGINAL.index.aboutH2);
        const aboutP = document.querySelector('.game-description p');
        if (aboutP) aboutP.textContent = ORIGINAL.index.aboutP;
        setText('.cards-gallery h2', ORIGINAL.index.galleryH2);
        setText('.cards-gallery .text-center .btn', ORIGINAL.index.allCardsBtn);
        setTextList('.stats .stat-label', ORIGINAL.index.statLabels);
        if (typeof CARDS_DATABASE !== 'undefined') {
            const heroes = CARDS_DATABASE.filter((c) => c.type === 'heroes')
                .sort((a, b) => a.id - b.id)
                .slice(0, 12);
            document.querySelectorAll('.cards-gallery .gallery-item').forEach((item, idx) => {
                const nameEl = item.querySelector('.card-name');
                const img = item.querySelector('.card-image');
                if (heroes[idx] && nameEl) nameEl.textContent = heroes[idx].name;
                if (img) img.setAttribute('alt', 'Герой');
            });
        } else {
            document.querySelectorAll('.cards-gallery .card-image').forEach((img, idx) => {
                const alt = ORIGINAL.index.galleryAlts[idx];
                if (alt !== undefined) img.setAttribute('alt', alt);
            });
            if (ORIGINAL.index.galleryNames && ORIGINAL.index.galleryNames.length) {
                setTextList('.cards-gallery .card-name', ORIGINAL.index.galleryNames);
            }
        }
    }

    function restoreCardsOriginal() {
        if (!ORIGINAL.cards) return;
        document.title = ORIGINAL.cards.documentTitle;
        setText('main h2', ORIGINAL.cards.mainH2);
        setPlaceholder('#searchInput', ORIGINAL.cards.searchPlaceholder);
        setText('label[for="filterType"]', ORIGINAL.cards.filterTypeLabel);
        setText('label[for="sortBy"]', ORIGINAL.cards.sortLabel);
        const fOpts = document.querySelectorAll('#filterType option');
        ORIGINAL.cards.filterOptions.forEach((t, idx) => {
            if (fOpts[idx]) fOpts[idx].textContent = t;
        });
        const sOpts = document.querySelectorAll('#sortBy option');
        ORIGINAL.cards.sortOptions.forEach((t, idx) => {
            if (sOpts[idx]) sOpts[idx].textContent = t;
        });
        setText('#resetFilters', ORIGINAL.cards.resetText);
        setTextList('.cards-tabs .card-tab-btn', ORIGINAL.cards.tabs);
        const noP = document.querySelector('#noResults p');
        if (noP) noP.textContent = ORIGINAL.cards.noResults;
        setText('#backToList', ORIGINAL.cards.backToList);
        const catInfo = document.querySelector('#catacombs-special .card-info');
        if (catInfo && ORIGINAL.cards.catacombsCardInfo) catInfo.innerHTML = ORIGINAL.cards.catacombsCardInfo;
        const catImg = document.querySelector('#catacombs-special .card-img');
        if (catImg && ORIGINAL.cards.catacombsImgAlt !== undefined) {
            catImg.setAttribute('alt', ORIGINAL.cards.catacombsImgAlt);
        }
    }

    function applyAboutLong(lang) {
        const payload = ABOUT_LONG[lang];
        if (!payload) return;

        const heroCards = document.querySelectorAll('.about-hero-card');
        heroCards.forEach((card, idx) => {
            const set = payload.heroCards[idx];
            if (!set) return;
            const h3 = card.querySelector('h3');
            const p = card.querySelector('p');
            if (h3) h3.textContent = set[0];
            if (p) p.textContent = set[1];
        });

        setTextList('.about-section:nth-of-type(2) .about-content p', payload.history);
        setTextList('.about-section:nth-of-type(3) .about-content p', payload.concept);

        const tips = document.querySelectorAll('.strategy-tips .tip-item');
        tips.forEach((tip, idx) => {
            const item = payload.tips[idx];
            if (!item) return;
            const title = tip.querySelector('.about-item-heading__text');
            const p = tip.querySelector('p');
            if (title) title.textContent = item[0];
            if (p) p.textContent = item[1];
        });

        const faqs = document.querySelectorAll('.faq .faq-item');
        faqs.forEach((faq, idx) => {
            const item = payload.faq[idx];
            if (!item) return;
            const title = faq.querySelector('.about-item-heading__text');
            const p = faq.querySelector('p');
            if (title) title.textContent = item[0];
            if (p) p.textContent = item[1];
        });

        const contacts = document.querySelectorAll('.contact-cards .contact-card');
        contacts.forEach((card, idx) => {
            const item = payload.contacts[idx];
            if (!item) return;
            const title = card.querySelector('.contact-title');
            const text = card.querySelector('.contact-text');
            const cta = card.querySelector('.contact-cta');
            if (title) title.textContent = item[0];
            if (text) text.textContent = item[1];
            if (cta) cta.textContent = item[2];
        });
    }

    function applyAbout(copy, lang) {
        if (!copy.about) return;
        if (copy.about.pageTitle) document.title = copy.about.pageTitle;
        setText('.about-hero h2', copy.about.world);
        setText('.about-section:nth-of-type(2) h2', copy.about.history);
        setText('.about-section:nth-of-type(3) h2', copy.about.concept);
        setText('.about-section:nth-of-type(4) h2', copy.about.tips);
        setText('.about-section:nth-of-type(5) h2', copy.about.faq);
        setText('.contact-section h2', copy.about.contacts);
        setText('.cta-buy', copy.about.ctaBuy);
        setText('.cta-tg', copy.about.ctaTg);
        setText('.cta-vk', copy.about.ctaVk);

        const legal = document.querySelector('.contact-legal');
        if (legal) {
            const spans = legal.querySelectorAll('span');
            if (spans[0]) spans[0].textContent = 'ФИО: Строганов Владислав Васильевич';
            if (spans[1]) spans[1].textContent = 'ИНН: 233804473695';
            const mail = legal.querySelector('a');
            if (mail) {
                const prefix = lang === 'ru' ? 'mail' : copy.about.legalMail || 'Email';
                mail.textContent = `${prefix}: vladkragv@gmail.com`;
            }
        }
    }

    function applyTranslations(lang) {
        const copy = DICT[lang] || DICT.ru;
        document.documentElement.lang = lang === 'zh' ? 'zh' : lang;
        applyCommon(copy);

        const pageId = getPageId();
        if (pageId === 'index') {
            if (lang === 'ru') restoreIndexOriginal();
            else applyIndex(copy, lang);
        }
        if (pageId === 'cards') {
            if (lang === 'ru') restoreCardsOriginal();
            else applyCards(copy);
        }
        if (pageId === 'about') {
            applyAbout(copy, lang);
            if (lang === 'ru') restoreAboutOriginal();
            else applyAboutLong(lang);
        }

        window.dispatchEvent(new CustomEvent('site-language-changed', { detail: { lang } }));
    }

    function relocateLangSwitcher() {
        const langBlock = document.querySelector('.footer-lang');
        const mobileMenu = document.getElementById('mobileMenu');
        const footerContent = document.querySelector('.footer-content');
        const age = document.querySelector('.footer-age-rating');
        if (!langBlock || !footerContent) return;
        const toMobileMenu = window.matchMedia('(max-width: 1023px)').matches;

        if (toMobileMenu && mobileMenu) {
            mobileMenu.appendChild(langBlock);
            langBlock.classList.add('footer-lang--in-drawer');
            return;
        }

        langBlock.classList.remove('footer-lang--in-drawer');
        if (langBlock.parentElement === footerContent) return;
        if (age) {
            footerContent.insertBefore(langBlock, age);
        } else {
            footerContent.appendChild(langBlock);
        }
    }

    window.relocateLangSwitcher = relocateLangSwitcher;

    function setupSwitcher() {
        const switcher = document.getElementById('langSwitcher');
        if (!switcher) return;
        captureOriginalPageContent();
        relocateLangSwitcher();
        const lang = getLang();
        switcher.value = lang;
        switcher.addEventListener('change', (e) => {
            const nextLang = SUPPORTED_LANGS.includes(e.target.value) ? e.target.value : 'ru';
            window.localStorage.setItem(STORAGE_KEY, nextLang);
            applyTranslations(nextLang);
        });
        applyTranslations(lang);
    }

    document.addEventListener('DOMContentLoaded', setupSwitcher);
})();

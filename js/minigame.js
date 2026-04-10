// ============================================
// MINIGAME.JS - Катакомбы: Рунический Рейд
// ============================================

(function () {
    const ROOT_ID = 'catacombsMinigame';
    const BEST_FLOOR_KEY = 'catacombs_raid_best_floor';
    const SAVE_STATE_KEY = 'catacombs_raid_state_v1';
    const HERO_TEMPLATE = { maxHp: 40, hp: 40, maxMp: 10, mp: 5, atk: 1, shield: 0, crit: 0.05, lifesteal: 0 };
    const CARDS_POOL = [
        { id: 'strike', name: 'Удар клинком', cost: 0, text: 'Наносит 4 урона.', play: (s) => hitEnemy(s, 4) },
        { id: 'focus', name: 'Сосредоточение', cost: 0, text: 'Восстановить 2 МР и взять карту.', play: (s) => { gainMana(s, 2); drawCards(s, 1); } },
        { id: 'guard', name: 'Железный щит', cost: 1, text: 'Даёт 8 щита до хода врага.', play: (s) => { s.hero.shield += 8; log(s, 'Щит укреплён (+8).', 'good'); } },
        { id: 'fireball', name: 'Огненный шар', cost: 3, text: 'Наносит 8 урона.', play: (s) => hitEnemy(s, 8) },
        { id: 'chain', name: 'Цепная молния', cost: 4, text: 'Наносит 11 урона и даёт 1 МР.', play: (s) => { hitEnemy(s, 11); gainMana(s, 1); } },
        { id: 'bleed', name: 'Кровавый след', cost: 2, text: '6 урона и кровотечение на 2 хода.', play: (s) => { hitEnemy(s, 6); s.enemy.effects.bleed = (s.enemy.effects.bleed || 0) + 2; log(s, 'Кровотечение наложено.', 'good'); } },
        { id: 'heal', name: 'Источник жизни', cost: 3, text: 'Восстановить 9 HP.', play: (s) => healHero(s, 9) },
        { id: 'summon', name: 'Призыв зверя', cost: 3, text: 'Следующие 2 атаки: +3 урона.', play: (s) => { s.hero.effects.empowered = (s.hero.effects.empowered || 0) + 2; log(s, 'Зверь встаёт на вашу сторону.', 'good'); } },
        { id: 'vampire', name: 'Тёмный ритуал', cost: 4, text: '8 урона и лечение на 4.', play: (s) => { hitEnemy(s, 8); healHero(s, 4); } },
        { id: 'time', name: 'Руна времени', cost: 4, text: '5 урона и враг пропускает ход.', play: (s) => { hitEnemy(s, 5); s.skipEnemyTurn = true; log(s, 'Время застыло: враг пропускает ход.', 'good'); } },
        { id: 'arcane', name: 'Арканный всплеск', cost: 2, text: '4 урона и +1 к следующей атаке карты.', play: (s) => { hitEnemy(s, 4); s.hero.effects.combo = (s.hero.effects.combo || 0) + 1; } }
    ];

    const ARTIFACTS = [
        { name: 'Кольцо маны', text: '+2 к максимуму МР и +1 МР каждый ход.', apply: (s) => { s.hero.maxMp += 2; s.hero.mp = Math.min(s.hero.maxMp, s.hero.mp + 2); s.bonuses.manaRegen += 1; } },
        { name: 'Клык дракона', text: '+2 к базовой атаке.', apply: (s) => { s.hero.atk += 2; } },
        { name: 'Сердце катакомб', text: '+8 к максимуму HP и лечение 8.', apply: (s) => { s.hero.maxHp += 8; s.hero.hp = Math.min(s.hero.maxHp, s.hero.hp + 8); } },
        { name: 'Печать ярости', text: 'Каждый третий ход: +5 к первой атаке.', apply: (s) => { s.bonuses.furyCycle = true; } },
        { name: 'Кристалл судьбы', text: '+10% шанс крит. удара.', apply: (s) => { s.hero.crit += 0.1; } },
        { name: 'Плащ вампира', text: '20% урона лечит героя.', apply: (s) => { s.hero.lifesteal += 0.2; } },
        { name: 'Руна мастерства', text: 'Старт каждого боя: +1 карта в руку.', apply: (s) => { s.bonuses.extraDraw += 1; } }
    ];
    const HEROES = [
        { id: 'hero-1', name: 'Воин Света', hp: 44, mp: 9, atk: 2, perk: 'Стойкость: +2 щита в начале каждого своего хода.' },
        { id: 'hero-2', name: 'Мастер Рун', hp: 38, mp: 12, atk: 1, perk: 'Магия: +1 МР каждый ход.' },
        { id: 'hero-3', name: 'Охотница Теней', hp: 40, mp: 10, atk: 2, perk: 'Точность: +10% крит. шанса.' },
        { id: 'hero-4', name: 'Щитоносец', hp: 48, mp: 8, atk: 1, perk: 'Бастион: первая атака врага -2 урона.' },
        { id: 'hero-5', name: 'Пожиратель Пламени', hp: 39, mp: 11, atk: 2, perk: 'Пламя: карты урона наносят +1.' },
        { id: 'hero-6', name: 'Лесной Страж', hp: 42, mp: 10, atk: 2, perk: 'Природа: +3 лечения с каждой карты лечения.' },
        { id: 'hero-7', name: 'Арканист', hp: 37, mp: 13, atk: 1, perk: 'Поток: каждая 3-я карта стоит на 1 МР меньше.' },
        { id: 'hero-8', name: 'Клинок Бури', hp: 41, mp: 10, atk: 2, perk: 'Натиск: после крит. удара +1 МР.' },
        { id: 'hero-9', name: 'Паладин Зари', hp: 45, mp: 9, atk: 2, perk: 'Аура: +1 к максимальному щиту.' },
        { id: 'hero-10', name: 'Повелитель Духов', hp: 40, mp: 11, atk: 1, perk: 'Духи: +1 карта в первой руке каждого боя.' },
        { id: 'hero-11', name: 'Ведьмак Катакомб', hp: 43, mp: 9, atk: 2, perk: 'Эликсиры: +1 эффект к исцелению и мане.' },
        { id: 'hero-12', name: 'Разрушитель Печатей', hp: 39, mp: 11, atk: 3, perk: 'Разлом: +1 к урону по боссам.' }
    ];
    const ENEMY_PREFIX = ['Костяной', 'Пепельный', 'Проклятый', 'Теневой', 'Рунический', 'Бездонный', 'Кровавый', 'Ледяной'];
    const ENEMY_BASE = ['страж', 'палач', 'шаман', 'охотник', 'берсерк', 'сквернитель', 'провидец', 'чародей'];
    const ENEMY_ARTIFACTS = [
        { name: 'Железный тотем', text: '+6 HP', apply: (e) => { e.hpMax += 6; e.hp += 6; } },
        { name: 'Клинок руин', text: '+1 АТК', apply: (e) => { e.atk += 1; } },
        { name: 'Сгусток эфира', text: '+2 МР max', apply: (e) => { e.mpMax += 2; e.mp += 1; } },
        { name: 'Щит бездны', text: 'Снижает получаемый урон на 1', apply: (e) => { e.armor = (e.armor || 0) + 1; } }
    ];

    function createState() {
        return {
            phase: 'hero_select',
            floor: 1,
            turn: 0,
            hero: { ...HERO_TEMPLATE, effects: {} },
            enemy: null,
            deck: [],
            discard: [],
            hand: [],
            log: [],
            rewards: [],
            skipEnemyTurn: false,
            bonuses: { manaRegen: 0, furyCycle: false, extraDraw: 0 },
            bestFloor: Number(localStorage.getItem(BEST_FLOOR_KEY) || 0),
            pendingFury: false,
            tip: 'Выберите одного из 12 героев, чтобы начать вылазку.',
            enemyPlan: [],
            heroPickPending: true,
            selectedHero: null,
            usedEnemyNames: new Set(),
            compactLog: [],
            playerStarts: true,
            actionCounter: 0,
            currentActionId: 0,
            latestActionId: 0,
            heroArtifacts: [],
            enemyArtifacts: [],
            firstTurnNoRegen: false
        };
    }

    let state = createState();
    let root = null;
    let prevSnapshot = { heroHp: null, heroMp: null, enemyHp: null, tip: '' };

    document.addEventListener('DOMContentLoaded', initMiniGame);

    function initMiniGame() {
        const openBtn = document.getElementById('openMiniGame');
        if (!openBtn) return;
        loadProgress();
        ensureRoot();
        openBtn.addEventListener('click', openGame);
    }

    function ensureRoot() {
        if (document.getElementById(ROOT_ID)) return;
        const overlay = document.createElement('div');
        overlay.id = ROOT_ID;
        overlay.className = 'minigame-overlay';
        overlay.innerHTML = `
            <div class="minigame-shell" role="dialog" aria-modal="true" aria-label="Катакомбы: Рунический рейд">
                <div class="minigame-header">
                    <h3 class="minigame-title">Катакомбы: Рунический рейд</h3>
                    <button class="minigame-close" type="button" aria-label="Закрыть">✕</button>
                </div>
                <div class="minigame-content">
                    <section class="minigame-panel">
                        <div class="minigame-stats" id="mgStats"></div>
                        <div class="artifact-row">
                            <details class="artifact-box" id="heroArtifactsBox">
                                <summary>Артефакты героя</summary>
                                <div class="artifact-list" id="heroArtifactsList"></div>
                            </details>
                            <details class="artifact-box" id="enemyArtifactsBox">
                                <summary>Артефакты соперника</summary>
                                <div class="artifact-list" id="enemyArtifactsList"></div>
                            </details>
                        </div>
                        <div class="minigame-bars">
                            <div class="bar-label"><span>Герой HP</span><span id="heroHpLabel">0 / 0</span></div>
                            <div class="bar"><div id="heroHpBar" class="bar-fill hero"></div></div>
                            <div class="bar-label"><span>Герой МР</span><span id="heroMpLabel">0 / 0</span></div>
                            <div class="bar"><div id="heroMpBar" class="bar-fill mana"></div></div>
                        </div>
                        <h4 class="minigame-enemy-name" id="enemyTitle">Подготовка к походу</h4>
                        <div class="minigame-bars">
                            <div class="bar-label"><span>Враг HP</span><span id="enemyHpLabel">0 / 0</span></div>
                            <div class="bar"><div id="enemyHpBar" class="bar-fill"></div></div>
                        </div>
                        <div class="minigame-tip" id="mgTip">Подсказки появятся во время боя.</div>
                        <div class="minigame-log" id="mgLog"></div>
                    </section>
                    <section class="minigame-panel">
                        <h4 class="minigame-enemy-name">Рука героя</h4>
                        <div class="minigame-hand" id="mgHand"></div>
                        <h4 class="minigame-enemy-name enemy-hand-title">Карты соперника</h4>
                        <div class="minigame-enemy-hand" id="mgEnemyHand"></div>
                        <h4 class="minigame-enemy-name enemy-hand-title" id="mgHeroTitle">Выбор героя</h4>
                        <div class="hero-select-grid" id="mgHeroSelect"></div>
                        <div class="reward-grid" id="mgRewards" hidden></div>
                    </section>
                </div>
                <div class="minigame-footer">
                    <div class="minigame-phase" id="mgPhase">Нажмите "Новая вылазка", чтобы начать.</div>
                    <div class="minigame-actions">
                        <button class="minigame-btn primary" id="mgStartBtn" type="button">Новая вылазка</button>
                        <button class="minigame-btn" id="mgNextBtn" type="button">Следующий бой</button>
                        <button class="minigame-btn" id="mgCloseBtn" type="button">Завершить поход</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        root = overlay;

        overlay.querySelector('.minigame-close').addEventListener('click', closeGame);
        overlay.querySelector('#mgCloseBtn').addEventListener('click', terminateExpedition);
        overlay.querySelector('#mgStartBtn').addEventListener('click', startRun);
        overlay.querySelector('#mgNextBtn').addEventListener('click', () => {
            if (state.phase === 'reward' || state.phase === 'victory') {
                state.floor += 1;
                spawnEnemy();
                if (state.playerStarts) {
                    state.tip = 'Новый бой: вы ходите первым.';
                    beginPlayerTurn();
                } else {
                    state.tip = 'Новый бой: первым ходит соперник.';
                    enemyTurn();
                    if (state.hero.hp > 0) beginPlayerTurn();
                    else handleDefeat();
                }
                render();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && root?.classList.contains('active')) closeGame();
        });
    }

    function openGame() {
        if (!root) ensureRoot();
        root.classList.remove('closing');
        root.classList.add('active');
        document.body.classList.add('mobile-menu-open');
        document.body.classList.add('minigame-open');
        if (!state.selectedHero) {
            state.phase = 'hero_select';
            state.tip = 'Выберите одного из 12 героев, чтобы начать вылазку.';
        }
        prevSnapshot = { heroHp: null, heroMp: null, enemyHp: null, tip: '' };
        render();
    }

    function closeGame() {
        if (!root) return;
        if (root.classList.contains('closing')) return;
        root.classList.add('closing');
        root.classList.remove('active');

        window.setTimeout(() => {
            root.classList.remove('closing');
            document.body.classList.remove('mobile-menu-open');
            document.body.classList.remove('minigame-open');
        }, 200);
        saveProgress();
    }

    function startRun() {
        if (state.phase !== 'ready') {
            render();
            return;
        }
        if (!state.selectedHero) {
            state.phase = 'hero_select';
            state.tip = 'Сначала выберите героя.';
            render();
            return;
        }

        const selectedHero = state.selectedHero;
        const bestFloor = state.bestFloor;
        state = createState();
        state.selectedHero = selectedHero;
        state.bestFloor = bestFloor;
        applySelectedHeroStats(selectedHero);
        state.heroArtifacts = [];
        state.enemyArtifacts = [];
        state.phase = 'battle';
        markPlayerAction();
        state.firstTurnNoRegen = true;
        state.deck = buildDeck();
        shuffle(state.deck);
        state.hand = [];
        state.discard = [];
        state.log = [];
        state.compactLog = [];

        spawnEnemy();
        log(state, 'Вы спускаетесь в Катакомбы. Держите баланс между уроном и выживанием.', 'good', 'system', 'info');
        pushCompact('system', `${state.enemy.name}`, 0, 0);

        if (state.playerStarts) {
            state.tip = 'Вы начинаете первым. Используйте ману экономно.';
            beginPlayerTurn();
        } else {
            state.tip = 'Первым ходит соперник. Подготовьтесь к ответной атаке.';
            enemyTurn();
            if (state.hero.hp > 0) beginPlayerTurn();
            else handleDefeat();
        }
        saveProgress();
        render();
    }

    function buildDeck() {
        const starter = ['strike', 'strike', 'focus', 'focus', 'guard', 'fireball', 'heal', 'summon', 'bleed', 'chain', 'vampire', 'time', 'arcane'];
        return starter.map((id) => ({ ...getCard(id) }));
    }

    function getCard(id) {
        const card = CARDS_POOL.find((c) => c.id === id);
        return card || CARDS_POOL[0];
    }

    function spawnEnemy() {
        const boss = state.floor % 5 === 0;
        const name = generateEnemyName(boss);
        const hpBase = boss ? 32 : 18;
        const atkBase = boss ? 7 : 4;
        const growth = state.floor - 1;
        const hp = hpBase + Math.floor(growth * (boss ? 3.2 : 2.1));
        const atk = atkBase + Math.floor(growth * (boss ? 0.9 : 0.55));
        state.enemy = {
            name: `${name} • этаж ${state.floor}`,
            hpMax: hp,
            hp,
            atk,
            baseHp: hp,
            baseAtk: atk,
            mpMax: 6 + Math.floor(state.floor / 3),
            mp: 3 + Math.floor(state.floor / 4),
            baseMp: 6 + Math.floor(state.floor / 3),
            boss,
            effects: {}
        };
        state.enemyArtifacts = [];
        applyEnemyArtifactsForFloor();
        state.phase = 'battle';
        state.rewards = [];
        state.skipEnemyTurn = false;
        state.pendingFury = false;
        state.hero.shield = 0;
        state.enemyPlan = createEnemyPlanQueue(state.floor);
        state.playerStarts = Math.random() < 0.5;
        state.tip = 'Сыграйте карту. Сначала держите 1-2 МР на защиту или лечение.';
        log(state, `Враг появляется: ${state.enemy.name}.`, 'bad', 'enemy', 'info');
        pushCompact('system', `${state.enemy.name}`, 0, 0);
    }

    function createEnemyPlanQueue(floor) {
        return [generateEnemyCard(floor), generateEnemyCard(floor), generateEnemyCard(floor)];
    }

    function generateEnemyCard(floor) {
        const roll = Math.random();
        const early = floor <= 3;
        if (early) {
        if (roll < 0.55) return { type: 'attack', name: 'Рваный удар', text: 'Обычная атака.', base: 0, cost: 1 };
        if (roll < 0.75) return { type: 'heal', name: 'Тёмная регенерация', text: 'Лечит врага.', base: 0, cost: 2 };
        if (roll < 0.9) return { type: 'buff', name: 'Ярость руин', text: 'Усиливает следующую атаку.', base: 1, cost: 2 };
        return { type: 'heavy', name: 'Сокрушение', text: 'Сильный удар.', base: 3, cost: 3 };
        }
        if (roll < 0.44) return { type: 'attack', name: 'Рваный удар', text: 'Обычная атака.', base: 0, cost: 1 };
        if (roll < 0.62) return { type: 'heal', name: 'Тёмная регенерация', text: 'Лечит врага.', base: 0, cost: 2 };
        if (roll < 0.77) return { type: 'buff', name: 'Ярость руин', text: 'Усиливает следующую атаку.', base: 1, cost: 2 };
        if (roll < 0.9) return { type: 'heavy', name: 'Сокрушение', text: 'Сильный удар.', base: 4, cost: 3 };
        return { type: 'pierce', name: 'Проклятый выпад', text: 'Часть урона проходит через щит.', base: 2, cost: 3 };
    }

    function generateEnemyName(boss) {
        if (boss) {
            const bosses = ['Владыка Бездны', 'Архонт Костей', 'Тень Погибшего Трона', 'Проклятый Магистр', 'Безликий Жнец'];
            return bosses[Math.floor(Math.random() * bosses.length)] + ` #${state.floor}`;
        }
        let tries = 0;
        let name = '';
        while (tries < 20) {
            name = `${ENEMY_PREFIX[Math.floor(Math.random() * ENEMY_PREFIX.length)]} ${ENEMY_BASE[Math.floor(Math.random() * ENEMY_BASE.length)]}`;
            if (!state.usedEnemyNames.has(name)) break;
            tries += 1;
        }
        state.usedEnemyNames.add(name);
        return name;
    }

    function beginPlayerTurn() {
        state.turn += 1;
        state.hero.shield = 0;
        const regen = state.firstTurnNoRegen ? 0 : (2 + state.bonuses.manaRegen);
        if (state.firstTurnNoRegen) state.firstTurnNoRegen = false;
        gainMana(state, regen);
        if (state.bonuses.furyCycle && state.turn % 3 === 0) {
            state.pendingFury = true;
            log(state, 'Печать ярости активна: +5 к первой атаке!', 'good', 'player', 'buff');
        }
        applyEnemyDot();
        const targetHand = 3;
        drawCards(state, Math.max(0, targetHand - state.hand.length));
        applyHeroPassive();
        state.phase = 'battle';
        updateTip();
    }

    function applyHeroPassive() {
        if (!state.selectedHero) return;
        if (state.selectedHero.id === 'hero-1') state.hero.shield += 2;
        if (state.selectedHero.id === 'hero-2') gainMana(state, 1);
        if (state.selectedHero.id === 'hero-7' && state.turn % 3 === 0) state.hero.mp = Math.min(state.hero.maxMp, state.hero.mp + 1);
    }

    function drawCards(s, count) {
        for (let i = 0; i < count; i += 1) {
            if (!s.deck.length) {
                if (!s.discard.length) return;
                s.deck = s.discard.splice(0);
                shuffle(s.deck);
                log(s, 'Колода обновлена из сброса.', 'good', 'system', 'info');
            }
            s.hand.push(s.deck.pop());
        }
    }

    function playCard(index) {
        if (state.phase !== 'battle') return;
        markPlayerAction();
        const card = state.hand[index];
        if (!card) return;
        if (card.cost > state.hero.mp) {
            state.tip = `Сейчас не хватает маны для "${card.name}". Лучше сыграть карту дешевле или подготовить МР.`;
            log(state, `Недостаточно МР для карты "${card.name}".`, 'bad', 'player', 'mana');
            render();
            return;
        }

        state.hero.mp -= card.cost;
        if (card.cost > 0) pushCompact('mana_minus', 'Мана -', 0, -card.cost);
        state.hand.splice(index, 1);
        state.discard.push(card);
        log(state, `Вы разыграли "${card.name}".`, 'good', 'player', 'info');
        card.play(state);
        if (state.selectedHero?.id === 'hero-5' && ['strike', 'fireball', 'chain', 'bleed', 'vampire', 'time', 'arcane'].includes(card.id)) {
            hitEnemy(state, 1);
        }
        if (state.selectedHero?.id === 'hero-10' && state.turn === 1) gainMana(state, 1);
        if (state.selectedHero?.id === 'hero-11' && ['heal', 'focus'].includes(card.id)) {
            healHero(state, 1);
            gainMana(state, 1);
        }

        if (state.enemy.hp <= 0) {
            handleVictory();
            render();
            return;
        }

        if (state.skipEnemyTurn) {
            state.skipEnemyTurn = false;
            state.tip = 'Отлично! Враг пропустил ход. Усиливайте давление.';
            beginPlayerTurn();
            render();
            return;
        }

        enemyTurn();
        if (state.hero.hp <= 0) {
            handleDefeat();
            render();
            return;
        }
        beginPlayerTurn();
        render();
    }

    function hitEnemy(s, baseDamage) {
        let dmg = baseDamage + s.hero.atk;
        if (s.hero.effects.empowered && s.hero.effects.empowered > 0) {
            dmg += 3;
            s.hero.effects.empowered -= 1;
        }
        if (s.hero.effects.combo && s.hero.effects.combo > 0) {
            dmg += 1;
            s.hero.effects.combo -= 1;
        }
        if (s.pendingFury) {
            dmg += 5;
            s.pendingFury = false;
        }
        if (Math.random() < s.hero.crit) {
            dmg = Math.floor(dmg * 2);
            log(s, 'Критический удар!', 'good', 'player', 'crit');
        }
        if (s.selectedHero?.id === 'hero-12' && s.enemy?.boss) dmg += 1;
        if (s.enemy?.armor) dmg = Math.max(1, dmg - s.enemy.armor);
        s.enemy.hp = Math.max(0, s.enemy.hp - dmg);
        log(s, `Враг получает ${dmg} урона.`, 'good', 'player', 'damage');
        pushCompact('deal', 'Урон врагу', dmg, 0);
        if (s.hero.lifesteal > 0) {
            const heal = Math.max(1, Math.floor(dmg * s.hero.lifesteal));
            healHero(s, heal);
        }
    }

    function healHero(s, amount) {
        const before = s.hero.hp;
        s.hero.hp = Math.min(s.hero.maxHp, s.hero.hp + amount);
        const healed = s.hero.hp - before;
        if (healed > 0) {
            log(s, `Восстановлено ${healed} HP.`, 'good', 'player', 'heal');
            pushCompact('heal', 'Лечение', healed, 0);
        }
    }

    function gainMana(s, amount) {
        const before = s.hero.mp;
        s.hero.mp = Math.min(s.hero.maxMp, s.hero.mp + amount);
        const restored = s.hero.mp - before;
        if (restored > 0) {
            log(s, `Восстановлено ${restored} МР.`, 'good', 'player', 'mana');
            pushCompact('mana_plus', 'Мана +', 0, restored);
        }
    }

    function applyEnemyDot() {
        if (!state.enemy?.effects.bleed) return;
        state.enemy.effects.bleed -= 1;
        state.enemy.hp = Math.max(0, state.enemy.hp - 3);
        log(state, 'Кровотечение наносит врагу 3 урона.', 'good', 'player', 'damage');
        if (state.enemy.hp <= 0) handleVictory();
    }

    function enemyTurn() {
        if (!state.enemy) return;
        state.enemy.mp = Math.min(state.enemy.mpMax, state.enemy.mp + 2);
        if (!state.enemyPlan.length) state.enemyPlan = createEnemyPlanQueue();

        const smartChance = Math.min(0.18 + state.floor * 0.05, 0.82);
        const isSmartMove = Math.random() < smartChance;
        let idx = 0;
        if (isSmartMove) idx = pickBestEnemyCardIndex(state.enemyPlan);
        let card = state.enemyPlan.splice(idx, 1)[0];
        if (card && card.cost > state.enemy.mp) {
            card = { type: 'attack', name: 'Импровизация', text: 'Быстрый удар без затрат.', base: 0, cost: 0 };
        }
        state.enemy.mp = Math.max(0, state.enemy.mp - (card?.cost || 0));
        state.enemyPlan.push(generateEnemyCard(state.floor));
        runEnemyCard(card);
    }

    function pickBestEnemyCardIndex(plan) {
        let bestIndex = 0;
        let bestScore = -Infinity;
        plan.forEach((card, index) => {
            let score = 0;
            if (card.type === 'heal') {
                const missing = state.enemy.hpMax - state.enemy.hp;
                score = missing > 6 ? 11 + missing * 0.15 : 3;
            } else if (card.type === 'buff') {
                score = state.enemy.atk < state.hero.atk + 3 ? 9 : 5;
            } else if (card.type === 'heavy') {
                score = state.hero.hp <= 16 ? 14 : 8;
            } else if (card.type === 'pierce') {
                score = state.hero.shield >= 5 ? 13 : 6;
            } else {
                score = state.hero.hp <= 10 ? 12 : 7;
            }
            if (score > bestScore) {
                bestScore = score;
                bestIndex = index;
            }
        });
        return bestIndex;
    }

    function runEnemyCard(card) {
        if (!card) return;
        const floorBonus = Math.floor(state.floor / 6);
        if (card.type === 'heal') {
            const heal = (state.enemy.boss ? 5 : 3) + floorBonus;
            state.enemy.hp = Math.min(state.enemy.hpMax, state.enemy.hp + heal);
            log(state, `${state.enemy.name} использует "${card.name}" и лечится на ${heal}.`, 'bad', 'enemy', 'heal');
            pushCompact('enemy_heal', 'Лечение врага', heal, 0);
            return;
        }
        if (card.type === 'buff') {
            state.enemy.atk += Math.max(1, card.base);
            log(state, `${state.enemy.name} использует "${card.name}" (+${Math.max(1, card.base)} АТК).`, 'bad', 'enemy', 'buff');
            pushCompact('enemy_buff', 'Бафф врага', Math.max(1, card.base), 0);
            return;
        }

        let incoming = state.enemy.atk + card.base + floorBonus;
        if (state.enemy.boss && card.type === 'heavy') incoming += 2;

        let pierceDamage = 0;
        if (card.type === 'pierce') {
            pierceDamage = Math.max(1, Math.floor(incoming * 0.35));
        }

        const blocked = Math.min(state.hero.shield, incoming);
        state.hero.shield -= blocked;
        const baseAfterBlock = Math.max(0, incoming - blocked);
        const finalDamage = baseAfterBlock + pierceDamage;

        state.hero.hp = Math.max(0, state.hero.hp - finalDamage);
        if (card.type === 'pierce') {
            log(state, `${state.enemy.name} использует "${card.name}" (${finalDamage} урона, часть прошла сквозь щит).`, 'bad', 'enemy', 'damage');
        } else {
            const kind = blocked > 0 && finalDamage === 0 ? 'block' : 'damage';
            log(state, `${state.enemy.name} использует "${card.name}" (${incoming} урона, ${blocked} заблокировано).`, finalDamage > 0 ? 'bad' : 'good', 'enemy', kind);
        }
        if (finalDamage > 0) pushCompact('take', 'Получено урона', finalDamage, 0);
    }

    function handleVictory() {
        if (state.phase === 'reward') return;
        state.phase = 'reward';
        state.bestFloor = Math.max(state.bestFloor, state.floor);
        localStorage.setItem(BEST_FLOOR_KEY, String(state.bestFloor));
        log(state, `Победа на этаже ${state.floor}. Выберите артефакт.`, 'good', 'system', 'info');
        state.tip = 'Сравните артефакты: выживание (HP/щит) или темп (урон/мана).';
        state.rewards = pickRewards(3);
        saveProgress();
    }

    function handleDefeat() {
        state.phase = 'hero_select';
        state.bestFloor = Math.max(state.bestFloor, state.floor);
        localStorage.setItem(BEST_FLOOR_KEY, String(state.bestFloor));
        state.tip = 'Выберите нового героя и попробуйте другой стиль боя.';
        state.floor = 1;
        state.enemy = null;
        state.enemyPlan = [];
        log(state, `Герой пал на этаже ${state.floor}.`, 'bad', 'system', 'death');
        pushCompact('system', 'Поражение', 0, 0);
        saveProgress();
    }

    function pickRewards(count) {
        const copy = ARTIFACTS.slice();
        shuffle(copy);
        return copy.slice(0, count);
    }

    function chooseReward(index) {
        const reward = state.rewards[index];
        if (!reward) return;
        markPlayerAction();
        reward.apply(state);
        state.heroArtifacts.push({ name: reward.name, text: reward.text });
        log(state, `Получен артефакт: ${reward.name}. ${reward.text}`, 'good', 'player', 'buff');
        state.tip = 'Отличный выбор. Жмите "Следующий бой" и используйте новое усиление сразу.';
        state.phase = 'victory';
        state.rewards = [];
        saveProgress();
        render();
    }

    function updateTip() {
        if (state.phase !== 'battle' || !state.enemy) return;
        const canPlay = state.hand.filter((c) => c.cost <= state.hero.mp);
        const healCard = canPlay.find((c) => c.id === 'heal');
        const guardCard = canPlay.find((c) => c.id === 'guard');
        const finisher = canPlay.find((c) => estimatedDamage(c) >= state.enemy.hp);
        if (finisher) {
            state.tip = `Можно добить врага картой "${finisher.name}".`;
            return;
        }
        if (state.hero.hp <= Math.max(10, state.enemy.atk + 3) && healCard) {
            state.tip = `Низкое HP: выгодно сыграть "${healCard.name}".`;
            return;
        }
        if (state.hero.hp <= 14 && guardCard) {
            state.tip = `Ожидается сильный удар врага. Рекомендуется "${guardCard.name}".`;
            return;
        }
        if (!canPlay.length) {
            state.tip = 'Не хватает МР на карты в руке. Ищите "Сосредоточение" и артефакты маны.';
            return;
        }
        const heavy = canPlay.sort((a, b) => estimatedDamage(b) - estimatedDamage(a))[0];
        state.tip = `Оптимальный ход: "${heavy.name}". После него оцените оставшуюся ману.`;
    }

    function pushCompact(type, label, damage, mana) {
        state.compactLog.unshift({
            type,
            label,
            damage,
            mana,
            turn: state.turn
        });
        if (state.compactLog.length > 12) state.compactLog.length = 12;
    }

    function selectHero(heroId) {
        if (state.phase !== 'hero_select') return;
        markPlayerAction();
        const hero = HEROES.find((h) => h.id === heroId);
        if (!hero) return;
        state.selectedHero = hero;
        applySelectedHeroStats(hero);
        state.phase = 'ready';
        state.hand = [];
        state.discard = [];
        state.enemy = null;
        state.enemyPlan = [];
        state.tip = `Герой "${hero.name}" выбран. Нажмите "Новая вылазка", чтобы начать.`;
        saveProgress();
        render();
    }

    function applySelectedHeroStats(hero) {
        state.hero.maxHp = hero.hp;
        state.hero.hp = hero.hp;
        state.hero.maxMp = hero.mp;
        state.hero.mp = Math.min(hero.mp, 5);
        state.hero.atk = hero.atk;
        state.hero.crit = 0.05 + (hero.id === 'hero-3' ? 0.1 : 0);
        state.hero.lifesteal = 0;
        state.hero.effects = {};
        state.bonuses = { manaRegen: hero.id === 'hero-2' ? 1 : 0, furyCycle: false, extraDraw: 0 };
        state.turn = 0;
        state.floor = 1;
    }

    function applyEnemyArtifactsForFloor() {
        if (!state.enemy) return;
        const count = state.enemy.boss ? 2 : (state.floor >= 4 ? 1 : 0);
        if (count <= 0) return;
        const pool = ENEMY_ARTIFACTS.slice();
        shuffle(pool);
        for (let i = 0; i < count; i += 1) {
            const art = pool[i];
            if (!art) break;
            art.apply(state.enemy);
            state.enemyArtifacts.push({ name: art.name, text: art.text });
        }
    }

    function estimatedDamage(card) {
        const map = { strike: 4, fireball: 8, chain: 11, bleed: 6, vampire: 8, time: 5, arcane: 4 };
        return (map[card.id] || 0) + state.hero.atk;
    }

    function markPlayerAction() {
        state.actionCounter += 1;
        state.currentActionId = state.actionCounter;
        state.latestActionId = state.currentActionId;
    }

    function log(s, text, tone = '', actor = 'system', kind = 'info') {
        s.log.push({
            text,
            tone,
            actor,
            kind,
            at: Date.now(),
            actionId: s.currentActionId || 0
        });
        if (s.log.length > 120) s.log.splice(0, s.log.length - 120);
    }

    function terminateExpedition() {
        if (!root || !root.classList.contains('active')) return;
        if (!['ready', 'battle', 'reward', 'victory'].includes(state.phase)) return;
        state.bestFloor = Math.max(state.bestFloor, state.floor);
        localStorage.setItem(BEST_FLOOR_KEY, String(state.bestFloor));
        markPlayerAction();
        state.phase = 'hero_select';
        state.enemy = null;
        state.enemyPlan = [];
        state.hand = [];
        state.rewards = [];
        state.log = [];
        state.compactLog = [];
        state.tip = 'Поход завершён. Результат сохранён. Выберите героя, чтобы начать заново.';
        saveProgress();
        render();
    }

    function shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i -= 1) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }

    function render() {
        if (!root) return;
        const stats = root.querySelector('#mgStats');
        const enemyTitle = root.querySelector('#enemyTitle');
        const logNode = root.querySelector('#mgLog');
        const handNode = root.querySelector('#mgHand');
        const rewardsNode = root.querySelector('#mgRewards');
        const phaseNode = root.querySelector('#mgPhase');
        const nextBtn = root.querySelector('#mgNextBtn');
        const tipNode = root.querySelector('#mgTip');
        const enemyHandNode = root.querySelector('#mgEnemyHand');
        const heroPickNode = root.querySelector('#mgHeroSelect');
        const heroTitleNode = root.querySelector('#mgHeroTitle');
        const heroArtifactsList = root.querySelector('#heroArtifactsList');
        const enemyArtifactsList = root.querySelector('#enemyArtifactsList');
        if (!stats || !enemyTitle || !logNode || !handNode || !rewardsNode || !phaseNode || !nextBtn || !tipNode || !enemyHandNode || !heroPickNode || !heroTitleNode || !heroArtifactsList || !enemyArtifactsList) return;

        const baseHp = state.selectedHero ? state.selectedHero.hp : state.hero.maxHp;
        const baseAtk = state.selectedHero ? state.selectedHero.atk : state.hero.atk;
        const baseMp = state.selectedHero ? state.selectedHero.mp : state.hero.maxMp;
        const hpBonus = state.hero.maxHp - baseHp;
        const atkBonus = state.hero.atk - baseAtk;
        const mpBonus = state.hero.maxMp - baseMp;
        stats.innerHTML = `
            <div class="stat-chip"><strong>Этаж</strong><br>${state.floor}</div>
            <div class="stat-chip"><strong>Ход</strong><br>${state.turn}</div>
            <div class="stat-chip"><strong>HP героя</strong><br>${state.hero.hp}/${state.hero.maxHp}${hpBonus > 0 ? ` <span class="stat-plus">+${hpBonus}</span>` : ''}</div>
            <div class="stat-chip"><strong>АТК героя</strong><br>${state.hero.atk}${atkBonus > 0 ? ` <span class="stat-plus">+${atkBonus}</span>` : ''}</div>
            <div class="stat-chip"><strong>MP героя</strong><br>${state.hero.mp}/${state.hero.maxMp}${mpBonus > 0 ? ` <span class="stat-plus">+${mpBonus}</span>` : ''}</div>
            <div class="stat-chip"><strong>Рекорд</strong><br>${state.bestFloor}</div>
        `;

        const heroHpPct = Math.max(0, Math.min(100, (state.hero.hp / state.hero.maxHp) * 100));
        const heroMpPct = Math.max(0, Math.min(100, (state.hero.mp / state.hero.maxMp) * 100));
        root.querySelector('#heroHpLabel').textContent = `${state.hero.hp} / ${state.hero.maxHp}`;
        root.querySelector('#heroMpLabel').textContent = `${state.hero.mp} / ${state.hero.maxMp}`;
        const heroHpBar = root.querySelector('#heroHpBar');
        const heroMpBar = root.querySelector('#heroMpBar');
        heroHpBar.style.width = `${heroHpPct}%`;
        heroMpBar.style.width = `${heroMpPct}%`;

        if (state.enemy) {
            const enemyHpPct = Math.max(0, Math.min(100, (state.enemy.hp / state.enemy.hpMax) * 100));
            const enemyHpBonus = (state.enemy.hpMax - (state.enemy.baseHp || state.enemy.hpMax));
            const enemyAtkBonus = (state.enemy.atk - (state.enemy.baseAtk || state.enemy.atk));
            const enemyMpBonus = (state.enemy.mpMax - (state.enemy.baseMp || state.enemy.mpMax));
            enemyTitle.textContent = `${state.enemy.name} • АТК ${state.enemy.atk}${enemyAtkBonus > 0 ? ` (+${enemyAtkBonus})` : ''} • МР ${state.enemy.mp}/${state.enemy.mpMax}${enemyMpBonus > 0 ? ` (+${enemyMpBonus})` : ''}`;
            root.querySelector('#enemyHpLabel').textContent = `${state.enemy.hp} / ${state.enemy.hpMax}`;
            root.querySelector('#enemyHpBar').style.width = `${enemyHpPct}%`;
            if (enemyHpBonus > 0) {
                root.querySelector('#enemyHpLabel').textContent += ` (+${enemyHpBonus})`;
            }
        } else {
            enemyTitle.textContent = 'Подготовка к походу';
            root.querySelector('#enemyHpLabel').textContent = '0 / 0';
            root.querySelector('#enemyHpBar').style.width = '0%';
        }

        if (prevSnapshot.tip !== state.tip) {
            tipNode.textContent = state.tip;
            tipNode.classList.remove('tip-animate');
            void tipNode.offsetWidth;
            tipNode.classList.add('tip-animate');
        } else {
            tipNode.textContent = state.tip;
        }

        enemyHandNode.innerHTML = state.enemyPlan
            .slice(0, 3)
            .map((card, idx) => `
                <div class="enemy-card ${idx === 0 ? 'next' : 'hidden'}">
                    <h5>${idx === 0 ? (card?.name || 'Тень') : 'Скрытая карта'}</h5>
                    <p>${idx === 0 ? (card?.text || '') : 'Соперник готовит ход...'}</p>
                    <span>${idx === 0 ? 'Следующий ход' : 'Скрыто'}</span>
                </div>
            `)
            .join('');

        heroArtifactsList.innerHTML = (state.heroArtifacts.length
            ? state.heroArtifacts.map((a) => `<div class="artifact-pill"><strong>${a.name}</strong><span>${a.text}</span></div>`).join('')
            : '<div class="artifact-empty">Пока нет активных артефактов</div>');
        enemyArtifactsList.innerHTML = (state.enemyArtifacts.length
            ? state.enemyArtifacts.map((a) => `<div class="artifact-pill enemy"><strong>${a.name}</strong><span>${a.text}</span></div>`).join('')
            : '<div class="artifact-empty">У соперника артефактов нет</div>');

        const recentLog = state.log.slice(-10).reverse();
        logNode.innerHTML = recentLog
            .map((entry, idx) => {
                const t = new Date(entry.at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                const isNew = entry.actionId && entry.actionId === state.latestActionId;
                return `<div class="minigame-log-entry ${entry.tone} actor-${entry.actor || 'system'} kind-${entry.kind || 'info'}" style="--i:${idx}">
                    <div class="log-top"><span class="log-text">${entry.text}</span>${isNew ? '<span class="log-new">NEW</span>' : ''}</div>
                    <div class="log-time">${t}</div>
                </div>`;
            })
            .join('');

        if (state.phase === 'reward') {
            handNode.hidden = true;
            enemyHandNode.hidden = true;
            heroPickNode.hidden = true;
            rewardsNode.hidden = false;
            rewardsNode.innerHTML = state.rewards
                .map((r, idx) => `<button class="minigame-btn reward-btn" data-reward="${idx}" type="button"><strong>${r.name}</strong><br>${r.text}</button>`)
                .join('');
            rewardsNode.querySelectorAll('[data-reward]').forEach((btn) => {
                btn.addEventListener('click', () => chooseReward(Number(btn.getAttribute('data-reward'))));
            });
            phaseNode.textContent = 'Выберите артефакт за победу.';
        } else {
            rewardsNode.hidden = true;
            handNode.hidden = state.phase === 'hero_select';
            enemyHandNode.hidden = state.phase === 'hero_select';
            heroPickNode.hidden = state.phase !== 'hero_select';
            heroTitleNode.hidden = state.phase !== 'hero_select';
            handNode.innerHTML = state.hand
                .slice(0, 3)
                .map((card, idx) => {
                    const disabled = state.phase !== 'battle' || card.cost > state.hero.mp || state.hero.hp <= 0;
                    return `
                        <button class="minigame-card" type="button" data-play="${idx}" ${disabled ? 'disabled' : ''}>
                            <h4>${card.name}</h4>
                            <p>${card.text}</p>
                            <span class="minigame-card-cost">${card.cost} МР</span>
                        </button>
                    `;
                }).join('');
            handNode.querySelectorAll('[data-play]').forEach((btn) => {
                btn.addEventListener('click', () => playCard(Number(btn.getAttribute('data-play'))));
            });
            heroPickNode.innerHTML = HEROES.map((hero) => `
                <button class="hero-pick-card" type="button" data-hero="${hero.id}">
                    <h5>${hero.name}</h5>
                    <p>HP ${hero.hp} • МР ${hero.mp} • АТК ${hero.atk}</p>
                    <span>${hero.perk}</span>
                </button>
            `).join('');
            heroPickNode.querySelectorAll('[data-hero]').forEach((btn) => {
                btn.addEventListener('click', () => selectHero(btn.getAttribute('data-hero')));
            });
            if (state.phase === 'defeat') {
                phaseNode.textContent = 'Поражение. Выберите героя и начните заново.';
            } else if (state.phase === 'victory') {
                phaseNode.textContent = 'Победа. Нажмите "Следующий бой".';
            } else if (state.phase === 'hero_select') {
                phaseNode.textContent = 'Выберите одного из 12 героев, чтобы начать вылазку.';
            } else if (state.phase === 'ready') {
                phaseNode.textContent = 'Герой выбран. Нажмите "Новая вылазка".';
            } else if (state.phase === 'battle') {
                phaseNode.textContent = 'Ваш ход: сыграйте карту.';
            } else {
                phaseNode.textContent = 'Нажмите "Новая вылазка", чтобы начать.';
            }
        }

        const startBtn = root.querySelector('#mgStartBtn');
        startBtn.disabled = state.phase !== 'ready';
        startBtn.style.opacity = startBtn.disabled ? '0.55' : '1';
        startBtn.classList.toggle('cta-pulse', state.phase === 'ready');
        nextBtn.disabled = !(state.phase === 'victory');
        nextBtn.style.opacity = nextBtn.disabled ? '0.5' : '1';
        nextBtn.classList.toggle('cta-pulse', state.phase === 'victory');
        const terminateBtn = root.querySelector('#mgCloseBtn');
        if (terminateBtn) {
            const canTerminate = ['ready', 'battle', 'reward', 'victory'].includes(state.phase);
            terminateBtn.disabled = !canTerminate;
            terminateBtn.style.opacity = canTerminate ? '1' : '0.55';
        }
        const enemyHpBar = root.querySelector('#enemyHpBar');
        const currentEnemyHp = state.enemy ? state.enemy.hp : 0;
        animateBarChanges(prevSnapshot.heroHp, state.hero.hp, heroHpBar, 'stat-hit', 'stat-heal');
        animateBarChanges(prevSnapshot.heroMp, state.hero.mp, heroMpBar, 'stat-hit', 'stat-mana');
        animateBarChanges(prevSnapshot.enemyHp, currentEnemyHp, enemyHpBar, 'stat-hit', 'stat-heal');
        prevSnapshot = { heroHp: state.hero.hp, heroMp: state.hero.mp, enemyHp: currentEnemyHp, tip: state.tip };
    }

    function animateBarChanges(prevValue, nextValue, el, downClass, upClass) {
        if (!el || prevValue === null || typeof nextValue !== 'number') return;
        if (nextValue === prevValue) return;
        const cls = nextValue < prevValue ? downClass : upClass;
        el.classList.remove(downClass, upClass);
        void el.offsetWidth;
        el.classList.add(cls);
        window.setTimeout(() => el.classList.remove(cls), 360);
    }

    function saveProgress() {
        try {
            const safe = {
                phase: state.phase,
                floor: state.floor,
                turn: state.turn,
                hero: state.hero,
                enemy: state.enemy,
                deck: state.deck.map((c) => c.id),
                discard: state.discard.map((c) => c.id),
                hand: state.hand.map((c) => c.id),
                rewards: state.rewards.map((r) => r.name),
                skipEnemyTurn: state.skipEnemyTurn,
                bonuses: state.bonuses,
                bestFloor: state.bestFloor,
                pendingFury: state.pendingFury,
                tip: state.tip,
                enemyPlan: state.enemyPlan,
                selectedHeroId: state.selectedHero ? state.selectedHero.id : null,
                usedEnemyNames: Array.from(state.usedEnemyNames || []),
                compactLog: state.compactLog,
                playerStarts: state.playerStarts,
                log: state.log.slice(0, 40),
                actionCounter: state.actionCounter,
                currentActionId: state.currentActionId,
                latestActionId: state.latestActionId,
                heroArtifacts: state.heroArtifacts,
                enemyArtifacts: state.enemyArtifacts,
                firstTurnNoRegen: state.firstTurnNoRegen
            };
            localStorage.setItem(SAVE_STATE_KEY, JSON.stringify(safe));
        } catch (e) {
            // ignore storage failures
        }
    }

    function loadProgress() {
        try {
            const raw = localStorage.getItem(SAVE_STATE_KEY);
            if (!raw) return;
            const saved = JSON.parse(raw);
            if (!saved || typeof saved !== 'object') return;

            const next = createState();
            next.phase = saved.phase || next.phase;
            next.floor = Number(saved.floor || next.floor);
            next.turn = Number(saved.turn || next.turn);
            next.hero = saved.hero || next.hero;
            next.enemy = saved.enemy || null;
            next.deck = Array.isArray(saved.deck) ? saved.deck.map((id) => ({ ...getCard(id) })) : [];
            next.discard = Array.isArray(saved.discard) ? saved.discard.map((id) => ({ ...getCard(id) })) : [];
            next.hand = Array.isArray(saved.hand) ? saved.hand.map((id) => ({ ...getCard(id) })) : [];
            next.rewards = Array.isArray(saved.rewards)
                ? saved.rewards.map((name) => ARTIFACTS.find((a) => a.name === name)).filter(Boolean)
                : [];
            next.skipEnemyTurn = Boolean(saved.skipEnemyTurn);
            next.bonuses = saved.bonuses || next.bonuses;
            next.bestFloor = Number(saved.bestFloor || next.bestFloor);
            next.pendingFury = Boolean(saved.pendingFury);
            next.tip = saved.tip || next.tip;
            next.enemyPlan = Array.isArray(saved.enemyPlan) ? saved.enemyPlan : [];
            next.selectedHero = HEROES.find((h) => h.id === saved.selectedHeroId) || null;
            next.usedEnemyNames = new Set(Array.isArray(saved.usedEnemyNames) ? saved.usedEnemyNames : []);
            next.compactLog = Array.isArray(saved.compactLog) ? saved.compactLog : [];
            next.playerStarts = typeof saved.playerStarts === 'boolean' ? saved.playerStarts : true;
            next.log = Array.isArray(saved.log) ? saved.log : [];
            next.actionCounter = Number(saved.actionCounter || 0);
            next.currentActionId = Number(saved.currentActionId || 0);
            next.latestActionId = Number(saved.latestActionId || 0);
            next.heroArtifacts = Array.isArray(saved.heroArtifacts) ? saved.heroArtifacts : [];
            next.enemyArtifacts = Array.isArray(saved.enemyArtifacts) ? saved.enemyArtifacts : [];
            next.firstTurnNoRegen = Boolean(saved.firstTurnNoRegen);
            state = next;
        } catch (e) {
            // ignore parse/storage errors
        }
    }
})();

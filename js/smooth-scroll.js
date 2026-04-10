// ============================================
// SMOOTH-SCROLL — умная плавная прокрутка сайта
// — Колесо/тачпад: экспоненциальное сглаживание с учётом dt (стабильно на 60/120/144 Hz)
// — Якоря: подготовка контекста (вкладка «Подробные» на rules) + двойной rAF перед измерением
// — Программный скролл: easeInOutCubic, длительность от расстояния
// — prefers-reduced-motion: нативно, но якоря правил всё равно переключают вкладку
// ============================================

(function () {
    'use strict';

    const STATE = {
        progRafId: 0,
        programmatic: false,
        interrupt: null,
        wheelInterruptOpts: { capture: true, passive: true },
        keyOpts: { capture: true }
    };

    const WHEEL = {
        rafId: 0,
        target: 0,
        moving: false,
        lastTs: 0,
        /** «жёсткость» пружины: выше — быстрее догоняет цель (10–16) */
        lambda: 13.5,
        opts: { capture: true, passive: false }
    };

    /** Средняя кнопка: нативная автопрокрутка — не перехватывать wheel (иначе дергание) */
    let middleButtonAutoscroll = false;

    let mqReduce;

    function prefersReducedMotion() {
        if (!mqReduce) {
            mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
        }
        return mqReduce.matches;
    }

    function detachInterrupt() {
        if (!STATE.interrupt) return;
        const fn = STATE.interrupt;
        STATE.interrupt = null;
        document.removeEventListener('wheel', fn, STATE.wheelInterruptOpts);
        document.removeEventListener('touchstart', fn, STATE.wheelInterruptOpts);
        document.removeEventListener('keydown', fn, STATE.keyOpts);
    }

    function stopWheelInertia() {
        if (WHEEL.rafId) {
            cancelAnimationFrame(WHEEL.rafId);
            WHEEL.rafId = 0;
        }
        WHEEL.moving = false;
        WHEEL.lastTs = 0;
        WHEEL.target = currentScrollY();
    }

    function cancelActiveScroll() {
        stopWheelInertia();
        if (STATE.progRafId) {
            cancelAnimationFrame(STATE.progRafId);
            STATE.progRafId = 0;
        }
        detachInterrupt();
    }

    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function maxScrollY() {
        const se = document.scrollingElement || document.documentElement;
        return Math.max(0, se.scrollHeight - window.innerHeight);
    }

    function currentScrollY() {
        return window.scrollY || document.documentElement.scrollTop || 0;
    }

    function prepareRulesAnchor(el) {
        if (typeof window.sitePrepareRulesAnchorTarget === 'function') {
            window.sitePrepareRulesAnchorTarget(el);
        }
    }

    /**
     * Два кадра после смены layout (вкладки), затем callback.
     */
    function afterLayout(callback) {
        return new Promise(function (resolve, reject) {
            requestAnimationFrame(function () {
                requestAnimationFrame(function () {
                    try {
                        const result = callback();
                        if (result && typeof result.then === 'function') {
                            result.then(resolve, reject);
                        } else {
                            resolve(result);
                        }
                    } catch (e) {
                        reject(e);
                    }
                });
            });
        });
    }

    function findConsumingScrollable(target, deltaY) {
        let node = target && target.nodeType === 1 ? target : null;
        if (!node) return null;

        while (node && node !== document.documentElement) {
            if (node === document.body) {
                node = node.parentElement;
                continue;
            }
            const cs = getComputedStyle(node);
            const oy = cs.overflowY;
            const scrollable = oy === 'auto' || oy === 'scroll' || oy === 'overlay';
            if (scrollable && node.scrollHeight > node.clientHeight + 2) {
                const down = node.scrollHeight - node.clientHeight - node.scrollTop;
                const up = node.scrollTop;
                if (deltaY > 0 && down > 2) return node;
                if (deltaY < 0 && up > 2) return node;
            }
            node = node.parentElement;
        }
        return null;
    }

    function normalizeWheelDelta(ev) {
        let dy = ev.deltaY;
        if (ev.deltaMode === 1) dy *= 16;
        if (ev.deltaMode === 2) dy *= window.innerHeight * 0.92;
        return dy;
    }

    function armMiddleAutoscroll(active) {
        middleButtonAutoscroll = Boolean(active);
        if (active) {
            stopWheelInertia();
        }
    }

    function isMiddleButtonAutoscroll(ev) {
        if (middleButtonAutoscroll) return true;
        /* WheelEvent.buttons: зажатое колесо = 4 */
        if (ev.buttons & 4) return true;
        return false;
    }

    function onWheelInertia(ev) {
        if (prefersReducedMotion()) return;
        if (STATE.programmatic) return;
        if (document.body.classList.contains('minigame-open')) return;
        if (isMiddleButtonAutoscroll(ev)) return;

        const maxY = maxScrollY();
        if (maxY < 1) return;

        if (Math.abs(ev.deltaX) > Math.abs(ev.deltaY) && Math.abs(ev.deltaY) < 3) return;

        const dy = normalizeWheelDelta(ev);
        if (Math.abs(dy) < 0.45) return;

        const inner = findConsumingScrollable(ev.target, dy);
        if (inner) return;

        const cur = currentScrollY();
        if ((dy > 0 && cur >= maxY - 0.5) || (dy < 0 && cur <= 0.5)) return;

        ev.preventDefault();

        if (!WHEEL.moving) {
            WHEEL.target = cur;
            WHEEL.moving = true;
            WHEEL.lastTs = 0;
        }

        WHEEL.target += dy * 1.1;
        WHEEL.target = Math.max(0, Math.min(maxY, WHEEL.target));

        if (!WHEEL.rafId) {
            WHEEL.rafId = requestAnimationFrame(wheelInertiaTick);
        }
    }

    function wheelInertiaTick(ts) {
        const maxY = maxScrollY();
        WHEEL.target = Math.max(0, Math.min(maxY, WHEEL.target));

        const cur = currentScrollY();
        const diff = WHEEL.target - cur;

        const prevTs = WHEEL.lastTs || ts;
        WHEEL.lastTs = ts;
        let dt = (ts - prevTs) / 1000;
        if (dt <= 0) dt = 0.001;
        if (dt > 0.056) dt = 0.056;

        const k = 1 - Math.exp(-WHEEL.lambda * dt);
        const next = cur + diff * k;
        window.scrollTo(0, next);

        const err = WHEEL.target - currentScrollY();
        if (Math.abs(err) < 0.48) {
            window.scrollTo(0, WHEEL.target);
            WHEEL.rafId = 0;
            WHEEL.moving = false;
            WHEEL.lastTs = 0;
            return;
        }

        WHEEL.rafId = requestAnimationFrame(wheelInertiaTick);
    }

    function siteScrollElementTopY(el) {
        if (!el || el.nodeType !== 1) return 0;
        const rect = el.getBoundingClientRect();
        const topDoc = rect.top + currentScrollY();
        const m = parseFloat(getComputedStyle(el).scrollMarginTop);
        const marginTop = Number.isFinite(m) ? m : 0;
        return Math.max(0, topDoc - marginTop);
    }

    function siteScrollToY(targetY, opts) {
        opts = opts || {};
        const maxY = maxScrollY();
        targetY = Math.max(0, Math.min(maxY, targetY));

        if (prefersReducedMotion()) {
            window.scrollTo(0, targetY);
            return Promise.resolve();
        }

        cancelActiveScroll();
        STATE.programmatic = true;

        const start = currentScrollY();
        const dist = Math.abs(targetY - start);
        if (dist < 1.5) {
            window.scrollTo(0, targetY);
            STATE.programmatic = false;
            return Promise.resolve();
        }

        const minD = opts.minDuration != null ? opts.minDuration : 340;
        const maxD = opts.maxDuration != null ? opts.maxDuration : 1550;
        const msPerPx = opts.msPerPx != null ? opts.msPerPx : 0.52;
        const duration = Math.min(maxD, Math.max(minD, dist * msPerPx));

        return new Promise(function (resolve) {
            const t0 = performance.now();

            function done() {
                STATE.programmatic = false;
                resolve();
            }

            function onInterrupt(ev) {
                if (ev.type === 'keydown') {
                    const k = ev.key;
                    if (
                        k !== 'ArrowUp' &&
                        k !== 'ArrowDown' &&
                        k !== 'PageUp' &&
                        k !== 'PageDown' &&
                        k !== 'Home' &&
                        k !== 'End' &&
                        k !== ' ' &&
                        k !== 'Spacebar'
                    ) {
                        return;
                    }
                }
                if (STATE.progRafId) {
                    cancelAnimationFrame(STATE.progRafId);
                    STATE.progRafId = 0;
                }
                detachInterrupt();
                stopWheelInertia();
                STATE.programmatic = false;
                resolve();
            }

            STATE.interrupt = onInterrupt;
            document.addEventListener('wheel', onInterrupt, STATE.wheelInterruptOpts);
            document.addEventListener('touchstart', onInterrupt, STATE.wheelInterruptOpts);
            document.addEventListener('keydown', onInterrupt, STATE.keyOpts);

            function step() {
                const elapsed = performance.now() - t0;
                const t = Math.min(1, elapsed / duration);
                const eased = easeInOutCubic(t);
                const y = start + (targetY - start) * eased;
                window.scrollTo(0, y);
                if (t < 1) {
                    STATE.progRafId = requestAnimationFrame(step);
                } else {
                    window.scrollTo(0, targetY);
                    STATE.progRafId = 0;
                    detachInterrupt();
                    done();
                }
            }

            STATE.progRafId = requestAnimationFrame(step);
        });
    }

    /**
     * Скролл к элементу: сначала контекст (правила), затем измерение после reflow.
     */
    function siteScrollToElement(el, opts) {
        if (!el || el.nodeType !== 1) {
            return Promise.resolve();
        }
        prepareRulesAnchor(el);
        return afterLayout(function () {
            return siteScrollToY(siteScrollElementTopY(el), opts);
        });
    }

    function resolveHashTarget(hash) {
        if (!hash || hash.length < 2) return null;
        let id;
        try {
            id = decodeURIComponent(hash.slice(1));
        } catch (e) {
            return null;
        }
        if (!id) return null;
        try {
            return document.getElementById(id) || null;
        } catch (e2) {
            return null;
        }
    }

    function applyLocationHashSmooth() {
        const el = resolveHashTarget(location.hash);
        if (!el) return;

        if (prefersReducedMotion()) {
            prepareRulesAnchor(el);
            afterLayout(function () {
                window.scrollTo(0, siteScrollElementTopY(el));
            });
            return;
        }

        siteScrollToElement(el);
    }

    function onDocumentClickCapture(ev) {
        if (ev.defaultPrevented || ev.button !== 0) return;
        if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return;

        const a = ev.target && ev.target.closest && ev.target.closest('a[href]');
        if (!a) return;
        if (a.hasAttribute('download')) return;
        if (a.target === '_blank') return;

        const href = a.getAttribute('href');
        if (!href || href.charAt(0) !== '#') return;
        if (href === '#') return;

        const el = resolveHashTarget(href);
        if (!el) return;

        ev.preventDefault();
        cancelActiveScroll();

        siteScrollToElement(el).then(function () {
            try {
                if (history.replaceState) {
                    history.replaceState(null, '', href);
                }
            } catch (e) {
                /* ignore */
            }

            if (typeof el.focus === 'function') {
                try {
                    if (!el.hasAttribute('tabindex')) {
                        el.setAttribute('tabindex', '-1');
                    }
                    el.focus({ preventScroll: true });
                } catch (e2) {
                    /* ignore */
                }
            }
        });
    }

    function init() {
        document.documentElement.classList.add('js-site-smooth-scroll');
        document.addEventListener('click', onDocumentClickCapture, true);
        window.addEventListener('load', applyLocationHashSmooth, { once: true });

        if (typeof PointerEvent !== 'undefined') {
            document.addEventListener(
                'pointerdown',
                function (e) {
                    if (e.button === 1) {
                        armMiddleAutoscroll(true);
                    }
                },
                true
            );
            document.addEventListener(
                'pointerup',
                function (e) {
                    if (e.button === 1) {
                        armMiddleAutoscroll(false);
                    }
                },
                true
            );
            document.addEventListener('pointercancel', function () {
                armMiddleAutoscroll(false);
            }, true);
        } else {
            document.addEventListener(
                'mousedown',
                function (e) {
                    if (e.button === 1) {
                        armMiddleAutoscroll(true);
                    }
                },
                true
            );
            document.addEventListener(
                'mouseup',
                function (e) {
                    if (e.button === 1) {
                        armMiddleAutoscroll(false);
                    }
                },
                true
            );
        }
        window.addEventListener('blur', function () {
            armMiddleAutoscroll(false);
        });

        if (!prefersReducedMotion()) {
            document.addEventListener('wheel', onWheelInertia, WHEEL.opts);
        }
    }

    window.siteScrollToY = siteScrollToY;
    window.siteScrollToElement = siteScrollToElement;
    window.siteScrollElementTopY = siteScrollElementTopY;
    window.siteScrollCancel = cancelActiveScroll;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

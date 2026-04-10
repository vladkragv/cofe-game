// ============================================
// RULES.JS - Функциональность страницы правил
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    setupRulesTabs();
});

function setupRulesTabs() {
    const ruleTabBtns = document.querySelectorAll('.rules-tab-btn');
    const rulesSections = document.querySelectorAll('.rules-section');

    ruleTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.dataset.tab;

            // Деактивировать все вкладки
            ruleTabBtns.forEach(b => b.classList.remove('active'));
            rulesSections.forEach(section => section.classList.remove('active'));

            // Активировать выбранную вкладку
            btn.classList.add('active');
            const activeSection = document.getElementById(`${tabName}-rules`);
            if (activeSection) {
                activeSection.classList.add('active');
            }
        });
    });
}

/**
 * Для якорей внутри «Подробных правил»: показать вкладку, иначе элемент в display:none — скролл не сработает.
 * Вызывается из js/smooth-scroll.js перед измерением позиции.
 * @param {Element | null} el
 */
window.sitePrepareRulesAnchorTarget = function (el) {
    if (!el || !el.nodeType) return;
    const detailed = document.getElementById('detailed-rules');
    if (!detailed) return;

    const isDetailedBlock = el === detailed || detailed.contains(el);
    if (!isDetailedBlock) return;
    if (detailed.classList.contains('active')) return;

    const ruleTabBtns = document.querySelectorAll('.rules-tab-btn');
    const rulesSections = document.querySelectorAll('.rules-section');

    ruleTabBtns.forEach((b) => b.classList.remove('active'));
    rulesSections.forEach((s) => s.classList.remove('active'));

    const detailedBtn = document.querySelector('.rules-tab-btn[data-tab="detailed"]');
    if (detailedBtn) {
        detailedBtn.classList.add('active');
    }
    detailed.classList.add('active');
};

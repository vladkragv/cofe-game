// ============================================
// RULES-LOADER.JS - Динамическая загрузка блоков правил
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    loadRulesBlocks();
});

function escapeHtmlAttr(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;');
}

function renderQuickRuleIcon(block) {
    if (block.iconSrc) {
        const src = escapeHtmlAttr(block.iconSrc);
        return `<img src="${src}" alt="" width="32" height="32" decoding="async">`;
    }
    if (block.icon) {
        return escapeHtmlAttr(block.icon);
    }
    return '';
}

function loadRulesBlocks() {
    const blocks = getQuickRuleBlocks();
    const container = document.querySelector('.key-points');
    
    if (!container || blocks.length === 0) {
        console.log('Контейнер не найден или блоков нет');
        return;
    }
    
    // Очистить существующее содержимое
    container.innerHTML = '';
    
    // Добавить блоки правил
    blocks.forEach((block, index) => {
        const pointItem = document.createElement('div');
        pointItem.className = 'point-item point-item--enter';
        // Плавная “очередь” появления блоков
        pointItem.style.animationDelay = `${index * 90}ms`;
        
        pointItem.innerHTML = `
            <div class="point-icon">${renderQuickRuleIcon(block)}</div>
            <h4>${block.title}</h4>
            <p>${block.text}</p>
        `;
        
        container.appendChild(pointItem);
    });
}

// Функция для динамического обновления блоков (например, после изменения данных)
function refreshRulesBlocks() {
    loadRulesBlocks();
}

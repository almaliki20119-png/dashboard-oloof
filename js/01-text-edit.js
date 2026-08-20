// ============================================================
// TEXT EDITING SYSTEM (نفس السابق)
// ============================================================
const TEXT_STORAGE_KEY = 'oloof_text_edits';
function loadTextEdits() {
    try {
        const saved = localStorage.getItem(TEXT_STORAGE_KEY);
        if (!saved) return;
        const edits = JSON.parse(saved);
        document.querySelectorAll('[data-editable="true"]').forEach(el => {
            const key = el.dataset.textKey || el.id || el.textContent.trim();
            if (edits[key] !== undefined && edits[key] !== '') {
                el.innerHTML = edits[key];
            }
        });
    } catch(e) {}
}
function saveTextEdits() {
    const edits = {};
    document.querySelectorAll('[data-editable="true"]').forEach(el => {
        const key = el.dataset.textKey || el.id || el.textContent.trim();
        edits[key] = el.innerHTML.trim();
    });
    try {
        localStorage.setItem(TEXT_STORAGE_KEY, JSON.stringify(edits));
        showToast('💾 تم حفظ النصوص');
    } catch(e) {}
}
function resetTextEdits() {
    if (!confirm('⚠️ هل تريد إعادة تعيين جميع النصوص إلى الأصلية؟')) return;
    localStorage.removeItem(TEXT_STORAGE_KEY);
    location.reload();
}
document.addEventListener('DOMContentLoaded', function() {
    loadTextEdits();
    document.querySelectorAll('[data-editable="true"]').forEach(el => {
        el.addEventListener('blur', saveTextEdits);
        el.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') { e.preventDefault(); this.blur(); }
        });
    });
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            saveTextEdits();
        }
    });
});


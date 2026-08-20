// ============================================================
// RESET
// ============================================================
function resetAllData() {
    if (!confirm('⚠️ هل أنت متأكد؟ سيتم مسح جميع البيانات.')) return;
    localStorage.removeItem(STORAGE_KEY);
    loadDefaultData();
    recalculateAll();
    showToast('↺ تم إعادة تعيين البيانات');
}

// ============================================================
// INIT
// ============================================================
window.onload = function() {
    if (!loadFullState()) loadDefaultData();
    loadFromSharedLink();
    recalculateAll();
    setTimeout(() => { renderQuarterlyChart(); renderCashFlow(); }, 300);
    showToast('🚀 تم تحميل الداشبورد مع جميع أشهر السنة وقوائم منسدلة لكل عقد في سجل التحصيل');
};
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && isPresentation) {
        togglePresentation(); // نفس وظيفة الخروج
    }
});

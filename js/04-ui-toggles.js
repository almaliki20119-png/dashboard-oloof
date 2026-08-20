// ============================================================
// CURRENCY, DARK MODE, PRESENTATION, SHARE, TOAST
// ============================================================
function formatNum(n) { return Math.round(n).toLocaleString('en-US'); }
function displayCurrency(num) {
    if (num === undefined || num === null || isNaN(num)) num = 0;
    const val = num * currencyRate;
    const symbol = currencyRate === 1 ? 'ر.س' : 'USD';
    return formatNum(val) + ' ' + symbol;
}
function toggleCurrency() {
    currencyRate = currencyRate === 1 ? 0.27 : 1;
    document.getElementById('currency-btn').innerHTML = currencyRate === 1 ? '🇸🇦 SAR' : '🇺🇸 USD';
    saveFullState();
    recalculateAll();
    showToast('💱 تم تبديل العملة');
}
function toggleDarkMode() {
    isDark = !isDark;
    document.getElementById('html-root').classList.toggle('dark');
    saveFullState();
    showToast(isDark ? '🌙 الوضع الليلي' : '☀️ الوضع النهاري');
}
function togglePresentation() {
    isPresentation = !isPresentation;
    const btn = document.getElementById('presentation-btn');
    if (isPresentation) {
        const activeTab = document.querySelector('.tab-content.active');
        if (activeTab) previousTab = activeTab.id.replace('content-', '');
        switchTab('overview', true);
        document.body.classList.add('presentation-mode');
        btn.textContent = '📋 خروج';
        btn.style.background = '#ef4444';
    } else {
        document.body.classList.remove('presentation-mode');
        switchTab(previousTab, true);
        btn.textContent = '📽️ عرض';
        btn.style.background = '#7c3aed';
    }
    showToast(isPresentation ? '📽️ وضع العرض التقديمي' : '📋 العودة للوضع العادي');
}
function shareLink() {
    const data = { revenues, expenses, contracts, pipeline, decisions };
    const json = JSON.stringify(data);
    const encoded = btoa(encodeURIComponent(json));
    if (encoded.length > 2000) {
        showToast('⚠️ البيانات كبيرة جداً للمشاركة عبر الرابط، استخدم تصدير Excel بدلاً من ذلك.');
        return;
    }
    const url = window.location.href.split('?')[0] + '?data=' + encoded;
    if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => showToast('🔗 تم نسخ الرابط')).catch(() => prompt('انسخ الرابط:', url));
    } else {
        prompt('انسخ الرابط:', url);
    }
}
function loadFromSharedLink() {
    const params = new URLSearchParams(window.location.search);
    const dataParam = params.get('data');
    if (!dataParam) return;
    try {
        if (dataParam.length > 3000) {
            showToast('⚠️ الرابط يحتوي على بيانات كبيرة جداً، يرجى استخدام تحميل ملف Excel بدلاً من ذلك.');
            return;
        }
        const json = decodeURIComponent(atob(dataParam));
        const parsed = JSON.parse(json);
        if (parsed.revenues) {
            revenues = parsed.revenues;
            expenses = parsed.expenses;
            contracts = parsed.contracts || [];
            pipeline = parsed.pipeline || [];
            decisions = parsed.decisions || [];
            showToast('📥 تم تحميل البيانات من الرابط المشترك');
            recalculateAll();
            saveFullState();
        }
    } catch(e) {
        console.warn('فشل تحميل الرابط:', e);
        showToast('⚠️ الرابط غير صالح أو تالف.');
    }
}
function showToast(msg) {
    const el = document.getElementById('toast-message');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(el._timer);
    el._timer = setTimeout(() => el.classList.remove('show'), 3000);
}

// ============================================================
// HELPERS
// ============================================================
function sumMonths(row) {
    if (!row || !row.months) return 0;
    return row.months.slice(0, MONTHS_INDEX + 1).reduce((a, b) => a + (Number(b) || 0), 0);
}
function getStatus(rem) { return rem <= 0 ? 'مكتمل' : 'مستحق'; }
function getBadge(status) {
    if (status === 'مكتمل') return 'badge-green';
    if (status === 'متأخر') return 'badge-red';
    return 'badge-yellow';
}

// ============================================================
// TAB SWITCHING
// ============================================================
function switchTab(name, force = false) {
    if (isPresentation && !force) return;
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    const content = document.getElementById('content-' + name);
    const btn = document.getElementById('tab-' + name);
    if (content) content.classList.add('active');
    if (btn) btn.classList.add('active');
    if (name === 'analytics') setTimeout(renderQuarterlyChart, 100);
    if (name === 'cashflow') renderCashFlow();
}


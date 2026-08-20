// ============================================================
// ALERTS
// ============================================================
function generateAlerts() {
    const alerts = [];
    const totalRev = revenues.reduce((s, r) => s + sumMonths(r), 0);
    const totalRevBudget = revenues.reduce((s, r) => s + (Number(r.budget)||0), 0);
    const totalExp = expenses.reduce((s, r) => s + sumMonths(r), 0);
    const totalExpBudget = expenses.reduce((s, r) => s + (Number(r.budget)||0), 0);
    const profit = totalRev - totalExp;
    const target = 1558178;
    const margin = totalRev > 0 ? (profit / totalRev * 100) : 0;
    expenses.forEach(r => {
        const used = sumMonths(r);
        const pct = Number(r.budget) > 0 ? (used / Number(r.budget) * 100) : 0;
        if (pct > 80) alerts.push({ type: 'warning', msg: `⚠️ بند المصروف "${r.name}" استهلك ${pct.toFixed(1)}% من ميزانيته.` });
        if (pct > 95) alerts.push({ type: 'critical', msg: `🔴 بند المصروف "${r.name}" استهلك ${pct.toFixed(1)}% من ميزانيته.` });
    });
    if (margin < 30 && totalRev > 0) alerts.push({ type: 'critical', msg: `🔴 هامش الربح منخفض (${margin.toFixed(1)}%)، يوصى بمراجعة التكاليف.` });
    if (margin > 50 && totalRev > 0) alerts.push({ type: 'info', msg: `✅ هامش الربح ممتاز (${margin.toFixed(1)}%).` });
    if (profit < target * 0.5 && totalRev > 0) alerts.push({ type: 'warning', msg: `⚠️ الربح المحقق (${displayCurrency(profit)}) أقل من 50% من الهدف.` });
    contracts.forEach(c => {
        const payments = c.payments || [];
        payments.forEach(p => {
            if (!p.paid && p.dueDate) {
                const due = new Date(p.dueDate);
                const now = new Date();
                if (due < now) {
                    alerts.push({ type: 'warning', msg: `📅 دفعة عقد "${c.name}" (${c.investor||''}) مستحقة في ${p.dueDate} بقيمة ${displayCurrency(p.amount)} لم تُدفع بعد.` });
                }
            }
        });
    });
    const overdueDecisions = decisions.filter(d => d.status !== 'مكتمل' && new Date(d.dueDate) < new Date());
    if (overdueDecisions.length > 0) alerts.push({ type: 'critical', msg: `📋 يوجد ${overdueDecisions.length} قرار متأخر.` });
    return alerts;
}

function renderAlerts() {
    const panel = document.getElementById('alert-panel');
    if (!panel) return;
    const alerts = generateAlerts();
    if (alerts.length === 0) { panel.innerHTML = ''; return; }
    panel.innerHTML = alerts.slice(0, 6).map(a => 
        `<div class="alert-item alert-${a.type} text-xs font-bold">${a.msg}</div>`
    ).join('');
    if (alerts.length > 6) panel.innerHTML += `<div class="text-xs text-slate-400 mt-1">+${alerts.length-6} تنبيهات أخرى</div>`;
}


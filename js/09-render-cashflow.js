// ============================================================
// CASHFLOW (لـ 12 شهراً)
// ============================================================
function renderCashFlow() {
    const tbody = document.getElementById('cashflow-body');
    if (!tbody) return;
    tbody.innerHTML = '';
    const totalRev = revenues.reduce((s, r) => s + sumMonths(r), 0);
    const totalExp = expenses.reduce((s, r) => s + sumMonths(r), 0);
    const count = MONTHS_INDEX + 1;
    const avgRev = count > 0 ? totalRev / count : 0;
    const avgExp = count > 0 ? totalExp / count : 0;
    let balance = 0;
    const monthNames = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    for (let i = 0; i < count; i++) {
        const rev = avgRev * (0.9 + (i * 0.02));
        const exp = avgExp * (0.95 + (i * 0.01));
        const net = rev - exp;
        balance += net;
        const tr = document.createElement('tr');
        tr.innerHTML = `<td class="p-3 font-bold">${monthNames[i]}</td><td class="p-3 text-emerald-600">${displayCurrency(rev)}</td><td class="p-3 text-blue-600">${displayCurrency(exp)}</td><td class="p-3 font-bold ${net>=0?'text-emerald-700':'text-rose-600'}">${displayCurrency(net)}</td><td class="p-3 font-bold text-slate-800">${displayCurrency(balance)}</td>`;
        tbody.appendChild(tr);
    }
}


// ============================================================
// OVERRIDE CASHFLOW (تعتمد على الدفعات الفعلية مع 12 شهراً)
// ============================================================
const originalRenderCashFlow = renderCashFlow;
renderCashFlow = function() {
    const tbody = document.getElementById('cashflow-body');
    if(!tbody) return;
    tbody.innerHTML = '';
    const now = new Date();
    let balance = 0;
    for(let i=0; i<12; i++){
        const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
        const rev = contractPaymentRows().filter(r => !r.c.payments[r.pi]?.paid && r.d && r.d.getFullYear() === d.getFullYear() && r.d.getMonth() === d.getMonth()).reduce((a,r) => a + r.due, 0);
        const exp = (expenses||[]).reduce((a,e) => a + (Number(e.months?.[Math.min(MONTHS_INDEX, (now.getMonth()+i) % 12)]) || 0), 0);
        const net = rev - exp;
        balance += net;
        const tr = document.createElement('tr');
        tr.innerHTML = `<td class="p-3 font-bold">${d.toLocaleDateString('ar-SA',{month:'long',year:'numeric'})}</td><td class="p-3 text-emerald-600">${displayCurrency(rev)}</td><td class="p-3 text-blue-600">${displayCurrency(exp)}</td><td class="p-3 font-bold ${net>=0?'text-emerald-700':'text-rose-600'}">${displayCurrency(net)}</td><td class="p-3 font-bold">${displayCurrency(balance)}</td>`;
        tbody.appendChild(tr);
    }
};


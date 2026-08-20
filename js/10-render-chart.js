// ============================================================
// QUARTERLY CHART
// ============================================================
function renderQuarterlyChart() {
    const ctx = document.getElementById('quarterlyChart');
    if (!ctx) return;
    const context = ctx.getContext('2d');
    if (quarterlyChart) { quarterlyChart.destroy(); quarterlyChart = null; }
    const months = Array.from({length: 12}, (_, i) => i);
    const revActual = months.map(m => revenues.reduce((s,r) => s + (Number(r.months?.[m])||0), 0));
    const qLabels = ['الربع الأول', 'الربع الثاني', 'الربع الثالث', 'الربع الرابع'];
    const qRev = [
        revActual.slice(0,3).reduce((a,b)=>a+b,0),
        revActual.slice(3,6).reduce((a,b)=>a+b,0),
        revActual.slice(6,9).reduce((a,b)=>a+b,0),
        revActual.slice(9,12).reduce((a,b)=>a+b,0)
    ];
    const totalBudget = revenues.reduce((s, r) => s + Number(r.budget), 0);
    const qBudgets = [totalBudget*0.30, totalBudget*0.25, totalBudget*0.20, totalBudget*0.25];
    safeSet('q1-actual', displayCurrency(qRev[0]));
    safeSet('q1-budget', 'ميزانية: ' + displayCurrency(qBudgets[0]));
    safeSet('q2-actual', displayCurrency(qRev[1]));
    safeSet('q2-budget', 'ميزانية: ' + displayCurrency(qBudgets[1]));
    safeSet('q3-actual', displayCurrency(qRev[2]));
    safeSet('q3-budget', 'ميزانية: ' + displayCurrency(qBudgets[2]));
    safeSet('q4-actual', displayCurrency(qRev[3]));
    safeSet('q4-budget', 'ميزانية: ' + displayCurrency(qBudgets[3]));

    quarterlyChart = new Chart(context, {
        type: 'bar',
        data: {
            labels: qLabels,
            datasets: [
                { label: 'الإيرادات الفعلية', data: qRev, backgroundColor: '#00a36c', borderRadius: 6 },
                { label: 'ميزانية الإيرادات', data: qBudgets, backgroundColor: '#94a3b8', borderRadius: 6 }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: true, position: 'top' } },
            scales: { y: { ticks: { callback: v => displayCurrency(v) } } }
        }
    });

    const totalDue = contracts.reduce((s, c) => s + (Number(c.due) - Number(c.collected)), 0);
    const totalCollected = contracts.reduce((s, c) => s + Number(c.collected), 0);
    const avgDaily = (MONTHS_INDEX + 1) > 0 ? totalCollected / ((MONTHS_INDEX + 1) * 30) : 1;
    const dso = avgDaily > 0 ? totalDue / avgDaily : 0;
    safeSet('analytics-dso', Math.round(dso) + ' يوم');
    const totalRevAll = revenues.reduce((s, r) => s + sumMonths(r), 0);
    const totalExpAll = expenses.reduce((s, r) => s + sumMonths(r), 0);
    const cnt = MONTHS_INDEX + 1;
    safeSet('analytics-avg-rev', displayCurrency(cnt > 0 ? totalRevAll / cnt : 0));
    safeSet('analytics-avg-exp', displayCurrency(cnt > 0 ? totalExpAll / cnt : 0));
}


// ============================================================
// COLLECTIONS V2 (مع قوائم منسدلة لكل عقد)
// ============================================================
function dateOnly(v){ const d=new Date(v); return isNaN(d)?null:new Date(d.getFullYear(),d.getMonth(),d.getDate()); }
function daysBetween(a,b){ return Math.max(0, Math.floor((b-a)/86400000)); }
function contractPaymentRows(){
    const today=dateOnly(new Date()); const rows=[];
    (contracts||[]).forEach((c,ci)=>{
        (c.payments||[]).forEach((p,pi)=>{
            const due=Number(p.amount)||0, d=dateOnly(p.dueDate), age=d&&d<today?daysBetween(d,today):0;
            const overdue=!p.paid && d && d<today;
            const next30=!p.paid && d && d>=today && daysBetween(today,d)<=30;
            rows.push({c,ci,pi,due,d,age,overdue,next30});
        });
    });
    return rows;
}

function renderCollectionAccordion() {
    const container = document.getElementById('collection-accordion');
    if (!container) return;
    container.innerHTML = '';
    if (!contracts || contracts.length === 0) {
        container.innerHTML = '<div class="text-center text-slate-400 py-6">لا توجد عقود لعرض دفعاتها</div>';
        return;
    }
    const today = dateOnly(new Date());
    contracts.forEach((c, ci) => {
        const payments = c.payments || [];
        if (payments.length === 0) return;
        const details = document.createElement('details');
        details.className = 'border border-slate-200 rounded-lg mb-3 p-2 bg-slate-50 dark:bg-slate-700 dark:border-slate-600';
        const summary = document.createElement('summary');
        summary.className = 'font-bold text-sm cursor-pointer hover:text-emerald-700 dark:hover:text-emerald-400';
        const totalPaid = payments.filter(p => p.paid).reduce((s, p) => s + Number(p.amount), 0);
        const totalDue = payments.reduce((s, p) => s + Number(p.amount), 0);
        const remaining = totalDue - totalPaid;
        summary.textContent = `${c.investor || 'مستثمر'} - ${c.name} (${payments.length} دفعة، المتبقي: ${displayCurrency(remaining)})`;
        details.appendChild(summary);
        const table = document.createElement('table');
        table.className = 'w-full text-xs text-right mt-2 border-collapse';
        table.innerHTML = `<thead><tr class="bg-slate-200 dark:bg-slate-600"><th class="p-1">التاريخ</th><th class="p-1">القيمة</th><th class="p-1">العمر</th><th class="p-1">الحالة</th><th class="p-1">الأولوية</th></tr></thead><tbody></tbody>`;
        const tbody = table.querySelector('tbody');
        payments.forEach((p, pi) => {
            const dueDate = p.dueDate ? new Date(p.dueDate) : null;
            const dueAmount = Number(p.amount) || 0;
            const age = dueDate && dueDate < today ? daysBetween(dueDate, today) : 0;
            const overdue = !p.paid && dueDate && dueDate < today;
            const next30 = !p.paid && dueDate && dueDate >= today && daysBetween(today, dueDate) <= 30;
            const status = p.paid ? 'مدفوعة' : (overdue ? 'متأخر' : (next30 ? 'قريب' : 'مستحق'));
            let priority = 'مجدولة';
            if (overdue) {
                if (age > 90) priority = 'حرج';
                else if (age > 60) priority = 'عالية';
                else priority = 'متوسطة';
            } else if (next30) {
                priority = 'قريبة';
            }
            const tr = document.createElement('tr');
            tr.className = 'border-b border-slate-100 dark:border-slate-600';
            tr.innerHTML = `
                <td class="p-1">${p.dueDate || '-'}</td>
                <td class="p-1 font-bold">${displayCurrency(dueAmount)}</td>
                <td class="p-1">${overdue ? age+' يوم' : '-'}</td>
                <td class="p-1"><span class="badge ${p.paid ? 'badge-green' : (overdue ? 'badge-red' : 'badge-yellow')}">${status}</span></td>
                <td class="p-1"><span class="px-2 py-1 rounded-full text-xs ${priority === 'حرج' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300' : priority === 'عالية' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300' : priority === 'متوسطة' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300' : priority === 'قريبة' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'}">${priority}</span></td>
            `;
            tbody.appendChild(tr);
        });
        details.appendChild(table);
        container.appendChild(details);
    });
}

function renderCollectionsV2() {
    const rows = contractPaymentRows();
    const today = dateOnly(new Date());
    const totalDue = rows.reduce((a,r)=>a+r.due,0);
    const collected = rows.filter(r=>r.c && r.c.payments[r.pi]?.paid).reduce((a,r)=>a+r.due,0);
    const overdue = rows.filter(r=>r.overdue).reduce((a,r)=>a+r.due,0);
    const next30 = rows.filter(r=>r.next30).reduce((a,r)=>a+r.due,0);
    const rate = totalDue ? collected/totalDue*100 : 0;
    const daily = collected>0 ? collected/Math.max(30,((new Date().getMonth()+1)*30)) : 0;
    const dso = daily ? overdue/daily : 0;
    safeSet('col-total-due', displayCurrency(totalDue));
    safeSet('col-collected', displayCurrency(collected));
    safeSet('col-overdue', displayCurrency(overdue));
    safeSet('col-next30', displayCurrency(next30));
    safeSet('col-rate', rate.toFixed(1)+'%');
    safeSet('col-dso', Math.round(dso)+' يوم');

    const buckets = [
        ['غير مستحق', rows.filter(r=>!r.overdue&&r.d&&!r.next30).reduce((a,r)=>a+r.due,0)],
        ['1-30 يوم', rows.filter(r=>r.overdue&&r.age<=30).reduce((a,r)=>a+r.due,0)],
        ['31-60 يوم', rows.filter(r=>r.overdue&&r.age>30&&r.age<=60).reduce((a,r)=>a+r.due,0)],
        ['61-90 يوم', rows.filter(r=>r.overdue&&r.age>60&&r.age<=90).reduce((a,r)=>a+r.due,0)],
        ['أكثر من 90 يوم', rows.filter(r=>r.overdue&&r.age>90).reduce((a,r)=>a+r.due,0)]
    ];
    const max = Math.max(1,...buckets.map(x=>x[1]));
    const ab = document.getElementById('aging-bars');
    if(ab) ab.innerHTML = buckets.map(([n,v]) => `<div><div class="flex justify-between text-xs mb-1"><span>${n}</span><b>${displayCurrency(v)}</b></div><div class="h-2 bg-slate-100 rounded-full overflow-hidden"><div class="h-full bg-emerald-600" style="width:${Math.min(100,v/max)}%"></div></div></div>`).join('');

    const alertsContainer = document.getElementById('collection-alerts');
    if(alertsContainer) {
        const urgent = rows.filter(r=>r.overdue).sort((a,b)=>b.age-a.age).slice(0,5);
        alertsContainer.innerHTML = urgent.length ? urgent.map(r => `<div class="p-3 rounded-xl bg-rose-50 border border-rose-100 text-xs"><b>${r.c.name}</b>، ${displayCurrency(r.due)}، متأخرة ${r.age} يوم</div>`).join('') : `<div class="p-4 rounded-xl bg-emerald-50 text-emerald-700 text-sm">لا توجد دفعات متأخرة حاليًا.</div>`;
    }

    renderCollectionAccordion();
    renderContractCashForecast();
}

function renderContractCashForecast() {
    const el = document.getElementById('contract-cash-forecast');
    if(!el) return;
    el.innerHTML = '';
    const now = new Date();
    for(let i=0; i<6; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
        const amount = contractPaymentRows().filter(r => !r.c.payments[r.pi]?.paid && r.d && r.d.getFullYear() === d.getFullYear() && r.d.getMonth() === d.getMonth()).reduce((a,r) => a + r.due, 0);
        const div = document.createElement('div');
        div.className = 'bg-white/10 rounded-xl p-3';
        div.innerHTML = `<div class="text-xs text-slate-300">${d.toLocaleDateString('ar-SA',{month:'short'})}</div><div class="font-black mt-1">${displayCurrency(amount)}</div>`;
        el.appendChild(div);
    }
}

function renderContractRevenueForecast() {
    let annual = 0;
    (contracts||[]).forEach(c => { if(Number(c.annualRevenue) > 0) annual += Number(c.annualRevenue); });
    const el = document.getElementById('kpi-contract-revenue-forecast');
    if (el) el.textContent = displayCurrency(annual);
}


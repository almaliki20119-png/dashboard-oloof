// ============================================================
// EXECUTIVE SUMMARY
// ============================================================
function getContractMetrics() {
    const now = new Date(); now.setHours(0,0,0,0);
    const in30 = new Date(now); in30.setDate(in30.getDate()+30);
    let contractValue=0, collected=0, overdue=0, due30=0, active=0;
    const rows=[];
    contracts.forEach((c,i)=>{
        const payments = Array.isArray(c.payments)?c.payments:[];
        const value = Number(c.value)||payments.reduce((s,p)=>s+(Number(p.amount)||0),0);
        const paid = payments.filter(p=>p.paid).reduce((s,p)=>s+(Number(p.amount)||0),0);
        contractValue += value; collected += paid;
        const end = c.endDate ? new Date(c.endDate) : null;
        if(end && end >= now) active++;
        let cOver=0, cNext=0;
        payments.forEach(p=>{
            if(p.paid || !p.dueDate) return;
            const d=new Date(p.dueDate); d.setHours(0,0,0,0);
            const amount=Number(p.amount)||0;
            if(d < now) cOver += amount;
            else if(d <= in30) cNext += amount;
        });
        overdue += cOver; due30 += cNext;
        rows.push({name:c.name||c.investor||('عقد '+(i+1)),value,paid,remaining:Math.max(0,value-paid),overdue:cOver,next:cNext});
    });
    return {contractValue,collected,overdue,due30,active:active||contracts.length,rows,collectionRate:contractValue>0?collected/contractValue*100:0};
}

function renderExecutiveSummary() {
    const totalRev = revenues.reduce((s,r)=>s+sumMonths(r),0);
    const totalRevBudget = revenues.reduce((s,r)=>s+(Number(r.budget)||0),0);
    const totalExp = expenses.reduce((s,r)=>s+sumMonths(r),0);
    const totalExpBudget = expenses.reduce((s,r)=>s+(Number(r.budget)||0),0);
    const profit = totalRev-totalExp;
    const achievement = totalRevBudget>0 ? totalRev/totalRevBudget*100 : 0;
    const elapsed = Math.max(1, Math.min(12, MONTHS_INDEX+1));
    const forecast = totalRev/elapsed*12;
    const cm=getContractMetrics();
    const netCash=cm.collected-totalExp;
    const year=new Date().getFullYear();
    safeSet('exec-period', year);
    safeSet('exec-revenue', displayCurrency(totalRev)); safeSet('exec-revenue-budget', formatNum(totalRevBudget));
    safeSet('exec-achievement', achievement.toFixed(1)+'%');
    safeSet('exec-expenses', displayCurrency(totalExp)); safeSet('exec-expenses-budget', formatNum(totalExpBudget));
    const profitEl=document.getElementById('exec-profit'); if(profitEl){profitEl.textContent=(profit>=0?'+':'')+displayCurrency(profit); profitEl.className='value '+(profit>=0?'text-emerald-700':'text-red-700');}
    safeSet('exec-collected', displayCurrency(cm.collected)); safeSet('exec-overdue', displayCurrency(cm.overdue));
    const achStatus=document.getElementById('exec-achievement-status');
    if(achStatus){achStatus.textContent=achievement>=100?'تم تحقيق الهدف':achievement>=80?'على المسار':'تحت المستهدف'; achStatus.className='exec-status '+(achievement>=100?'green':achievement>=80?'amber':'red');}
    safeSet('exec-forecast', displayCurrency(forecast)); safeSet('exec-forecast-target', displayCurrency(totalRevBudget));
    const fStatus=document.getElementById('exec-forecast-status');
    if(fStatus){const r=totalRevBudget?forecast/totalRevBudget*100:0;fStatus.textContent=r>=100?'متوقع تحقيق الهدف':r>=80?'يحتاج متابعة':'غير متوقع تحقيق الهدف';fStatus.className='exec-status '+(r>=100?'green':r>=80?'amber':'red');}
    const os=document.getElementById('exec-overdue-status'); if(os){os.textContent=cm.overdue>0?'يحتاج متابعة':'لا يوجد متأخرات';os.className='exec-status '+(cm.overdue>0?'red':'green');}
    safeSet('exec-contract-count', contracts.length); safeSet('exec-contract-value', displayCurrency(cm.contractValue)); safeSet('exec-collection-rate', cm.collectionRate.toFixed(1)+'%'); safeSet('exec-next30', displayCurrency(cm.due30));
    safeSet('exec-cash-in', displayCurrency(cm.collected)); safeSet('exec-cash-out', displayCurrency(totalExp)); safeSet('exec-net-cash', (netCash>=0?'+':'')+displayCurrency(netCash)); safeSet('exec-due30', displayCurrency(cm.due30));
    const tbody=document.getElementById('exec-contracts-body');
    if(tbody){tbody.innerHTML=cm.rows.slice(0,5).map(r=>{const status=r.overdue>0?'<span class="exec-status red">متأخر</span>':r.remaining<=0?'<span class="exec-status green">محصل</span>':'<span class="exec-status amber">قائم</span>';return `<tr><td class="font-bold">${r.name}</td><td class="money">${displayCurrency(r.value)}</td><td class="money text-emerald-700">${displayCurrency(r.paid)}</td><td class="money">${displayCurrency(r.remaining)}</td><td>${status}</td></tr>`;}).join('')||'<tr><td colspan="5" class="text-center text-slate-400 py-6">لا توجد عقود</td></tr>';}
    const actions=[];
    if(cm.overdue>0) actions.push({type:'red',title:'تحصيل المتأخرات',desc:`يوجد ${displayCurrency(cm.overdue)} مستحق متأخر على العقود.`});
    if(cm.due30>0) actions.push({type:'blue',title:'الدفعات القادمة',desc:`توجد دفعات بقيمة ${displayCurrency(cm.due30)} مستحقة خلال 30 يومًا.`});
    const forecastRatio=totalRevBudget?forecast/totalRevBudget*100:100;
    if(forecastRatio<80) actions.push({type:'red',title:'خطر تحقيق الإيرادات',desc:'التوقع الحالي أقل من 80% من المستهدف السنوي، ويحتاج إلى إجراء إداري.'});
    else if(forecastRatio<100) actions.push({type:'amber',title:'متابعة تحقيق المستهدف',desc:'التوقع الحالي أقل من الميزانية السنوية، ويُنصح بمتابعة مصادر الإيرادات والفرص المؤكدة.'});
    const dOver=decisions.filter(d=>d.status!=='مكتمل' && d.dueDate && new Date(d.dueDate)<new Date()).length;
    if(dOver>0) actions.push({type:'amber',title:'قرارات متأخرة',desc:`يوجد ${dOver} قرار أو إجراء تجاوز تاريخ الاستحقاق.`});
    if(!actions.length) actions.push({type:'blue',title:'الوضع التنفيذي',desc:'لا توجد تنبيهات رئيسية تتطلب تدخلًا فوريًا وفق البيانات الحالية.'});
    const box=document.getElementById('exec-actions'); if(box) box.innerHTML=actions.slice(0,4).map(a=>`<div class="exec-action"><span class="exec-dot ${a.type}"></span><div><div class="font-black text-sm text-slate-800">${a.title}</div><div class="text-xs text-slate-500 mt-1">${a.desc}</div></div></div>`).join('');
}


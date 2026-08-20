// ============================================================
// PIPELINE, DECISIONS
// ============================================================
function renderPipeline() {
    const tbody = document.getElementById('pipeline-body');
    if (!tbody) return;
    tbody.innerHTML = '';
    let confirmed = 0, negotiation = 0, expected = 0, overdue = 0, total = 0;
    pipeline.forEach((p, i) => {
        const val = Number(p.value) || 0;
        const prob = Number(p.probability) || 0;
        const weighted = val * prob / 100;
        total += val;
        if (p.stage === 'مؤكد') confirmed += val;
        else if (p.stage === 'قيد التعاقد') negotiation += val;
        else if (p.stage === 'متوقع') expected += val;
        else overdue += val;
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="p-2"><input type="text" value="${p.name}" onchange="updatePipeline(${i},'name',this.value)" style="width:130px;"></td>
            <td class="p-2"><input type="number" value="${p.value}" onchange="updatePipeline(${i},'value',this.value)" style="width:70px;"></td>
            <td class="p-2"><select onchange="updatePipeline(${i},'stage',this.value)" style="width:100px;">${['مؤكد','قيد التعاقد','متوقع','متأخر'].map(s => `<option value="${s}" ${p.stage===s?'selected':''}>${s}</option>`).join('')}</select></td>
            <td class="p-2"><input type="number" value="${p.probability}" onchange="updatePipeline(${i},'probability',this.value)" style="width:50px;" min="0" max="100">%</td>
            <td class="p-2 font-bold text-purple-700">${formatNum(weighted)}</td>
            <td class="p-2 no-print"><button onclick="deletePipeline(${i})" class="text-red-500 font-bold">✕</button></td>
        `;
        tbody.appendChild(tr);
    });
    safeSet('p-confirmed', displayCurrency(confirmed));
    safeSet('p-negotiation', displayCurrency(negotiation));
    safeSet('p-expected', displayCurrency(expected));
    safeSet('p-overdue', displayCurrency(overdue));
    safeSet('p-total', displayCurrency(total));
}

function renderDecisions() {
    const tbody = document.getElementById('decisions-body');
    if (!tbody) return;
    tbody.innerHTML = '';
    let total = 0, done = 0, overdue = 0;
    decisions.forEach((d, i) => {
        total++;
        if (d.status === 'مكتمل') done++;
        else if (new Date(d.dueDate) < new Date()) overdue++;
        const badge = d.status === 'مكتمل' ? 'badge-green' : d.status === 'قيد التنفيذ' ? 'badge-blue' : 'badge-yellow';
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="p-2"><input type="text" value="${d.action}" onchange="updateDecision(${i},'action',this.value)" style="width:140px;"></td>
            <td class="p-2"><input type="text" value="${d.owner}" onchange="updateDecision(${i},'owner',this.value)" style="width:100px;"></td>
            <td class="p-2"><input type="date" value="${d.dueDate}" onchange="updateDecision(${i},'dueDate',this.value)"></td>
            <td class="p-2"><select onchange="updateDecision(${i},'status',this.value)" style="width:100px;">${['جديد','قيد التنفيذ','بانتظار قرار','مكتمل'].map(s => `<option value="${s}" ${d.status===s?'selected':''}>${s}</option>`).join('')}</select></td>
            <td class="p-2 no-print"><button onclick="deleteDecision(${i})" class="text-red-500 font-bold">✕</button></td>
        `;
        tbody.appendChild(tr);
    });
    safeSet('d-total', total);
    safeSet('d-done', done);
    safeSet('d-overdue', overdue);
}


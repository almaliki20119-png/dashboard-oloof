// ============================================================
// RENDER FUNCTIONS (الإيرادات والمصروفات - 12 شهراً)
// ============================================================
function renderRevenues() {
    const tbody = document.getElementById('rev-body');
    if (!tbody) return;
    tbody.innerHTML = '';
    let totals = Array(MONTHS_INDEX + 1).fill(0), grandTotal = 0, totalBudget = 0;
    revenues.forEach((row, i) => {
        const total = sumMonths(row);
        grandTotal += total;
        totalBudget += Number(row.budget) || 0;
        const tr = document.createElement('tr');
        let cells = `<td class="p-1 font-bold">${i+1}</td>`;
        cells += `<td class="p-1 text-right"><input type="text" value="${row.name}" onchange="updateRev(${i},'name',this.value)" style="width:120px;"></td>`;
        cells += `<td class="p-1"><input type="number" value="${row.budget}" onchange="updateRev(${i},'budget',this.value)" style="width:70px;"></td>`;
        for (let m = 0; m <= MONTHS_INDEX; m++) {
            cells += `<td class="p-1"><input type="number" value="${row.months[m] || 0}" onchange="updateRevMonth(${i},${m},this.value)" style="width:50px;"></td>`;
            totals[m] += Number(row.months[m]) || 0;
        }
        cells += `<td class="p-1 font-bold text-emerald-700">${formatNum(total)}</td>`;
        cells += `<td class="p-1"><input type="text" value="${row.note || ''}" onchange="updateRev(${i},'note',this.value)" style="width:100px;text-align:right;"></td>`;
        cells += `<td class="p-1 no-print"><button onclick="deleteRevenue(${i})" class="text-red-500 font-bold">✕</button></td>`;
        tr.innerHTML = cells;
        tbody.appendChild(tr);
    });
    safeSet('rev-total-budget', formatNum(totalBudget));
    totals.forEach((v, i) => { safeSet('rev-m'+(i+1), formatNum(v)); });
    safeSet('rev-grand-total', formatNum(grandTotal));
}

function renderExpenses() {
    const tbody = document.getElementById('exp-body');
    if (!tbody) return;
    tbody.innerHTML = '';
    let totals = Array(MONTHS_INDEX + 1).fill(0), grandTotal = 0, totalBudget = 0;
    expenses.forEach((row, i) => {
        const total = sumMonths(row);
        grandTotal += total;
        totalBudget += Number(row.budget) || 0;
        const tr = document.createElement('tr');
        let cells = `<td class="p-1 font-bold">${i+1}</td>`;
        cells += `<td class="p-1 text-right"><input type="text" value="${row.name}" onchange="updateExp(${i},'name',this.value)" style="width:120px;"></td>`;
        cells += `<td class="p-1"><input type="number" value="${row.budget}" onchange="updateExp(${i},'budget',this.value)" style="width:70px;"></td>`;
        for (let m = 0; m <= MONTHS_INDEX; m++) {
            cells += `<td class="p-1"><input type="number" value="${row.months[m] || 0}" onchange="updateExpMonth(${i},${m},this.value)" style="width:50px;"></td>`;
            totals[m] += Number(row.months[m]) || 0;
        }
        cells += `<td class="p-1 font-bold text-blue-700">${formatNum(total)}</td>`;
        cells += `<td class="p-1"><input type="text" value="${row.note || ''}" onchange="updateExp(${i},'note',this.value)" style="width:100px;text-align:right;"></td>`;
        cells += `<td class="p-1 no-print"><button onclick="deleteExpense(${i})" class="text-red-500 font-bold">✕</button></td>`;
        tr.innerHTML = cells;
        tbody.appendChild(tr);
    });
    safeSet('exp-total-budget', formatNum(totalBudget));
    totals.forEach((v, i) => { safeSet('exp-m'+(i+1), formatNum(v)); });
    safeSet('exp-grand-total', formatNum(grandTotal));
}


// ============================================================
// RENDER CONTRACTS (مع تفاصيل الدفعات)
// ============================================================
function renderContracts() {
    const tbody = document.getElementById('contract-body');
    if (!tbody) return;
    tbody.innerHTML = '';
    let totalVal = 0, totalDue = 0, totalCol = 0;

    contracts.forEach((c, i) => {
        recalculateContractTotalsDirect(c);
        const val = Number(c.value) || 0;
        const due = Number(c.due) || 0;
        const collected = Number(c.collected) || 0;
        totalVal += val;
        totalDue += due;
        totalCol += collected;
        const rem = Math.max(0, due - collected);
        const status = getStatus(rem);

        const payments = c.payments || [];
        const totalPayments = payments.length;
        const paidCount = payments.filter(p => p.paid === true).length;

        let paymentsHtml = '';
        if (totalPayments === 0) {
            paymentsHtml = '<span class="text-slate-400 text-xs">لا توجد دفعات</span>';
        } else {
            paymentsHtml = `
                <details class="contract-details">
                    <summary>عرض ${totalPayments} دفعة (${paidCount} مدفوعة)</summary>
                    <div class="mt-2 space-y-1">
            `;
            payments.forEach((p, pi) => {
                const isPaid = p.paid;
                const paidClass = isPaid ? 'paid' : 'unpaid';
                const label = isPaid ? '✅ مدفوعة' : '⏳ غير مدفوعة';
                paymentsHtml += `
                    <div class="payment-detail">
                        <span class="text-xs font-bold ml-1">#${pi+1}</span>
                        <input type="date" value="${p.dueDate || ''}" 
                               onchange="updatePaymentDate(${i}, ${pi}, this.value)" 
                               style="width:120px; padding:2px 4px; border:1px solid #d1d5db; border-radius:4px;">
                        <input type="number" value="${p.amount || 0}" 
                               onchange="updatePaymentAmount(${i}, ${pi}, this.value)" 
                               style="width:90px; padding:2px 4px; border:1px solid #d1d5db; border-radius:4px;" 
                               placeholder="المبلغ">
                        <button class="payment-toggle-btn ${paidClass}" onclick="togglePayment(${i}, ${pi})">
                            ${label}
                        </button>
                        <button onclick="removeSinglePayment(${i}, ${pi})" class="text-red-500 font-bold text-xs" title="حذف الدفعة">✕</button>
                    </div>
                `;
            });
            paymentsHtml += `
                    </div>
                    <div class="mt-2">
                        <button onclick="addSinglePayment(${i})" class="btn-action btn-sky text-xs">+ إضافة دفعة</button>
                    </div>
                </details>
            `;
        }

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="p-2"><input type="text" value="${c.investor || ''}" onchange="updateContract(${i},'investor',this.value)" style="width:120px;"></td>
            <td class="p-2"><input type="text" value="${c.name}" onchange="updateContract(${i},'name',this.value)" style="width:120px;"></td>
            <td class="p-2"><input type="number" value="${val}" onchange="updateContract(${i},'value',this.value)" style="width:70px;"></td>
            <td class="p-2"><input type="number" value="${due}" onchange="updateContract(${i},'due',this.value)" style="width:70px;"></td>
            <td class="p-2"><input type="number" value="${collected}" onchange="updateContract(${i},'collected',this.value)" style="width:70px;"></td>
            <td class="p-2 font-bold">${formatNum(rem)}</td>
            <td class="p-2"><input type="date" value="${c.signDate || ''}" onchange="updateContract(${i},'signDate',this.value)" style="width:110px;"></td>
            <td class="p-2"><input type="date" value="${c.endDate || ''}" onchange="updateContract(${i},'endDate',this.value)" style="width:110px;"></td>
            <td class="p-2" style="min-width:220px;">${paymentsHtml}</td>
            <td class="p-2"><span class="badge ${getBadge(status)}">${status}</span></td>
            <td class="p-2 no-print"><button onclick="deleteContract(${i})" class="text-red-500 font-bold">✕</button></td>
        `;
        tbody.appendChild(tr);
    });

    safeSet('c-total', displayCurrency(totalVal));
    safeSet('c-due', displayCurrency(totalDue));
    safeSet('c-collected', displayCurrency(totalCol));
    safeSet('c-remaining', displayCurrency(Math.max(0, totalDue - totalCol)));
}

// ============================================================
// PAYMENT FUNCTIONS (نفس السابق)
// ============================================================
function togglePayment(contractIndex, paymentIndex) {
    if (!contracts[contractIndex] || !contracts[contractIndex].payments) return;
    const p = contracts[contractIndex].payments[paymentIndex];
    if (!p) return;
    p.paid = !p.paid;
    recalculateContractTotals(contractIndex);
    recalculateAll();
    showToast('🔄 تم تحديث حالة الدفعة');
}

function updatePaymentDate(contractIndex, paymentIndex, newDate) {
    if (!contracts[contractIndex] || !contracts[contractIndex].payments) return;
    const p = contracts[contractIndex].payments[paymentIndex];
    if (!p) return;
    p.dueDate = newDate;
    recalculateAll();
    showToast('📅 تم تحديث تاريخ الدفعة');
}

function updatePaymentAmount(contractIndex, paymentIndex, newAmount) {
    if (!contracts[contractIndex] || !contracts[contractIndex].payments) return;
    const p = contracts[contractIndex].payments[paymentIndex];
    if (!p) return;
    p.amount = parseFloat(newAmount) || 0;
    recalculateContractTotals(contractIndex);
    recalculateAll();
    showToast('💰 تم تحديث قيمة الدفعة');
}

function addSinglePayment(contractIndex) {
    if (!contracts[contractIndex]) return;
    const payments = contracts[contractIndex].payments || [];
    const lastDate = payments.length > 0 ? payments[payments.length-1].dueDate : new Date().toISOString().slice(0,10);
    let nextDate = new Date(lastDate);
    nextDate.setMonth(nextDate.getMonth() + 1);
    const avgAmount = payments.length > 0 ? payments.reduce((sum, p) => sum + (Number(p.amount)||0), 0) / payments.length : 0;
    payments.push({ dueDate: nextDate.toISOString().slice(0,10), amount: Math.round(avgAmount), paid: false });
    recalculateContractTotals(contractIndex);
    recalculateAll();
    showToast('➕ تم إضافة دفعة جديدة');
}

function removeSinglePayment(contractIndex, paymentIndex) {
    if (!contracts[contractIndex]) return;
    const payments = contracts[contractIndex].payments || [];
    if (payments.length <= 1) {
        showToast('⚠️ لا يمكن حذف الدفعة الأخيرة');
        return;
    }
    payments.splice(paymentIndex, 1);
    recalculateContractTotals(contractIndex);
    recalculateAll();
    showToast('🗑️ تم حذف الدفعة');
}

function recalculateContractTotals(index) {
    const c = contracts[index];
    if (!c) return;
    recalculateContractTotalsDirect(c);
    c.value = c.due;
}


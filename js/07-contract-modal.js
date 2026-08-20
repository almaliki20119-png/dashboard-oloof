// ============================================================
// CONTRACT MODAL (نفس السابق)
// ============================================================
function openContractModal() {
    document.getElementById('add-contract-modal').classList.add('show');
    const today = new Date().toISOString().slice(0,10);
    document.getElementById('contract-sign-date').value = today;
    document.getElementById('contract-end-date').value = '';
    document.getElementById('contract-name').value = '';
    document.getElementById('contract-investor').value = '';
    document.getElementById('contract-value').value = '';
    document.getElementById('contract-payments-count').value = 4;
    if (document.getElementById('contract-annual-revenue')) document.getElementById('contract-annual-revenue').value = '';
    if (document.getElementById('contract-revenue-method')) document.getElementById('contract-revenue-method').value = 'straight';
    updatePaymentEstimate();
    generatePaymentPreview();
}

function closeContractModal() {
    document.getElementById('add-contract-modal').classList.remove('show');
}

function updatePaymentEstimate() {
    const val = parseFloat(document.getElementById('contract-value').value) || 0;
    const count = parseInt(document.getElementById('contract-payments-count').value) || 1;
    const est = count > 0 ? val / count : 0;
    document.getElementById('payment-estimate').value = formatNum(est) + ' ر.س';
}

function generatePaymentPreview() {
    const tbody = document.getElementById('payments-preview');
    if (!tbody) return;
    tbody.innerHTML = '';
    const count = parseInt(document.getElementById('contract-payments-count').value) || 1;
    const signDate = document.getElementById('contract-sign-date').value;
    const totalVal = parseFloat(document.getElementById('contract-value').value) || 0;
    const perPayment = count > 0 ? Math.round(totalVal / count) : 0;
    let startDate = signDate ? new Date(signDate) : new Date();
    for (let i = 0; i < count; i++) {
        const due = new Date(startDate);
        due.setMonth(due.getMonth() + i + 1);
        const dueStr = due.toISOString().slice(0,10);
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="p-2">${i+1}</td>
            <td class="p-2"><input type="date" class="payment-date" value="${dueStr}" style="width:130px;"></td>
            <td class="p-2"><input type="number" class="payment-amount" value="${perPayment}" style="width:80px;"></td>
            <td class="p-2"><input type="checkbox" class="payment-paid"></td>
            <td class="p-2"><span class="payment-due-status text-xs">${due < new Date() ? 'مستحقة' : 'غير مستحقة'}</span></td>
        `;
        tbody.appendChild(tr);
    }
    document.querySelectorAll('.payment-date').forEach(el => {
        el.addEventListener('change', function() {
            const row = this.closest('tr');
            const dateVal = this.value;
            const dueStatus = row.querySelector('.payment-due-status');
            if (dateVal) {
                const dueDate = new Date(dateVal);
                dueStatus.textContent = dueDate < new Date() ? 'مستحقة' : 'غير مستحقة';
            }
        });
    });
    document.getElementById('contract-value').addEventListener('input', function() {
        updatePaymentEstimate();
        generatePaymentPreview();
    });
    document.getElementById('contract-payments-count').addEventListener('input', function() {
        updatePaymentEstimate();
        generatePaymentPreview();
    });
}

function addPaymentRow() {
    const tbody = document.getElementById('payments-preview');
    if (!tbody) return;
    const rowCount = tbody.children.length;
    const tr = document.createElement('tr');
    const lastDate = tbody.lastChild ? tbody.lastChild.querySelector('.payment-date').value : new Date().toISOString().slice(0,10);
    let nextDate = new Date(lastDate);
    nextDate.setMonth(nextDate.getMonth() + 1);
    const dueStr = nextDate.toISOString().slice(0,10);
    const totalVal = parseFloat(document.getElementById('contract-value').value) || 0;
    const count = parseInt(document.getElementById('contract-payments-count').value) || 1;
    const perPayment = count > 0 ? Math.round(totalVal / count) : 0;
    tr.innerHTML = `
        <td class="p-2">${rowCount+1}</td>
        <td class="p-2"><input type="date" class="payment-date" value="${dueStr}" style="width:130px;"></td>
        <td class="p-2"><input type="number" class="payment-amount" value="${perPayment}" style="width:80px;"></td>
        <td class="p-2"><input type="checkbox" class="payment-paid"></td>
        <td class="p-2"><span class="payment-due-status text-xs">${nextDate < new Date() ? 'مستحقة' : 'غير مستحقة'}</span></td>
    `;
    tbody.appendChild(tr);
    document.getElementById('contract-payments-count').value = rowCount + 1;
    updatePaymentEstimate();
    tr.querySelector('.payment-date').addEventListener('change', function() {
        const row = this.closest('tr');
        const dateVal = this.value;
        const dueStatus = row.querySelector('.payment-due-status');
        if (dateVal) {
            const dueDate = new Date(dateVal);
            dueStatus.textContent = dueDate < new Date() ? 'مستحقة' : 'غير مستحقة';
        }
    });
}

function removePaymentRow() {
    const tbody = document.getElementById('payments-preview');
    if (!tbody || tbody.children.length <= 1) {
        showToast('⚠️ يجب أن يكون هناك دفعة واحدة على الأقل');
        return;
    }
    tbody.removeChild(tbody.lastChild);
    document.getElementById('contract-payments-count').value = tbody.children.length;
    updatePaymentEstimate();
}

document.getElementById('contract-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const investor = document.getElementById('contract-investor').value.trim();
    const name = document.getElementById('contract-name').value.trim();
    const signDate = document.getElementById('contract-sign-date').value;
    const endDate = document.getElementById('contract-end-date').value;
    if (!name) { showToast('⚠️ الرجاء إدخال اسم العقد'); return; }
    if (!signDate || !endDate) { showToast('⚠️ الرجاء إدخال تاريخ البداية والنهاية'); return; }

    const rows = document.querySelectorAll('#payments-preview tr');
    const payments = [];
    let totalValue = 0;
    rows.forEach(row => {
        const dateInput = row.querySelector('.payment-date');
        const amountInput = row.querySelector('.payment-amount');
        const paidCheck = row.querySelector('.payment-paid');
        if (dateInput && amountInput && paidCheck) {
            const amount = parseFloat(amountInput.value) || 0;
            totalValue += amount;
            payments.push({ dueDate: dateInput.value, amount: amount, paid: paidCheck.checked });
        }
    });
    if (payments.length === 0) { showToast('⚠️ يجب إضافة دفعة واحدة على الأقل'); return; }
    if (totalValue <= 0) { showToast('⚠️ يجب أن يكون مجموع الدفعات أكبر من صفر'); return; }

    const newContract = {
        investor: investor,
        name: name,
        value: totalValue,
        due: totalValue,
        collected: payments.filter(p => p.paid).reduce((sum, p) => sum + p.amount, 0),
        signDate: signDate,
        endDate: endDate,
        annualRevenue: parseFloat(document.getElementById('contract-annual-revenue')?.value) || 0,
        revenueMethod: document.getElementById('contract-revenue-method')?.value || 'straight',
        payments: payments,
        note: ''
    };
    contracts.push(newContract);
    closeContractModal();
    recalculateAll();
    showToast('✅ تم إضافة العقد بنجاح');
});


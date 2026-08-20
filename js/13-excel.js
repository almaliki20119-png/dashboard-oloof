// ============================================================
// EXPORT / IMPORT EXCEL (مع 12 شهراً)
// ============================================================
function exportExcel() {
    if (typeof XLSX === 'undefined') { alert('جاري تحميل مكتبة Excel... حاول مرة أخرى'); return; }
    const wb = XLSX.utils.book_new();
    const monthNames = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
    const revData = [['#', 'البند', 'الميزانية', ...monthNames, 'الإجمالي', 'ملاحظة']];
    revenues.forEach((r,i) => {
        const total = sumMonths(r);
        revData.push([i+1, r.name, r.budget, ...r.months.slice(0,12), total, r.note || '']);
    });
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(revData), 'الإيرادات');
    const expData = [['#', 'البند', 'الميزانية', ...monthNames, 'الإجمالي', 'ملاحظة']];
    expenses.forEach((r,i) => {
        const total = sumMonths(r);
        expData.push([i+1, r.name, r.budget, ...r.months.slice(0,12), total, r.note || '']);
    });
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(expData), 'المصروفات');
    const conData = [['المستثمر', 'العقد', 'القيمة الإجمالية', 'المستحق', 'المحصل', 'المتبقي', 'تاريخ التوقيع', 'تاريخ الانتهاء', 'تفاصيل الدفعات (التاريخ - القيمة - الحالة)', 'الحالة', 'ملاحظة']];
    contracts.forEach(c => {
        const rem = Math.max(0,c.due-c.collected);
        const payments = c.payments || [];
        const details = payments.map((p, idx) => `دفعة ${idx+1}: ${p.dueDate} - ${p.amount} ر.س - ${p.paid?'مدفوعة':'غير مدفوعة'}`).join('; ');
        conData.push([c.investor||'', c.name, c.value, c.due, c.collected, rem, c.signDate||'', c.endDate||'', details, rem<=0?'مكتمل':'مستحق', c.note||'']);
    });
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(conData), 'العقود');
    XLSX.writeFile(wb, 'Oloof_Dashboard_Full.xlsx');
    showToast('📊 تم تصدير Excel بنجاح');
}

function importExcel(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const json = XLSX.utils.sheet_to_json(sheet);
            if (json.length > 0 && json[0]['البند']) {
                const monthNames = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
                const newRevenues = json.map(row => ({
                    name: row['البند'] || 'بند',
                    budget: parseFloat(row['الميزانية']) || 0,
                    months: monthNames.map(m => parseFloat(row[m]) || 0),
                    note: row['ملاحظة'] || ''
                }));
                if (newRevenues.length > 0) revenues = newRevenues;
                recalculateAll();
                saveFullState();
                showToast('📂 تم استيراد البيانات من Excel');
            } else alert('تنسيق الملف غير متوافق');
        } catch(err) { alert('خطأ في قراءة الملف'); }
    };
    reader.readAsArrayBuffer(file);
    event.target.value = '';
}


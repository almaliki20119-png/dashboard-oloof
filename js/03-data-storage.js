// ============================================================
// SAFE DOM HELPER
// ============================================================
function safeSet(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

// ============================================================
// DEFAULT DATA (مع 12 شهراً)
// ============================================================
function loadDefaultData() {
    revenues = [
        { name: 'إيرادات عقود/ايجار', budget: 4879771, months: [1729771, 500000, 0, 0, 0, 1800000, 0, 850000, 0, 0, 0, 0], note: '' },
        { name: 'إيرادات متوقعة', budget: 2580000, months: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], note: '' }
    ];
    expenses = [
        { name: 'الرواتب والأجور', budget: 1994942, months: [80000, 80000, 80000, 153065, 80000, 80000, 80000, 0, 0, 0, 0, 0], note: '' },
        { name: 'الخدمات المهنية', budget: 1553985, months: [0, 0, 121074, 0, 37500, 138, 18522, 5000, 0, 0, 0, 0], note: '' },
        { name: 'المصاريف الإدارية', budget: 2052666, months: [0, 0, 11916, 0, 0, 17036, 200000, 0, 0, 0, 0, 0], note: '' },
        { name: 'مصاريف تشغيلية', budget: 300000, months: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], note: '' }
    ];
    contracts = [
        { 
            name: 'عقد المبنى الرئيسي', 
            investor: 'شركة الأفق العقارية',
            value: 2500000, 
            due: 2500000, 
            collected: 0,
            signDate: '2026-01-15',
            endDate: '2027-01-14',
            payments: [
                { dueDate: '2026-02-15', amount: 500000, paid: true },
                { dueDate: '2026-03-15', amount: 500000, paid: true },
                { dueDate: '2026-04-15', amount: 300000, paid: false },
                { dueDate: '2026-05-15', amount: 400000, paid: false },
                { dueDate: '2026-06-15', amount: 800000, paid: false }
            ],
            note: ''
        },
        { 
            name: 'عقد الفرع الثاني', 
            investor: 'مؤسسة الرياض التجارية',
            value: 1200000, 
            due: 1200000, 
            collected: 0,
            signDate: '2026-02-01',
            endDate: '2027-01-31',
            payments: [
                { dueDate: '2026-03-01', amount: 300000, paid: true },
                { dueDate: '2026-04-01', amount: 300000, paid: true },
                { dueDate: '2026-05-01', amount: 300000, paid: true },
                { dueDate: '2026-06-01', amount: 300000, paid: true }
            ],
            note: ''
        },
        { 
            name: 'عقد الصيانة', 
            investor: 'شركة الخدمات المتقنة',
            value: 450000, 
            due: 450000, 
            collected: 0,
            signDate: '2026-03-10',
            endDate: '2026-09-09',
            payments: [
                { dueDate: '2026-04-10', amount: 100000, paid: true },
                { dueDate: '2026-05-10', amount: 150000, paid: true },
                { dueDate: '2026-06-10', amount: 100000, paid: false },
                { dueDate: '2026-07-10', amount: 100000, paid: false }
            ],
            note: ''
        }
    ];
    contracts.forEach(c => recalculateContractTotalsDirect(c));
    pipeline = [
        { name: 'توسعة المبنى', value: 3000000, stage: 'قيد التعاقد', probability: 70 },
        { name: 'عقد المنطقة الشرقية', value: 1800000, stage: 'متوقع', probability: 40 },
        { name: 'تجديد العميل أ', value: 950000, stage: 'مؤكد', probability: 100 }
    ];
    decisions = [
        { action: 'مراجعة العقود المتأخرة', owner: 'مدير الاستثمار', dueDate: '2026-08-30', status: 'جديد' },
        { action: 'تحديث الميزانية', owner: 'المدير المالي', dueDate: '2026-08-15', status: 'قيد التنفيذ' },
        { action: 'تقرير الأداء', owner: 'فريق المالية', dueDate: '2026-08-25', status: 'جديد' }
    ];
}

function recalculateContractTotalsDirect(c) {
    const payments = c.payments || [];
    let totalCollected = 0;
    let totalDue = 0;
    payments.forEach(p => {
        const amount = Number(p.amount) || 0;
        totalDue += amount;
        if (p.paid) totalCollected += amount;
    });
    c.due = totalDue;
    c.collected = totalCollected;
    c.value = totalDue;
}

// ============================================================
// SAVE / LOAD
// ============================================================
function saveFullState() {
    const data = { revenues, expenses, contracts, pipeline, decisions, currencyRate, isDark };
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch(e) {}
}

function loadFullState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return false;
        const data = JSON.parse(raw);
        if (data.revenues) {
            revenues = data.revenues;
            expenses = data.expenses;
            contracts = data.contracts || [];
            pipeline = data.pipeline || [];
            decisions = data.decisions || [];
        }
        if (data.currencyRate !== undefined) currencyRate = data.currencyRate;
        if (data.isDark) { isDark = data.isDark; document.getElementById('html-root').classList.add('dark'); }
        return true;
    } catch(e) { return false; }
}


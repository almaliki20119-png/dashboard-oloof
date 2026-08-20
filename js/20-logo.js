// ============================================================
// COMPANY LOGO (رفع وحفظ شعار الشركة - يُخزَّن محلياً في المتصفح)
// ============================================================
const LOGO_STORAGE_KEY = 'oloof_company_logo';
const LOGO_MAX_WIDTH = 300; // px - تصغير الصورة قبل الحفظ لتفادي امتلاء مساحة التخزين المحلي

function uploadLogo(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
        showToast('⚠️ الرجاء اختيار ملف صورة صالح');
        event.target.value = '';
        return;
    }
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const scale = Math.min(1, LOGO_MAX_WIDTH / img.width);
            const canvas = document.createElement('canvas');
            canvas.width = Math.max(1, Math.round(img.width * scale));
            canvas.height = Math.max(1, Math.round(img.height * scale));
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/png');
            try {
                localStorage.setItem(LOGO_STORAGE_KEY, dataUrl);
                applyLogo(dataUrl);
                showToast('✅ تم حفظ الشعار بنجاح');
            } catch (err) {
                showToast('⚠️ تعذر حفظ الشعار - حاول بصورة أصغر حجماً');
            }
        };
        img.onerror = function() {
            showToast('⚠️ تعذر قراءة الصورة، جرّب ملفاً آخر');
        };
        img.src = e.target.result;
    };
    reader.onerror = function() {
        showToast('⚠️ فشل تحميل الملف');
    };
    reader.readAsDataURL(file);
    event.target.value = '';
}

function applyLogo(dataUrl) {
    const img = document.getElementById('company-logo-img');
    const text = document.getElementById('company-logo-text');
    const removeBtn = document.getElementById('remove-logo-btn');
    if (!img) return;
    img.src = dataUrl;
    img.style.display = 'block';
    if (text) text.style.display = 'none';
    if (removeBtn) removeBtn.style.display = 'inline-block';
}

function removeLogo() {
    if (!confirm('⚠️ هل تريد إزالة الشعار والعودة إلى الاسم النصي؟')) return;
    localStorage.removeItem(LOGO_STORAGE_KEY);
    const img = document.getElementById('company-logo-img');
    const text = document.getElementById('company-logo-text');
    const removeBtn = document.getElementById('remove-logo-btn');
    if (img) { img.src = ''; img.style.display = 'none'; }
    if (text) text.style.display = 'block';
    if (removeBtn) removeBtn.style.display = 'none';
    showToast('↺ تمت إزالة الشعار');
}

function loadLogo() {
    try {
        const saved = localStorage.getItem(LOGO_STORAGE_KEY);
        if (saved) applyLogo(saved);
    } catch (e) {}
}

// يُنفَّذ مباشرة لأن هذا الملف يُحمَّل في نهاية <body>، بعد وجود عناصر الشعار في DOM
loadLogo();

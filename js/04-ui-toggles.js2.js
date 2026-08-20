// ============================================================
// LOGO UPLOAD / RESET
// ============================================================
function uploadLogo() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(ev) {
            const base64 = ev.target.result;
            try {
                localStorage.setItem('customLogo', base64);
                document.getElementById('logo-image').src = base64;
                showToast('✅ تم رفع الشعار وحفظه');
            } catch(err) {
                showToast('⚠️ فشل حفظ الشعار: ' + err.message);
            }
        };
        reader.readAsDataURL(file);
    };
    input.click();
}

function resetLogo() {
    localStorage.removeItem('customLogo');
    const img = document.getElementById('logo-image');
    img.src = 'assets/logo.png';
    img.style.display = 'inline-block';
    showToast('↺ تم استعادة الشعار الافتراضي');
}

// استعادة الشعار المحفوظ عند تحميل الصفحة (يُستدعى في onload أو init)
function loadSavedLogo() {
    const saved = localStorage.getItem('customLogo');
    if (saved) {
        document.getElementById('logo-image').src = saved;
    }
}
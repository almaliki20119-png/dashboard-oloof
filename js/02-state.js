// ============================================================
// GLOBAL STATE - 12 شهراً
// ============================================================
const MONTHS_INDEX = 11;
const STORAGE_KEY = 'oloof_dashboard_pro_data';
let currencyRate = 1;
let isDark = false;
let isPresentation = false;
let previousTab = 'overview';
let quarterlyChart = null;

let revenues = [], expenses = [], contracts = [], pipeline = [], decisions = [];


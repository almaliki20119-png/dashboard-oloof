// ============================================================
// RECALCULATE ALL (مع تحديث جميع العناصر)
// ============================================================
function recalculateAll() {
    const totalRev = revenues.reduce((s, r) => s + sumMonths(r), 0);
    const totalRevBudget = revenues.reduce((s, r) => s + (Number(r.budget)||0), 0);
    const totalExp = expenses.reduce((s, r) => s + sumMonths(r), 0);
    const totalExpBudget = expenses.reduce((s, r) => s + (Number(r.budget)||0), 0);
    const profit = totalRev - totalExp;
    const targetProfit = 1558178;
    const savings = totalExpBudget - totalExp;
    const margin = totalRev > 0 ? (profit / totalRev * 100) : 0;
    const budgetAch = totalRevBudget > 0 ? (totalRev / totalRevBudget * 100) : 0;
    const activeContracts = contracts.filter(c => (Number(c.due) - Number(c.collected)) > 0).length;
    const totalContracts = contracts.length;
    const compRate = totalContracts > 0 ? ((totalContracts - activeContracts) / totalContracts * 100) : 0;
    const weightedPipe = pipeline.reduce((s, p) => s + (Number(p.value) * Number(p.probability) / 100), 0);

    // تحديث بطاقات KPI
    const kpiRev = document.getElementById('kpi-rev');
    if (kpiRev) kpiRev.innerHTML = displayCurrency(totalRev);
    const kpiRevBudget = document.getElementById('kpi-rev-budget');
    if (kpiRevBudget) kpiRevBudget.textContent = formatNum(totalRevBudget);
    const kpiRevPct = document.getElementById('kpi-rev-pct');
    if (kpiRevPct) kpiRevPct.textContent = budgetAch.toFixed(1) + '%';
    const kpiRevBar = document.getElementById('kpi-rev-bar');
    if (kpiRevBar) kpiRevBar.style.width = Math.min(budgetAch,100)+'%';

    const kpiExp = document.getElementById('kpi-exp');
    if (kpiExp) kpiExp.innerHTML = displayCurrency(totalExp);
    const kpiExpBudget = document.getElementById('kpi-exp-budget');
    if (kpiExpBudget) kpiExpBudget.textContent = formatNum(totalExpBudget);
    const expPct = totalExpBudget > 0 ? (totalExp/totalExpBudget*100) : 0;
    const kpiExpPct = document.getElementById('kpi-exp-pct');
    if (kpiExpPct) kpiExpPct.textContent = expPct.toFixed(1)+'%';
    const kpiExpBar = document.getElementById('kpi-exp-bar');
    if (kpiExpBar) kpiExpBar.style.width = Math.min(expPct,100)+'%';

    const kpiProfit = document.getElementById('kpi-profit');
    if (kpiProfit) kpiProfit.innerHTML = (profit>=0?'+':'') + displayCurrency(profit);
    const kpiProfitTarget = document.getElementById('kpi-profit-target');
    if (kpiProfitTarget) kpiProfitTarget.textContent = formatNum(targetProfit);
    const profitPct = targetProfit > 0 ? (profit/targetProfit*100) : 0;
    const kpiProfitPct = document.getElementById('kpi-profit-pct');
    if (kpiProfitPct) kpiProfitPct.textContent = profitPct.toFixed(1)+'%';
    const kpiProfitBar = document.getElementById('kpi-profit-bar');
    if (kpiProfitBar) kpiProfitBar.style.width = Math.min(Math.max(profitPct,0),100)+'%';

    const kpiMargin = document.getElementById('kpi-margin');
    if (kpiMargin) kpiMargin.textContent = margin.toFixed(1)+'%';
    const kpiMarginBar = document.getElementById('kpi-margin-bar');
    if (kpiMarginBar) kpiMarginBar.style.width = Math.min(margin,100)+'%';
    const kpiMarginStatus = document.getElementById('kpi-margin-status');
    if (kpiMarginStatus) kpiMarginStatus.textContent = margin>=50?'ممتاز':margin>=30?'جيد':'يحتاج تحسين';

    const kpiSavings = document.getElementById('kpi-savings');
    if (kpiSavings) kpiSavings.innerHTML = displayCurrency(savings);
    const savPct = totalExpBudget > 0 ? (savings/totalExpBudget*100) : 0;
    const kpiSavingsPct = document.getElementById('kpi-savings-pct');
    if (kpiSavingsPct) kpiSavingsPct.textContent = savPct.toFixed(1)+'%';
    const kpiSavingsBar = document.getElementById('kpi-savings-bar');
    if (kpiSavingsBar) kpiSavingsBar.style.width = Math.min(savPct,100)+'%';

    const kpiAchievement = document.getElementById('kpi-achievement');
    if (kpiAchievement) kpiAchievement.textContent = budgetAch.toFixed(1)+'%';
    const kpiAchievementBar = document.getElementById('kpi-achievement-bar');
    if (kpiAchievementBar) kpiAchievementBar.style.width = Math.min(budgetAch,100)+'%';
    const kpiAchievementStatus = document.getElementById('kpi-achievement-status');
    if (kpiAchievementStatus) kpiAchievementStatus.textContent = budgetAch>=100?'تم تحقيق الهدف':budgetAch>=80?'على المسار':'تحت المستهدف';

    const kpiActive = document.getElementById('kpi-active-contracts');
    if (kpiActive) kpiActive.textContent = activeContracts;
    const kpiTotal = document.getElementById('kpi-total-contracts');
    if (kpiTotal) kpiTotal.textContent = totalContracts;
    const kpiContractsRate = document.getElementById('kpi-contracts-rate');
    if (kpiContractsRate) kpiContractsRate.textContent = compRate.toFixed(1)+'%';
    const kpiContractsBar = document.getElementById('kpi-contracts-bar');
    if (kpiContractsBar) kpiContractsBar.style.width = Math.min(compRate,100)+'%';

    const kpiWeighted = document.getElementById('kpi-weighted-pipeline');
    if (kpiWeighted) kpiWeighted.innerHTML = displayCurrency(weightedPipe);
    const kpiPipelineCount = document.getElementById('kpi-pipeline-count');
    if (kpiPipelineCount) kpiPipelineCount.textContent = pipeline.length + ' فرصة';
    const remBudget = Math.max(0, totalRevBudget - totalRev);
    const coverage = remBudget > 0 ? (weightedPipe/remBudget*100) : 100;
    const kpiPipelineBar = document.getElementById('kpi-pipeline-bar');
    if (kpiPipelineBar) kpiPipelineBar.style.width = Math.min(coverage,100)+'%';

    // باقي الدوال
    renderRevenues();
    renderExpenses();
    renderContracts();
    renderPipeline();
    renderDecisions();
    renderCashFlow();
    renderQuarterlyChart();
    renderAlerts();
    renderExecutiveSummary();
    renderCollectionsV2();
    renderContractRevenueForecast();

    const progress = ((MONTHS_INDEX + 1) / 12) * 100;
    safeSet('annual-progress-text', progress.toFixed(0) + '%');
    const bar = document.getElementById('annual-progress-bar');
    if (bar) bar.style.width = progress + '%';

    saveFullState();
}


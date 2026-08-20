// ============================================================
// ADD / DELETE
// ============================================================
function addRevenue() { revenues.push({ name:'بند جديد', budget:0, months:Array(MONTHS_INDEX+1).fill(0), note:'' }); recalculateAll(); }
function deleteRevenue(i) { if(revenues.length<=1) return alert('لا يمكن حذف البند الأخير'); revenues.splice(i,1); recalculateAll(); }
function addExpense() { expenses.push({ name:'بند جديد', budget:0, months:Array(MONTHS_INDEX+1).fill(0), note:'' }); recalculateAll(); }
function deleteExpense(i) { if(expenses.length<=1) return alert('لا يمكن حذف البند الأخير'); expenses.splice(i,1); recalculateAll(); }
function deleteContract(i) { contracts.splice(i,1); recalculateAll(); }
function addPipeline() { pipeline.push({ name:'فرصة جديدة', value:0, stage:'متوقع', probability:50 }); recalculateAll(); }
function deletePipeline(i) { pipeline.splice(i,1); recalculateAll(); }
function addDecision() { decisions.push({ action:'إجراء جديد', owner:'', dueDate:'', status:'جديد' }); recalculateAll(); }
function deleteDecision(i) { decisions.splice(i,1); recalculateAll(); }


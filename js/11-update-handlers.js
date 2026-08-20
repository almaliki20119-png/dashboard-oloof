// ============================================================
// UPDATE FUNCTIONS
// ============================================================
function updateRev(i, f, v) {
    if (f === 'name') revenues[i].name = v;
    else if (f === 'budget') revenues[i].budget = parseFloat(v) || 0;
    else if (f === 'note') revenues[i].note = v;
    recalculateAll();
}
function updateRevMonth(i, m, v) { revenues[i].months[m] = parseFloat(v) || 0; recalculateAll(); }
function updateExp(i, f, v) {
    if (f === 'name') expenses[i].name = v;
    else if (f === 'budget') expenses[i].budget = parseFloat(v) || 0;
    else if (f === 'note') expenses[i].note = v;
    recalculateAll();
}
function updateExpMonth(i, m, v) { expenses[i].months[m] = parseFloat(v) || 0; recalculateAll(); }
function updateContract(i, f, v) {
    if (f === 'note') contracts[i].note = v;
    else contracts[i][f] = v;
    recalculateAll();
}
function updatePipeline(i, f, v) {
    if (f === 'probability') pipeline[i][f] = parseFloat(v) || 0;
    else pipeline[i][f] = v;
    recalculateAll();
}
function updateDecision(i, f, v) { decisions[i][f] = v; recalculateAll(); }


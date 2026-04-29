export function updateMonthlyPlan(dashboard, patch) {
  return {
    ...dashboard,
    monthlyPlan: { ...dashboard.monthlyPlan, ...patch },
  };
}

export function updateWeeklyFocus(dashboard, text) {
  return { ...dashboard, weeklyFocus: text };
}

import React from 'react';
import Card from '../../../components/common/Card';
import { incomeExpenseData } from '../../../data/ownerDashboardData';

/**
 * IncomeExpenseChart
 * Lightweight, zero-dependency SVG bar chart card displaying:
 * - Income = ৳1,650,000 (blue)
 * - Expenses = ৳620,000 (red)
 * - Monthly multi-period comparison
 */
function IncomeExpenseChart() {
  const { period, incomeLabel, expenseLabel, monthlyBreakdown } = incomeExpenseData;
  const maxVal = 1800000; // Normalization ceiling for bar heights

  return (
    <Card
      title={`Income vs Expenses (${period})`}
      actions={
        <div className="chart-card__header-summary">
          <div className="chart-summary-pill">
            <span className="chart-summary-pill__dot chart-summary-pill__dot--income" />
            <span>Income: {incomeLabel}</span>
          </div>
          <div className="chart-summary-pill">
            <span className="chart-summary-pill__dot chart-summary-pill__dot--expense" />
            <span>Expenses: {expenseLabel}</span>
          </div>
        </div>
      }
    >
      <div className="bar-chart-container">
        <div className="bar-chart-bars">
          {monthlyBreakdown.map((item) => {
            const incomeHeight = Math.round((item.income / maxVal) * 100);
            const expenseHeight = Math.round((item.expense / maxVal) * 100);

            return (
              <div key={item.month} className="bar-chart-group">
                <div className="bar-chart-pair">
                  <div
                    className="bar-item bar-item--income"
                    style={{ height: `${incomeHeight}%` }}
                    title={`${item.month} Income: ৳${item.income.toLocaleString()}`}
                  />
                  <div
                    className="bar-item bar-item--expense"
                    style={{ height: `${expenseHeight}%` }}
                    title={`${item.month} Expenses: ৳${item.expense.toLocaleString()}`}
                  />
                </div>
                <span className="bar-chart-label">{item.month}</span>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

export default IncomeExpenseChart;

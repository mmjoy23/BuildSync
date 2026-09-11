import React from 'react';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import Icon from '../../../components/common/Icon';
import StatusBadge from '../../../components/common/StatusBadge';
import { currentBillBreakdown } from '../../../data/tenantDashboardData';

/**
 * BillDetails
 * Card displaying the itemized receipt for the current month:
 * - Rent: ৳25,000
 * - Electricity: ৳3,200
 * - Water: ৳800
 * - Gas: ৳1,080
 * - Service Charge: ৳2,000
 * - Parking: ৳1,500
 * - Total: ৳33,580 (emphasized)
 * - Pay Now button
 */
function BillDetails({ onPayNow }) {
  const { month, items, total, dueDate } = currentBillBreakdown;

  return (
    <Card
      title={`Bill Details (${month})`}
      actions={<StatusBadge status="Unpaid" />}
    >
      <div className="bill-receipt-card">
        <div className="bill-receipt-list">
          {items.map((item, idx) => (
            <div key={idx} className="bill-receipt-row">
              <span className="bill-receipt-row__label">{item.label}</span>
              <span className="bill-receipt-row__amount">{item.amount}</span>
            </div>
          ))}
        </div>

        <div className="bill-receipt-total-row">
          <span className="bill-receipt-total-row__label">Total Due</span>
          <span className="bill-receipt-total-row__amount">{total}</span>
        </div>

        <div className="bill-receipt-footer">
          <span className="bill-receipt-due">
            ⚠️ Due by {dueDate}
          </span>
          <Button
            variant="primary"
            icon={<Icon name="credit-card" size={16} />}
            onClick={onPayNow}
          >
            Pay Now
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default BillDetails;

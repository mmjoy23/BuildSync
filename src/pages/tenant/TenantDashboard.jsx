import React, { useState } from 'react';
import TenantWelcomeHeader from './components/TenantWelcomeHeader';
import TenantSummaryCards from './components/TenantSummaryCards';
import BillDetails from './components/BillDetails';
import TenantRecentPayments from './components/TenantRecentPayments';
import TenantNotices from './components/TenantNotices';
import TenantQuickActions from './components/TenantQuickActions';
import TenantComplaints from './components/TenantComplaints';

// Reusable overlays from design system
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import FormGroup from '../../components/common/FormGroup';
import Input from '../../components/common/Input';
import Toast from '../../components/common/Toast';

import { tenantProfile, currentBillBreakdown } from '../../data/tenantDashboardData';

/**
 * TenantDashboard
 * Complete BuildSync Tenant Dashboard fulfilling all Phase 5 requirements:
 * 1. Welcome Header (Tanjim Ahmed, Flat 3A, ABC Residence + Call/Message Owner)
 * 2. Action Buttons & Four Summary Cards (Current Bill prominent, Last Payment, Parking Slot, Maintenance)
 * 3. Bill Details (September 2025 itemized receipt breakdown + Pay Now button)
 * 4. Recent Payments (date, amount, status badges, View All)
 * 5. Recent Notices (Water supply, Cleaning, Lift maintenance)
 * 6. Quick Actions (Make Payment, Raise Complaint, View Receipts, Send Message)
 * 7. My Complaints (#1023 Lift, #1018 Water leakage)
 */
export default function TenantDashboard() {
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setIsPayModalOpen(false);
    setToastMessage('Payment simulation processed. Receipt generated in your bills section.');
  };

  return (
    <div className="tenant-dashboard">
      {/* 1. WELCOME HEADER */}
      <TenantWelcomeHeader
        onMessageOwner={() => setToastMessage(`Opening message thread with ${tenantProfile.ownerName}...`)}
        onCallOwner={() => setToastMessage(`Calling ${tenantProfile.ownerName} (${tenantProfile.ownerPhone})...`)}
      />

      {/* 2. FOUR SUMMARY CARDS */}
      <TenantSummaryCards onPayNow={() => setIsPayModalOpen(true)} />

      {/* MAIN LAYOUT: LEFT SIDE (BILLS, PAYMENTS, ACTIONS) + RIGHT SIDE (NOTICES, COMPLAINTS) */}
      <div className="tenant-dashboard__main-layout">
        {/* LEFT COLUMN */}
        <div className="tenant-dashboard__content-area">
          {/* 3. BILL DETAILS */}
          <BillDetails onPayNow={() => setIsPayModalOpen(true)} />

          {/* 4. RECENT PAYMENTS */}
          <TenantRecentPayments />

          {/* 5. QUICK ACTIONS */}
          <TenantQuickActions
            onActionClick={(title) => {
              if (title === 'Make Payment') {
                setIsPayModalOpen(true);
              } else {
                setToastMessage(`Opening ${title}...`);
              }
            }}
          />
        </div>

        {/* RIGHT COLUMN */}
        <aside className="tenant-dashboard__side-panel">
          {/* 6. RECENT NOTICES */}
          <TenantNotices />

          {/* 7. MY COMPLAINTS */}
          <TenantComplaints />
        </aside>
      </div>

      {/* Interactive Pay Now Modal Placeholder */}
      <Modal
        isOpen={isPayModalOpen}
        onClose={() => setIsPayModalOpen(false)}
        title="Pay September Bill"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsPayModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handlePaymentSubmit}>
              Confirm Pay {currentBillBreakdown.total}
            </Button>
          </>
        }
      >
        <form onSubmit={handlePaymentSubmit}>
          <div style={{ background: 'var(--color-divider)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-4)' }}>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Bill for {currentBillBreakdown.month}</div>
            <div style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-primary)' }}>
              {currentBillBreakdown.total}
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
              Due: {currentBillBreakdown.dueDate}
            </div>
          </div>

          <FormGroup label="Payment Method" required>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-sm)' }}>
                <input type="radio" name="payMethod" defaultChecked /> Credit / Debit Card (Online)
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-sm)' }}>
                <input type="radio" name="payMethod" /> Bank Wire Transfer
              </label>
            </div>
          </FormGroup>

          <FormGroup label="Reference / Transaction Note">
            <Input placeholder="e.g. Sep 2025 Rent + Utilities" />
          </FormGroup>
        </form>
      </Modal>

      {/* Feedback Toast */}
      {toastMessage && (
        <Toast
          type="info"
          title="Tenant Portal"
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
}

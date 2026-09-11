import React, { useState } from 'react';
import OwnerDashboardHeader from './components/OwnerDashboardHeader';
import OwnerStatCards from './components/OwnerStatCards';
import IncomeExpenseChart from './components/IncomeExpenseChart';
import PropertyOverview from './components/PropertyOverview';
import RecentPayments from './components/RecentPayments';
import QuickActions from './components/QuickActions';
import RecentComplaints from './components/RecentComplaints';
import OwnerMessages from './components/OwnerMessages';
import QuickContact from './components/QuickContact';

// Overlays & Forms for interactive preview
import Modal from '../../components/common/Modal';
import FormGroup from '../../components/common/FormGroup';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import Toast from '../../components/common/Toast';
import { useAuth } from '../../context/AuthContext';

import { ownerProfile } from '../../data/ownerDashboardData';

/**
 * OwnerDashboard
 * Complete BuildSync Owner Dashboard reproducing the reference composition:
 * 1. Top Page Header
 * 2. Five KPI Cards
 * 3. Income vs Expenses Chart
 * 4. Property Overview Ring Chart
 * 5. Recent Payments Table
 * 6. Quick Actions Grid
 * 7. Recent Complaints Table
 * 8. Right-side Messages Panel
 * 9. Right-side Quick Contact Panel
 */
export default function OwnerDashboard() {
  const { currentUser } = useAuth();
  const [isAddPropertyOpen, setIsAddPropertyOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const handlePropertySubmit = (e) => {
    e.preventDefault();
    setIsAddPropertyOpen(false);
    setToastMessage('New property listing registered successfully.');
  };

  return (
    <div className="owner-dashboard">
      {/* 1. TOP PAGE HEADER */}
      <OwnerDashboardHeader
        name={currentUser?.name || ownerProfile.name}
        greeting={ownerProfile.greeting}
        subtitle={ownerProfile.subtitle}
        onAddProperty={() => setIsAddPropertyOpen(true)}
      />

      {/* 2. FIVE KPI CARDS */}
      <OwnerStatCards />

      {/* MAIN CONTENT + RIGHT SIDE PANEL GRID */}
      <div className="owner-dashboard__main-layout">
        {/* LEFT COLUMN: CHARTS, PAYMENTS, ACTIONS, COMPLAINTS */}
        <div className="owner-dashboard__content-area">
          {/* 3 & 4. CHARTS ROW: Income vs Expenses + Property Overview */}
          <div className="owner-charts-row">
            <IncomeExpenseChart />
            <PropertyOverview />
          </div>

          {/* 5. RECENT PAYMENTS */}
          <RecentPayments />

          {/* 6. QUICK ACTIONS */}
          <QuickActions
            onActionClick={(actionTitle) => {
              setToastMessage(`Navigating to ${actionTitle}...`);
            }}
          />

          {/* 7. RECENT COMPLAINTS */}
          <RecentComplaints />
        </div>

        {/* RIGHT COLUMN: MESSAGES & QUICK CONTACT */}
        <aside className="owner-dashboard__side-panel">
          {/* 8. MESSAGES */}
          <OwnerMessages />

          {/* 9. QUICK CONTACT */}
          <QuickContact
            onAction={(actionName) => {
              setToastMessage(`Triggered: ${actionName}`);
            }}
          />
        </aside>
      </div>

      {/* Interactive Add Property Modal */}
      <Modal
        isOpen={isAddPropertyOpen}
        onClose={() => setIsAddPropertyOpen(false)}
        title="Add New Property"
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsAddPropertyOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handlePropertySubmit}>
              Save Property
            </Button>
          </>
        }
      >
        <form onSubmit={handlePropertySubmit}>
          <FormGroup label="Property Name" required>
            <Input placeholder="e.g. Apex Bay Residency" required />
          </FormGroup>
          <FormGroup label="Address" required>
            <Input placeholder="Road 11, Banani, Dhaka" required />
          </FormGroup>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
            <FormGroup label="Total Units" required>
              <Input type="number" placeholder="24" required />
            </FormGroup>
            <FormGroup label="Property Type">
              <Select
                options={[
                  { value: 'residential', label: 'Residential' },
                  { value: 'commercial', label: 'Commercial' },
                  { value: 'mixed', label: 'Mixed-Use' },
                ]}
              />
            </FormGroup>
          </div>
        </form>
      </Modal>

      {/* Toast Notification */}
      {toastMessage && (
        <Toast
          type="info"
          title="Owner Dashboard Action"
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
}

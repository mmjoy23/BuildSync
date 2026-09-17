import React, { useEffect, useState } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/common/Card';
import StatCard from '../../components/common/StatCard';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import StatusBadge from '../../components/common/StatusBadge';
import Table from '../../components/tables/Table';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import { TenantModalActions } from './components/TenantPageTools';
import api from '../../services/api';

export default function TenantPayments() {
  const [payments, setPayments] = useState([]);
  const [selected, setSelected] = useState(null);
  const [receiptData, setReceiptData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPayments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.payments.getAll();
      const list = (res && res.data) ? res.data : (Array.isArray(res) ? res : []);
      setPayments(list);
    } catch (err) {
      setError(err.message || 'Failed to load payment history.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const viewReceipt = async (payment) => {
    setSelected(payment);
    setReceiptData(null);
    try {
      const res = await api.payments.getReceipt(payment.id);
      setReceiptData(res.data || res);
    } catch {
      // fallback to basic payment info
      setReceiptData(null);
    }
  };

  const totalPaid = payments
    .filter((p) => p.status === 'VERIFIED')
    .reduce((acc, p) => acc + Number(p.amount || 0), 0);
  const totalPending = payments
    .filter((p) => p.status === 'PENDING')
    .reduce((acc, p) => acc + Number(p.amount || 0), 0);

  const columns = [
    {
      key: 'id',
      label: 'Transaction ID',
      render: (val, row) => <strong>{row.transactionId || `PAY-${String(val).slice(0, 8).toUpperCase()}`}</strong>,
    },
    {
      key: 'paymentDate',
      label: 'Date',
      render: (val) => (val ? new Date(val).toLocaleDateString() : '—'),
    },
    {
      key: 'bill',
      label: 'Invoice',
      render: (_, row) => (
        <div>
          <span>{row.bill?.billingMonth || '—'}</span>
          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
            BS-{String(row.billId || '').slice(0, 8).toUpperCase()}
          </div>
        </div>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      align: 'right',
      render: (val) => <strong>৳{Number(val).toLocaleString()}</strong>,
    },
    { key: 'method', label: 'Method' },
    {
      key: 'status',
      label: 'Status',
      render: (value) => <StatusBadge status={value} />,
    },
    {
      key: 'actions',
      label: '',
      align: 'right',
      render: (_, row) => (
        <Button size="xs" variant="ghost" onClick={() => viewReceipt(row)}>
          Receipt / Details
        </Button>
      ),
    },
  ];

  return (
    <div className="tenant-page">
      <PageHeader
        title="Payments"
        description="Your payment history and official receipt records."
      />

      <div className="tenant-summary-grid">
        <StatCard
          title="Total Paid (Verified)"
          value={`৳${totalPaid.toLocaleString()}`}
          iconName="check-circle"
          iconColor="green"
        />
        <StatCard
          title="Pending Verification"
          value={`৳${totalPending.toLocaleString()}`}
          iconName="clock"
          iconColor="orange"
        />
        <StatCard
          title="Payment Records"
          value={payments.length}
          iconName="credit-card"
          iconColor="blue"
        />
        <StatCard
          title="Receipts Issued"
          value={payments.filter((p) => p.receiptNumber).length}
          iconName="file-text"
          iconColor="purple"
        />
      </div>

      {isLoading && <LoadingState label="Loading payment records..." />}

      {error && (
        <ErrorState
          title="Unable to load payments"
          message={error}
          onRetry={fetchPayments}
        />
      )}

      {!isLoading && !error && (
        <Card>
          {payments.length === 0 ? (
            <EmptyState
              title="No payment records"
              description="You have not submitted any payments yet."
            />
          ) : (
            <Table title="Payment History" columns={columns} data={payments} />
          )}
        </Card>
      )}

      {/* Payment / Receipt Details Modal */}
      <Modal
        isOpen={Boolean(selected)}
        onClose={() => setSelected(null)}
        title="Payment & Receipt Details"
        size="sm"
        footer={
          <TenantModalActions onCancel={() => setSelected(null)} submitLabel="Close" />
        }
      >
        <form onSubmit={(e) => { e.preventDefault(); setSelected(null); }}>
          {selected && (
            <div className="payment-detail-list">
              {[
                ['Receipt Number', receiptData?.receipt?.receiptNumber || selected.receiptNumber || 'None (Pending Verification)'],
                ['Status', selected.status],
                ['Amount', `৳${Number(selected.amount).toLocaleString()}`],
                ['Payment Method', selected.method],
                ['Transaction ID', selected.transactionId || 'N/A'],
                ['Payment Date', selected.paymentDate ? new Date(selected.paymentDate).toLocaleString() : '—'],
                ['Invoice Month', receiptData?.bill?.billingMonth || selected.bill?.billingMonth || '—'],
                ['Property', receiptData?.property?.name || '—'],
                ['Unit', receiptData?.unit?.unitNumber ? `Unit ${receiptData.unit.unitNumber}` : '—'],
                ['Remaining Balance', receiptData?.bill?.remainingBalance !== undefined ? `৳${Number(receiptData.bill.remainingBalance).toLocaleString()}` : '—'],
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid var(--color-border-subtle)', fontSize: 'var(--text-sm)' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>{label}</span>
                  <strong style={{ fontFamily: label.includes('Receipt') || label.includes('Amount') ? 'var(--font-mono)' : 'inherit' }}>{value}</strong>
                </div>
              ))}
            </div>
          )}
        </form>
      </Modal>
    </div>
  );
}

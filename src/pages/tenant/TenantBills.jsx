import React, { useEffect, useState } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/common/Card';
import StatCard from '../../components/common/StatCard';
import Button from '../../components/common/Button';
import Icon from '../../components/common/Icon';
import Modal from '../../components/common/Modal';
import StatusBadge from '../../components/common/StatusBadge';
import Table from '../../components/tables/Table';
import FormGroup from '../../components/common/FormGroup';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import { TenantFeedback, TenantModalActions } from './components/TenantPageTools';
import api from '../../services/api';

export default function TenantBills() {
  const [tab, setTab] = useState('all');
  const [bills, setBills] = useState([]);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Payment form state
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('BKASH');
  const [transactionId, setTransactionId] = useState('');
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);

  const fetchTenantBills = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.bills.getTenantBills();
      const list = (res && res.data) ? res.data : (Array.isArray(res) ? res : []);
      setBills(list);
    } catch (err) {
      setError(err.message || 'Failed to load invoices.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTenantBills();
  }, []);

  const openPayModal = (bill) => {
    setSelected(bill);
    setPaymentAmount(bill ? String(bill.totalAmount) : '');
    setPaymentMethod('BKASH');
    setTransactionId('');
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!selected) return;
    setIsSubmittingPayment(true);
    try {
      const payload = {
        billId: selected.id,
        amount: parseFloat(paymentAmount),
        method: paymentMethod,
      };
      if (['BKASH', 'NAGAD'].includes(paymentMethod)) {
        if (!transactionId.trim()) {
          throw new Error(`Transaction ID is required for ${paymentMethod}`);
        }
        payload.transactionId = transactionId.trim();
      } else if (transactionId.trim()) {
        payload.transactionId = transactionId.trim();
      }

      await api.payments.create(payload);
      setSelected(null);
      setFeedback('Payment record submitted successfully (Status: PENDING verification).');
      await fetchTenantBills();
    } catch (err) {
      setFeedback(`Payment submission failed: ${err.message}`);
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  const rows = bills.filter((b) => {
    if (tab === 'all') return true;
    if (tab === 'unpaid') return b.status === 'PENDING';
    return (b.status || '').toLowerCase() === tab;
  });

  // Authoritative calculations from backend data
  const pendingBills = bills.filter((b) => b.status === 'PENDING');
  const paidBills = bills.filter((b) => b.status === 'PAID');
  const currentDue = pendingBills.length > 0 ? Number(pendingBills[0].totalAmount) : 0;
  const totalPaid = paidBills.reduce((acc, b) => acc + Number(b.totalAmount || 0), 0);
  const totalOutstanding = pendingBills.reduce((acc, b) => acc + Number(b.totalAmount || 0), 0);

  const columns = [
    {
      key: 'id',
      label: 'Invoice ID',
      render: (value) => <strong>BS-{String(value).slice(0, 8).toUpperCase()}</strong>,
    },
    { key: 'billingMonth', label: 'Billing Month' },
    {
      key: 'totalAmount',
      label: 'Amount',
      align: 'right',
      render: (val) => <strong>৳{Number(val).toLocaleString()}</strong>,
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      render: (val) => (val ? new Date(val).toLocaleDateString() : '—'),
    },
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
        <Button
          size="xs"
          variant="ghost"
          onClick={() => openPayModal(row)}
        >
          {row.status === 'PENDING' ? 'View / Pay' : 'View'}
        </Button>
      ),
    },
  ];

  return (
    <div className="tenant-page">
      <PageHeader
        title="My Bills"
        description="Review your invoices and current household charges."
        actions={
          pendingBills.length > 0 && (
            <Button
              variant="primary"
              icon={<Icon name="credit-card" size={16} />}
              onClick={() => openPayModal(pendingBills[0])}
            >
              Pay Current Bill
            </Button>
          )
        }
      />

      <div className="tenant-summary-grid">
        <StatCard
          title="Current Due"
          value={`৳${currentDue.toLocaleString()}`}
          iconName="alert-circle"
          iconColor="red"
        />
        <StatCard
          title="Paid Invoices"
          value={`৳${totalPaid.toLocaleString()}`}
          iconName="check-circle"
          iconColor="green"
        />
        <StatCard
          title="Outstanding Balance"
          value={`৳${totalOutstanding.toLocaleString()}`}
          iconName="clock"
          iconColor="orange"
        />
        <StatCard
          title="Total Invoices"
          value={bills.length}
          iconName="calendar"
          iconColor="blue"
        />
      </div>

      {isLoading && <LoadingState label="Loading your bills from server..." />}

      {error && (
        <ErrorState
          title="Unable to load invoices"
          message={error}
          onRetry={fetchTenantBills}
        />
      )}

      {!isLoading && !error && (
        <Card>
          <div className="tenant-tabs">
            <button
              className={`owner-tab-btn ${tab === 'all' ? 'active' : ''}`}
              onClick={() => setTab('all')}
            >
              All ({bills.length})
            </button>
            <button
              className={`owner-tab-btn ${tab === 'unpaid' ? 'active' : ''}`}
              onClick={() => setTab('unpaid')}
            >
              Unpaid ({pendingBills.length})
            </button>
            <button
              className={`owner-tab-btn ${tab === 'paid' ? 'active' : ''}`}
              onClick={() => setTab('paid')}
            >
              Paid ({paidBills.length})
            </button>
          </div>

          {rows.length === 0 ? (
            <EmptyState
              title="No invoices found"
              description="You have no invoices in this view."
            />
          ) : (
            <Table title="Invoice History" columns={columns} data={rows} />
          )}
        </Card>
      )}

      {/* Invoice Details & Payment Modal */}
      <Modal
        isOpen={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={`Invoice BS-${String(selected?.id).slice(0, 8).toUpperCase()}`}
        size="md"
        footer={
          selected?.status === 'PENDING' ? (
            <TenantModalActions
              onCancel={() => setSelected(null)}
              submitLabel={isSubmittingPayment ? 'Submitting...' : 'Submit Payment'}
              disabled={isSubmittingPayment}
            />
          ) : (
            <Button variant="secondary" onClick={() => setSelected(null)}>
              Close
            </Button>
          )
        }
      >
        <form onSubmit={handlePaymentSubmit}>
          {selected && (
            <>
              <div className="invoice-detail-head" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
                <div>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Month: </span>
                  <strong>{selected.billingMonth}</strong>
                </div>
                <StatusBadge status={selected.status} />
              </div>

              <div className="invoice-detail-list" style={{ background: 'var(--color-surface-sunken)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)' }}>
                {(selected.items || []).map((item) => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', fontSize: 'var(--text-sm)' }}>
                    <span>{item.description || item.itemType}</span>
                    <strong>৳{Number(item.amount).toLocaleString()}</strong>
                  </div>
                ))}
                <hr style={{ margin: '8px 0', borderColor: 'var(--color-border)' }} />
                <div className="invoice-detail-total" style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                  <span>Total Bill Amount</span>
                  <strong style={{ color: 'var(--color-primary)' }}>৳{Number(selected.totalAmount).toLocaleString()}</strong>
                </div>
              </div>

              {selected.status === 'PENDING' && (
                <div style={{ marginTop: 'var(--space-4)' }}>
                  <h5 style={{ marginBottom: 'var(--space-2)' }}>Record Payment</h5>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)' }}>
                    <FormGroup label="Payment Method" required>
                      <Select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        options={[
                          { value: 'BKASH', label: 'bKash' },
                          { value: 'NAGAD', label: 'Nagad' },
                          { value: 'CASH', label: 'Cash' },
                          { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
                        ]}
                      />
                    </FormGroup>
                    <FormGroup label="Amount (৳)" required>
                      <Input
                        type="number"
                        step="0.01"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        required
                      />
                    </FormGroup>
                  </div>
                  {['BKASH', 'NAGAD'].includes(paymentMethod) && (
                    <FormGroup label="Transaction ID" required>
                      <Input
                        placeholder="e.g. TXN-94821"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        required
                      />
                    </FormGroup>
                  )}
                </div>
              )}
            </>
          )}
        </form>
      </Modal>

      <TenantFeedback message={feedback} onClose={() => setFeedback(null)} />
    </div>
  );
}

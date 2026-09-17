import React, { useEffect, useState } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/common/Card';
import StatCard from '../../components/common/StatCard';
import Button from '../../components/common/Button';
import Icon from '../../components/common/Icon';
import Select from '../../components/common/Select';
import FormGroup from '../../components/common/FormGroup';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import StatusBadge from '../../components/common/StatusBadge';
import Table from '../../components/tables/Table';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import { OwnerFeedback, OwnerFieldGrid, OwnerModalActions } from './components/OwnerPageTools';
import api from '../../services/api';

export default function OwnerBilling() {
  const [tab, setTab] = useState('all');
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [bills, setBills] = useState([]);
  const [leases, setLeases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [verifyingPaymentId, setVerifyingPaymentId] = useState(null);

  const [newBill, setNewBill] = useState({
    leaseId: '',
    billingMonth: new Date().toISOString().slice(0, 7),
    dueDate: new Date(Date.now() + 10 * 86400000).toISOString().slice(0, 10),
    rentAmount: '25000',
    serviceCharge: '2000',
    utilityAmount: '3000',
  });

  const fetchBillingData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [billsRes, leasesRes] = await Promise.all([
        api.bills.getAll(),
        api.leases.getAll({ status: 'ACTIVE' }),
      ]);
      const billList = (billsRes && billsRes.data) ? billsRes.data : (Array.isArray(billsRes) ? billsRes : []);
      const leaseList = (leasesRes && leasesRes.data) ? leasesRes.data : (Array.isArray(leasesRes) ? leasesRes : []);
      setBills(billList);
      setLeases(leaseList);
      if (leaseList.length > 0 && !newBill.leaseId) {
        setNewBill((prev) => ({ ...prev, leaseId: leaseList[0].id }));
      }
    } catch (err) {
      setError(err.message || 'Failed to load billing records.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBillingData();
  }, []);

  const handleGenerateBill = async (event) => {
    event.preventDefault();
    if (!newBill.leaseId || !newBill.billingMonth || !newBill.dueDate) return;
    setIsSubmitting(true);
    try {
      const items = [
        { type: 'RENT', description: 'Monthly Apartment Rent', amount: parseFloat(newBill.rentAmount) || 0 },
      ];
      if (parseFloat(newBill.serviceCharge) > 0) {
        items.push({ type: 'SERVICE_CHARGE', description: 'Building Service Charge', amount: parseFloat(newBill.serviceCharge) });
      }
      if (parseFloat(newBill.utilityAmount) > 0) {
        items.push({ type: 'ELECTRICITY', description: 'Utilities (Electricity/Water/Gas)', amount: parseFloat(newBill.utilityAmount) });
      }

      await api.bills.create({
        leaseId: newBill.leaseId,
        billingMonth: newBill.billingMonth,
        dueDate: newBill.dueDate,
        items,
      });

      setOpen(false);
      setFeedback(`Bill for ${newBill.billingMonth} created successfully.`);
      await fetchBillingData();
    } catch (err) {
      setFeedback(`Failed to generate bill: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyPayment = async (paymentId) => {
    setVerifyingPaymentId(paymentId);
    try {
      const res = await api.payments.verify(paymentId);
      setFeedback(res.message || 'Payment verified successfully!');
      if (selectedBill) {
        const updatedBillRes = await api.bills.getById(selectedBill.id);
        setSelectedBill(updatedBillRes.data || updatedBillRes);
      }
      await fetchBillingData();
    } catch (err) {
      setFeedback(`Verification failed: ${err.message}`);
    } finally {
      setVerifyingPaymentId(null);
    }
  };

  const rows = bills.filter((b) => {
    if (tab === 'all') return true;
    return (b.status || '').toLowerCase() === tab;
  });

  // Authoritative financial totals computed directly from backend data
  const totalExpected = bills.reduce((sum, b) => sum + Number(b.totalAmount || 0), 0);
  const totalPaid = bills.filter((b) => b.status === 'PAID').reduce((sum, b) => sum + Number(b.totalAmount || 0), 0);
  const totalPending = bills.filter((b) => b.status === 'PENDING').reduce((sum, b) => sum + Number(b.totalAmount || 0), 0);

  const columns = [
    {
      key: 'id',
      label: 'Invoice ID',
      render: (value) => <strong>BS-{String(value).slice(0, 8).toUpperCase()}</strong>,
    },
    {
      key: 'tenant',
      label: 'Tenant',
      render: (_, row) => (
        <div>
          <strong>{row.lease?.tenant?.name || '—'}</strong>
          <div className="table-subtext">
            {row.lease?.unit?.property?.name || 'Property'} · Unit {row.lease?.unit?.unitNumber || ''}
          </div>
        </div>
      ),
    },
    { key: 'billingMonth', label: 'Month' },
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
          onClick={async () => {
            try {
              const res = await api.bills.getById(row.id);
              setSelectedBill(res.data || res);
            } catch {
              setSelectedBill(row);
            }
          }}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="owner-page">
      <PageHeader
        title="Billing & Payments"
        description="Monitor invoices, collections, and overdue rent across your properties."
        actions={
          <Button
            variant="primary"
            icon={<Icon name="file-plus" size={16} />}
            onClick={() => setOpen(true)}
          >
            Generate Bills
          </Button>
        }
      />

      <div className="owner-summary-grid">
        <StatCard
          title="Total Invoiced"
          value={`৳${totalExpected.toLocaleString()}`}
          iconName="file-text"
          iconColor="blue"
        />
        <StatCard
          title="Collected"
          value={`৳${totalPaid.toLocaleString()}`}
          iconName="check-circle"
          iconColor="green"
        />
        <StatCard
          title="Outstanding"
          value={`৳${totalPending.toLocaleString()}`}
          iconName="clock"
          iconColor="orange"
        />
        <StatCard
          title="Total Invoices"
          value={bills.length}
          iconName="clipboard-list"
          iconColor="purple"
        />
      </div>

      {isLoading && <LoadingState label="Loading bills from server..." />}

      {error && (
        <ErrorState
          title="Unable to load invoices"
          message={error}
          onRetry={fetchBillingData}
        />
      )}

      {!isLoading && !error && (
        <Card>
          <div className="owner-tabs">
            <button
              className={`owner-tab-btn ${tab === 'all' ? 'active' : ''}`}
              onClick={() => setTab('all')}
            >
              All Invoices ({bills.length})
            </button>
            <button
              className={`owner-tab-btn ${tab === 'paid' ? 'active' : ''}`}
              onClick={() => setTab('paid')}
            >
              Paid
            </button>
            <button
              className={`owner-tab-btn ${tab === 'pending' ? 'active' : ''}`}
              onClick={() => setTab('pending')}
            >
              Pending
            </button>
          </div>

          {rows.length === 0 ? (
            <EmptyState
              title="No invoices found"
              description="There are no invoices matching this view."
              actionLabel="Generate Bills"
              onAction={() => setOpen(true)}
            />
          ) : (
            <Table title="Invoice Register" columns={columns} data={rows} />
          )}
        </Card>
      )}

      {/* Generate Bill Modal */}
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Generate Monthly Bill"
        size="md"
        footer={
          <OwnerModalActions
            onCancel={() => setOpen(false)}
            submitLabel={isSubmitting ? 'Generating...' : 'Generate Bill'}
            disabled={isSubmitting}
          />
        }
      >
        <form onSubmit={handleGenerateBill}>
          <OwnerFieldGrid>
            <FormGroup label="Select Active Lease" required>
              <Select
                value={newBill.leaseId}
                onChange={(e) => setNewBill({ ...newBill, leaseId: e.target.value })}
                options={leases.map((l) => ({
                  value: l.id,
                  label: `${l.unit?.property?.name || 'Building'} - Unit ${l.unit?.unitNumber} (${l.tenant?.name})`,
                }))}
              />
            </FormGroup>
            <FormGroup label="Billing Month (YYYY-MM)" required>
              <Input
                type="text"
                placeholder="2026-10"
                value={newBill.billingMonth}
                onChange={(e) => setNewBill({ ...newBill, billingMonth: e.target.value })}
                required
              />
            </FormGroup>
          </OwnerFieldGrid>

          <OwnerFieldGrid>
            <FormGroup label="Due Date (YYYY-MM-DD)" required>
              <Input
                type="date"
                value={newBill.dueDate}
                onChange={(e) => setNewBill({ ...newBill, dueDate: e.target.value })}
                required
              />
            </FormGroup>
            <FormGroup label="Rent Amount (৳)" required>
              <Input
                type="number"
                value={newBill.rentAmount}
                onChange={(e) => setNewBill({ ...newBill, rentAmount: e.target.value })}
                required
              />
            </FormGroup>
          </OwnerFieldGrid>

          <OwnerFieldGrid>
            <FormGroup label="Service Charge (৳)">
              <Input
                type="number"
                value={newBill.serviceCharge}
                onChange={(e) => setNewBill({ ...newBill, serviceCharge: e.target.value })}
              />
            </FormGroup>
            <FormGroup label="Utilities (৳)">
              <Input
                type="number"
                value={newBill.utilityAmount}
                onChange={(e) => setNewBill({ ...newBill, utilityAmount: e.target.value })}
              />
            </FormGroup>
          </OwnerFieldGrid>
          <p className="form-hint">The backend will securely calculate and verify authoritative invoice totals.</p>
        </form>
      </Modal>

      {/* View Bill Details & Payment Verification Modal */}
      <Modal
        isOpen={Boolean(selectedBill)}
        onClose={() => setSelectedBill(null)}
        title={`Invoice Details — BS-${String(selectedBill?.id).slice(0, 8).toUpperCase()}`}
        size="md"
        footer={
          <Button variant="secondary" onClick={() => setSelectedBill(null)}>
            Close
          </Button>
        }
      >
        {selectedBill && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
              <div>
                <h4>{selectedBill.lease?.tenant?.name}</h4>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
                  {selectedBill.lease?.unit?.property?.name} · Unit {selectedBill.lease?.unit?.unitNumber}
                </p>
              </div>
              <StatusBadge status={selectedBill.status} />
            </div>

            <h5 style={{ marginTop: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>Line Items</h5>
            <div style={{ background: 'var(--color-surface-sunken)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)' }}>
              {(selectedBill.items || []).map((item) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 'var(--text-sm)' }}>
                  <span>{item.description || item.itemType}</span>
                  <strong>৳{Number(item.amount).toLocaleString()}</strong>
                </div>
              ))}
              <hr style={{ margin: '8px 0', borderColor: 'var(--color-border)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-md)', fontWeight: 700 }}>
                <span>Total Amount:</span>
                <span style={{ color: 'var(--color-primary)' }}>৳{Number(selectedBill.totalAmount).toLocaleString()}</span>
              </div>
            </div>

            <h5 style={{ marginTop: 'var(--space-4)', marginBottom: 'var(--space-2)' }}>Recorded Payments</h5>
            {(!selectedBill.payments || selectedBill.payments.length === 0) ? (
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>No payments recorded for this bill yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {selectedBill.payments.map((p) => (
                  <div
                    key={p.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: 'var(--space-2) var(--space-3)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                    }}
                  >
                    <div>
                      <div><strong>৳{Number(p.amount).toLocaleString()}</strong> · <small>{p.method}</small></div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                        Receipt: {p.receiptNumber || 'None (Pending)'} {p.transactionId ? `· Txn: ${p.transactionId}` : ''}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <StatusBadge status={p.status} />
                      {p.status === 'PENDING' && (
                        <Button
                          size="xs"
                          variant="primary"
                          loading={verifyingPaymentId === p.id}
                          onClick={() => handleVerifyPayment(p.id)}
                        >
                          Verify
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>

      <OwnerFeedback message={feedback} onClose={() => setFeedback(null)} />
    </div>
  );
}

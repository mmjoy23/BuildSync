import React, { useState } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/common/Card';
import StatCard from '../../components/common/StatCard';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import StatusBadge from '../../components/common/StatusBadge';
import Table from '../../components/tables/Table';
import { tenantPayments } from '../../data/tenantPortalData';
import { TenantModalActions } from './components/TenantPageTools';

export default function TenantPayments() {
	const [selected, setSelected] = useState(null); const columns = [{ key: 'id', label: 'Transaction ID', render: (value) => <strong>{value}</strong> }, { key: 'date', label: 'Date' }, { key: 'invoice', label: 'Invoice' }, { key: 'amount', label: 'Amount', align: 'right' }, { key: 'method', label: 'Method' }, { key: 'status', label: 'Status', render: (value) => <StatusBadge status={value} /> }, { key: 'actions', label: '', align: 'right', render: (_, row) => <Button size="xs" variant="ghost" onClick={() => setSelected(row)}>Details</Button> }];
	return <div className="tenant-page"><PageHeader title="Payments" description="Your payment history and receipt records." /><div className="tenant-summary-grid"><StatCard title="Total Paid" value="৳80,900" iconName="check-circle" iconColor="green" /><StatCard title="This Month" value="৳33,580" iconName="credit-card" iconColor="blue" /><StatCard title="Pending" value="৳33,580" iconName="clock" iconColor="orange" /><StatCard title="Failed" value="৳0" iconName="x-circle" iconColor="red" /></div><Card><Table title="Payment History" columns={columns} data={tenantPayments} /></Card><Modal isOpen={Boolean(selected)} onClose={() => setSelected(null)} title="Payment Details" size="sm" footer={<TenantModalActions onCancel={() => setSelected(null)} submitLabel="Close" />}><form onSubmit={(event) => { event.preventDefault(); setSelected(null); }}>{selected && <div className="payment-detail-list">{[['Transaction ID', selected.id], ['Invoice', selected.invoice], ['Amount', selected.amount], ['Date', `${selected.date} · 10:30 AM`], ['Payment Method', selected.method], ['Status', selected.status], ['Receipt Number', selected.receipt]].map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>}</form></Modal></div>;
}

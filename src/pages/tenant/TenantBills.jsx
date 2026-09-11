import React, { useState } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/common/Card';
import StatCard from '../../components/common/StatCard';
import Button from '../../components/common/Button';
import Icon from '../../components/common/Icon';
import Modal from '../../components/common/Modal';
import StatusBadge from '../../components/common/StatusBadge';
import Table from '../../components/tables/Table';
import { tenantBills } from '../../data/tenantPortalData';
import { TenantFeedback, TenantModalActions } from './components/TenantPageTools';

export default function TenantBills() {
	const [tab, setTab] = useState('all'); const [selected, setSelected] = useState(null); const [feedback, setFeedback] = useState(null);
	const rows = tab === 'all' ? tenantBills : tenantBills.filter((bill) => bill.status.toLowerCase() === tab);
	const columns = [{ key: 'id', label: 'Invoice ID', render: (value) => <strong>{value}</strong> }, { key: 'month', label: 'Billing Month' }, { key: 'amount', label: 'Amount', align: 'right' }, { key: 'dueDate', label: 'Due Date' }, { key: 'status', label: 'Status', render: (value) => <StatusBadge status={value} /> }, { key: 'actions', label: '', align: 'right', render: (_, row) => <Button size="xs" variant="ghost" onClick={() => setSelected(row)}>{row.status === 'Unpaid' ? 'View / Pay' : 'View'}</Button> }];
	return <div className="tenant-page"><PageHeader title="My Bills" description="Review your invoices and current household charges." actions={<Button variant="primary" icon={<Icon name="credit-card" size={16} />} onClick={() => setSelected(tenantBills[0])}>Pay Current Bill</Button>} /><div className="tenant-summary-grid"><StatCard title="Current Due" value="৳33,580" iconName="alert-circle" iconColor="red" /><StatCard title="Paid This Year" value="৳106,900" iconName="check-circle" iconColor="green" /><StatCard title="Outstanding" value="৳33,580" iconName="clock" iconColor="orange" /><StatCard title="Last Payment" value="৳28,500" iconName="calendar" iconColor="blue" /></div><Card><div className="tenant-tabs"><button className={tab === 'all' ? 'active' : ''} onClick={() => setTab('all')}>All</button><button className={tab === 'unpaid' ? 'active' : ''} onClick={() => setTab('unpaid')}>Unpaid</button><button className={tab === 'paid' ? 'active' : ''} onClick={() => setTab('paid')}>Paid</button><button className={tab === 'overdue' ? 'active' : ''} onClick={() => setTab('overdue')}>Overdue</button></div><Table title="Invoice History" columns={columns} data={rows} /></Card><Modal isOpen={Boolean(selected)} onClose={() => setSelected(null)} title="Invoice Details" size="md" footer={<TenantModalActions onCancel={() => setSelected(null)} submitLabel={selected?.status === 'Unpaid' ? 'Pay Now' : 'Close'} />}><form onSubmit={(event) => { event.preventDefault(); setSelected(null); setFeedback('Payment flow opened in frontend preview.'); }}>{selected && <><div className="invoice-detail-head"><div><span>{selected.id}</span><strong>{selected.month}</strong></div><StatusBadge status={selected.status} /></div><div className="invoice-detail-list">{selected.items.map(([label, amount]) => <div key={label}><span>{label}</span><strong>{amount}</strong></div>)}<div className="invoice-detail-total"><span>Total</span><strong>{selected.amount}</strong></div></div><p className="form-hint">Due date: {selected.dueDate}. Receipt download is available as a frontend placeholder.</p></>}</form></Modal><TenantFeedback message={feedback} onClose={() => setFeedback(null)} /></div>;
}

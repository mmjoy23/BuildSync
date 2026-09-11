import React, { useState } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/common/Card';
import StatCard from '../../components/common/StatCard';
import Button from '../../components/common/Button';
import Icon from '../../components/common/Icon';
import Select from '../../components/common/Select';
import FormGroup from '../../components/common/FormGroup';
import Modal from '../../components/common/Modal';
import StatusBadge from '../../components/common/StatusBadge';
import Table from '../../components/tables/Table';
import { billingOverview, invoicesList } from '../../data/ownerPortalData';
import { OwnerFeedback, OwnerFieldGrid, OwnerModalActions } from './components/OwnerPageTools';

export default function OwnerBilling() {
	const [tab, setTab] = useState('all');
	const [open, setOpen] = useState(false);
	const [feedback, setFeedback] = useState(null);
	const rows = tab === 'all' ? invoicesList : invoicesList.filter((invoice) => invoice.status.toLowerCase() === tab);
	const submit = (event) => { event.preventDefault(); setOpen(false); setFeedback('Bills generated for the selected month.'); };
	const columns = [
		{ key: 'id', label: 'Invoice ID', render: (value) => <strong>{value}</strong> },
		{ key: 'tenant', label: 'Tenant', render: (value, row) => <div><strong>{value}</strong><div className="table-subtext">{row.property} · {row.flat}</div></div> },
		{ key: 'month', label: 'Month' }, { key: 'amount', label: 'Amount', align: 'right' }, { key: 'dueDate', label: 'Due Date' },
		{ key: 'status', label: 'Status', render: (value) => <StatusBadge status={value} /> }, { key: 'actions', label: '', align: 'right', render: (_, row) => <Button size="xs" variant="ghost" onClick={() => setFeedback(`Invoice ${row.id} opened.`)}>View</Button> },
	];
	return <div className="owner-page">
		<PageHeader title="Billing & Payments" description="Monitor invoices, collections, and overdue rent across your properties." actions={<Button variant="primary" icon={<Icon name="file-plus" size={16} />} onClick={() => setOpen(true)}>Generate Bills</Button>} />
		<div className="owner-summary-grid"><StatCard title="Expected" value={billingOverview.expected} iconName="file-text" iconColor="blue" /><StatCard title="Collected" value={billingOverview.collected} iconName="check-circle" iconColor="green" /><StatCard title="Outstanding" value={billingOverview.outstanding} iconName="clock" iconColor="orange" /><StatCard title="Overdue" value={billingOverview.overdue} iconName="alert-circle" iconColor="red" /></div>
		<Card><div className="owner-tabs"><button className={`owner-tab-btn ${tab === 'all' ? 'active' : ''}`} onClick={() => setTab('all')}>All Invoices ({invoicesList.length})</button><button className={`owner-tab-btn ${tab === 'paid' ? 'active' : ''}`} onClick={() => setTab('paid')}>Paid</button><button className={`owner-tab-btn ${tab === 'pending' ? 'active' : ''}`} onClick={() => setTab('pending')}>Pending</button><button className={`owner-tab-btn ${tab === 'overdue' ? 'active' : ''}`} onClick={() => setTab('overdue')}>Overdue</button></div><Table title="Invoice Register" columns={columns} data={rows} /></Card>
		<Modal isOpen={open} onClose={() => setOpen(false)} title="Generate Monthly Bills" size="sm" footer={<OwnerModalActions onCancel={() => setOpen(false)} submitLabel="Generate Bills" />}><form onSubmit={submit}><OwnerFieldGrid><FormGroup label="Billing Month"><Select options={[{ value: 'sep', label: 'September 2025' }, { value: 'oct', label: 'October 2025' }]} /></FormGroup><FormGroup label="Property"><Select options={[{ value: 'all', label: 'All Properties' }, { value: 'abc', label: 'ABC Residence' }]} /></FormGroup></OwnerFieldGrid><p className="form-hint">This frontend demo will prepare invoices for all occupied units.</p></form></Modal>
		<OwnerFeedback message={feedback} onClose={() => setFeedback(null)} />
	</div>;
}

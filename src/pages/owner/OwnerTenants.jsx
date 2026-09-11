import React, { useState } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Icon from '../../components/common/Icon';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import FormGroup from '../../components/common/FormGroup';
import Modal from '../../components/common/Modal';
import StatusBadge from '../../components/common/StatusBadge';
import Table from '../../components/tables/Table';
import { tenantsList } from '../../data/ownerPortalData';
import { OwnerFeedback, OwnerFieldGrid, OwnerModalActions, OwnerToolbar } from './components/OwnerPageTools';

export default function OwnerTenants() {
	const [search, setSearch] = useState('');
	const [filter, setFilter] = useState('all');
	const [open, setOpen] = useState(false);
	const [feedback, setFeedback] = useState(null);
	const rows = tenantsList.filter((tenant) => {
		const query = search.toLowerCase();
		return (tenant.name.toLowerCase().includes(query) || tenant.property.toLowerCase().includes(query) || tenant.flat.toLowerCase().includes(query)) && (filter === 'all' || tenant.paymentStatus.toLowerCase() === filter);
	});
	const submit = (event) => { event.preventDefault(); setOpen(false); setFeedback('Tenant added to the directory.'); };
	const columns = [
		{ key: 'name', label: 'Tenant', render: (value, row) => <div><strong>{value}</strong><div className="table-subtext">{row.email}</div></div> },
		{ key: 'flat', label: 'Flat' }, { key: 'property', label: 'Property' }, { key: 'phone', label: 'Phone' }, { key: 'monthlyRent', label: 'Monthly Rent', align: 'right' },
		{ key: 'paymentStatus', label: 'Payment', render: (value) => <StatusBadge status={value} /> }, { key: 'status', label: 'Status', render: (value) => <StatusBadge status={value} /> },
		{ key: 'actions', label: '', align: 'right', render: (_, row) => <Button size="xs" variant="ghost" onClick={() => setFeedback(`Opening ${row.name}'s profile...`)}>View</Button> },
	];
	return <div className="owner-page">
		<PageHeader title="Tenants" description="Keep track of residents, leases, and monthly payment status." actions={<Button variant="primary" icon={<Icon name="plus" size={16} />} onClick={() => setOpen(true)}>Add Tenant</Button>} />
		<OwnerToolbar count={rows.length}><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search tenants, flats, or properties..." /><div className="owner-toolbar__select"><Select value={filter} onChange={(event) => setFilter(event.target.value)} options={[{ value: 'all', label: 'All payments' }, { value: 'paid', label: 'Paid' }, { value: 'pending', label: 'Pending' }, { value: 'overdue', label: 'Overdue' }]} /></div></OwnerToolbar>
		<Card><Table title="Tenant Directory" columns={columns} data={rows} /></Card>
		<Modal isOpen={open} onClose={() => setOpen(false)} title="Add Tenant" size="md" footer={<OwnerModalActions onCancel={() => setOpen(false)} submitLabel="Add Tenant" />}>
			<form onSubmit={submit}><OwnerFieldGrid><FormGroup label="Full Name" required><Input placeholder="e.g. Nusrat Jahan" required /></FormGroup><FormGroup label="Phone" required><Input placeholder="+880 1XXX-XXXXXX" required /></FormGroup></OwnerFieldGrid><OwnerFieldGrid><FormGroup label="Email"><Input type="email" placeholder="tenant@example.com" /></FormGroup><FormGroup label="Flat" required><Input placeholder="5B" required /></FormGroup></OwnerFieldGrid><FormGroup label="Property"><Select options={[{ value: 'abc', label: 'ABC Residence' }, { value: 'green', label: 'Green View Apartments' }]} /></FormGroup><FormGroup label="Monthly Rent" required><Input placeholder="৳25,000" required /></FormGroup></form>
		</Modal>
		<OwnerFeedback message={feedback} onClose={() => setFeedback(null)} />
	</div>;
}

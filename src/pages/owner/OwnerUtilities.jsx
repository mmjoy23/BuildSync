import React, { useState } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/common/Card';
import StatCard from '../../components/common/StatCard';
import Button from '../../components/common/Button';
import Icon from '../../components/common/Icon';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import FormGroup from '../../components/common/FormGroup';
import Modal from '../../components/common/Modal';
import StatusBadge from '../../components/common/StatusBadge';
import Table from '../../components/tables/Table';
import { utilitiesList } from '../../data/ownerPortalData';
import { OwnerFeedback, OwnerFieldGrid, OwnerModalActions, OwnerToolbar } from './components/OwnerPageTools';

export default function OwnerUtilities() {
	const [search, setSearch] = useState('');
	const [type, setType] = useState('all');
	const [open, setOpen] = useState(false);
	const [feedback, setFeedback] = useState(null);
	const rows = utilitiesList.filter((item) => (type === 'all' || item.utilityType.toLowerCase() === type) && `${item.property} ${item.unit}`.toLowerCase().includes(search.toLowerCase()));
	const submit = (event) => { event.preventDefault(); setOpen(false); setFeedback('Utility reading saved for review.'); };
	const columns = [
		{ key: 'utilityType', label: 'Utility', render: (value) => <strong>{value}</strong> }, { key: 'property', label: 'Property' }, { key: 'unit', label: 'Unit' },
		{ key: 'prevReading', label: 'Previous' }, { key: 'currReading', label: 'Current' }, { key: 'usage', label: 'Usage' }, { key: 'rate', label: 'Rate' }, { key: 'amount', label: 'Amount', align: 'right' }, { key: 'month', label: 'Month' }, { key: 'status', label: 'Status', render: (value) => <StatusBadge status={value} /> },
	];
	return <div className="owner-page">
		<PageHeader title="Utilities" description="Record readings and track electricity, water, and gas billing." actions={<Button variant="primary" icon={<Icon name="plus" size={16} />} onClick={() => setOpen(true)}>Add Reading</Button>} />
		<div className="owner-summary-grid"><StatCard title="Total Utility Cost" value="৳10,716" iconName="zap" iconColor="blue" /><StatCard title="Electricity" value="৳8,870" iconName="zap" iconColor="orange" /><StatCard title="Water" value="৳910" iconName="droplet" iconColor="blue" /><StatCard title="Pending Readings" value="1" iconName="clock" iconColor="purple" /></div>
		<OwnerToolbar count={rows.length}><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search property or unit..." /><div className="owner-toolbar__select"><Select value={type} onChange={(event) => setType(event.target.value)} options={[{ value: 'all', label: 'All utilities' }, { value: 'electricity', label: 'Electricity' }, { value: 'water', label: 'Water' }, { value: 'gas', label: 'Gas' }]} /></div><div className="owner-toolbar__select"><Select options={[{ value: 'sep', label: 'September 2025' }, { value: 'aug', label: 'August 2025' }]} /></div></OwnerToolbar>
		<Card><Table title="Utility Readings" columns={columns} data={rows} /></Card>
		<Modal isOpen={open} onClose={() => setOpen(false)} title="Add Utility Reading" size="md" footer={<OwnerModalActions onCancel={() => setOpen(false)} submitLabel="Save Reading" />}><form onSubmit={submit}><OwnerFieldGrid><FormGroup label="Property"><Select options={[{ value: 'abc', label: 'ABC Residence' }, { value: 'green', label: 'Green View Apartments' }]} /></FormGroup><FormGroup label="Unit" required><Input placeholder="5B" required /></FormGroup></OwnerFieldGrid><OwnerFieldGrid><FormGroup label="Utility"><Select options={[{ value: 'electricity', label: 'Electricity' }, { value: 'water', label: 'Water' }, { value: 'gas', label: 'Gas' }]} /></FormGroup><FormGroup label="Current Reading" required><Input type="number" placeholder="1680" required /></FormGroup></OwnerFieldGrid></form></Modal><OwnerFeedback message={feedback} onClose={() => setFeedback(null)} />
	</div>;
}

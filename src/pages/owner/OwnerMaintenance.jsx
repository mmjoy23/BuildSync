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
import Badge from '../../components/common/Badge';
import Table from '../../components/tables/Table';
import { maintenanceTickets } from '../../data/ownerPortalData';
import { OwnerFeedback, OwnerFieldGrid, OwnerModalActions, OwnerToolbar } from './components/OwnerPageTools';

export default function OwnerMaintenance() {
	const [search, setSearch] = useState(''); const [filter, setFilter] = useState('all'); const [open, setOpen] = useState(false); const [feedback, setFeedback] = useState(null);
	const rows = maintenanceTickets.filter((ticket) => (filter === 'all' || ticket.status.toLowerCase().replace(' ', '-') === filter) && `${ticket.id} ${ticket.issue} ${ticket.property} ${ticket.tenant}`.toLowerCase().includes(search.toLowerCase()));
	const submit = (event) => { event.preventDefault(); setOpen(false); setFeedback('Maintenance request updated.'); };
	const columns = [{ key: 'id', label: 'Request ID', render: (value) => <strong>{value}</strong> }, { key: 'issue', label: 'Issue' }, { key: 'property', label: 'Property' }, { key: 'flat', label: 'Flat' }, { key: 'tenant', label: 'Tenant' }, { key: 'priority', label: 'Priority', render: (value) => <Badge variant={value === 'High' ? 'danger' : value === 'Medium' ? 'warning' : 'neutral'}>{value}</Badge> }, { key: 'assignedTo', label: 'Assigned To' }, { key: 'status', label: 'Status', render: (value) => <StatusBadge status={value} /> }, { key: 'date', label: 'Date' }, { key: 'actions', label: '', align: 'right', render: (_, row) => <Button size="xs" variant="ghost" onClick={() => { setOpen(true); setFeedback(`Updating ${row.id}...`); }}>Update</Button> }];
	return <div className="owner-page"><PageHeader title="Maintenance" description="Track resident requests, assignments, priorities, and resolution progress." actions={<Button variant="primary" icon={<Icon name="plus" size={16} />} onClick={() => setOpen(true)}>New Request</Button>} /><div className="owner-summary-grid"><StatCard title="Open" value="1" iconName="alert-circle" iconColor="red" /><StatCard title="Assigned" value="1" iconName="user-check" iconColor="blue" /><StatCard title="In Progress" value="1" iconName="clock" iconColor="orange" /><StatCard title="Resolved" value="2" iconName="check-circle" iconColor="green" /></div><OwnerToolbar count={rows.length}><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search requests or tenants..." /><div className="owner-toolbar__select"><Select value={filter} onChange={(event) => setFilter(event.target.value)} options={[{ value: 'all', label: 'All statuses' }, { value: 'open', label: 'Open' }, { value: 'assigned', label: 'Assigned' }, { value: 'in-progress', label: 'In Progress' }, { value: 'resolved', label: 'Resolved' }]} /></div></OwnerToolbar><Card><Table title="Maintenance Requests" columns={columns} data={rows} /></Card><Modal isOpen={open} onClose={() => setOpen(false)} title="Update Maintenance Request" size="md" footer={<OwnerModalActions onCancel={() => setOpen(false)} submitLabel="Save Update" />}><form onSubmit={submit}><FormGroup label="Issue"><Input placeholder="Describe the issue" /></FormGroup><OwnerFieldGrid><FormGroup label="Priority"><Select options={[{ value: 'high', label: 'High' }, { value: 'medium', label: 'Medium' }, { value: 'low', label: 'Low' }]} /></FormGroup><FormGroup label="Status"><Select options={[{ value: 'open', label: 'Open' }, { value: 'assigned', label: 'Assigned' }, { value: 'progress', label: 'In Progress' }, { value: 'resolved', label: 'Resolved' }]} /></FormGroup></OwnerFieldGrid><FormGroup label="Assigned To"><Input placeholder="Maintenance Team" /></FormGroup></form></Modal><OwnerFeedback message={feedback} onClose={() => setFeedback(null)} /></div>;
}

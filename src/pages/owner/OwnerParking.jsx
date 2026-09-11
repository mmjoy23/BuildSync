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
import { parkingSlots } from '../../data/ownerPortalData';
import { OwnerFeedback, OwnerModalActions, OwnerToolbar } from './components/OwnerPageTools';

export default function OwnerParking() {
	const [search, setSearch] = useState(''); const [filter, setFilter] = useState('all'); const [open, setOpen] = useState(false); const [feedback, setFeedback] = useState(null);
	const rows = parkingSlots.filter((slot) => (filter === 'all' || slot.status.toLowerCase() === filter) && `${slot.slot} ${slot.property} ${slot.assignedTo}`.toLowerCase().includes(search.toLowerCase()));
	const submit = (event) => { event.preventDefault(); setOpen(false); setFeedback('Parking assignment saved.'); };
	const columns = [{ key: 'slot', label: 'Parking Slot', render: (value) => <strong>{value}</strong> }, { key: 'property', label: 'Property' }, { key: 'floor', label: 'Location' }, { key: 'assignedTo', label: 'Assigned To' }, { key: 'vehicle', label: 'Vehicle' }, { key: 'status', label: 'Status', render: (value) => <StatusBadge status={value} /> }, { key: 'actions', label: '', align: 'right', render: (_, row) => <Button size="xs" variant="ghost" onClick={() => setFeedback(row.status === 'Vacant' ? `Assigning ${row.slot}...` : `Releasing ${row.slot}...`)}>{row.status === 'Vacant' ? 'Assign' : 'Manage'}</Button> }];
	return <div className="owner-page"><PageHeader title="Parking" description="Manage parking inventory and vehicle assignments across properties." actions={<Button variant="primary" icon={<Icon name="plus" size={16} />} onClick={() => setOpen(true)}>Assign Slot</Button>} /><div className="owner-summary-grid"><StatCard title="Total Slots" value="6" iconName="grid" iconColor="blue" /><StatCard title="Assigned" value="4" iconName="check-circle" iconColor="green" /><StatCard title="Available" value="2" iconName="car" iconColor="orange" /></div><OwnerToolbar count={rows.length}><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search slots, tenants, or vehicles..." /><div className="owner-toolbar__select"><Select value={filter} onChange={(event) => setFilter(event.target.value)} options={[{ value: 'all', label: 'All slots' }, { value: 'assigned', label: 'Assigned' }, { value: 'vacant', label: 'Available' }]} /></div></OwnerToolbar><Card><Table title="Parking Inventory" columns={columns} data={rows} /></Card><Modal isOpen={open} onClose={() => setOpen(false)} title="Assign Parking Slot" size="sm" footer={<OwnerModalActions onCancel={() => setOpen(false)} submitLabel="Assign Slot" />}><form onSubmit={submit}><FormGroup label="Parking Slot"><Select options={[{ value: 'p-02', label: 'P-02 · ABC Residence' }, { value: 'p-04', label: 'P-04 · ABC Residence' }]} /></FormGroup><FormGroup label="Tenant"><Select options={[{ value: 'rahim', label: 'Rahim Ahmed · 5B' }, { value: 'shakil', label: 'Shakil Hasan · 7C' }]} /></FormGroup><FormGroup label="Vehicle Details"><Input placeholder="Toyota Premio · Dhaka Metro-Ga 00-0000" /></FormGroup></form></Modal><OwnerFeedback message={feedback} onClose={() => setFeedback(null)} /></div>;
}

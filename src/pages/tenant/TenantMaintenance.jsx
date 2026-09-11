import React, { useState } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/common/Card';
import StatCard from '../../components/common/StatCard';
import Button from '../../components/common/Button';
import Icon from '../../components/common/Icon';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Textarea from '../../components/common/Textarea';
import FormGroup from '../../components/common/FormGroup';
import Modal from '../../components/common/Modal';
import StatusBadge from '../../components/common/StatusBadge';
import Table from '../../components/tables/Table';
import { tenantMaintenance } from '../../data/tenantPortalData';
import { TenantFeedback, TenantFieldGrid, TenantModalActions } from './components/TenantPageTools';

export default function TenantMaintenance() {
	const [open, setOpen] = useState(false); const [selected, setSelected] = useState(null); const [feedback, setFeedback] = useState(null);
	const submit = (event) => { event.preventDefault(); setOpen(false); setFeedback('Complaint submitted for review.'); };
	const columns = [{ key: 'id', label: 'Request ID', render: (value) => <strong>{value}</strong> }, { key: 'issue', label: 'Issue' }, { key: 'priority', label: 'Priority', render: (value) => <StatusBadge status={value} /> }, { key: 'submitted', label: 'Submitted' }, { key: 'status', label: 'Status', render: (value) => <StatusBadge status={value} /> }, { key: 'actions', label: '', align: 'right', render: (_, row) => <Button size="xs" variant="ghost" onClick={() => setSelected(row)}>View</Button> }];
	return <div className="tenant-page"><PageHeader title="Maintenance" description="Raise and follow up on requests for your flat." actions={<Button variant="primary" icon={<Icon name="plus" size={16} />} onClick={() => setOpen(true)}>Raise Complaint</Button>} /><div className="tenant-summary-grid tenant-summary-grid--three"><StatCard title="Open" value="0" iconName="alert-circle" iconColor="red" /><StatCard title="In Progress" value="1" iconName="clock" iconColor="orange" /><StatCard title="Resolved" value="2" iconName="check-circle" iconColor="green" /></div><Card><Table title="My Requests" columns={columns} data={tenantMaintenance} /></Card><Modal isOpen={Boolean(selected)} onClose={() => setSelected(null)} title={`Request ${selected?.id || ''}`} size="md" footer={<TenantModalActions onCancel={() => setSelected(null)} submitLabel="Close" />}><form onSubmit={(event) => { event.preventDefault(); setSelected(null); }}>{selected && <><div className="request-detail-head"><div><span>Issue</span><strong>{selected.issue}</strong></div><StatusBadge status={selected.status} /></div><p className="request-description">{selected.description}</p><div className="request-detail-meta"><span>Submitted<strong>{selected.submitted}</strong></span><span>Priority<strong>{selected.priority}</strong></span><span>Assigned To<strong>{selected.assignedTo}</strong></span></div><div className="request-timeline">{selected.updates.map((update) => <div key={update}><i /><span>{update}</span></div>)}</div></>}</form></Modal><Modal isOpen={open} onClose={() => setOpen(false)} title="Raise Complaint" size="md" footer={<TenantModalActions onCancel={() => setOpen(false)} submitLabel="Submit Complaint" />}><form onSubmit={submit}><TenantFieldGrid><FormGroup label="Issue Category"><Select options={[{ value: 'plumbing', label: 'Plumbing' }, { value: 'electrical', label: 'Electrical' }, { value: 'lift', label: 'Lift' }, { value: 'water', label: 'Water' }, { value: 'gas', label: 'Gas' }, { value: 'other', label: 'Other' }]} /></FormGroup><FormGroup label="Priority"><Select options={[{ value: 'medium', label: 'Medium' }, { value: 'high', label: 'High' }, { value: 'low', label: 'Low' }]} /></FormGroup></TenantFieldGrid><FormGroup label="Title" required><Input placeholder="e.g. Kitchen tap is leaking" required /></FormGroup><FormGroup label="Description" required><Textarea placeholder="Describe the issue and where it occurs..." required /></FormGroup><FormGroup label="Preferred Visit Time"><Input placeholder="e.g. Weekdays after 5 PM" /></FormGroup></form></Modal><TenantFeedback message={feedback} onClose={() => setFeedback(null)} /></div>;
}

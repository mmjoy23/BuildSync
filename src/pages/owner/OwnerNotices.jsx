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
import { noticesList } from '../../data/ownerPortalData';
import { OwnerFeedback, OwnerFieldGrid, OwnerModalActions, OwnerToolbar } from './components/OwnerPageTools';

export default function OwnerNotices() {
	const [search, setSearch] = useState(''); const [filter, setFilter] = useState('all'); const [open, setOpen] = useState(false); const [feedback, setFeedback] = useState(null);
	const rows = noticesList.filter((notice) => (filter === 'all' || notice.type.toLowerCase() === filter) && `${notice.title} ${notice.audience}`.toLowerCase().includes(search.toLowerCase()));
	const submit = (event) => { event.preventDefault(); setOpen(false); setFeedback('Notice published to the selected audience.'); };
	return <div className="owner-page"><PageHeader title="Notices" description="Create clear, timely announcements for residents and property teams." actions={<Button variant="primary" icon={<Icon name="plus" size={16} />} onClick={() => setOpen(true)}>Create Notice</Button>} /><OwnerToolbar count={rows.length}><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search notices..." /><div className="owner-toolbar__select"><Select value={filter} onChange={(event) => setFilter(event.target.value)} options={[{ value: 'all', label: 'All types' }, { value: 'maintenance', label: 'Maintenance' }, { value: 'general', label: 'General' }, { value: 'policy', label: 'Policy' }]} /></div></OwnerToolbar><div className="notice-grid">{rows.map((notice) => <Card key={notice.id} className="notice-card"><div className="notice-card__top"><StatusBadge status={notice.status} /><span className="table-subtext">{notice.date}</span></div><h3>{notice.title}</h3><p>{notice.details}</p><div className="notice-card__meta"><span><Icon name="users" size={14} /> {notice.audience}</span><span><Icon name="user" size={14} /> {notice.createdBy}</span></div><div className="notice-card__footer"><span className="badge badge--neutral">{notice.type}</span><Button size="xs" variant="ghost" onClick={() => setFeedback(`Editing ${notice.title}...`)}>Edit Notice</Button></div></Card>)}</div><Modal isOpen={open} onClose={() => setOpen(false)} title="Create Notice" size="md" footer={<OwnerModalActions onCancel={() => setOpen(false)} submitLabel="Publish Notice" />}><form onSubmit={submit}><FormGroup label="Notice Title" required><Input placeholder="e.g. Water supply maintenance" required /></FormGroup><OwnerFieldGrid><FormGroup label="Type"><Select options={[{ value: 'general', label: 'General' }, { value: 'maintenance', label: 'Maintenance' }, { value: 'policy', label: 'Policy' }]} /></FormGroup><FormGroup label="Audience"><Select options={[{ value: 'all', label: 'All Tenants' }, { value: 'property', label: 'Property' }, { value: 'unit', label: 'Specific Unit' }]} /></FormGroup></OwnerFieldGrid><FormGroup label="Message" required><textarea className="form-control" rows="5" placeholder="Write the announcement..." required /></FormGroup></form></Modal><OwnerFeedback message={feedback} onClose={() => setFeedback(null)} /></div>;
}

import React, { useState } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Select from '../../components/common/Select';
import Modal from '../../components/common/Modal';
import StatusBadge from '../../components/common/StatusBadge';
import { tenantNotices } from '../../data/tenantPortalData';
import { TenantModalActions } from './components/TenantPageTools';

export default function TenantNotices() {
	const [filter, setFilter] = useState('all'); const [selected, setSelected] = useState(null); const rows = filter === 'all' ? tenantNotices : tenantNotices.filter((notice) => notice.category.toLowerCase() === filter);
	return <div className="tenant-page"><PageHeader title="Notices" description="Stay up to date with announcements from your property team." actions={<div className="tenant-notice-filter"><Select value={filter} onChange={(event) => setFilter(event.target.value)} options={[{ value: 'all', label: 'All notices' }, { value: 'maintenance', label: 'Maintenance' }, { value: 'billing', label: 'Billing' }, { value: 'general', label: 'General' }, { value: 'emergency', label: 'Emergency' }]} /></div>} /><div className="tenant-notices-grid">{rows.map((notice) => <Card key={notice.id} className={`tenant-notice-card ${notice.unread ? 'is-unread' : ''}`}><div className="tenant-notice-card__head"><StatusBadge status={notice.category} /><span>{notice.unread ? 'Unread' : 'Read'}</span></div><h3>{notice.title}</h3><div className="tenant-notice-card__date">{notice.date}</div><p>{notice.description}</p><Button size="xs" variant="ghost" onClick={() => setSelected(notice)}>Read Notice</Button></Card>)}</div><Modal isOpen={Boolean(selected)} onClose={() => setSelected(null)} title={selected?.title} size="sm" footer={<TenantModalActions onCancel={() => setSelected(null)} submitLabel="Close" />}><form onSubmit={(event) => { event.preventDefault(); setSelected(null); }}>{selected && <div className="notice-detail"><StatusBadge status={selected.category} /><strong>{selected.date}</strong><p>{selected.description}</p></div>}</form></Modal></div>;
}

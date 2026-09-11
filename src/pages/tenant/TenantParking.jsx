import React, { useState } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Icon from '../../components/common/Icon';
import Input from '../../components/common/Input';
import FormGroup from '../../components/common/FormGroup';
import Modal from '../../components/common/Modal';
import StatusBadge from '../../components/common/StatusBadge';
import { tenantFlat } from '../../data/tenantPortalData';
import { TenantFeedback, TenantModalActions } from './components/TenantPageTools';

export default function TenantParking() {
	const [open, setOpen] = useState(false); const [feedback, setFeedback] = useState(null); const submit = (event) => { event.preventDefault(); setOpen(false); setFeedback('Parking request saved for the property manager.'); };
	 return <div className="tenant-page"><PageHeader title="Parking" description="View your assigned slot, vehicle details, and parking guidance." actions={<Button variant="secondary" icon={<Icon name="edit" size={16} />} onClick={() => setOpen(true)}>Update Vehicle</Button>} /><div className="tenant-parking-hero"><div className="tenant-parking-slot"><span>Assigned Parking Slot</span><strong>{tenantFlat.parkingSlot}</strong><StatusBadge status="Assigned" /></div><div><span>Property</span><strong>{tenantFlat.property}</strong></div><div><span>Vehicle</span><strong>Honda Civic</strong><small>Dhaka Metro-Ka 98-7654</small></div></div><div className="tenant-info-grid"><Card title="Slot Details"><div className="tenant-detail-grid"><div><span>Slot</span><strong>P-05</strong></div><div><span>Location</span><strong>Basement 1</strong></div><div><span>Property</span><strong>ABC Residence</strong></div><div><span>Status</span><StatusBadge status="Assigned" /></div></div></Card><Card title="Vehicle Details"><div className="tenant-detail-grid"><div><span>Vehicle</span><strong>Honda Civic</strong></div><div><span>Registration</span><strong>Dhaka Metro-Ka 98-7654</strong></div><div><span>Registered To</span><strong>Tanjim Ahmed</strong></div></div></Card><Card title="Parking Rules & Notice"><ul className="tenant-rules"><li>Display your parking sticker visibly at all times.</li><li>Keep the assigned slot clear and do not block access lanes.</li><li>Report damage or unauthorized use to the property manager.</li></ul><Button variant="primary" icon={<Icon name="message-circle" size={16} />} onClick={() => setOpen(true)}>Request Parking Change</Button></Card></div><Modal isOpen={open} onClose={() => setOpen(false)} title="Update Parking Details" size="sm" footer={<TenantModalActions onCancel={() => setOpen(false)} onSubmit={submit} submitLabel="Save Request" />}><form onSubmit={submit}><FormGroup label="Vehicle Make & Model"><Input defaultValue="Honda Civic" /></FormGroup><FormGroup label="Registration Number"><Input defaultValue="Dhaka Metro-Ka 98-7654" /></FormGroup><FormGroup label="Request"><Input placeholder="Describe a change you need" /></FormGroup></form></Modal><TenantFeedback message={feedback} onClose={() => setFeedback(null)} /></div>;
}

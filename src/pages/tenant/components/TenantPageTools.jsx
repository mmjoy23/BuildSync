import React from 'react';
import Button from '../../../components/common/Button';
import Icon from '../../../components/common/Icon';
import Toast from '../../../components/common/Toast';

export function TenantModalActions({ onCancel, onSubmit, submitLabel = 'Save Changes' }) {
  const submit = onSubmit || (() => document.querySelector('.modal form')?.requestSubmit());
  return <><Button variant="ghost" onClick={onCancel}>Cancel</Button><Button type="button" onClick={submit} variant="primary" icon={<Icon name="check" size={15} />}>{submitLabel}</Button></>;
}

export function TenantFeedback({ message, onClose, type = 'success' }) {
  return message ? <Toast type={type} title="Tenant Portal" message={message} onClose={onClose} /> : null;
}

export function TenantFieldGrid({ children }) {
  return <div className="tenant-field-grid">{children}</div>;
}

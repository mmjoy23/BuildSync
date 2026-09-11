import React from 'react';
import Button from '../../../components/common/Button';
import Icon from '../../../components/common/Icon';
import Toast from '../../../components/common/Toast';

export function OwnerToolbar({ children, count }) {
  return (
    <div className="owner-toolbar">
      <div className="owner-toolbar__search-group">{children}</div>
      {count !== undefined && <span className="owner-toolbar__count">Showing {count} records</span>}
    </div>
  );
}

export function OwnerModalActions({ onCancel, onSubmit, submitLabel = 'Save Changes' }) {
  const submit = onSubmit || (() => document.querySelector('.modal form')?.requestSubmit());
  return (
    <>
      <Button variant="ghost" onClick={onCancel}>Cancel</Button>
      <Button variant="primary" type="button" onClick={submit} icon={<Icon name="check" size={15} />}>{submitLabel}</Button>
    </>
  );
}

export function OwnerFeedback({ message, onClose, type = 'success' }) {
  if (!message) return null;
  return <Toast type={type} title="Owner Portal" message={message} onClose={onClose} />;
}

export function OwnerFieldGrid({ children }) {
  return <div className="owner-field-grid">{children}</div>;
}
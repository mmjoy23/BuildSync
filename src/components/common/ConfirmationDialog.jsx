import React from 'react';
import Modal from './Modal';
import Button from './Button';
import Icon from './Icon';

/**
 * ConfirmationDialog component
 * Props:
 *  - isOpen: boolean
 *  - onClose: func
 *  - onConfirm: func
 *  - title: string
 *  - message: string
 *  - confirmText: string
 *  - cancelText: string
 *  - variant: 'danger' | 'warning' | 'info'
 *  - loading: boolean
 */
function ConfirmationDialog({
  isOpen = false,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  loading = false,
}) {
  const iconMap = {
    danger: 'alert-circle',
    warning: 'alert-circle',
    info: 'info',
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button
            variant={variant === 'warning' ? 'primary' : variant}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </>
      }
    >
      <div className="confirm-dialog">
        <div className={`confirm-dialog__icon confirm-dialog__icon--${variant}`}>
          <Icon name={iconMap[variant] || 'info'} size={28} />
        </div>
        <h4 className="confirm-dialog__title">{title}</h4>
        <p className="confirm-dialog__message">{message}</p>
      </div>
    </Modal>
  );
}

export default ConfirmationDialog;

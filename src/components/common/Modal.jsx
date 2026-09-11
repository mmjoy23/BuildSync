import React, { useEffect } from 'react';
import IconButton from '../common/IconButton';
import Icon from '../common/Icon';

/**
 * Modal component
 * Props:
 *  - isOpen: boolean
 *  - onClose: func
 *  - title: string | node
 *  - children: node
 *  - footer: node
 *  - size: 'sm' | 'md' | 'lg' | 'xl'
 */
function Modal({
  isOpen = false,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  className = '',
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && onClose) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`modal modal--${size} ${className}`.trim()}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal__header">
          {title && <h3 className="modal__title">{title}</h3>}
          {onClose && (
            <IconButton
              icon={<Icon name="x" size={18} />}
              onClick={onClose}
              size="sm"
              variant="ghost"
              aria-label="Close modal"
            />
          )}
        </div>
        <div className="modal__body">{children}</div>
        {footer && <div className="modal__footer">{footer}</div>}
      </div>
    </div>
  );
}

export default Modal;

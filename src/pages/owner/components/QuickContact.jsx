import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../../components/common/Card';
import Icon from '../../../components/common/Icon';

/**
 * QuickContact
 * Quick action buttons for owner communication:
 * - Message Tenant
 * - Call Tenant
 * - Send Notice (to all tenants)
 * - Chat with Support
 */
function QuickContact({ onAction }) {
  const actions = [
    { label: 'Message Tenant', iconName: 'mail', to: '/owner/messages' },
    { label: 'Call Tenant', iconName: 'phone', to: '/owner/tenants' },
    { label: 'Send Notice (to all)', iconName: 'clipboard-list', to: '/owner/notices' },
    { label: 'Chat with Support', iconName: 'headphones', to: '/owner/messages' },
  ];

  return (
    <Card title="Quick Contact">
      <div className="quick-contact-actions">
        {actions.map((act, index) => (
          <Link
            key={index}
            to={act.to}
            className="btn btn--secondary quick-contact-btn"
            onClick={() => onAction && onAction(act.label)}
          >
            <Icon name={act.iconName} size={16} />
            <span>{act.label}</span>
          </Link>
        ))}
      </div>
    </Card>
  );
}

export default QuickContact;

import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../../components/common/Card';
import Avatar from '../../../components/common/Avatar';
import { ownerMessagesList } from '../../../data/ownerDashboardData';

/**
 * OwnerMessages
 * Right-side messages panel displaying recent tenant inquiries and previews.
 */
function OwnerMessages() {
  return (
    <Card
      title="Messages"
      actions={
        <Link to="/owner/messages" className="btn btn--ghost btn--xs" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
          View All →
        </Link>
      }
      footer={
        <Link
          to="/owner/messages"
          className="btn btn--secondary btn--sm btn--full"
          style={{ justifyContent: 'center' }}
        >
          View All Messages
        </Link>
      }
    >
      <div className="messages-list">
        {ownerMessagesList.map((msg) => (
          <Link
            key={msg.id}
            to="/owner/messages"
            className={`message-item ${msg.unread ? 'message-item--unread' : ''}`}
          >
            <Avatar name={msg.sender} size="sm" color={msg.avatarColor} />
            <div className="message-item__content">
              <div className="message-item__top">
                <span className="message-item__sender">{msg.sender}</span>
                <span className="message-item__time">{msg.time}</span>
              </div>
              <span className="message-item__role">{msg.role}</span>
              <p className="message-item__preview">{msg.preview}</p>
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
}

export default OwnerMessages;

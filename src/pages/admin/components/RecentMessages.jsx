import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../../components/common/Card';
import Avatar from '../../../components/common/Avatar';
import { adminRecentMessages } from '../../../data/adminDashboardData';

/**
 * RecentMessages
 * Card showing platform-wide messages and tickets needing attention:
 * - Rahim Ahmed (Owner)
 * - Support Ticket #1042
 * - Farhan Hossain (Owner)
 */
function RecentMessages() {
  return (
    <Card
      title="Recent Messages"
      actions={
        <Link to="/admin/messages" className="btn btn--ghost btn--xs" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
          View All →
        </Link>
      }
    >
      <div className="messages-list">
        {adminRecentMessages.map((msg) => (
          <Link
            key={msg.id}
            to="/admin/messages"
            className="message-item"
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

export default RecentMessages;

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Icon from './Icon';
import api from '../../services/api';

const POLL_INTERVAL_MS = 30_000; // poll every 30 seconds

/**
 * NotificationBell — Live, database-backed notification component.
 *
 * Fetches real notifications from GET /api/notifications.
 * Polls for unread count every 30 seconds while the user is logged in.
 * Provides a dropdown panel listing recent notifications with mark-as-read actions.
 *
 * External props (count / onClick) are still accepted for backward-compatibility
 * with the ComponentShowcase, but are ignored when the component is used inside
 * a real authenticated layout.
 */
function NotificationBell({ className = '' }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const panelRef = useRef(null);

  // ── Fetch helpers ────────────────────────────────────────────
  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await api.notifications.getUnreadCount();
      if (res?.data?.count !== undefined) {
        setUnreadCount(res.data.count);
      }
    } catch {
      // Silently ignore polling errors (e.g. session expired)
    }
  }, []);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.notifications.getAll(20);
      if (res?.data) {
        setNotifications(res.data);
        const unread = res.data.filter((n) => !n.isRead).length;
        setUnreadCount(unread);
      }
    } catch (err) {
      setError('Failed to load notifications.');
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Initial fetch + polling ───────────────────────────────────
  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  // ── Open dropdown: load full list ────────────────────────────
  const handleToggle = useCallback(() => {
    setIsOpen((prev) => {
      if (!prev) fetchNotifications();
      return !prev;
    });
  }, [fetchNotifications]);

  // ── Close on outside click ───────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // ── Mark single notification as read ─────────────────────────
  const handleMarkRead = useCallback(async (e, id) => {
    e.stopPropagation();
    try {
      await api.notifications.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch {
      // ignore
    }
  }, []);

  // ── Mark all as read ──────────────────────────────────────────
  const handleMarkAllRead = useCallback(async () => {
    try {
      await api.notifications.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {
      // ignore
    }
  }, []);

  // ── Helpers ───────────────────────────────────────────────────
  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now - d;
    const diffMin = Math.floor(diffMs / 60_000);
    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    return d.toLocaleDateString();
  };

  const typeIcon = (type) => {
    switch (type) {
      case 'BILL_CREATED': return 'file-text';
      case 'PAYMENT_SUBMITTED': return 'credit-card';
      case 'PAYMENT_VERIFIED': return 'check-circle';
      case 'BILL_PAID': return 'check-square';
      default: return 'bell';
    }
  };

  // ── Render ────────────────────────────────────────────────────
  return (
    <div className={`notification-bell-wrapper ${className}`.trim()} ref={panelRef} style={{ position: 'relative' }}>
      <button
        type="button"
        className="notification-bell"
        onClick={handleToggle}
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
        aria-expanded={isOpen}
      >
        <Icon name="bell" size={18} />
        {unreadCount > 0 && (
          <span className="notification-bell__badge">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="notif-dropdown">
          {/* Header */}
          <div className="notif-dropdown__header">
            <span className="notif-dropdown__title">Notifications</span>
            {unreadCount > 0 && (
              <button
                type="button"
                className="notif-dropdown__mark-all"
                onClick={handleMarkAllRead}
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Body */}
          <div className="notif-dropdown__body">
            {loading && (
              <p className="notif-dropdown__empty">Loading…</p>
            )}
            {error && !loading && (
              <p className="notif-dropdown__empty notif-dropdown__empty--error">{error}</p>
            )}
            {!loading && !error && notifications.length === 0 && (
              <p className="notif-dropdown__empty">No notifications yet.</p>
            )}
            {!loading && !error && notifications.map((n) => (
              <div
                key={n.id}
                className={`notif-item${n.isRead ? '' : ' notif-item--unread'}`}
              >
                <span className="notif-item__icon">
                  <Icon name={typeIcon(n.type)} size={15} />
                </span>
                <div className="notif-item__content">
                  <p className="notif-item__title">{n.title}</p>
                  <p className="notif-item__message">{n.message}</p>
                  <p className="notif-item__time">{formatTime(n.createdAt)}</p>
                </div>
                {!n.isRead && (
                  <button
                    type="button"
                    className="notif-item__read-btn"
                    onClick={(e) => handleMarkRead(e, n.id)}
                    aria-label="Mark as read"
                    title="Mark as read"
                  >
                    <Icon name="x" size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;

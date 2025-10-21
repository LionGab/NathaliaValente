/**
 * ClubNath Notification Center Component
 *
 * Example React component for displaying in-app notifications
 */

import React, { useEffect, useState } from 'react';
import NotificationService, {
  type InAppNotification,
} from '../services/notificationService';

export const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<InAppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load notifications on mount
  useEffect(() => {
    loadNotifications();
    loadUnreadCount();

    // Subscribe to real-time notifications
    const unsubscribe = NotificationService.subscribeToNotifications(
      (newNotification) => {
        setNotifications((prev) => [newNotification, ...prev]);
        setUnreadCount((prev) => prev + 1);

        // Show browser notification if permission granted
        if (NotificationService.isNotificationEnabled()) {
          new Notification(newNotification.title, {
            body: newNotification.body,
            icon: '/logo-192.png',
            badge: '/badge-72.png',
          });
        }
      }
    );

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    const data = await NotificationService.getNotifications(20);
    setNotifications(data);
    setLoading(false);
  };

  const loadUnreadCount = async () => {
    const count = await NotificationService.getUnreadCount();
    setUnreadCount(count);
  };

  const handleMarkAsRead = async (notificationId: string) => {
    await NotificationService.markAsRead(notificationId);

    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notificationId
          ? { ...n, read_at: new Date().toISOString(), status: 'read' as const }
          : n
      )
    );

    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const handleMarkAllAsRead = async () => {
    await NotificationService.markAllAsRead();

    setNotifications((prev) =>
      prev.map((n) => ({
        ...n,
        read_at: n.read_at || new Date().toISOString(),
        status: 'read' as const,
      }))
    );

    setUnreadCount(0);
  };

  const handleNotificationClick = (notification: InAppNotification) => {
    // Mark as read
    if (!notification.read_at) {
      handleMarkAsRead(notification.id);
    }

    // Navigate to deep link if available
    if (notification.deep_link) {
      window.location.href = notification.deep_link;
    }
  };

  const formatTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);

    if (diffInSeconds < 60) return 'agora mesmo';
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} min atrás`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} h atrás`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)} dias atrás`;

    return time.toLocaleDateString('pt-BR');
  };

  return (
    <div className="notification-center">
      {/* Notification Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="notification-bell"
        aria-label="Notificações"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notificações</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="mark-all-read-btn"
              >
                Marcar todas como lidas
              </button>
            )}
          </div>

          <div className="notification-list">
            {loading ? (
              <div className="notification-loading">Carregando...</div>
            ) : notifications.length === 0 ? (
              <div className="notification-empty">
                <p>Nenhuma notificação ainda</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${!notification.read_at ? 'unread' : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="notification-content">
                    <h4>{notification.title}</h4>
                    <p>{notification.body}</p>
                    <span className="notification-time">
                      {formatTimeAgo(notification.created_at)}
                    </span>
                  </div>
                  {!notification.read_at && (
                    <div className="notification-unread-dot" />
                  )}
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="notification-footer">
              <button onClick={loadNotifications} className="load-more-btn">
                Ver todas
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;

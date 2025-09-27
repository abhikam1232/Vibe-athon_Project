import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import './NotificationPanel.css';

const NotificationPanel = () => {
  const { notifications, markAsRead, deleteNotification } = useNotifications();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <button 
        className="notification-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell size={20} />
        {notifications.filter(n => !n.read).length > 0 && (
          <span className="notification-count">
            {notifications.filter(n => !n.read).length}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="notification-panel"
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <div className="panel-header">
              <h3>Notifications</h3>
              <button onClick={() => setIsOpen(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="notifications-list">
              {notifications.length === 0 ? (
                <div className="empty-notifications">
                  <Bell size={48} />
                  <p>No notifications yet</p>
                </div>
              ) : (
                notifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="notification-content">
                      <h4>{notification.title}</h4>
                      <p>{notification.message}</p>
                      <span className="notification-time">
                        {new Date(notification.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <button
                      className="delete-notification"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NotificationPanel;

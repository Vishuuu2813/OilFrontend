import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedNotifications, setExpandedNotifications] = useState({});
  const [markAllRead, setMarkAllRead] = useState(false);
  const [readNotifications, setReadNotifications] = useState({});
  const [activeFilter, setActiveFilter] = useState('all');

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:8000/api/notifications');

      if (res.status !== 200) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      console.log("Fetched notifications:", res.data);
      setNotifications(Array.isArray(res.data.data) ? res.data.data : []);
      setError(null);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleNotificationClick = (id) => {
    setExpandedNotifications(prevState => ({
      ...prevState,
      [id]: !prevState[id],
    }));
    
    // Mark as read when clicked
    setReadNotifications(prevState => ({
      ...prevState,
      [id]: true
    }));
  };

  const handleMarkAsRead = (id, e) => {
    e.stopPropagation(); // Prevent triggering the card's click event
    setReadNotifications(prevState => ({
      ...prevState,
      [id]: !prevState[id]
    }));
  };

  const handleMarkAllAsRead = () => {
    const allRead = {};
    notifications.forEach(notif => {
      allRead[notif._id] = true;
    });
    setReadNotifications(allRead);
    setMarkAllRead(true);
  };

  const handleClearAllRead = () => {
    const filterNotifications = notifications.filter(
      notif => !readNotifications[notif._id]
    );
    setNotifications(filterNotifications);
  };

  const filterNotifications = () => {
    if (activeFilter === 'all') return notifications;
    if (activeFilter === 'unread') 
      return notifications.filter(notif => !readNotifications[notif._id]);
    if (activeFilter === 'read') 
      return notifications.filter(notif => readNotifications[notif._id]);
    return notifications;
  };

  const displayNotifications = filterNotifications();

  return (
    <div className="notification-container">
      <style>
        {`
          .notification-container {
            padding: 30px;
            max-width: 900px;
            margin: 20px auto;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f8f9fa;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          }

          .page-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 2px solid #dee2e6;
          }

          .page-title {
            font-size: 2.2rem;
            font-weight: 600;
            color: #343a40;
            margin: 0;
          }

          .notification-filter {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
          }

          .filter-button {
            padding: 8px 16px;
            border: 1px solid #dee2e6;
            border-radius: 20px;
            background-color: white;
            cursor: pointer;
            font-size: 0.9rem;
            transition: all 0.2s ease;
          }

          .filter-button.active {
            background-color: #007bff;
            color: white;
            border-color: #007bff;
          }

          .notification-actions {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
          }

          .action-button {
            background-color: #007bff;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 5px;
            cursor: pointer;
            font-weight: 500;
            transition: background-color 0.2s ease;
          }

          .action-button:hover {
            background-color: #0069d9;
          }

          .action-button.secondary {
            background-color: #6c757d;
          }

          .action-button.secondary:hover {
            background-color: #5a6268;
          }

          .notification-list {
            list-style: none;
            padding: 0;
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
            gap: 20px;
          }

          .notification-card {
            border-radius: 10px;
            padding: 20px;
            background-color: #fff;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
            transition: all 0.3s ease;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            border-left: 4px solid #007bff;
          }

          .notification-card.read {
            border-left-color: #6c757d;
            opacity: 0.8;
          }

          .notification-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          }

          .notification-card-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 10px;
          }

          .notification-title {
            font-size: 1.3rem;
            font-weight: 600;
            color: #212529;
            margin: 0 0 10px 0;
          }

          .notification-description {
            font-size: 1rem;
            color: #495057;
            line-height: 1.6;
            margin-bottom: 15px;
            flex-grow: 1;
          }

          .notification-description.collapsed {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .notification-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: auto;
          }

          .notification-timestamp {
            font-size: 0.85rem;
            color: #6c757d;
          }

          .notification-actions-menu {
            display: flex;
            gap: 10px;
          }

          .notification-action {
            background-color: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 4px;
            padding: 4px 8px;
            font-size: 0.8rem;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .notification-action:hover {
            background-color: #e9ecef;
          }

          .notification-action.read {
            color: #28a745;
          }

          .notification-action.unread {
            color: #007bff;
          }

          .notification-indicator {
            width: 10px;
            height: 10px;
            background-color: #007bff;
            border-radius: 50%;
            margin-right: 8px;
          }

          .read-indicator {
            display: flex;
            align-items: center;
            font-size: 0.85rem;
            color: #6c757d;
          }

          .expand-indicator {
            margin-top: 5px;
            text-align: center;
            font-size: 0.9rem;
            color: #007bff;
            cursor: pointer;
          }

          .no-notifications {
            text-align: center;
            font-size: 1.2rem;
            color: #6c757d;
            font-style: italic;
            padding: 50px 0;
            grid-column: 1 / -1;
          }

          .loading {
            text-align: center;
            font-size: 1.2rem;
            color: #007bff;
            padding: 50px 0;
            grid-column: 1 / -1;
          }

          .error {
            text-align: center;
            font-size: 1.2rem;
            color: #dc3545;
            margin: 20px 0;
            padding: 15px;
            background-color: #f8d7da;
            border-radius: 5px;
          }

          @media (max-width: 768px) {
            .notification-list {
              grid-template-columns: 1fr;
            }
          }
        `}
      </style>

      <div className="page-header">
        <h1 className="page-title">Notifications</h1>
        <button className="action-button" onClick={fetchNotifications}>
          Refresh
        </button>
      </div>

      <div className="notification-filter">
        <button 
          className={`filter-button ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          All
        </button>
        <button 
          className={`filter-button ${activeFilter === 'unread' ? 'active' : ''}`}
          onClick={() => setActiveFilter('unread')}
        >
          Unread
        </button>
        <button 
          className={`filter-button ${activeFilter === 'read' ? 'active' : ''}`}
          onClick={() => setActiveFilter('read')}
        >
          Read
        </button>
      </div>

      <div className="notification-actions">
        <button className="action-button" onClick={handleMarkAllAsRead}>
          Mark All as Read
        </button>
        <button className="action-button secondary" onClick={handleClearAllRead}>
          Clear Read Notifications
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {loading ? (
        <div className="loading">Loading notifications...</div>
      ) : displayNotifications.length === 0 ? (
        <div className="no-notifications">No notifications to display.</div>
      ) : (
        <div className="notification-list">
          {displayNotifications.map((notif) => {
            const isExpanded = expandedNotifications[notif._id] || false;
            const isRead = readNotifications[notif._id] || false;
            
            return (
              <div
                key={notif._id}
                className={`notification-card ${isRead ? 'read' : ''}`}
                onClick={() => handleNotificationClick(notif._id)}
              >
                <div className="notification-card-header">
                  <h3 className="notification-title">{notif.title}</h3>
                  {!isRead && (
                    <div className="read-indicator">
                      <div className="notification-indicator"></div>
                      New
                    </div>
                  )}
                </div>
                
                <p className={`notification-description ${isExpanded ? '' : 'collapsed'}`}>
                  {notif.description}
                </p>
                
                <div className="expand-indicator">
                  {isExpanded ? 'Show less' : 'Show more'}
                </div>
                
                <div className="notification-footer">
                  <span className="notification-timestamp">
                    {new Date(notif.createdAt).toLocaleString()}
                  </span>
                  
                  <div className="notification-actions-menu">
                    <button 
                      className={`notification-action ${isRead ? 'unread' : 'read'}`}
                      onClick={(e) => handleMarkAsRead(notif._id, e)}
                    >
                      {isRead ? 'Mark as unread' : 'Mark as read'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Notification;
// import { useState, useEffect } from 'react';
// import api from '../../services/api';
// import { motion, AnimatePresence } from 'framer-motion';

// const NotificationBell = () => {
//   const [notifications, setNotifications] = useState([]);
//   const [showDropdown, setShowDropdown] = useState(false);

//   const fetchNotifications = async () => {
//     try {
//       const { data } = await api.get('/notifications');
//       setNotifications(data);
//     } catch (error) {
//       console.error('Failed to fetch notifications');
//     }
//   };

//   useEffect(() => {
//     fetchNotifications();
//     const interval = setInterval(fetchNotifications, 10000); // poll every 10 sec
//     return () => clearInterval(interval);
//   }, []);

//   const unreadCount = notifications.filter(n => !n.read).length;

//   const markAsRead = async (id) => {
//     await api.put(`/notifications/${id}/read`);
//     fetchNotifications();
//   };

//   return (
//     <div className="relative">
//       <button onClick={() => setShowDropdown(!showDropdown)} className="relative p-2">
//         🔔
//         {unreadCount > 0 && (
//           <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">{unreadCount}</span>
//         )}
//       </button>
//       <AnimatePresence>
//         {showDropdown && (
//           <motion.div
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -10 }}
//             className="absolute right-0 mt-2 w-80 bg-white border rounded shadow-lg z-50 max-h-96 overflow-y-auto"
//           >
//             {notifications.length === 0 ? (
//               <p className="p-3 text-gray-500">No notifications</p>
//             ) : (
//               notifications.map(n => (
//                 <div key={n._id} className={`p-3 border-b ${!n.read ? 'bg-blue-50' : ''}`}>
//                   <p className="text-sm">{n.message}</p>
//                   <p className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleString()}</p>
//                   {!n.read && <button onClick={() => markAsRead(n._id)} className="text-xs text-blue-600 mt-1">Mark read</button>}
//                 </div>
//               ))
//             )}
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default NotificationBell;

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import { useSocket } from '../../contexts/SocketContext';
import { useAuth } from '../../contexts/AuthContext';

const NotificationBell = () => {
  const { user } = useAuth();
  const { socket, online } = useSocket();
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch initial notifications from DB (for offline period)
  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.read).length);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    }
  };

  useEffect(() => {
    if (user) fetchNotifications();
  }, [user]);

  // Listen for live notifications via socket
  useEffect(() => {
    if (!socket || !online) return;

    const handleNewNotification = (notification) => {
      console.log('New notification:', notification);
      setNotifications(prev => [notification, ...prev]);
      if (!notification.read) {
        setUnreadCount(prev => prev + 1);
      }
      // Optional: show browser notification
      if (Notification.permission === 'granted') {
        new Notification('Carsphere', { body: notification.message });
      }
    };

    socket.on('notification', handleNewNotification);
    socket.on('bid_update', (data) => {
      // Optionally update UI elsewhere, but for bell we just show a toast
      console.log('Bid update received:', data);
    });

    return () => {
      socket.off('notification', handleNewNotification);
      socket.off('bid_update');
    };
  }, [socket, online]);

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(n => (n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark as read', error);
    }
  };

  const markAllAsRead = async () => {
    const unreadIds = notifications.filter(n => !n.read).map(n => n._id);
    await Promise.all(unreadIds.map(id => api.put(`/notifications/${id}/read`)));
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  // Request browser notification permission on first click
  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => {
          setShowDropdown(!showDropdown);
          requestNotificationPermission();
        }}
        className="relative p-2 focus:outline-none"
      >
        <span className="text-xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px]">
            {unreadCount}
          </span>
        )}
        {!online && (
          <span className="absolute bottom-0 right-0 w-2 h-2 bg-gray-400 rounded-full" title="Offline mode" />
        )}
      </button>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto"
          >
            <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800">
              <h3 className="font-semibold">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Mark all read
                </button>
              )}
            </div>
            {notifications.length === 0 ? (
              <p className="p-4 text-center text-gray-500">No notifications yet</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  className={`p-3 border-b border-gray-100 dark:border-gray-700 transition ${
                    !n.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  <p className="text-sm text-gray-800 dark:text-gray-200">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                  {!n.read && (
                    <button
                      onClick={() => markAsRead(n._id)}
                      className="text-xs text-blue-600 mt-2 hover:underline"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              ))
            )}
            {notifications.length > 5 && (
              <div className="p-2 text-center border-t">
                <button className="text-xs text-gray-500 hover:text-gray-700">
                  View all
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
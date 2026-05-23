// // import { createContext, useContext, useEffect, useState } from 'react';
// // import io from 'socket.io-client';
// // import { useAuth } from './AuthContext';

// // const SocketContext = createContext();

// // export const SocketProvider = ({ children }) => {
// //   const { user, loading } = useAuth();
// //   const [socket, setSocket] = useState(null);
// //   const [online, setOnline] = useState(false);

// //   useEffect(() => {
// //     if (loading || !user) return;

// //     const token = localStorage.getItem('token');
// //     const socketInstance = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000', {
// //       auth: { token },
// //       transports: ['websocket'],
// //     });

// //     socketInstance.on('connect', () => {
// //       console.log('Socket connected');
// //       setOnline(true);
// //     });
// //     socketInstance.on('disconnect', () => {
// //       console.log('Socket disconnected');
// //       setOnline(false);
// //     });
// //     socketInstance.on('connect_error', (err) => {
// //       console.error('Socket connection error:', err.message);
// //     });

// //     setSocket(socketInstance);

// //     return () => {
// //       socketInstance.disconnect();
// //     };
// //   }, [user, loading]);

// //   return (
// //     <SocketContext.Provider value={{ socket, online }}>
// //       {children}
// //     </SocketContext.Provider>
// //   );
// // };

// // export const useSocket = () => useContext(SocketContext);

// import { createContext, useContext, useEffect, useState } from 'react';
// import io from 'socket.io-client';
// import { useAuth } from './AuthContext';

// const SocketContext = createContext();

// export const SocketProvider = ({ children }) => {
//   const { user, loading } = useAuth();
//   const [socket, setSocket] = useState(null);
//   const [online, setOnline] = useState(false);

//   useEffect(() => {
//     if (loading || !user) return;

//     const token = localStorage.getItem('token');
//     const socketInstance = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000', {
//       auth: { token },
//       transports: ['websocket'],
//     });

//     socketInstance.on('connect', () => {
//       console.log('Socket connected');
//       setOnline(true);
//     });
//     socketInstance.on('disconnect', () => {
//       console.log('Socket disconnected');
//       setOnline(false);
//     });
//     socketInstance.on('connect_error', (err) => {
//       console.error('Socket connection error:', err.message);
//     });

//     setSocket(socketInstance);

//     return () => {
//       socketInstance.disconnect();
//     };
//   }, [user, loading]);

//   return (
//     <SocketContext.Provider value={{ socket, online }}>
//       {children}
//     </SocketContext.Provider>
//   );
// };

// export const useSocket = () => useContext(SocketContext);

import { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext({ socket: null, online: false }); // ✅ default value

export const SocketProvider = ({ children }) => {
  const { user, loading } = useAuth();
  const [socket, setSocket] = useState(null);
  const [online, setOnline] = useState(false);

  useEffect(() => {
    if (loading || !user) return;

    const token = localStorage.getItem('token');
    const socketInstance = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
  auth: { token },
  transports: ['websocket'],
});

    socketInstance.on('connect', () => {
      console.log('Socket connected');
      setOnline(true);
    });
    socketInstance.on('disconnect', () => {
      console.log('Socket disconnected');
      setOnline(false);
    });
    socketInstance.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [user, loading]);

  return (
    <SocketContext.Provider value={{ socket, online }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  // If context is undefined (shouldn't happen with default), return safe object
  return context || { socket: null, online: false };
};
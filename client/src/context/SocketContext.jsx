import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../store/authContext';
import { getSocketBaseUrl } from '../utils/socketEnv';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  const socket = useMemo(() => {
    try {
      const url = getSocketBaseUrl();
      return io(url, {
        autoConnect: false,
        transports: ['websocket', 'polling'],
        withCredentials: true,
        path: '/socket.io',
      });
    } catch (error) {
      console.error('Failed to initialize socket connection:', error);
      return null;
    }
  }, []);

  useEffect(() => {
    if (!socket) return undefined;
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) return;
    if (isAuthenticated && user?.id) {
      socket.emit('join', { userId: user.id });
    }
  }, [socket, isAuthenticated, user?.id]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};

export default SocketContext;

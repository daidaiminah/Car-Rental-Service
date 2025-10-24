import { Server } from 'socket.io';

let ioInstance = null;

export const initSocket = (httpServer, corsOptions = {}) => {
  ioInstance = new Server(httpServer, {
    cors: corsOptions,
  });

  ioInstance.on('connection', (socket) => {
    socket.on('join', ({ userId }) => {
      if (!userId) return;
      socket.join(`user:${userId}`);
    });

    socket.on('disconnect', () => {
      // No-op for now; kept for future logging or cleanup.
    });
  });

  return ioInstance;
};

export const getIO = () => ioInstance;

export const emitToUser = (userId, event, payload) => {
  if (!ioInstance || !userId) return;
  ioInstance.to(`user:${userId}`).emit(event, payload);
};

export const emitGlobally = (event, payload) => {
  if (!ioInstance) return;
  ioInstance.emit(event, payload);
};

export default {
  initSocket,
  getIO,
  emitToUser,
  emitGlobally,
};

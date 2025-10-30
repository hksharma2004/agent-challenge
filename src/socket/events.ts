import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { createClient } from 'redis';

export const setupSocketEvents = (io: Server) => {
  const subClient = createClient({ url: process.env.REDIS_URL });
  subClient.connect();

  subClient.subscribe('socket-events', (message) => {
    try {
      const { event, userId, data } = JSON.parse(message);
      emitToUser(io, userId, event, data);
    } catch (error) {
      console.error('Error parsing Redis message:', error);
    }
  });
  

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication error'));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      socket.data.userId = decoded.id;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket: Socket) => {
    console.log(`User connected: ${socket.data.userId}`);


    socket.join(`user:${socket.data.userId}`);

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.data.userId}`);
    });
  });

  return io;
};


export const emitToUser = (io: Server, userId: string, event: string, data: any) => {
  io.to(`user:${userId}`).emit(event, data);
};

export const emitToRoom = (io: Server, room: string, event: string, data: any) => {
  io.to(room).emit(event, data);
};
'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { ServerToClientEvents } from '@/types/socket-events';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000';

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket<ServerToClientEvents> | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const setupSocket = async () => {
      // Mocked socket connection without Supabase session
      const newSocket = io(SOCKET_URL);

      newSocket.on('connect', () => {
        setIsConnected(true);
        console.log('Socket connected');
      });

      newSocket.on('disconnect', () => {
        setIsConnected(false);
        console.log('Socket disconnected');
      });

      setSocket(newSocket);
    };

    setupSocket();

    return () => {
      socket?.disconnect();
    };
  }, []);

  return { socket, isConnected };
};

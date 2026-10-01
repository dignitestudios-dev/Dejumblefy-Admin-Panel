"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { getSocket, disconnectSocket } from "@/lib/socket";
import { SOCKET_EVENTS } from "@/lib/socket-events";
import { useAppSelector } from "@/store";

interface SocketContextValue {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextValue>({
  socket: null,
  isConnected: false,
});

export const useSocket = (): SocketContextValue => {
  return useContext(SocketContext);
};

interface SocketProviderProps {
  children: React.ReactNode;
}

export default function SocketProvider({ children }: SocketProviderProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { isAuthenticated, accessToken } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      disconnectSocket();
      setSocket(null);
      setIsConnected(false);
      return;
    }

    const socketClient = getSocket();
    setSocket(socketClient);

    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socketClient.on(SOCKET_EVENTS.CONNECT, onConnect);
    socketClient.on(SOCKET_EVENTS.DISCONNECT, onDisconnect);

    if (!socketClient.connected) {
      socketClient.connect();
    } else {
      setIsConnected(true);
    }

    return () => {
      socketClient.off(SOCKET_EVENTS.CONNECT, onConnect);
      socketClient.off(SOCKET_EVENTS.DISCONNECT, onDisconnect);
    };
  }, [isAuthenticated, accessToken]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>{children}</SocketContext.Provider>
  );
}

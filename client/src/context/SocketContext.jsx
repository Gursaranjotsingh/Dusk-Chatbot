import { createContext, useEffect, useRef, useState, useContext } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";
import { SOCKET_URL } from "../utils/api";

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { token, user } = useContext(AuthContext);
  const socketRef = useRef(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!token || !user) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setConnected(false);
      }
      return;
    }

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));
    socket.on("online-users", (userIds) => setOnlineUsers(userIds));
    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token, user]);

  return (
    <SocketContext.Provider
      value={{ socket: socketRef.current, onlineUsers, connected }}
    >
      {children}
    </SocketContext.Provider>
  );
};

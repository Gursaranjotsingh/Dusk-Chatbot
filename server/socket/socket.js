import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Message from "../models/Message.js";

// userId -> Set of socket ids (supports multiple tabs/devices)
const onlineUsers = new Map();

const addOnlineUser = (userId, socketId) => {
  if (!onlineUsers.has(userId)) {
    onlineUsers.set(userId, new Set());
  }
  onlineUsers.get(userId).add(socketId);
};

const removeOnlineUser = (userId, socketId) => {
  if (onlineUsers.has(userId)) {
    onlineUsers.get(userId).delete(socketId);
    if (onlineUsers.get(userId).size === 0) {
      onlineUsers.delete(userId);
    }
  }
};

const getOnlineUserIds = () => Array.from(onlineUsers.keys());

export const initSocket = (io) => {
  // Authenticate every socket connection using the JWT
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) {
        return next(new Error("Authentication error: token missing"));
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user) {
        return next(new Error("Authentication error: user not found"));
      }
      socket.userId = user._id.toString();
      socket.username = user.username;
      next();
    } catch (err) {
      next(new Error("Authentication error: invalid token"));
    }
  });

  io.on("connection", async (socket) => {
    const userId = socket.userId;
    console.log(`Socket connected: ${socket.username} (${socket.id})`);

    addOnlineUser(userId, socket.id);
    socket.join(userId); // personal room for direct messaging

    try {
      await User.findByIdAndUpdate(userId, { isOnline: true });
    } catch (err) {
      console.error("Error setting user online:", err.message);
    }

    // Broadcast updated online list to everyone
    io.emit("online-users", getOnlineUserIds());

    // --- Send message ---
    socket.on("send-message", async ({ receiver, text }) => {
      try {
        if (!receiver || !text || !text.trim()) return;

        const message = await Message.create({
          sender: userId,
          receiver,
          text: text.trim(),
        });

        const populated = await message.populate([
          { path: "sender", select: "username avatarColor" },
          { path: "receiver", select: "username avatarColor" },
        ]);

        // Send to receiver (if online) and echo back to sender
        io.to(receiver).emit("receive-message", populated);
        io.to(userId).emit("receive-message", populated);
      } catch (err) {
        console.error("send-message error:", err.message);
        socket.emit("message-error", { message: "Failed to send message" });
      }
    });

    // --- Typing indicators ---
    socket.on("typing", ({ receiver }) => {
      if (receiver) {
        io.to(receiver).emit("typing", { sender: userId });
      }
    });

    socket.on("stop-typing", ({ receiver }) => {
      if (receiver) {
        io.to(receiver).emit("stop-typing", { sender: userId });
      }
    });

    // --- Seen receipts ---
    socket.on("mark-seen", async ({ senderId }) => {
      try {
        await Message.updateMany(
          { sender: senderId, receiver: userId, seen: false },
          { seen: true, seenAt: new Date() }
        );
        io.to(senderId).emit("messages-seen", { by: userId });
      } catch (err) {
        console.error("mark-seen error:", err.message);
      }
    });

    // --- Disconnect ---
    socket.on("disconnect", async () => {
      console.log(`Socket disconnected: ${socket.username} (${socket.id})`);
      removeOnlineUser(userId, socket.id);

      // Only mark fully offline if no other sockets remain for this user
      if (!onlineUsers.has(userId)) {
        try {
          await User.findByIdAndUpdate(userId, {
            isOnline: false,
            lastSeen: new Date(),
          });
        } catch (err) {
          console.error("Error setting user offline:", err.message);
        }
      }

      io.emit("online-users", getOnlineUserIds());
    });
  });
};

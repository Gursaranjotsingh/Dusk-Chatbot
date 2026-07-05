import { useEffect, useRef, useState, useCallback } from "react";
import EmojiPicker from "emoji-picker-react";
import toast from "react-hot-toast";
import { format } from "date-fns";
import Avatar from "./Avatar";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import Loader from "./Loader";
import api from "../utils/api";
import { useAuth } from "../hooks/useAuth";
import { useSocket } from "../hooks/useSocket";

const ChatWindow = ({ activeUser, onlineUsers }) => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const bottomRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const isOnline = activeUser ? onlineUsers.includes(activeUser._id) : false;

  const scrollToBottom = useCallback((behavior = "smooth") => {
    bottomRef.current?.scrollIntoView({ behavior });
  }, []);

  // Load conversation history when active user changes
  useEffect(() => {
    if (!activeUser) return;

    setLoading(true);
    setMessages([]);
    setShowEmoji(false);

    api
      .get(`/messages/${activeUser._id}`)
      .then(({ data }) => {
        setMessages(data.messages);
        setTimeout(() => scrollToBottom("auto"), 50);
      })
      .catch(() => toast.error("Couldn't load this conversation"))
      .finally(() => setLoading(false));
  }, [activeUser, scrollToBottom]);

  // Socket listeners
  useEffect(() => {
    if (!socket) return;

    const handleReceive = (message) => {
      const otherId =
        message.sender._id === user._id ? message.receiver._id : message.sender._id;

      if (activeUser && otherId === activeUser._id) {
        setMessages((prev) => [...prev, message]);
        if (message.sender._id === activeUser._id) {
          socket.emit("mark-seen", { senderId: activeUser._id });
        }
      }
    };

    const handleTyping = ({ sender }) => {
      if (activeUser && sender === activeUser._id) setIsTyping(true);
    };

    const handleStopTyping = ({ sender }) => {
      if (activeUser && sender === activeUser._id) setIsTyping(false);
    };

    const handleSeen = ({ by }) => {
      if (activeUser && by === activeUser._id) {
        setMessages((prev) => prev.map((m) => ({ ...m, seen: true })));
      }
    };

    socket.on("receive-message", handleReceive);
    socket.on("typing", handleTyping);
    socket.on("stop-typing", handleStopTyping);
    socket.on("messages-seen", handleSeen);

    return () => {
      socket.off("receive-message", handleReceive);
      socket.off("typing", handleTyping);
      socket.off("stop-typing", handleStopTyping);
      socket.off("messages-seen", handleSeen);
    };
  }, [socket, activeUser, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const handleTextChange = (e) => {
    setText(e.target.value);
    if (!socket || !activeUser) return;

    socket.emit("typing", { receiver: activeUser._id });

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop-typing", { receiver: activeUser._id });
    }, 1200);
  };

  const handleSend = (e) => {
    e?.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || !activeUser || !socket) return;

    socket.emit("send-message", { receiver: activeUser._id, text: trimmed });
    socket.emit("stop-typing", { receiver: activeUser._id });
    clearTimeout(typingTimeoutRef.current);
    setText("");
    setShowEmoji(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const onEmojiClick = (emojiData) => {
    setText((prev) => prev + emojiData.emoji);
  };

  if (!activeUser) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal to-dusk-600 flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path
              d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 className="font-display font-semibold text-lg">
          Pick someone to talk to
        </h2>
        <p className="text-sm text-dusk-400 max-w-xs">
          Choose a person from the list to start a real-time conversation.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full min-w-0">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-dusk-200 dark:border-dusk-800">
        <Avatar
          username={activeUser.username}
          color={activeUser.avatarColor}
          avatarUrl={activeUser.avatarUrl}
          isOnline={isOnline}
        />
        <div className="min-w-0">
          <p className="font-medium text-sm truncate">{activeUser.username}</p>
          <p className="text-xs text-dusk-400">
            {isOnline
              ? "Online"
              : activeUser.lastSeen
              ? `Last seen ${format(new Date(activeUser.lastSeen), "MMM d, h:mm a")}`
              : "Offline"}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {loading ? (
          <Loader label="Loading conversation" />
        ) : messages.length === 0 ? (
          <p className="text-center text-xs text-dusk-400 mt-10">
            No messages yet. Say hello to {activeUser.username}!
          </p>
        ) : (
          messages.map((m) => (
            <MessageBubble
              key={m._id}
              message={m}
              isOwn={(m.sender._id || m.sender) === user._id}
            />
          ))
        )}
        {isTyping && <TypingIndicator username={activeUser.username} />}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSend}
        className="relative flex items-end gap-2 p-3 border-t border-dusk-200 dark:border-dusk-800"
      >
        {showEmoji && (
          <div className="absolute bottom-16 left-3 z-10 shadow-panel rounded-xl overflow-hidden">
            <EmojiPicker onEmojiClick={onEmojiClick} theme="auto" height={350} />
          </div>
        )}

        <button
          type="button"
          onClick={() => setShowEmoji((s) => !s)}
          aria-label="Toggle emoji picker"
          className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center bg-dusk-100 dark:bg-dusk-800 hover:opacity-80 transition-opacity focus-ring"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
            <path
              d="M8.5 14.5s1.2 2 3.5 2 3.5-2 3.5-2"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path d="M9 10h.01M15 10h.01" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </button>

        <textarea
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Write a message… (Enter to send)"
          className="flex-1 resize-none max-h-32 rounded-xl px-4 py-2.5 bg-dusk-100 dark:bg-dusk-800 text-sm placeholder:text-dusk-400 focus-ring"
        />

        <button
          type="submit"
          disabled={!text.trim()}
          aria-label="Send message"
          className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center bg-gradient-to-br from-amber to-amber-dark text-white disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity focus-ring"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 11l18-8-8 18-2.5-7.5L3 11z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
              fill="currentColor"
            />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;

import { useState } from "react";
import Navbar from "../components/Navbar";
import UserList from "../components/UserList";
import ChatWindow from "../components/ChatWindow";
import { useSocket } from "../hooks/useSocket";

const Chat = () => {
  const [activeUser, setActiveUser] = useState(null);
  const { onlineUsers } = useSocket();
  const [showSidebarOnMobile, setShowSidebarOnMobile] = useState(true);

  const handleSelectUser = (u) => {
    setActiveUser(u);
    setShowSidebarOnMobile(false);
  };

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex overflow-hidden">
        <aside
          className={`w-full sm:w-80 shrink-0 border-r border-dusk-200 dark:border-dusk-800 bg-white/60 dark:bg-dusk-900/60 ${
            showSidebarOnMobile ? "flex" : "hidden"
          } sm:flex flex-col`}
        >
          <UserList
            activeUser={activeUser}
            onSelectUser={handleSelectUser}
            onlineUsers={onlineUsers}
          />
        </aside>

        <main
          className={`flex-1 ${
            showSidebarOnMobile ? "hidden" : "flex"
          } sm:flex flex-col min-w-0`}
        >
          {activeUser && (
            <button
              onClick={() => setShowSidebarOnMobile(true)}
              className="sm:hidden flex items-center gap-1 px-4 py-2 text-xs text-dusk-400 border-b border-dusk-200 dark:border-dusk-800"
            >
              ← Back to people
            </button>
          )}
          <ChatWindow activeUser={activeUser} onlineUsers={onlineUsers} />
        </main>
      </div>
    </div>
  );
};

export default Chat;

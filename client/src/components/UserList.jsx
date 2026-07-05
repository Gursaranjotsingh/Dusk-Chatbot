import { useState, useEffect, useCallback } from "react";
import Avatar from "./Avatar";
import api from "../utils/api";

const UserList = ({ activeUser, onSelectUser, onlineUsers }) => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async (searchTerm = "") => {
    try {
      setLoading(true);
      const { data } = await api.get("/users", {
        params: searchTerm ? { search: searchTerm } : {},
      });
      setUsers(data.users);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchUsers(search);
    }, 300);
    return () => clearTimeout(timeout);
  }, [search, fetchUsers]);

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-dusk-200 dark:border-dusk-800">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-dusk-400"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              cx="11"
              cy="11"
              r="7"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M21 21l-4.35-4.35"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search people…"
            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-dusk-100 dark:bg-dusk-800 text-sm placeholder:text-dusk-400 focus-ring"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading && (
          <p className="text-center text-xs text-dusk-400 py-6">
            Loading people…
          </p>
        )}

        {!loading && users.length === 0 && (
          <p className="text-center text-xs text-dusk-400 py-6 px-4">
            No one matches "{search}". Try a different name.
          </p>
        )}

        {users.map((u) => {
          const isOnline = onlineUsers.includes(u._id);
          const isActive = activeUser?._id === u._id;
          return (
            <button
              key={u._id}
              onClick={() => onSelectUser(u)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                isActive
                  ? "bg-dusk-100 dark:bg-dusk-800"
                  : "hover:bg-dusk-100/60 dark:hover:bg-dusk-800/60"
              }`}
            >
              <Avatar
                username={u.username}
                color={u.avatarColor}
                avatarUrl={u.avatarUrl}
                isOnline={isOnline}
              />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm truncate">{u.username}</p>
                <p className="text-xs text-dusk-400 truncate">
                  {isOnline ? "Online" : "Offline"}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default UserList;

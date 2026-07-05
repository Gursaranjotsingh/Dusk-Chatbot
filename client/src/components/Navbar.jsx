import { useEffect, useState } from "react";
import Avatar from "./Avatar";
import { useAuth } from "../hooks/useAuth";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [dark, setDark] = useState(
    () => localStorage.getItem("chat_theme") === "dark"
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("chat_theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <header className="flex items-center justify-between px-5 py-3 border-b border-dusk-200 dark:border-dusk-800 bg-white/70 dark:bg-dusk-900/70 backdrop-blur">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal to-dusk-600 flex items-center justify-center">
          <span className="text-white font-display font-bold text-sm">D</span>
        </div>
        <h1 className="font-display font-bold text-lg tracking-tight">
          Dusk
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setDark((d) => !d)}
          aria-label="Toggle dark mode"
          className="w-9 h-9 rounded-xl flex items-center justify-center bg-dusk-100 dark:bg-dusk-800 hover:opacity-80 transition-opacity focus-ring"
        >
          {dark ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
              <path
                d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M21 12.8A9 9 0 1111.2 3 7 7 0 0021 12.8z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>

        <div className="flex items-center gap-2 pl-1">
          <Avatar
            username={user?.username}
            color={user?.avatarColor}
            avatarUrl={user?.avatarUrl}
            size="sm"
          />
          <span className="hidden sm:block text-sm font-medium">
            {user?.username}
          </span>
        </div>

        <button
          onClick={logout}
          className="text-xs font-medium px-3 py-2 rounded-xl bg-dusk-100 dark:bg-dusk-800 hover:bg-dusk-200 dark:hover:bg-dusk-800/70 transition-colors focus-ring"
        >
          Log out
        </button>
      </div>
    </header>
  );
};

export default Navbar;

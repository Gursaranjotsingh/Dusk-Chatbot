const Avatar = ({ username, color, avatarUrl, isOnline, size = "md" }) => {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-11 h-11 text-sm",
    lg: "w-16 h-16 text-lg",
  };

  const initial = username ? username.charAt(0).toUpperCase() : "?";

  return (
    <div className="relative shrink-0">
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={username}
          className={`${sizes[size]} rounded-2xl object-cover shadow-bubble`}
          referrerPolicy="no-referrer"
        />
      ) : (
        <div
          className={`${sizes[size]} rounded-2xl flex items-center justify-center font-display font-semibold text-white shadow-bubble`}
          style={{ backgroundColor: color || "#8B87B8" }}
        >
          {initial}
        </div>
      )}
      {isOnline !== undefined && (
        <span
          className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-dusk-50 dark:border-dusk-950 ${
            isOnline ? "bg-teal animate-pulse-ring" : "bg-dusk-400"
          }`}
        />
      )}
    </div>
  );
};

export default Avatar;

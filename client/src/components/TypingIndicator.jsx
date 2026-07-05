const TypingIndicator = ({ username }) => {
  return (
    <div className="flex items-end gap-2 px-4 py-1 animate-pop-in">
      <div className="bubble-received bg-white dark:bg-dusk-800 shadow-bubble px-4 py-3 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-dusk-400 animate-wave-dot" />
        <span
          className="w-1.5 h-1.5 rounded-full bg-dusk-400 animate-wave-dot"
          style={{ animationDelay: "0.15s" }}
        />
        <span
          className="w-1.5 h-1.5 rounded-full bg-dusk-400 animate-wave-dot"
          style={{ animationDelay: "0.3s" }}
        />
      </div>
      {username && (
        <span className="text-[11px] text-dusk-400 pb-1">
          {username} is typing
        </span>
      )}
    </div>
  );
};

export default TypingIndicator;

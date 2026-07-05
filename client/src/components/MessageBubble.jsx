import { format } from "date-fns";

const CheckIcon = ({ double, seen }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    className={seen ? "text-sky-400" : "text-white/60"}
  >
    <path
      d="M2 8.5L5.2 11.7L11 4.3"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {double && (
      <path
        d="M6 8.5L9.2 11.7L15 4.3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    )}
  </svg>
);

const MessageBubble = ({ message, isOwn }) => {
  const time = message.createdAt
    ? format(new Date(message.createdAt), "h:mm a")
    : "";

  return (
    <div
      className={`flex w-full mb-2 animate-pop-in ${
        isOwn ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[75%] sm:max-w-[60%] px-4 py-2.5 shadow-bubble break-words ${
          isOwn
            ? "bubble-sent bg-gradient-to-br from-amber to-amber-dark"
            : "bubble-received bg-white dark:bg-dusk-800"
        }`}
      >
        <p
          className={`text-sm leading-relaxed whitespace-pre-wrap ${
            isOwn
              ? "text-white"
              : "text-teal-dark dark:text-teal-light font-medium"
          }`}
        >
          {message.text}
        </p>
        <div
          className={`flex items-center gap-1 mt-1 justify-end ${
            isOwn ? "text-white/70" : "text-dusk-400"
          }`}
        >
          <span className="text-[10px] font-mono">{time}</span>
          {isOwn && <CheckIcon double seen={message.seen} />}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;

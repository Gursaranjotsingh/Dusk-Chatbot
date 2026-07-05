const Loader = ({ label = "Loading" }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 h-full w-full py-16">
      <div className="flex gap-1.5">
        <span className="w-2.5 h-2.5 rounded-full bg-amber animate-wave-dot" />
        <span
          className="w-2.5 h-2.5 rounded-full bg-teal animate-wave-dot"
          style={{ animationDelay: "0.15s" }}
        />
        <span
          className="w-2.5 h-2.5 rounded-full bg-dusk-400 animate-wave-dot"
          style={{ animationDelay: "0.3s" }}
        />
      </div>
      <p className="text-sm text-dusk-400 font-medium">{label}…</p>
    </div>
  );
};

export default Loader;

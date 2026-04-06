function formatTime(ms: number) {
  const total = Math.max(0, ms);
  const minutes = Math.floor(total / 60000);
  const seconds = Math.floor((total % 60000) / 1000);
  const tenths = Math.floor((total % 1000) / 100);

  if (minutes === 0 && seconds < 10) {
    return `${seconds}.${tenths}`;
  }
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function isLow(ms: number) {
  return ms < 30000; // under 30s
}

function isCritical(ms: number) {
  return ms < 10000; // under 10s
}

export const ClockFace = ({
  color,
  timeMs,
  active,
}: {
  color: "white" | "black";
  timeMs: number;
  active: boolean;
}) => {
  const low = isLow(timeMs);
  const critical = isCritical(timeMs);

  return (
    <div
      className="flex items-center gap-3 px-4 py-2.5 border transition-all duration-200"
      style={{
        borderColor: active
          ? critical
            ? "#b85040"
            : low
              ? "#c8a96e"
              : "#2a2a2a"
          : "#1a1a1a",
        background: active ? "#0e0e0e" : "#080808",
      }}
    >
      {/* Color indicator */}
      <div
        className="w-2 h-2 shrink-0 border"
        style={{
          background: color === "white" ? "#f0ebe0" : "#1a1a1a",
          borderColor: color === "white" ? "#999" : "#333",
        }}
      />

      {/* Label */}
      <span
        className="text-xs tracking-[0.15em] uppercase font-light w-10"
        style={{ color: active ? "#888" : "#333" }}
      >
        {color}
      </span>

      {/* Time */}
      <span
        className="font-light tabular-nums text-xl leading-none min-w-16 text-right"
        style={{
          fontFamily: "Georgia, serif",
          color: critical
            ? "#b85040"
            : low
              ? "#c8a96e"
              : active
                ? "#f0ebe0"
                : "#333",
        }}
      >
        {formatTime(timeMs)}
      </span>

      {/* Active pulse */}
      {active && (
        <div
          className="w-1.5 h-1.5 rounded-full shrink-0"
          style={{
            background: critical ? "#b85040" : "#c8a96e",
            animation: "pulse 1s ease-in-out infinite",
          }}
        />
      )}
    </div>
  );
};

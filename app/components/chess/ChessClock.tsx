"use client";

import { useEffect, useState } from "react";
import { useGameStore } from "@/store/useGameStore";
import { ClockFace } from "./ClockFace";

export default function ChessClock() {
  const { turn, serverTime, lastTimestamp } = useGameStore();

  const [localTime, setLocalTime] = useState({
    white: serverTime.white,
    black: serverTime.black,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Date.now() - lastTimestamp;
      setLocalTime({
        white: turn === "white" ? serverTime.white - elapsed : serverTime.white,
        black: turn === "black" ? serverTime.black - elapsed : serverTime.black,
      });
    }, 100);
    return () => clearInterval(interval);
  }, [turn, serverTime, lastTimestamp]);

  return (
    <>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }
      `}</style>
      <div
        className="flex gap-1 w-full mb-2"
        style={{ maxWidth: "clamp(280px, 80vw, 504px)" }}
      >
        <div className="flex-1">
          <ClockFace
            color="black"
            timeMs={localTime.black}
            active={turn === "black"}
          />
        </div>
        <div className="flex-1">
          <ClockFace
            color="white"
            timeMs={localTime.white}
            active={turn === "white"}
          />
        </div>
      </div>
    </>
  );
}

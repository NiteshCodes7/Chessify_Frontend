"use client";

import { api } from "@/lib/api";
import { useToast } from "@/store/useToast";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function AddFriend() {
  const [status, setStatus] = useState<{ msg: string; ok: boolean } | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [results, setResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const addToast = useToast((state) => state.addToast);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setSearching(true);

        const res = await api.get("/friends/search", {
          params: { q: query },
        });

        setResults(res.data);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  async function sendRequest(identifier: string) {
    try {
      setLoading(true);

      await api.post("/friends/request", { identifier });

      addToast("Request sent successfully.", "success");

      setQuery("");
      setResults([]);
      setStatus(null);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      addToast(
        err?.response?.data?.message || "Failed to send request.",
        "error", 50, 50
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Description */}
      <p className="text-[#878383] text-xs font-light leading-relaxed">
        Enter a player&apos;s email address or username to send them a friend
        request.
      </p>

      {/* Input row */}
      <div className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            {/* Search icon */}
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6c6a6a] pointer-events-none"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>

            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by email or username"
              className="w-full h-9 pl-9 pr-3 bg-[#0e0e0e] border border-[#1a1a1a] text-[#d0c8b8] placeholder-[#6c6a6a] text-xs font-light tracking-wide focus:outline-none focus:border-[#2a2a2a] transition-colors duration-150"
            />
          </div>
        </div>

        {/* Fixed/Floating Dropdown */}
        {(results.length > 0 || searching) && (
          <div
            className="absolute left-0 right-0 top-full mt-2 z-50 overflow-hidden border border-[#1a1a1a] bg-[#0e0e0e] shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
            style={{ maxHeight: "260px", overflowY: "auto" }}
          >
            {searching && (
              <div className="px-3 py-3 text-xs text-[#666]">Searching...</div>
            )}

            {!searching &&
              results.map((user) => (
                <button
                  key={user.id}
                  disabled={loading}
                  onClick={() => sendRequest(user.email)}
                  className="w-full px-3 py-2 flex items-center gap-3 hover:bg-[#151515] border-b border-[#141414] last:border-b-0"
                >
                  <Image
                    src={user.avatar || "/assets/default-avatar.png"}
                    alt={user.username}
                    width={28}
                    height={28}
                    className="w-7 h-7 rounded-full object-cover"
                  />

                  <div className="text-left min-w-0">
                    <p className="text-[#d0c8b8] text-xs truncate">
                      @{user.username}
                    </p>
                    <p className="text-[#666] text-[11px] truncate">
                      {user.email}
                    </p>
                  </div>
                </button>
              ))}

            {!searching && results.length === 0 && query.trim().length >= 2 && (
              <div className="px-3 py-3 text-xs text-[#666]">
                No players found
              </div>
            )}
          </div>
        )}
      </div>

      {/* Status message */}
      {status && (
        <div
          className="flex items-center gap-2 px-3 py-2 border"
          style={{
            borderColor: status.ok ? "#2a4a2a" : "#3a1a1a",
            background: status.ok
              ? "rgba(74,138,74,0.05)"
              : "rgba(138,48,48,0.05)",
          }}
        >
          {/* Icon */}
          {status.ok ? (
            <svg
              className="w-3 h-3 text-[#4a8a4a] shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg
              className="w-3 h-3 text-[#8a4a4a] shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          )}
          <p
            className="text-xs font-light"
            style={{ color: status.ok ? "#4a8a4a" : "#8a4a4a" }}
          >
            {status.msg}
          </p>
        </div>
      )}
    </div>
  );
}

"use client";

import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function EditProfilePage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");
  const [initialUsername, setInitialUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [uploading, setUploading] = useState(false);

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // preview instantly
    const localUrl = URL.createObjectURL(file);
    setAvatar(localUrl);

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await api.post("/users/me/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setAvatar(data.url);
    } catch {
      setAvatar("");
    } finally {
      setUploading(false);
    }
  }

  async function handleAvatarDelete() {
    try {
      setUploading(true);
      await api.delete("/users/me/avatar");
      setAvatar("");
    } finally {
      setUploading(false);
    }
  }

  useEffect(() => {
    const load = async () => {
      const { data } = await api.get("/auth/me");
      setName(data.name ?? "");
      setUsername(data.username ?? "");
      setInitialUsername(data.username ?? "");
      setAvatar(data.avatar ?? "");
    };
    load();
  }, []);

  useEffect(() => {
    if (!username || username.length < 3) {
      setIsAvailable(null);
      setSuggestions([]);
      return;
    }
    if (username === initialUsername) {
      setIsAvailable(null);
      setSuggestions([]);
      return;
    }
    const delay = setTimeout(async () => {
      try {
        setChecking(true);
        const res = await api.get("/auth/check-username", {
          params: { username },
        });
        setIsAvailable(res.data.available);
        setSuggestions(res.data.available ? [] : (res.data.suggestions ?? []));
      } catch {
        setIsAvailable(null);
        setSuggestions([]);
      } finally {
        setChecking(false);
      }
    }, 400);
    return () => clearTimeout(delay);
  }, [username, initialUsername]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (username.length < 3)
      return setError("Username must be at least 3 characters.");
    if (!/^[a-z0-9_]+$/.test(username))
      return setError("Only lowercase letters, numbers, underscores allowed.");
    try {
      setLoading(true);
      const { data } = await api.patch("/users/me", { name, username });
      if (data?.error) {
        setError(data.error);
        setSuggestions(data.suggestions ?? []);
        return;
      }
      router.push("/auth/profile");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err?.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  }

  const avatarLetter =
    username?.[0]?.toUpperCase() || name?.[0]?.toUpperCase() || "?";

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.5s ease both; }
        .field-input {
          width: 100%;
          height: 40px;
          background: #0a0a0a;
          border: 1px solid #1a1a1a;
          color: #d0c8b8;
          font-size: 13px;
          font-weight: 300;
          padding: 0 12px;
          outline: none;
          transition: border-color 0.15s;
          font-family: inherit;
        }
        .field-input::placeholder { color: #595757; }
        .field-input:focus { border-color: #2a2520; }
      `}</style>

      {/* Background glows */}
      <div className="fixed inset-0 bg-[#060608]" />
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(180,140,55,0.07) 0%, transparent 65%)",
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-5">
        <Image
          src={"/assets/logo_chessify.png"}
          alt="logo"
          width={100}
          height={100}
          onClick={() => router.push("/")}
          className="text-[#c8a96e] text-sm tracking-widest uppercase font-light hover:opacity-70 transition-opacity no-underline"
          style={{ fontFamily: "Georgia, serif" }}
        />
      </nav>

      <form
        onSubmit={onSubmit}
        className="relative w-full max-w-md fade-up z-90 p-8"
      >
        {/* Top Left Corner */}
        <span className="absolute top-0 left-0 w-4.5 h-4.5 border-t border-l border-[#c8a96e]" />

        {/* Bottom Right Corner */}
        <span className="absolute bottom-0 right-0 w-4.5 h-4.5 border-b border-r border-[#c8a96e]" />

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <span className="block w-8 h-px bg-[#c8a96e] opacity-40" />
          <span className="text-[#c8a96e] text-xs tracking-[0.25em] uppercase">
            Edit profile
          </span>
        </div>

        <h1
          className="text-4xl font-light text-[#f0ebe0] mb-8 leading-none"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Your <span className="italic text-[#c8a96e]">identity</span>
        </h1>

        {/* Avatar row */}
        <div className="mb-8 pb-8 border-b border-[#111]">
          <p className="text-[#444] text-[10px] tracking-[0.2em] uppercase mb-4">
            Avatar
          </p>
          <div className="flex items-center gap-4">
            {/* Preview */}
            <div className="relative shrink-0 group">
              <div className="w-14 h-14 border border-[#2a2520] bg-[#0e0e0e] overflow-hidden flex items-center justify-center">
                {uploading ? (
                  <div className="w-4 h-4 rounded-full border border-[#c8a96e]/30 border-t-[#c8a96e] animate-spin" />
                ) : avatar ? (
                  <Image
                    src={avatar}
                    alt="avatar"
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span
                    className="text-[#c8a96e] text-xl font-light"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    {avatarLetter}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 flex-1">
              {/* Upload button */}
              <label className="cursor-pointer h-9 px-4 border border-[#1e1e1e] text-[#878383] hover:border-[#c8a96e] hover:text-[#c8a96e] transition-all duration-150 text-xs font-light tracking-wide flex items-center gap-2 w-fit">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="w-3.5 h-3.5"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                Upload image
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                  disabled={uploading}
                />
              </label>

              {/* Delete button — only if avatar exists */}
              {avatar && (
                <button
                  type="button"
                  onClick={handleAvatarDelete}
                  disabled={uploading}
                  className="h-9 px-4 border border-[#1e1e1e] text-[#555] hover:border-[#8a3030] hover:text-[#c06060] transition-all duration-150 text-xs font-light tracking-wide flex items-center gap-2 w-fit disabled:opacity-30"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="w-3.5 h-3.5"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14H6L5 6" />
                    <path d="M10 11v6M14 11v6" />
                    <path d="M9 6V4h6v2" />
                  </svg>
                  Remove avatar
                </button>
              )}

              <p className="text-[#444] text-[10px] font-light">
                JPG, PNG or WebP · max 5MB
              </p>
            </div>
          </div>
        </div>

        {/* Name field */}
        <div className="mb-5">
          <label className="block text-[10px] tracking-[0.2em] uppercase text-[#878383] mb-2">
            Full name
          </label>
          <input
            type="text"
            placeholder="Your name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="field-input"
          />
        </div>

        {/* Username field */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-[10px] tracking-[0.2em] uppercase text-[#878383]">
              Username
            </label>
            {checking && (
              <span className="text-[10px] text-[#6c6767] font-light">
                Checking…
              </span>
            )}
            {!checking && isAvailable === true && (
              <span className="text-[10px] text-[#49de32] font-light flex items-center gap-1">
                <svg
                  className="w-2.5 h-2.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Available
              </span>
            )}
            {!checking && isAvailable === false && (
              <span className="text-[10px] text-[#d12828] font-light flex items-center gap-1">
                <svg
                  className="w-2.5 h-2.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
                Taken
              </span>
            )}
          </div>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#878383] text-sm font-light select-none">
              @
            </span>
            <input
              value={username}
              onChange={(e) => {
                setUsername(e.target.value.toLowerCase());
                setError(null);
              }}
              placeholder="username"
              className="field-input"
              style={{ paddingLeft: "1.6rem" }}
            />
            {/* Availability indicator bar */}
            <div
              className="absolute bottom-0 left-0 right-0 h-px transition-all duration-300"
              style={{
                background:
                  isAvailable === true
                    ? "#4a8a4a"
                    : isAvailable === false
                      ? "#8a4a4a"
                      : "transparent",
                opacity: 0.8,
              }}
            />
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="mt-3">
              <p className="text-[#646060] text-[10px] mb-2 font-light">
                Try one of these:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setUsername(s);
                      setSuggestions([]);
                      setError(null);
                    }}
                    className="px-2.5 py-1 text-[10px] border border-[#1e1e1e] text-[#c8a96e] hover:border-[#c8a96e] hover:bg-[#c8a96e]/5 transition-all duration-150 font-light"
                  >
                    @{s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 border border-[#3a1a1a] bg-[#1a0808] px-3 py-2 mb-5">
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
            <p className="text-[#8a4a4a] text-xs font-light">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={() => router.push("/auth/profile")}
            className="flex-1 h-10 text-xs font-light tracking-[0.12em] uppercase border border-[#1a1a1a] text-[#878383] hover:border-[#2a2a2a] hover:text-[#878383] transition-all duration-150"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || uploading || isAvailable === false}
            className="flex-1 h-10 text-xs font-light tracking-[0.15em] uppercase border transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              borderColor: "#c8a96e",
              color: "#0a0a0a",
              background: loading ? "#a88f5a" : "#c8a96e",
            }}
            onMouseEnter={(e) => {
              if (!loading)
                (e.currentTarget as HTMLButtonElement).style.background =
                  "#d4ba80";
            }}
            onMouseLeave={(e) => {
              if (!loading)
                (e.currentTarget as HTMLButtonElement).style.background =
                  "#c8a96e";
            }}
          >
            {loading ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthProvider";

export default function LandingPage() {
  const router = useRouter();
  const { loading, authed } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="w-10 h-10 rounded-full border-2 border-[#222] border-t-[#c8a96e] animate-spin" />
      </div>
    );
  }

  const pieces: Record<string, string> = {
    "0,0": "♜", "0,1": "♞", "0,2": "♝", "0,3": "♛",
    "0,4": "♚", "0,5": "♝", "0,6": "♞", "0,7": "♜",
    "1,0": "♟", "1,1": "♟", "1,2": "♟", "1,3": "♟",
    "1,4": "♟", "1,5": "♟", "1,6": "♟", "1,7": "♟",
    "4,4": "♙", "3,3": "♟", "4,3": "♙", "3,4": "♟",
    "6,0": "♙", "6,1": "♙", "6,2": "♙", "6,3": "♙",
    "6,4": "♙", "6,5": "♙", "6,6": "♙", "6,7": "♙",
    "7,0": "♖", "7,1": "♘", "7,2": "♗", "7,3": "♕",
    "7,4": "♔", "7,5": "♗", "7,6": "♘", "7,7": "♖",
  };
  const highlighted = new Set(["4,4", "3,3"]);

  const features = [
    {
      title: "Real-time matchmaking",
      desc: "Instantly matched against players of equal skill using our Elo-based rating system.",
      icon: (
        <svg className="w-8 h-8 text-[#c8a96e]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      ),
    },
    {
      title: "Live presence",
      desc: "See when your friends are online, playing, or away. Challenge them instantly.",
      icon: (
        <svg className="w-8 h-8 text-[#c8a96e]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
        </svg>
      ),
    },
    {
      title: "In-game chat",
      desc: "Communicate with your opponent during play. Friendly banter, respect always.",
      icon: (
        <svg className="w-8 h-8 text-[#c8a96e]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
    {
      title: "Game replay",
      desc: "Review every move from past games. Study your patterns, improve your play.",
      icon: (
        <svg className="w-8 h-8 text-[#c8a96e]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" />
        </svg>
      ),
    },
    {
      title: "Friends system",
      desc: "Add friends, send challenges, and build your chess circle.",
      icon: (
        <svg className="w-8 h-8 text-[#c8a96e]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      title: "Rating & stats",
      desc: "Track your Elo, win rate, and progress over time with detailed statistics.",
      icon: (
        <svg className="w-8 h-8 text-[#c8a96e]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e8e0d0] overflow-x-hidden">

      {/* Keyframes injected once */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes boardReveal {
          from { opacity: 0; transform: translateY(-50%) perspective(900px) rotateX(35deg) rotateZ(-12deg); }
          to { opacity: 1; transform: translateY(-50%) perspective(900px) rotateX(30deg) rotateZ(-8deg); }
        }
        @keyframes pieceFade {
          from { opacity: 0; transform: scale(0.7); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-up { animation: fadeUp 0.8s ease both; }
        .animate-board-reveal { animation: boardReveal 1s ease 0.3s both; }
      `}</style>

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-5 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent">
        <span
          className="text-[#c8a96e] text-xl tracking-widest uppercase font-light"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Chessify
        </span>
        <ul className="hidden md:flex gap-8 list-none m-0 p-0">
          {[
            { label: "Friends", href: "/friends" },
            { label: "Profile", href: "/profile" },
            { label: "Replay", href: "/replay" },
            ...(!authed ? [{ label: "Sign in", href: "/auth/login" }] : []),
          ].map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                className="text-[#555] hover:text-[#c8a96e] text-xs tracking-[0.2em] uppercase transition-colors duration-200 no-underline"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center px-6 md:px-12 pt-28 pb-16 md:pb-0 overflow-hidden">

        {/* Left content */}
        <div className="relative z-10 max-w-lg animate-fade-up">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-6">
            <span className="block w-8 h-px bg-[#c8a96e]" />
            <span className="text-[#c8a96e] text-xs tracking-[0.25em] uppercase">The art of chess</span>
          </div>

          {/* Title */}
          <h1
            className="text-6xl md:text-7xl lg:text-[5.5rem] font-light leading-none tracking-tight text-[#f0ebe0] mb-7"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Play with<br />
            <span className="italic text-[#c8a96e]">precision.</span><br />
            Win with grace.
          </h1>

          <p className="text-[#666] font-light leading-relaxed mb-10 max-w-sm text-base">
            A refined chess experience for those who take the game seriously.
            Compete, analyse, and master your craft.
          </p>

          {/* CTAs */}
          <div className="flex gap-4 flex-wrap">
            {authed ? (
              <button
                onClick={() => router.push("/play")}
                className="bg-[#c8a96e] text-[#0a0a0a] px-10 py-3.5 text-xs font-medium tracking-[0.15em] uppercase hover:bg-[#d4ba80] transition-all duration-200 hover:-translate-y-px active:translate-y-0"
                style={{ clipPath: "polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px))" }}
              >
                Find a match
              </button>
            ) : (
              <>
                <button
                  onClick={() => router.push("/auth/register")}
                  className="bg-[#c8a96e] text-[#0a0a0a] px-10 py-3.5 text-xs font-medium tracking-[0.15em] uppercase hover:bg-[#d4ba80] transition-all duration-200 hover:-translate-y-px active:translate-y-0"
                  style={{ clipPath: "polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px))" }}
                >
                  Start playing
                </button>
                <button
                  onClick={() => router.push("/auth/login")}
                  className="bg-transparent text-[#666] border border-[#2a2a2a] px-8 py-3.5 text-xs font-light tracking-[0.12em] uppercase hover:border-[#c8a96e] hover:text-[#c8a96e] transition-all duration-200"
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </div>

        {/* Decorative chess board — desktop only */}
        <div
          className="hidden lg:block absolute right-[-5%] top-1/2 w-[50%] max-w-160 animate-board-reveal"
          style={{ transform: "translateY(-50%) perspective(900px) rotateX(30deg) rotateZ(-8deg)" }}
        >
          <div
            className="grid w-full aspect-square border border-[#2a2520]"
            style={{
              gridTemplateColumns: "repeat(8, 1fr)",
              boxShadow: "0 0 0 1px #1a1610, 0 40px 80px rgba(0,0,0,0.8), 0 80px 160px rgba(0,0,0,0.4)",
            }}
          >
            {Array.from({ length: 64 }, (_, i) => {
              const r = Math.floor(i / 8);
              const c = i % 8;
              const key = `${r},${c}`;
              const isLight = (r + c) % 2 === 0;
              const isHighlighted = highlighted.has(key);
              const piece = pieces[key];

              return (
                <div
                  key={key}
                  className="aspect-square relative flex items-center justify-center"
                  style={{
                    background: isHighlighted
                      ? "rgba(200,169,110,0.25)"
                      : isLight ? "#2d2820" : "#1a1610",
                    outline: isHighlighted ? "2px solid rgba(200,169,110,0.5)" : "none",
                  }}
                >
                  {piece && (
                    <span
                      className="text-2xl md:text-3xl select-none leading-none"
                      style={{
                        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.8))",
                        animation: `pieceFade 0.4s ease ${(r * 8 + c) * 0.02}s both`,
                      }}
                    >
                      {piece}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <div className="flex border-t border-b border-[#1a1a1a]">
        {[
          { num: "12K+", label: "Active players" },
          { num: "340K+", label: "Games played" },
          { num: "99.9%", label: "Uptime" },
        ].map((s, i) => (
          <div
            key={s.label}
            className={`flex-1 px-6 md:px-12 py-10 ${i < 2 ? "border-r border-[#1a1a1a]" : ""}`}
          >
            <div
              className="text-4xl md:text-5xl font-light text-[#c8a96e] mb-2 leading-none"
              style={{ fontFamily: "Georgia, serif" }}
            >
              {s.num}
            </div>
            <div className="text-[#444] text-xs tracking-[0.2em] uppercase font-light">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── FEATURES ── */}
      <section className="px-6 md:px-12 py-20 md:py-28">
        <div className="mb-14">
          <p className="text-[#c8a96e] text-xs tracking-[0.25em] uppercase mb-3">Why Chessify</p>
          <h2
            className="text-4xl md:text-5xl font-light text-[#f0ebe0] leading-tight"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Built for serious players
          </h2>
        </div>

        <div
          className="grid border border-[#1a1a1a] bg-[#1a1a1a]"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1px" }}
        >
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-[#0e0e0e] hover:bg-[#111] transition-colors duration-200 p-8 md:p-10"
            >
              <div className="mb-6">{f.icon}</div>
              <h3
                className="text-xl font-light text-[#e8e0d0] mb-3"
                style={{ fontFamily: "Georgia, serif" }}
              >
                {f.title}
              </h3>
              <p className="text-[#555] text-sm font-light leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 md:px-12 py-20 md:py-28 text-center border-t border-[#1a1a1a]">
        <h2
          className="text-5xl md:text-6xl font-light text-[#f0ebe0] mb-5 leading-tight"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Your next move<br />
          <span className="italic text-[#c8a96e]">awaits.</span>
        </h2>
        <p className="text-[#555] font-light mb-10 text-base">
          Join thousands of players. No subscription required.
        </p>
        {authed ? (
          <button
            onClick={() => router.push("/play")}
            className="bg-[#c8a96e] text-[#0a0a0a] px-12 py-3.5 text-xs font-medium tracking-[0.15em] uppercase hover:bg-[#d4ba80] transition-all duration-200 hover:-translate-y-px"
            style={{ clipPath: "polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px))" }}
          >
            Find a match now
          </button>
        ) : (
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => router.push("/auth/register")}
              className="bg-[#c8a96e] text-[#0a0a0a] px-12 py-3.5 text-xs font-medium tracking-[0.15em] uppercase hover:bg-[#d4ba80] transition-all duration-200 hover:-translate-y-px"
              style={{ clipPath: "polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px))" }}
            >
              Create free account
            </button>
            <button
              onClick={() => router.push("/auth/login")}
              className="bg-transparent text-[#666] border border-[#2a2a2a] px-8 py-3.5 text-xs font-light tracking-[0.12em] uppercase hover:border-[#c8a96e] hover:text-[#c8a96e] transition-all duration-200"
            >
              Sign in
            </button>
          </div>
        )}
      </section>

      {/* ── FOOTER ── */}
      <footer className="px-6 md:px-12 py-6 border-t border-[#141414] flex items-center justify-between flex-wrap gap-3">
        <span
          className="text-[#333] text-sm tracking-widest uppercase"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Chessify
        </span>
        <span className="text-[#333] text-xs font-light">
          © {new Date().getFullYear()} Chessify. All rights reserved.
        </span>
      </footer>
    </div>
  );
}
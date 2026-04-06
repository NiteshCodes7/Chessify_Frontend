type Piece = "queen" | "rook" | "bishop" | "knight";

const PIECE_SYMBOLS: Record<Piece, { white: string; black: string }> = {
  queen:  { white: "♕", black: "♛" },
  rook:   { white: "♖", black: "♜" },
  bishop: { white: "♗", black: "♝" },
  knight: { white: "♘", black: "♞" },
};

export function PromotionDialog({
  onSelect,
  color = "white",
}: {
  onSelect: (piece: Piece) => void;
  color?: "white" | "black";
}) {
  const pieces: Piece[] = ["queen", "rook", "bishop", "knight"];

  return (
    <div className="flex flex-col items-center gap-5 p-6 bg-[#0e0e0e] border border-[#1a1a1a]">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="block w-5 h-px bg-[#c8a96e] opacity-40" />
        <span className="text-[#c8a96e] text-xs tracking-[0.25em] uppercase">
          Promotion
        </span>
        <span className="block w-5 h-px bg-[#c8a96e] opacity-40" />
      </div>

      <p
        className="text-[#888] text-sm font-light text-center"
        style={{ fontFamily: "Georgia, serif", fontStyle: "italic" }}
      >
        Choose your piece
      </p>

      {/* Piece buttons */}
      <div className="flex gap-2">
        {pieces.map((p) => (
          <button
            key={p}
            onClick={() => onSelect(p)}
            className="group flex flex-col items-center gap-2 px-4 py-4 border border-[#2a2a2a] bg-[#0a0a0a] hover:border-[#c8a96e] hover:bg-[#111] transition-all duration-200"
            title={p}
          >
            <span
              className="text-3xl select-none group-hover:scale-110 transition-transform duration-200"
              style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.8))" }}
            >
              {PIECE_SYMBOLS[p][color]}
            </span>
            <span className="text-[#444] group-hover:text-[#c8a96e] text-[10px] tracking-[0.15em] uppercase font-light transition-colors duration-200">
              {p}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
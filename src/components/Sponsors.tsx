import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";

// --- Your logo imports (keep paths as-is) ---
import Ashok_Leyland from "../images/Sponsors/Ashok_Leyland.png";
import CISAI from "../images/Sponsors/CISAI.png";
import CUB from "../images/Sponsors/CUB.png";
import Hack_The_Box from "../images/Sponsors/Hack_The_Box.png";
import Innspark from "../images/Sponsors/Innspark.png";
import ISEA from "../images/Sponsors/ISEA.png";
import Manag_Engine from "../images/Sponsors/Manag_Engine.png";
import MRF from "../images/Sponsors/MRF.jpg";
import Quick_Heal from "../images/Sponsors/Quick_Heal.png";
import Skills_Da from "../images/Sponsors/Skills_Da.png";
import TCS from "../images/Sponsors/TCS.png";
import Wipro from "../images/Sponsors/Wipro.png";

const SPONSORS = [
  { name: "Ashok Leyland", logo: Ashok_Leyland },
  { name: "CISAI", logo: CISAI },
  { name: "CUB", logo: CUB },
  { name: "Hack The Box", logo: Hack_The_Box },
  { name: "Innspark", logo: Innspark },
  { name: "ISEA", logo: ISEA },
  { name: "ManageEngine", logo: Manag_Engine },
  { name: "MRF", logo: MRF },
  { name: "Quick Heal", logo: Quick_Heal },
  { name: "Skills DA", logo: Skills_Da },
  { name: "TCS", logo: TCS },
  { name: "Wipro", logo: Wipro },
  // Add more logos freely — marquee stays seamless
];

// Repeat the array N times to ensure each lane is wide enough even on big screens
const repeat = (arr, times = 3) => Array.from({ length: times }, () => arr).flat();

const Card = ({ item }) => (
  <div
    className="w-44 sm:w-48 md:w-52 h-24 sm:h-28 md:h-32 flex-shrink-0 rounded-2xl bg-white shadow-lg border border-gray-200
               hover:border-[var(--accent)]/30 transition-all duration-500 group"
  >
    <div className="relative w-full h-full p-3 sm:p-4 flex items-center justify-center rounded-2xl">
      <img
        src={item.logo}
        alt={item.name}
        loading="lazy"
        decoding="async"
        className="max-w-full max-h-full object-contain transition-all duration-500"
      />
      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-[var(--accent)]/10 via-transparent to-transparent" />
    </div>
  </div>
);

const MarqueeRow = ({ items, reverse = false, speedSec = 30, gapClass = "gap-8" }) => {
  // Build a long sequence and then duplicate once more for seamless 200% track
  const longSeq = useMemo(() => repeat(items, 3), [items]);
  const track = useMemo(() => [...longSeq, ...longSeq], [longSeq]);

  return (
    <div className="relative overflow-hidden">
      {/* Edge fades for elegance */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-gray-900 to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-gray-900 to-transparent z-10" />

      <div
        className={`marquee-track flex ${gapClass} items-center will-change-transform`}
        style={{
          animation: `${reverse ? "scrollXRev" : "scrollX"} var(--speed, ${speedSec}s) linear infinite`,
        }}
      >
        {track.map((it, i) => (
          <Card key={`${it.name}-${i}`} item={it} />
        ))}
      </div>
    </div>
  );
};

const SponsorsWeaveMarquee = () => {
  const accent = "#a3133f"; // your brand accent
  const navigate = useNavigate();
  const split = Math.ceil(SPONSORS.length / 2);
  const row1 = SPONSORS.slice(0, split);
  const row2 = SPONSORS.slice(split);

  // Ensure both rows have content; if one is short, borrow from the other
  const safeRow1 = row1.length ? row1 : SPONSORS;
  const safeRow2 = row2.length ? row2 : SPONSORS;

  return (
    <section
      id="sponsors"
      className="relative overflow-hidden py-10 sm:py-16 bg-gradient-to-br from-platinumGray to-royalBlue"
      style={{ ["--accent"]: accent, ["--speed"]: "30s" }}
      aria-label="Sponsors"
    >
      {/* Local keyframes for perfect seamless scroll (200% track → translateX(-50%)) */}
      <style>{`
        @keyframes scrollX { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes scrollXRev { from { transform: translateX(-50%); } to { transform: translateX(0); } }
        .marquee-track { width: max-content; }
        .marquee-track:hover { animation-play-state: paused; }
      `}</style>

      <div className="container mx-auto px-2 sm:px-4 lg:px-8">
        <div className="rounded-3xl bg-black/95 shadow-2xl px-4 sm:px-8 py-10 sm:py-14">
          <div className="text-center mb-10 sm:mb-14">
            <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm tracking-wide text-[var(--accent)] font-semibold backdrop-blur">
              Powered By
            </span>
            <h2 className="mt-5 text-3xl sm:text-5xl font-extrabold text-white leading-tight">
              Our <span className="text-[var(--accent)]">Sponsors</span>
            </h2>
            <p className="mt-3 text-sm sm:text-lg text-gray-300/90 max-w-3xl mx-auto">
              Collaborating with industry leaders to advance cybersecurity education and innovation.
            </p>
          </div>

          {/* Two continuous lanes */}
          <div className="space-y-8 sm:space-y-12">
            {/* Top row (left → right or right → left). We choose leftwards for variety */}
            <MarqueeRow items={safeRow1} reverse={false} speedSec={28} />
            {/* Bottom row opposite direction */}
            <MarqueeRow items={safeRow2} reverse={true} speedSec={32} />
          </div>

          {/* CTA (optional) */}
          <div className="text-center mt-12 sm:mt-16">
            <button
              className="px-8 sm:px-10 py-3.5 sm:py-4 rounded-full font-semibold text-gray-900 bg-[var(--accent)] hover:bg-[#8d1034] active:bg-[#780d2c] transition-colors shadow-[0_8px_24px_rgba(163,19,63,0.45)]"
              aria-label="Become a Partner"
              onClick={() => navigate("/sponsors-complete")}
            >
              All Partner's
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SponsorsWeaveMarquee;

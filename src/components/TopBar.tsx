import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SPOTS_REMAINING, SPOTS_TOTAL } from "../counter";

interface TopBarProps {
  onClaimClick: () => void;
  accentColor: "violet" | "gold";
}

export default function TopBar({ onClaimClick, accentColor }: TopBarProps) {
  // Animated countdown state starting at SPOTS_TOTAL (20) and ticking down to SPOTS_REMAINING (13)
  const [currentSpots, setCurrentSpots] = useState(SPOTS_TOTAL);
  const [isTickSparking, setIsTickSparking] = useState(false);

  useEffect(() => {
    // Staggered countdown simulation to create high urgency and tactile feedback on mount
    const delayTimer = setTimeout(() => {
      let temp = SPOTS_TOTAL;
      const interval = setInterval(() => {
        if (temp > SPOTS_REMAINING) {
          temp--;
          setCurrentSpots(temp);
          setIsTickSparking(true);
          setTimeout(() => setIsTickSparking(false), 200);
        } else {
          clearInterval(interval);
        }
      }, 250); // elegant paced countdown tick

      return () => clearInterval(interval);
    }, 1000); // starts 1 second after page loads

    return () => clearTimeout(delayTimer);
  }, []);

  const accentColorHex = accentColor === "violet" ? "#d9a326" : "#C9A84C";

  return (
    <div className="sticky top-0 w-full z-[9999] backdrop-blur-md bg-white/85 border-b border-slate-200/40 py-2.5 flex items-center justify-center">
      <div className="max-w-7xl mx-auto w-full px-4 flex flex-col sm:flex-row items-center justify-center gap-3 text-center">
        
        {/* Main Ticker Message - Centered */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 text-xs sm:text-sm font-medium text-[#4e3c31]">
          {/* Pulsing indicator */}
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>

          <span className="tracking-tight flex items-center gap-1.5 flex-wrap">
            <span>Launch Rate —</span>
            <span className="inline-flex items-center font-bold text-[#1b120c] font-mono px-1.5 py-0.5 rounded bg-amber-50/80 border border-amber-200/30 relative">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={currentSpots}
                  initial={{ y: -12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 12, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 350, damping: 20 }}
                  className={`inline-block ${isTickSparking ? "text-amber-600 scale-110 font-black" : "text-amber-800"}`}
                >
                  {currentSpots}
                </motion.span>
              </AnimatePresence>
              <span className="text-amber-900/40 mx-1 font-sans">/</span>
              <span className="text-amber-900/60">{SPOTS_TOTAL} spots</span>
            </span>{" "}
            <span>remaining.</span>
          </span>

          {/* Graphical Seats Visual Countdown Grid to illustrate scarcity organically - now positioned before Price Doubles */}
          <div className="flex items-center space-x-1.5 px-2 py-1 bg-amber-50/40 rounded-full border border-amber-100/30 mx-1">
            {Array.from({ length: SPOTS_TOTAL }).map((_, idx) => {
              const seatId = idx + 1;
              const isFilled = seatId <= (SPOTS_TOTAL - currentSpots);
              return (
                <motion.div
                  key={idx}
                  className={`w-2 h-2 rounded-full ${
                    isFilled 
                      ? "bg-amber-950/20" 
                      : "bg-[#C9A84C] shadow-[0_0_5px_rgba(201,168,76,0.8)]"
                  }`}
                  animate={!isFilled && idx === (SPOTS_TOTAL - currentSpots) ? { scale: [1, 1.4, 1] } : {}}
                  transition={{ duration: 0.3 }}
                  title={isFilled ? "Reserved spot" : "Open spot"}
                />
              );
            })}
          </div>

          <span className="font-bold text-[#b28e35]">
            Price Doubles at 00
          </span>
        </div>

        {/* Small Interactive Shortcut Styled as a 3D tactile trigger */}
        <button
          onClick={onClaimClick}
          className="relative inline-flex items-center justify-center font-bold text-xs uppercase tracking-widest text-[#1b120c] bg-[#C9A84C]/90 hover:bg-[#C9A84C] px-3.5 py-1 rounded-lg shadow-[0_3px_0_#91732c] active:shadow-[0_1px_0_#91732c] active:translate-y-[2px] transition-all duration-100 cursor-pointer border border-amber-300/30 select-none ml-1 sm:ml-2"
        >
          Claim Now
        </button>
        
      </div>
    </div>
  );
}

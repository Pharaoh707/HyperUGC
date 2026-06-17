import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { SPOTS_REMAINING, getCountdownTarget } from "../counter";

interface CTARepeatSectionProps {
  onClaimClick: () => void;
  accentColor: "violet" | "gold";
}

export default function CTARepeatSection({ onClaimClick, accentColor }: CTARepeatSectionProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 25, seconds: 0 });

  useEffect(() => {
    const target = getCountdownTarget();

    const updateTimer = () => {
      const now = new Date();
      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatNum = (num: number) => String(num).padStart(2, "0");

  const accentFill = accentColor === "violet" ? "bg-purple-600" : "bg-[#C9A84C]";
  const accentText = accentColor === "violet" ? "text-purple-600" : "text-[#af8d31]";
  const accentBorder = accentColor === "violet" ? "border-purple-600/30" : "border-[#C9A84C]/30";
  const btnBg = "bg-gradient-to-b from-[#e3c166] via-[#C9A84C] to-[#b08e33] border-b-[5px] border-[#8e732c] shadow-[0_8px_20px_rgba(201,168,76,0.35)] hover:brightness-105 active:translate-y-[3px] active:border-b-[1px] active:shadow-[0_2px_8px_rgba(201,168,76,0.2)]";

  return (
    <section className="relative py-16 px-4 sm:px-6 md:px-8 z-10">
      <div className="max-w-4xl mx-auto">
        <div className={`glass-panel p-8 sm:p-12 text-center space-y-8 border ${accentBorder} relative overflow-hidden backdrop-blur-md`}>
          
          {/* Accent glow orb hidden in the background */}
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-[80px] opacity-10 ${accentFill}`} />

          <div className="space-y-3 z-10 relative">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-rose-500 font-mono animate-pulse block">
              ⚠️ Launch Rate Closes Soon
            </span>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-display font-black text-slate-900 tracking-tight leading-none">
              Claim Your Spots Before the Pricing Doubles
            </h3>
            <p className="text-slate-500 text-sm sm:text-base font-medium max-w-lg mx-auto">
              Our automated intake triggers immediate priority processing. Secure your spot now and lock in founding pricing forever.
            </p>
          </div>

          {/* Countdown Clock */}
          <div className="flex justify-center items-center space-x-3 sm:space-x-4 z-10 relative">
            {/* Hours */}
            <div className="flex flex-col items-center">
              <div className="w-14 sm:w-16 h-14 sm:h-16 flex items-center justify-center bg-white shadow-xs rounded-xl border border-slate-200 text-slate-800 font-mono font-bold text-xl sm:text-2xl">
                {formatNum(timeLeft.hours)}
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mt-1.5 font-medium">Hours</span>
            </div>
            
            <span className="text-slate-400 font-bold text-xl sm:text-2xl pb-6">:</span>

            {/* Minutes */}
            <div className="flex flex-col items-center">
              <div className="w-14 sm:w-16 h-14 sm:h-16 flex items-center justify-center bg-white shadow-xs rounded-xl border border-slate-200 text-slate-800 font-mono font-bold text-xl sm:text-2xl">
                {formatNum(timeLeft.minutes)}
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mt-1.5 font-medium">Min</span>
            </div>

            <span className="text-slate-400 font-bold text-xl sm:text-2xl pb-6">:</span>

            {/* Seconds */}
            <div className="flex flex-col items-center">
              <div className="w-14 sm:w-16 h-14 sm:h-16 flex items-center justify-center bg-white shadow-xs rounded-xl border border-slate-200 text-slate-800 font-mono font-bold text-xl sm:text-2xl">
                {formatNum(timeLeft.seconds)}
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mt-1.5 font-medium">Sec</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="max-w-md mx-auto space-y-2 z-10 relative">
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-[2px] border border-slate-200/40">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${accentFill}`}
                style={{ width: `${((20 - SPOTS_REMAINING) / 20) * 100}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[11px] font-mono text-slate-500">
              <span>{SPOTS_REMAINING} SPOTS FREE</span>
              <span>{20 - SPOTS_REMAINING} / 20 SECURED</span>
            </div>
          </div>

          {/* CTA */}
          <div className="pt-2 z-10 relative">
            <button
              onClick={onClaimClick}
              className={`shimmer-btn px-9 py-4.5 rounded-xl text-xs sm:text-sm font-black text-white cursor-pointer tracking-widest transition-all uppercase select-none ${btnBg}`}
            >
              CLAIM YOUR SPOT NOW
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}

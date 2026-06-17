import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Clock, CheckSquare, Sparkles, AlertCircle } from "lucide-react";
import { getCountdownTarget } from "../counter";

interface ThankYouPageProps {
  onGoToBrief: () => void;
  accentColor: "violet" | "gold";
}

export default function ThankYouPage({ onGoToBrief, accentColor }: ThankYouPageProps) {
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

  const accentText = accentColor === "violet" ? "text-purple-600" : "text-[#af8d31]";
  const accentFill = accentColor === "violet" ? "bg-purple-600" : "bg-[#C9A84C]";
  const accentBorder = accentColor === "violet" ? "border-purple-600/30" : "border-[#C9A84C]/30";
  const glowText = accentColor === "violet" ? "text-purple-600 font-extrabold" : "text-[#af8d31] font-extrabold";

  const btnBg = accentColor === "violet"
    ? "bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-600/20 text-white"
    : "bg-amber-500 hover:bg-amber-600 shadow-md shadow-amber-500/20 text-white";

  return (
    <div className="relative min-h-[85vh] py-16 px-4 sm:px-6 md:px-8 z-10 flex flex-col items-center justify-center text-center">
      <div className="max-w-2xl w-full">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
          className={`glass-panel p-8 sm:p-12 border ${accentBorder} relative backdrop-blur-md space-y-8`}
        >
          {/* Confetti celebration crown background effect */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-amber-200/10 rounded-full blur-2xl opacity-50" />

          <div className="space-y-4">
            <div className="flex justify-center items-center space-x-1 font-mono text-xs font-bold text-emerald-500">
              <CheckSquare className="w-4 h-4" />
              <span>TRANSACTION VERIFIED</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-slate-900 tracking-tight leading-none">
              You're in. Your launch rate is locked.
            </h1>
            
            <p className={`text-slate-600 text-sm sm:text-base font-medium max-w-md mx-auto leading-relaxed`}>
              We have processed your 50% checkout token. The pricing tier is frozen under reservation hash.
            </p>
          </div>

          {/* Sync ticking system clock "Watch the clock." */}
          <div className="space-y-3 pt-2">
            <span className="text-[10px] font-mono tracking-widest text-slate-400 font-extrabold block">
              ⏱️ LAUNCH REVOLUTION CLOCK
            </span>
            <div className="flex justify-center items-center space-x-3 text-lg sm:text-xl font-mono font-bold text-slate-800">
              <div className="px-3 py-2 bg-slate-100 rounded-lg">{formatNum(timeLeft.hours)}</div>
              <span className="text-slate-400">:</span>
              <div className="px-3 py-2 bg-slate-100 rounded-lg">{formatNum(timeLeft.minutes)}</div>
              <span className="text-slate-400">:</span>
              <div className="px-3 py-2 bg-slate-100 rounded-lg">{formatNum(timeLeft.seconds)}</div>
            </div>
            <p className="text-xs text-slate-500 font-bold italic">“Watch the clock.”</p>
          </div>

          {/* Next action guidance */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/50 text-left flex items-start space-x-3">
            <AlertCircle className={`w-5 h-5 ${accentText} shrink-0 mt-0.5`} />
            <div className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
              <strong>Next Step:</strong> Submit your brand guidelines so production begins. This takes under 10 minutes and preserves delivery priority parameters.
            </div>
          </div>

          {/* Nav direct button */}
          <div className="pt-2">
            <button
              onClick={onGoToBrief}
              className={`shimmer-btn w-full py-4.5 rounded-xl text-sm font-black flex items-center justify-center space-x-2 transition-transform transform active:scale-95 duration-100 cursor-pointer ${btnBg}`}
            >
              <span>SUBMIT BRAND GUIDELINES NOW</span>
              <span>→</span>
            </button>
          </div>

        </motion.div>

      </div>
    </div>
  );
}

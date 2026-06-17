import { motion } from "motion/react";
import { Loader2, Sparkles, Film } from "lucide-react";

interface GlobalLoaderProps {
  isVisible: boolean;
  accentColor: "violet" | "gold";
}

export default function GlobalLoader({ isVisible, accentColor }: GlobalLoaderProps) {
  const accentText = accentColor === "violet" ? "text-amber-500" : "text-[#af8d31]";
  const accentBg = accentColor === "violet" ? "bg-amber-600" : "bg-[#C9A84C]";
  const progressGlow = accentColor === "violet" 
    ? "shadow-[0_0_15px_#d9a326]" 
    : "shadow-[0_0_15px_#C9A84C]";

  return (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#1a110a]/98 backdrop-blur-xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none translate-y-[-10px]"
      }`}
    >
      <div className="max-w-md w-full px-6 text-center space-y-8">
        
        {/* Floating animated ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full pointer-events-none filter blur-[80px] opacity-[0.08]"
          style={{
            background: accentColor === "violet" ? "#d9a326" : "#C9A84C"
          }}
        />

        <div className="space-y-3 relative z-10">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center items-center space-x-2"
          >
            <Film className={`w-5 h-5 ${accentText} animate-pulse`} />
            <span className="font-mono text-[10px] tracking-[0.3em] font-extrabold uppercase text-amber-200/60">
              MANDJACK DIGITAL
            </span>
          </motion.div>
          
          <h2 className="text-xl sm:text-2xl font-display font-black text-amber-50 tracking-tight">
            Preparing Cinematic Assets...
          </h2>
          <p className="text-amber-100/50 text-xs font-medium">
            Caching ultra-high-definition scroll-stopping creatives for seamless playback
          </p>
        </div>

        {/* Elegant Minimal Progress Bar with warm amber background track */}
        <div className="relative w-full h-[3px] bg-amber-950/40 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.2, ease: "easeInOut" }}
            className={`absolute top-0 left-0 h-full ${accentBg} ${progressGlow}`}
          />
        </div>

        <div className="flex items-center justify-center space-x-2 text-[10px] font-mono text-amber-200/40 tracking-wider">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-700" />
          <span>ESTABLISHING PIPELINE CONNECTION</span>
        </div>

      </div>
    </div>
  );
}

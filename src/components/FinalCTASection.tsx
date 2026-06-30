import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ShieldCheck, Calendar, Zap, RefreshCw, Layers } from "lucide-react";
import { getCountdownTarget } from "../counter";
import PremiumSparklesEffect from "./PremiumSparklesEffect";
import { useCurrency } from "../lib/CurrencyContext";

interface FinalCTASectionProps {
  onPaymentCheckout: () => void;
  accentColor: "violet" | "gold";
}

export default function FinalCTASection({ onPaymentCheckout, accentColor }: FinalCTASectionProps) {
  const { currentCurrency } = useCurrency();
  const [showPrice, setShowPrice] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 25, seconds: 0 });
  const [counter, setCounter] = useState(currentCurrency.valueNum);

  useEffect(() => {
    setCounter(currentCurrency.valueNum);
  }, [currentCurrency]);

  useEffect(() => {
    if (!showPrice) {
      setCounter(currentCurrency.valueNum);
      return;
    }
    const start = currentCurrency.valueNum;
    const end = currentCurrency.depositNum;
    const duration = 2200; // 2.2 seconds countdown
    const startTime = performance.now();

    let animationFrameId: number;

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing out cubic to decelerate heavily towards €300
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.round(start - easedProgress * (start - end));

      setCounter(currentValue);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [showPrice]);

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

  const bulletItems = [
    { text: "5 Hyper-Realistic Video Ads", detail: "runs across Meta, TikTok, YouTube" },
    { text: "Every Format Cut Included", detail: "9:16 · 1:1 · 16:9, no extra charge" },
    { text: "Creative Strategy Session", detail: "so every ad has a specific conversion job to do" },
    { text: "2 Bonus Hook Variants", detail: "instant split-test data, completely free of charge" },
    { text: "48–72 Hour Super Delivery", detail: "not two weeks. 72 hours max" },
    { text: "Satisfaction Guarantee", detail: "if it's off-brand, we redo it immediately on us" }
  ];

  const accentFill = accentColor === "violet" ? "bg-purple-600" : "bg-[#C9A84C]";
  const accentText = accentColor === "violet" ? "text-purple-600" : "text-[#af8d31]";
  const accentBorder = accentColor === "violet" ? "border-purple-600/30" : "border-[#C9A84C]/30";
  const accentTextSecondary = accentColor === "violet" ? "text-indigo-600" : "text-amber-700";
  const glowShadow = accentColor === "violet" ? "shadow-[0_0_20px_rgba(124,58,237,0.35)]" : "shadow-[0_0_20px_rgba(201,168,76,0.35)]";

  const btnGrad = "bg-gradient-to-b from-[#e3c166] via-[#C9A84C] to-[#b08e33] border-b-[5px] border-[#8e732c] shadow-[0_8px_20px_rgba(201,130,50,0.15)] hover:brightness-105 active:translate-y-[2px] active:border-b-[3px] transition-all duration-100";

  return (
    <section className="relative py-24 md:py-32 px-4 sm:px-6 md:px-8 z-10 w-full overflow-hidden">
      <div className="max-w-5xl mx-auto space-y-16">
        
        {/* Header Block */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs font-bold font-mono tracking-[0.25em] text-rose-500 uppercase block">
            🚨 EXTREMELY <motion.span
              animate={{ 
                scale: [1, 1.1, 1],
                color: ["#f43f5e", "#be123c", "#f43f5e"]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="inline-block origin-center font-bold"
            >LIMITED</motion.span> PORTAL
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-slate-900 tracking-tight leading-none">
            Spots are <motion.span
              animate={{ 
                scale: [1, 1.05, 1],
                color: ["#0f172a", "#ef4444", "#0f172a"]
              }}
              transition={{ 
                duration: 2.5, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="inline-block origin-center font-black"
            >limited</motion.span> to maintain quality and fast delivery. Once <motion.span
              animate={{ 
                scale: [1, 1.03, 1],
                color: ["#ef4444", "#991b1b", "#ef4444"]
              }}
              transition={{ 
                duration: 2.2, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="inline-block origin-center font-black"
            >they're gone, they're gone.</motion.span>
          </h2>
          <p className="text-slate-600 font-medium text-base sm:text-lg">
            Lock in the <motion.span
              animate={{ 
                scale: [1, 1.04, 1],
                color: ["#0f172a", "#ca8a04", "#0f172a"]
              }}
              transition={{ 
                duration: 3.5, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="inline-block origin-center font-extrabold"
            >
              {currentCurrency.symbol}{currentCurrency.price} launch rate
            </motion.span> today. Pay only <motion.span
              animate={{ 
                scale: [1, 1.04, 1],
                color: ["#0f172a", "#ca8a04", "#0f172a"]
              }}
              transition={{ 
                duration: 3.5, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 0.5
              }}
              className="inline-block origin-center font-extrabold"
            >
              {currentCurrency.symbol}{currentCurrency.deposit} deposit
            </motion.span> to book your slot now.
          </p>
        </div>

        {/* Central Master Offer Summary Card - Triggering price reveal sequence */}
        <motion.div
          onViewportEnter={() => setShowPrice(true)}
          className={`glass-panel p-6 sm:p-10 border ${accentBorder} relative backdrop-blur-md overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12`}
        >
          {/* Inner Light Burst */}
          <div className="absolute top-1/2 left-0 w-48 h-48 rounded-full bg-yellow-200/5 blur-3xl pointer-events-none" />

          {/* Left Column: Bullet List items sliding in */}
          <div className="md:col-span-7 flex flex-col justify-center space-y-6">
            
            <div className="space-y-1 pb-3 border-b border-slate-200/60">
              <span className={`text-[10px] font-mono font-bold tracking-widest ${accentText}`}>INCLUDED IN YOUR SPECIFIC PACKAGE:</span>
              <h4 className="text-lg font-display font-black text-slate-900 tracking-tight">FOUNDING MEMBER INTAKE</h4>
            </div>

            <div className="space-y-4">
              {bulletItems.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -30 }}
                  animate={showPrice ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: idx * 0.08, duration: 0.5 }}
                  className="flex items-start space-x-3 text-slate-700 text-sm font-medium"
                >
                  <span className={`text-md leading-none pt-0.5 ${accentText}`}>✦</span>
                  <div>
                    <span className="font-extrabold text-slate-800">{item.text}</span>
                    <span className="text-slate-400 font-mono text-xs block sm:inline sm:ml-1.5">• {item.detail}</span>
                  </div>
                </motion.div>
              ))}
            </div>

          </div>

          {/* Right Column: Price Reveal Animation */}
          <div className="md:col-span-5 flex flex-col justify-center items-center p-6 sm:p-8 rounded-2xl bg-white/50 border border-slate-200/50 text-center relative space-y-6">
            
            <div className="space-y-2">
              <span className="text-[10px] font-mono tracking-widest text-slate-400 font-extrabold uppercase block">
                FOUNDING DISCOUNT
              </span>

              {/* Price sequence with elegant strike-through */}
              <div className="space-y-3 pt-2">
                
                {/* 1. Value strike-through */}
                <div className="relative inline-block text-slate-400 text-xl font-bold font-mono">
                  <span>{currentCurrency.symbol}{currentCurrency.value} VALUE</span>
                  {showPrice && (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ delay: 0.4, duration: 0.6 }}
                      className="absolute left-0 top-1/2 -translate-y-1/2 h-[3px] bg-rose-500 rounded-full"
                    />
                  )}
                </div>

                {/* 2. Target rate */}
                {showPrice && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 0.6, scale: 1 }}
                    transition={{ delay: 0.9, duration: 0.5 }}
                    className="text-lg text-slate-600 font-bold font-mono tracking-tight leading-none"
                  >
                    Standard Launch Price: {currentCurrency.symbol}{currentCurrency.price}
                  </motion.div>
                )}

                {/* 3. Real Highlight deposit today */}
                {showPrice && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 120 }}
                    className="space-y-1 block"
                  >
                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block font-bold">DEPOSIT TO SECURE TIME</span>
                    <div className="flex flex-col justify-center items-center">
                    <span className={`text-5xl sm:text-6xl font-black font-display tracking-tight leading-none block ${accentText} ${glowShadow} px-4 py-2 bg-white rounded-2xl border-2 ${accentBorder} animate-pulse-slow min-w-[140px]`}>
                      {currentCurrency.symbol}{counter.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold font-mono mt-2">DUE TODAY (-50% OF PACKAGE VALUE)</span>
                  </div>
                  </motion.div>
                )}

              </div>
            </div>

            {/* Action CTA Trigger min-height 56px */}
            <div className="w-full pt-1.5">
              <button
                onClick={onPaymentCheckout}
                className={`shimmer-btn relative overflow-hidden w-full h-[58px] rounded-xl text-xs sm:text-sm font-black text-white hover:brightness-105 cursor-pointer flex items-center justify-center space-x-2 px-4 select-none ${btnGrad}`}
              >
                <PremiumSparklesEffect color={accentColor === "violet" ? "violet" : "gold"} />
                <span>CLAIM YOUR SPOT NOW — {currentCurrency.symbol}{currentCurrency.deposit} DEPOSIT TO START</span>
              </button>
            </div>

            {/* Trust Badges Row */}
            <div className="space-y-3 w-full">
              <div className="flex justify-center items-center space-x-3 text-[11px] font-mono text-slate-400 font-bold">
                <span>Revolut</span>
                <span>•</span>
                <span>PayPal</span>
                <span>•</span>
                <span>Visa</span>
                <span>•</span>
                <span>Mastercard</span>
              </div>
              <div className="flex justify-center items-center space-x-1.5 text-[10px] text-slate-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>256-bit SSL Encrypted. Secure Checkout.</span>
              </div>
            </div>

          </div>

        </motion.div>

        {/* Closing Sub-headline Callout on frosted glassmorphism */}
        <div className="max-w-2xl mx-auto p-5 rounded-2xl bg-white/30 backdrop-blur-md border border-white/40 shadow-xs text-center">
          <p className="text-xs sm:text-sm text-slate-800 font-bold tracking-wide leading-relaxed">
            Join 160+ DTC brands already running <span className="text-amber-600 font-extrabold">our premium AI-generated UGC ads for Saas</span>.
          </p>
        </div>

      </div>
    </section>
  );
}

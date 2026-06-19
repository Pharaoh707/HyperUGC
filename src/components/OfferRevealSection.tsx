import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { SPOTS_REMAINING } from "../counter";
import PremiumSparklesEffect from "./PremiumSparklesEffect";

interface OfferRevealSectionProps {
  onClaimClick: () => void;
  accentColor: "violet" | "gold";
}

export default function OfferRevealSection({ onClaimClick, accentColor }: OfferRevealSectionProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  // Track scroll inside the section for the dynamic expanding scale specified
  // We use start end to end start so that tracking begins when the section appears
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Calculate scrolling transformations based on scroll - starts IMMEDIATELY upon section entry
  const videoScale = useTransform(scrollYProgress, [0.1, 0.9], [0.93, 1.15]);
  const videoY = useTransform(scrollYProgress, [0.1, 1], [40, -40]);
  const videoRotate = useTransform(scrollYProgress, [0.1, 1], [-0.5, 1.5]);
  const glowOpacity = useTransform(scrollYProgress, [0.1, 0.85], [0.12, 0.75]);
  const glowScale = useTransform(scrollYProgress, [0.1, 0.85], [0.9, 1.2]);

  // Handle mock dynamic counting for our premium stats highlights
  const [counts, setCounts] = useState({ delivery: 0, videos: 0, price: 1200, pay: 0 });
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    if (!hasEntered) return;
    
    // Animate stats values up elegantly
    const duration = 1200;
    const steps = 30;
    const interval = duration / steps;
    let stepCount = 0;

    const timer = setInterval(() => {
      stepCount++;
      setCounts({
        delivery: Math.min(Math.round((72 / steps) * stepCount), 72),
        videos: Math.min(Math.round((5 / steps) * stepCount), 5),
        price: Math.max(1200 - Math.round((600 / steps) * stepCount), 600),
        pay: Math.min(Math.round((50 / steps) * stepCount), 50),
      });

      if (stepCount >= steps) {
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [hasEntered]);

  // Staggered variants for copy elements
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.05,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 22 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.75,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const accentFill = accentColor === "violet" ? "bg-purple-600" : "bg-[#C9A84C]";
  const accentText = accentColor === "violet" ? "text-purple-600" : "text-[#af8d31]";
  const accentBorder = accentColor === "violet" ? "border-purple-600/30" : "border-[#C9A84C]/30";

  return (
    <section 
      ref={containerRef} 
      className="relative min-h-[90vh] lg:min-h-[110vh] z-10 antialiased flex flex-col justify-center py-12 sm:py-20"
    >
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-8">
        
        {/* Dynamic split row where everything aligns perfectly without any absolute layering overlapping */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* LEFT COLUMN: Reveal copy and structured Offer information */}
          <div className="lg:col-span-7 flex flex-col space-y-6 sm:space-y-8 text-left">
            
            {/* Elegant Headings and Copy text with smooth slide-up reveal animations */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-120px" }}
              className="space-y-4"
            >
              <motion.h2 
                variants={itemVariants}
                className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-slate-900 leading-[1.14]"
              >
                You deserve hyper-realistic video ads that look like a <span className="text-amber-600 font-extrabold">$10,000 production shoot</span>
              </motion.h2>

              <motion.p 
                variants={itemVariants}
                className="text-slate-600 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl"
              >
                Why settle for shaky, amateur mobile-clip templates when you can launch cinema-grade, high-end conversions? Every frame is mathematically engineered with scroll-stopping hooks, psychological overlays, and pristine aesthetics.
              </motion.p>
            </motion.div>

            {/* Premium Package Launch Offer Card - Does not fade out, perfectly stable info block */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              onViewportEnter={() => setHasEntered(true)}
              className="glass-panel p-5 sm:p-7 space-y-4 sm:space-y-5 relative overflow-hidden bg-white/95 backdrop-blur-md border border-white/70 shadow-xl rounded-3xl w-full"
            >
              {/* Luxury ambient backing node */}
              <div className={`absolute top-0 right-0 w-32 h-32 ${accentColor === "violet" ? "bg-purple-300/10" : "bg-[#C9A84C]/10"} rounded-full blur-3xl pointer-events-none`} />

              <div className="space-y-2">
                <span className={`text-[10px] font-bold uppercase tracking-[0.2em] px-2.5 py-0.5 rounded bg-slate-100/90 ${accentText}`}>
                  LAUNCH SPECIFIC PACKAGE OFFER
                </span>
                <p className="text-sm sm:text-base md:text-lg font-semibold text-slate-800 leading-snug">
                  Transform your digital presence with <span className="text-amber-600 font-extrabold">5 hyper-realistic ad creatives</span>, 
                  including 3 <span className="text-amber-600 font-bold">heavy-converting hero concepts</span> and 2 optional format modifications. Delivered in 72 hours, ready to immediately load.
                </p>
              </div>

              {/* Slots progress indicator bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-600">
                  <span className="font-semibold">LAUNCH SLOTS CAPACITY</span>
                  <span className="font-bold text-slate-800">{SPOTS_REMAINING} / 20 SPOTS REMAINING</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200/40 p-[2px]">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${accentFill}`}
                    style={{ width: `${((20 - SPOTS_REMAINING) / 20) * 100}%` }}
                  />
                </div>
                <p className="text-[9px] text-slate-500 font-medium">
                  Only {SPOTS_REMAINING} spots remain at launch rate — price doubles automatically once these fill.
                </p>
              </div>

              {/* Click action controls */}
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-1">
                <button
                  onClick={onClaimClick}
                  className="shimmer-btn relative overflow-hidden px-6 py-3.5 rounded-xl text-[11px] font-black tracking-widest transition-all cursor-pointer text-center select-none text-white uppercase bg-gradient-to-b from-[#e3c166] via-[#C9A84C] to-[#b08e33] border-b-[5px] border-[#8e732c] shadow-[0_8px_20px_rgba(201,168,76,0.3)] hover:brightness-105 active:translate-y-[3px] active:border-b-[1px] active:shadow-[0_2px_8px_rgba(201,168,76,0.2)]"
                >
                  <PremiumSparklesEffect color={accentColor === "violet" ? "violet" : "gold"} />
                  CLAIM YOUR SPOT — $300 DEPOSIT
                </button>
                
                <div className="flex items-center space-x-2 text-slate-500 text-[10px] font-mono justify-center sm:justify-start">
                  <span>💰 $300 to start ($600 total)</span>
                  <span>•</span>
                  <span>⏱️ Setup: 10 min</span>
                  <span>•</span>
                  <span>⚡ Instant Lock</span>
                </div>
              </div>
            </motion.div>

            {/* Staggered KPIs and stats strip */}
            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full"
            >
              {/* Stat 1 */}
              <div className="glass-panel py-3 px-2 text-center flex flex-col justify-center items-center space-y-0.5 bg-white/95 rounded-2xl border border-white/50 shadow-sm">
                <span className="text-base sm:text-lg">⚡</span>
                <span className="text-sm sm:text-base font-mono font-bold text-slate-900">
                  {hasEntered ? `${counts.delivery}hr` : "72hr"}
                </span>
                <span className="text-[8px] sm:text-[9px] font-semibold text-slate-500 uppercase tracking-wider leading-none">
                  GUARANTEED DELIVERY
                </span>
              </div>

              {/* Stat 2 */}
              <div className="glass-panel py-3 px-2 text-center flex flex-col justify-center items-center space-y-0.5 bg-white/95 rounded-2xl border border-white/50 shadow-sm">
                <span className="text-base sm:text-lg">🎬</span>
                <span className="text-sm sm:text-base font-mono font-bold text-slate-900">
                  {hasEntered ? `${counts.videos} Videos` : "5 Videos"}
                </span>
                <span className="text-[8px] sm:text-[9px] font-semibold text-slate-500 uppercase tracking-wider leading-none">
                  CINEMATIC CREATIVES
                </span>
              </div>

              {/* Stat 3 */}
              <div className="glass-panel py-3 px-2 text-center flex flex-col justify-center items-center space-y-0.5 bg-white/95 rounded-2xl border border-white/50 shadow-sm">
                <span className="text-base sm:text-lg">💰</span>
                <span className="text-sm sm:text-base font-mono font-bold text-slate-900">
                  ${hasEntered ? counts.price : 600}
                </span>
                <span className="text-[8px] sm:text-[9px] font-semibold text-slate-400 uppercase tracking-wider leading-none line-through">
                  $1,200 VALUE
                </span>
              </div>

              {/* Stat 4 */}
              <div className="glass-panel py-3 px-2 text-center flex flex-col justify-center items-center space-y-0.5 bg-white/95 rounded-2xl border border-white/50 shadow-sm">
                <span className="text-base sm:text-lg">🔒</span>
                <span className="text-sm sm:text-base font-mono font-bold text-slate-900">
                  {hasEntered ? `${counts.pay}% Now` : "50% Now"}
                </span>
                <span className="text-[8px] sm:text-[9px] font-semibold text-slate-500 uppercase tracking-wider leading-none">
                  DEPOSIT TO SECURE
                </span>
              </div>
            </motion.div>

          </div>

          {/* RIGHT COLUMN: Interactive 9:16 portrait video container with scroll-linked movement */}
          <div className="lg:col-span-5 flex justify-center items-center w-full relative">
            
            {/* Ambient gold glow baking that scales and lights up smoothly based on scroll position */}
            <motion.div 
              style={{ opacity: glowOpacity, scale: glowScale }}
              className={`absolute -inset-8 rounded-full filter blur-3xl pointer-events-none ${
                accentColor === "violet" ? "bg-purple-400/20" : "bg-gold-400/25"
              }`}
            />

            {/* Scroll-mapped transformed wrapper */}
            <motion.div 
              style={{ 
                scale: videoScale,
                y: videoY,
                rotate: videoRotate
              }} 
              className={`relative p-2 rounded-3xl bg-white/60 border ${accentBorder} shadow-2xl overflow-hidden max-w-full w-[290px] sm:w-[350px] lg:w-full`}
            >
              {/* Aspect-ratio portrait container */}
              <div className="bg-slate-950 aspect-[9/16] w-full rounded-2xl overflow-hidden relative shadow-inner">
                <video
                  className="w-full h-full object-cover"
                  src="https://pub-27fa783e79dc4c36acfb007dffa6224f.r2.dev/Upscaler-2K%20-%20UHD-wild_card.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                />
              </div>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
}

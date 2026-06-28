import { motion, AnimatePresence } from "motion/react";
import { useEffect, useRef, useState, ReactNode } from "react";
import PremiumSparklesEffect from "./PremiumSparklesEffect";

interface AnimatedKeywordProps {
  children: ReactNode;
  accentColor: "violet" | "gold";
  className?: string;
  delay?: number;
}

function AnimatedKeyword({ children, accentColor, className = "", delay = 0 }: AnimatedKeywordProps) {
  const isViolet = accentColor === "violet";
  
  // Ultra-refined metallic text-clip gradient that flows smoothly on a shine cycle
  const gradientClass = isViolet
    ? "bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600"
    : "bg-gradient-to-r from-[#a17e25] via-[#edd07f] to-[#a17e25]";

  return (
    <motion.span
      className={`inline-block font-black bg-clip-text text-transparent bg-[length:200%_auto] animate-[shine_3.5s_ease-in-out_infinite] select-none ${gradientClass} ${className}`}
      animate={{
        scale: [1, 1.03, 1],
      }}
      transition={{
        duration: 2.8,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delay
      }}
    >
      {children}
    </motion.span>
  );
}

interface HeroSectionProps {
  onClaimClick: () => void;
  accentColor: "violet" | "gold";
  onVideoLoaded?: () => void;
}

export default function HeroSection({ onClaimClick, accentColor, onVideoLoaded }: HeroSectionProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [inView, setInView] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  
  // Custom optimization states for high performance delivery
  const [videoSrc, setVideoSrc] = useState("https://pub-c17d22842c694a2fb28ee33ccd088e27.r2.dev/hero.mp4");
  const [isHardwareStruggling, setIsHardwareStruggling] = useState(false);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  // 1. HIGH-PRIORITY IMMEDIATE PRELOADING STRATEGY: 
  // We inject a highly prioritized <link rel="preload"> tag on component mount.
  // This directs the browser's preload parser to allocate connection threads and 
  // start downloading the 2K UGC MP4 segment instantly.
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "video";
    link.type = "video/mp4";
    link.href = "https://pub-c17d22842c694a2fb28ee33ccd088e27.r2.dev/hero.mp4";
    document.head.appendChild(link);

    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

  // Performance-optimized Intersection Observer for lazy loading and viewport play/pause gating
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      {
        threshold: 0.1, // Trigger when 10% visible
        rootMargin: "120px" // Start preloading & preparation 120px before entry (increased for smoother transition)
      }
    );
    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Handle video element play/pause state based on intersection
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (inView) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Automatic browser block bypass trigger
          const forcePlay = () => {
            if (videoRef.current) {
              videoRef.current.play().catch(() => {});
            }
            document.removeEventListener("click", forcePlay);
            document.removeEventListener("touchstart", forcePlay);
          };
          document.addEventListener("click", forcePlay);
          document.addEventListener("touchstart", forcePlay);
        });
      }
    } else {
      video.pause();
    }
  }, [inView]);

  // Handle loaded callback to synchronize transitions
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleVideoReady = () => {
      setVideoLoaded(true);
      onVideoLoaded?.();
    };

    video.addEventListener("canplay", handleVideoReady);
    video.addEventListener("loadedmetadata", handleVideoReady);
    video.addEventListener("loadeddata", handleVideoReady);
    video.addEventListener("playing", handleVideoReady);

    if (video.readyState >= 2) {
      handleVideoReady();
    }

    // High performance fallback check to ensure the preloader always hides gracefully
    const fallbackTimeout = setTimeout(() => {
      handleVideoReady();
    }, 1200);

    // Programmatic mute bypass
    video.muted = true;

    return () => {
      clearTimeout(fallbackTimeout);
      video.removeEventListener("canplay", handleVideoReady);
      video.removeEventListener("loadedmetadata", handleVideoReady);
      video.removeEventListener("loadeddata", handleVideoReady);
      video.removeEventListener("playing", handleVideoReady);
    };
  }, [onVideoLoaded]);

  // 2. BROWSER HARDWARE ACCELERATION & DECODER BOTTLENECK AUDITOR:
  // Continuous telemetry checks evaluating frame rendering quality and lag benchmarks.
  // Swaps and degrades gracefully to lightweight formats and simpler rendering trees
  // upon detecting high CPU decode saturation or slow local playback speeds.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let checkInterval: NodeJS.Timeout;
    let didTriggerFallback = false;

    const startPerformanceCheck = () => {
      if (!video) return;

      let lastTime = video.currentTime;
      let lastCheckTimestamp = performance.now();
      let consecutiveStalls = 0;

      checkInterval = setInterval(() => {
        if (!video || didTriggerFallback) return;

        const currentTimestamp = performance.now();
        const elapsedRealTime = (currentTimestamp - lastCheckTimestamp) / 1000;
        const elapsedVideoTime = video.currentTime - lastTime;

        // Diagnostic A: Frame Drops (Standard hardware-acceleration measurement API)
        // Checks if GPU/hardware decode pipeline is disabled or saturated
        if (typeof video.getVideoPlaybackQuality === "function") {
          const quality = video.getVideoPlaybackQuality();
          const totalFrames = quality.totalVideoFrames;
          const droppedFrames = quality.droppedVideoFrames;

          if (totalFrames > 35) {
            const dropRatio = droppedFrames / totalFrames;
            // Over 18% frame drop rate indicates severe rendering/CPU bottleneck: degrade instantly
            if (dropRatio > 0.18) {
              didTriggerFallback = true;
              setIsHardwareStruggling(true);
              setVideoSrc("https://pub-c17d22842c694a2fb28ee33ccd088e27.r2.dev/hero_sharp.webm");
              clearInterval(checkInterval);
              return;
            }
          }
        }

        // Diagnostic B: Capture Playback Lags (Active decoder freeze/throttle evaluation)
        // Excellent for power-saving constraints, Safari battery-modes or sub-par network
        if (inView && !video.paused) {
          if (elapsedRealTime > 0.45) {
            // Video buffer didn't play or played at less than 35% of real-world speed
            if (elapsedVideoTime < elapsedRealTime * 0.35) {
              consecutiveStalls++;
              if (consecutiveStalls >= 3) {
                didTriggerFallback = true;
                setIsHardwareStruggling(true);
                setVideoSrc("https://pub-c17d22842c694a2fb28ee33ccd088e27.r2.dev/hero_sharp.webm");
                clearInterval(checkInterval);
                return;
              }
            } else {
              consecutiveStalls = Math.max(0, consecutiveStalls - 1);
            }
          }
        }

        lastTime = video.currentTime;
        lastCheckTimestamp = currentTimestamp;
      }, 600);
    };

    const handlePlaying = () => {
      startPerformanceCheck();
    };

    video.addEventListener("playing", handlePlaying);

    return () => {
      if (checkInterval) clearInterval(checkInterval);
      video.removeEventListener("playing", handlePlaying);
    };
  }, [inView]);

  // Synchronize stream reloading safely when the active optimized source swaps
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.src !== videoSrc) {
      video.src = videoSrc;
      video.load();
      if (inView) {
        video.play().catch(() => {});
      }
    }
  }, [videoSrc, inView]);

  // Canceled scroll triggers to satisfy user feedback and optimize playback performance
  const leftOpacity = 1;
  const leftX = 0;

  const videoScale = 1;
  const videoX = "0%";
  const videoY = "0%";

  const accentGlow = accentColor === "violet" 
    ? "border-amber-400/30 shadow-[0_0_25px_rgba(218,165,32,0.25)] text-amber-600 font-medium" 
    : "border-amber-500/50 shadow-[0_0_30px_rgba(201,168,76,0.4)] text-amber-700 font-bold";

  const btnBg = "bg-gradient-to-b from-[#e3c166] via-[#C9A84C] to-[#b08e33] border-b-[5px] border-[#8e732c] shadow-[0_8px_20px_rgba(201,168,76,0.35)] hover:brightness-105 active:translate-y-[3px] active:border-b-[1px] active:shadow-[0_2px_8px_rgba(201,168,76,0.2)]";

  const glowText = accentColor === "violet"
    ? "bg-gradient-to-r from-amber-600 via-[#C9A84C] to-amber-500 text-transparent bg-clip-text"
    : "bg-gradient-to-r from-[#af8d31] via-yellow-600 to-[#C9A84C] text-transparent bg-clip-text";

  return (
    <section ref={containerRef} id="hero-section" className="relative min-h-[92dvh] flex flex-col justify-center items-center px-4 sm:px-6 md:px-8 py-12 md:py-24 z-10 overflow-hidden">
      
      {/* Outer Layout Grid */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
        
        {/* Left Side: Staggered Copy Section, responds to page scroll layout expansion */}
        <motion.div 
          style={{ opacity: leftOpacity, x: leftX }}
          className="lg:col-span-6 flex flex-col justify-center text-left space-y-6 md:space-y-8 z-10"
        >
          {/* Brand Badge in rich dark brown text and premium frosted glass card styling */}
          <div
            className="self-start px-4 py-2 rounded-full text-xs font-black uppercase tracking-[0.18em] bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_4px_12px_rgba(0,0,0,0.03)] text-[#4e3c31] ring-1 ring-white/10"
          >
            Mandjack Digital | AI Creative Studio
          </div>

          {/* Heading with luxurious dark espresso brown instead of pure black */}
          <div className="space-y-4 md:space-y-5">
            <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-sans font-bold tracking-tight text-[#1b120c] leading-[1.08]">
              <div className="block">
                <span className="block">UGC ads for SaaS</span>
              </div>
              <div className="block">
                <span className={`block ${glowText}`}>delivered in 72 hours</span>
              </div>
            </h1>
            <p className="text-xl md:text-2xl font-bold tracking-tight text-[#4e3c31] leading-relaxed">
              For Brands that need more leads, clicks, and sales.
            </p>
          </div>

          {/* Subheading in soft cocoa brown tones */}
          <div className="text-base md:text-lg text-[#4e3c31] font-medium tracking-tight max-w-xl space-y-3.5">
            <p className="leading-relaxed">
              Get <AnimatedKeyword accentColor={accentColor} delay={0}>5 UGC ads</AnimatedKeyword> built around your <AnimatedKeyword accentColor={accentColor} delay={0.3}>Product</AnimatedKeyword> or <AnimatedKeyword accentColor={accentColor} delay={0.6}>Service</AnimatedKeyword> use case, pain point, and buyer psychology.
            </p>
            <p className="leading-relaxed opacity-90">
              Ready for TikTok, Instagram Reels, Youtube Shorts, and Meta. <span className="font-bold text-[#1b120c] inline-block whitespace-nowrap">
                <AnimatedKeyword accentColor={accentColor} delay={0.9}>Order</AnimatedKeyword> today for <AnimatedKeyword accentColor={accentColor} delay={1.2}>50% Discount</AnimatedKeyword>.
              </span>
            </p>
          </div>

          {/* CTA Trigger Group */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-5 pt-2">
            <button
              onClick={onClaimClick}
              className={`shimmer-btn relative overflow-hidden px-9 py-4.5 rounded-xl text-sm sm:text-base font-black tracking-widest transition-all duration-150 transform cursor-pointer text-center select-none text-white uppercase ${btnBg}`}
            >
              <PremiumSparklesEffect color="gold" />
              CLAIM YOUR SPOT NOW!
            </button>
            
            <div className="flex items-center justify-center sm:justify-start space-x-3 text-[#4e3c31]/80 text-xs sm:text-sm font-mono bg-white/10 border border-white/20 px-4 py-2.5 rounded-xl shadow-sm backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>100% Satisfaction Guaranteed</span>
            </div>
          </div>

        </motion.div>

        {/* Right Side: Showcase Contained Video card floating */}
        <div className="lg:col-span-6 flex justify-center items-center z-10 w-full">
          {/* Scroll scroll-linked transformation wrapper (scale, x, y) */}
          <motion.div
            style={{ scale: videoScale, x: videoX, y: videoY }}
            className="w-full max-w-[540px] lg:max-w-none transform-gpu origin-center lg:origin-center"
          >
            {/* Gentle ambient hover loop wrapper to preserve separate scroll mapping */}
            <motion.div
              animate={isHardwareStruggling ? { y: 0 } : { y: [-6, 6, -6] }}
              transition={{
                repeat: Infinity,
                duration: 5.0,
                ease: "easeInOut"
              }}
              className="w-full"
            >
              <div 
                className="relative p-3.5 rounded-[2rem] bg-white/30 border border-white/40 max-w-full overflow-hidden shadow-[0_20px_50px_rgba(201,130,50,0.12)] ring-1 ring-white/10"
                style={{ willChange: "transform" }}
              >

                <div 
                  className="relative aspect-video rounded-2xl overflow-hidden bg-[#24170f] transform-gpu"
                  style={{ willChange: "transform" }}
                >
                  
                  {/* Premium champagne colored gold shimmer skeleton preloader overlay */}
                  <AnimatePresence>
                    {!videoLoaded && (
                      <motion.div
                        key="preloader"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6 }}
                        className="absolute inset-0 bg-gradient-to-br from-[#24170f] via-[#3a271c] to-[#120b08] flex flex-col items-center justify-center space-y-4 z-20"
                      >
                        {/* Premium glowing loader */}
                        <div className="relative w-12 h-12">
                          <div className="absolute inset-0 rounded-full border-2 border-amber-200/10" />
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                            className="absolute inset-0 rounded-full border-2 border-t-[#C9A84C] border-r-transparent border-b-transparent border-l-transparent"
                          />
                        </div>
                        <motion.p
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                          className="text-[10px] font-mono tracking-widest text-[#C9A84C] uppercase font-bold"
                        >
                          PRELOADING UGC FEED...
                        </motion.p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover transform-gpu"
                    style={{
                      transform: "translate3d(0, 0, 0)",
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      willChange: "transform, contents"
                    }}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    src={videoSrc}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

      </div>

      {/* CSS Bottom Gradient Transition Mask blended with luxury warm cream champagne bg */}
      <div className="absolute bottom-0 left-0 w-full h-28 bg-gradient-to-t from-[#faf7f2] via-[#faf7f2]/30 to-transparent pointer-events-none z-10" />
    </section>
  );
}

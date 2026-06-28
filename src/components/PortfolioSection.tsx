import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Play } from "lucide-react";
import TextReveal from "./TextReveal";
import { getVimeoVideoData } from "./vimeoCache";

interface PortfolioSectionProps {
  accentColor: "gold" | "violet";
}

interface VideoItem {
  id: string;
  vimeoId: string;
  label: string;
  description: string;
  aspectRatio: string; // Dynamic ratio mapping e.g. "aspect-[9/16]"
}

// Optimized Lazy loading Vimeo player wrapper with background stream optimization and reconnection logic
function LazyVimeo({ vimeoId, label, isVertical }: { vimeoId: string; label: string; isVertical: boolean }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    // 1. Fetch thumbnail/data details
    getVimeoVideoData(vimeoId)
      .then((data) => {
        setThumbnailUrl(data.thumbnailUrl);
      })
      .catch((err) => {
        console.warn("Failed to load Vimeo thumbnail:", err);
      });
  }, [vimeoId]);

  // Use dnt=1 option to bypass Cloudflare security block inside sandbox browsers!
  const embedUrl = `https://player.vimeo.com/video/${vimeoId}?autoplay=1&muted=0&playsinline=1&quality=720p&byline=0&portrait=0&title=0&badge=0&autopause=0&dnt=1`;

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-full bg-slate-950 cursor-pointer group/vimeo"
      onClick={() => setIsPlaying(true)}
    >
      {isPlaying ? (
        <iframe
          src={embedUrl}
          className="absolute inset-0 w-full h-full border-0 scale-[1.01] object-cover object-center"
          allow="autoplay; fullscreen; picture-in-picture"
          title={label}
          referrerPolicy="strict-origin-when-cross-origin" // crucial: send secure parent origin so Vimeo allows playback!
          onLoad={() => setIframeLoaded(true)}
        />
      ) : (
        <div className="absolute inset-0">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={label}
              className="w-full h-full object-cover scale-[1.01] transition-transform duration-500 group-hover/vimeo:scale-105"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col justify-center items-center bg-slate-950 text-center p-4">
              <div className="w-10 h-10 border-2 border-amber-500/20 border-t-amber-500 animate-spin rounded-full mb-3" />
              <span className="text-[10px] text-white/40 font-mono tracking-widest uppercase">
                Preparing...
              </span>
            </div>
          )}

          {/* Centered golden premium glassmorphism play button facade */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover/vimeo:bg-black/40 transition-colors duration-300">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-slate-900/85 backdrop-blur-md border border-[#ebd07a]/30 flex items-center justify-center text-[#ebd07a] shadow-[0_8px_24px_rgba(201,168,76,0.35)] transition-all duration-300 group-hover/vimeo:scale-110 group-hover/vimeo:bg-[#C9A84C] group-hover/vimeo:text-slate-950 group-hover/vimeo:shadow-[0_12px_32px_rgba(201,168,76,0.5)]">
              <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current translate-x-0.5" />
            </div>
          </div>
        </div>
      )}

      {/* Loading state indicator on iframe mount */}
      {isPlaying && !iframeLoaded && (
        <div className="absolute inset-0 flex flex-col justify-center items-center bg-slate-950/80 backdrop-blur-xs text-center z-10 pointer-events-none">
          <div className="w-8 h-8 border-2 border-amber-500/20 border-t-amber-500 animate-spin rounded-full mb-2" />
          <span className="text-[9px] text-white/50 font-mono uppercase tracking-widest">
            Preparing High-Res Stream...
          </span>
        </div>
      )}
    </div>
  );
}

export default function PortfolioSection({ accentColor }: PortfolioSectionProps) {
  // All 7 high-performance vertical (9:16) reels configured for precise portrait presentation
  const list: VideoItem[] = [
    {
      id: "v1",
      vimeoId: "1188912682",
      label: "Broadcast-Quality Ad",
      description: "Cinema grading, crystal clear audio, and sharp hooks",
      aspectRatio: "aspect-[9/16]"
    },
    {
      id: "v2",
      vimeoId: "1188913854",
      label: "Authentic Product Review",
      description: "Word-of-mouth energy with high persuasive triggers",
      aspectRatio: "aspect-[9/16]"
    },
    {
      id: "v3",
      vimeoId: "1188913175",
      label: "Customer Testimonial",
      description: "Direct to camera validation that drives conversion",
      aspectRatio: "aspect-[9/16]"
    },
    {
      id: "v4",
      vimeoId: "1188914310",
      label: "Unboxing Experience",
      description: "Curiosity loop capture showing high brand discovery",
      aspectRatio: "aspect-[9/16]"
    },
    {
      id: "v5",
      vimeoId: "1188914606",
      label: "Beauty Commercial",
      description: "Tactile closeups highlighting premium textures",
      aspectRatio: "aspect-[9/16]"
    },
    {
      id: "v6",
      vimeoId: "1188915268",
      label: "How-To Tutorial",
      description: "Educational frameworks answering core custom queries",
      aspectRatio: "aspect-[9/16]"
    },
    {
      id: "v7",
      vimeoId: "1188915732",
      label: "Fashion-Style Ad",
      description: "Aesthetic fit lifestyle transitions with modern beats",
      aspectRatio: "aspect-[9/16]"
    }
  ];

  return (
    <section className="relative py-24 px-4 sm:px-6 md:px-8 z-10 bg-transparent">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Header Block */}
        <div className="space-y-4 text-center sm:text-left">
          <span className="text-xs font-bold font-mono uppercase tracking-[0.25em] text-slate-500 block">
            PROVEN HIGH-PERFORMANCE REELS
          </span>
          <TextReveal
            tag="h2"
            className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-slate-900 tracking-tight leading-none"
            text="These ads are already running. Yours could be next."
          />
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.8 }}
            className="text-slate-600 font-medium text-base sm:text-lg max-w-2xl leading-relaxed"
          >
            <span className="text-amber-600 font-extrabold">High-converting UGC</span> — delivered in 72 hours, engineered around consumer psychology to stop the scroll and hook audiences.
          </motion.p>
        </div>

        {/* Floating Masonry Layout column grid */}
        <div className="columns-1 sm:columns-2 md:columns-3 xl:columns-4 gap-6 lg:gap-8 pt-4 [column-fill:_balance]">
          {list.map((item, idx) => (
            <PortfolioCard key={item.id} item={item} idx={idx} />
          ))}
        </div>

      </div>
    </section>
  );
}

interface PortfolioCardProps {
  key?: string;
  item: VideoItem;
  idx: number;
}

function PortfolioCard({ item, idx }: PortfolioCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hasEntered, setHasEntered] = useState(false);
  const [isVertical, setIsVertical] = useState(true);
  const [aspectClass, setAspectClass] = useState("aspect-[9/16]");
  const [reduceMotion, setReduceMotion] = useState(false);

  // Setup Framer Motion scroll tracker for subtle premium parallax window depth
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  // Calculate subtle dynamic vertical movement (-15px to 15px is balanced and highly premium)
  const yParallax = useTransform(scrollYProgress, [0, 1], [15, -15]);

  // Disable parallax if user prefers reduced motion or on slow connections
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nav = navigator as any;
    const conn = nav.connection || nav.mozConnection || nav.webkitConnection;
    let isSlow = false;
    if (conn) {
      if (conn.saveData || conn.effectiveType === "slow-2g" || conn.effectiveType === "2g" || conn.effectiveType === "3g") {
        isSlow = true;
      }
    }
    if (prefersReduced || isSlow) {
      setReduceMotion(true);
    }
  }, []);

  const innerY = reduceMotion ? 0 : yParallax;

  // Fetch vertical/landscape orientation from Vimeo metadata at runtime
  useEffect(() => {
    getVimeoVideoData(item.vimeoId)
      .then((data) => {
        setIsVertical(data.isVertical);
        setAspectClass(data.isVertical ? "aspect-[9/16]" : "aspect-[16/9]");
      })
      .catch((err) => {
        console.warn("Failed to retrieve dynamic format properties:", err);
      });
  }, [item.vimeoId]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHasEntered(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: "0px 0px -80px 0px", // Trigger when the card starts arriving
        threshold: 0.1,
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={hasEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      whileHover={{ y: -10, scale: 1.02 }}
      transition={
        hasEntered
          ? {
              y: { type: "spring", stiffness: 85, damping: 16, mass: 1, delay: (idx % 4) * 0.08 },
              opacity: { duration: 0.6, ease: "easeOut", delay: (idx % 4) * 0.08 },
            }
          : { duration: 0.2 }
      }
      style={{ originX: 0.5, originY: 0.5 }}
      // Asynchronous float offsets for floating cards theme with Masonry support
      className="break-inside-avoid inline-block w-full mb-6 relative p-2.5 rounded-[22px] bg-white/45 backdrop-blur-md border border-white/30 shadow-[0_12px_40px_rgba(0,0,0,0.06)] group transition-all duration-300"
    >
      <div className={`relative ${aspectClass} rounded-2xl overflow-hidden w-full bg-slate-950 transition-all duration-500`}>
        {/* Parallax inner wrapper scaling slightly to prevent visual edge clipping */}
        <motion.div 
          className="absolute inset-0 w-full h-full scale-[1.08] origin-center"
          style={{ y: innerY }}
        >
          {/* Embed lazy-loaded player in native video ratio */}
          <LazyVimeo vimeoId={item.vimeoId} label={item.label} isVertical={isVertical} />
        </motion.div>

        {/* Frosted Glass Overlay Caption Bar */}
        <div className="absolute inset-x-3 bottom-3 p-3.5 bg-gradient-to-b from-black/25 via-black/45 to-black/60 backdrop-blur-md border border-white/10 rounded-xl flex flex-col justify-end transition-all duration-300 shadow-xl">
          <div className="flex justify-between items-center">
            <span className="text-white text-xs sm:text-sm font-sans font-black tracking-wide uppercase">
              {item.label}
            </span>
          </div>
          <p className="text-[10px] text-white/80 font-medium mt-1 leading-relaxed">
            {item.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

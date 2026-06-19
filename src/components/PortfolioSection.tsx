import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
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
  const [isIntersecting, setIsIntersecting] = useState(false);
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

    let debounceTimeout: any = null;

    // 2. Setup intersection observer that toggles active loads as user scrolls
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (debounceTimeout) clearTimeout(debounceTimeout);
            debounceTimeout = setTimeout(() => {
              setIsIntersecting(true);
            }, 100); // stable wait before initialization
          } else {
            if (debounceTimeout) {
              clearTimeout(debounceTimeout);
              debounceTimeout = null;
            }
            // Smart unload when scrolling far out of view to avoid concurrent Cloudflare/Vimeo session blocks
            setIsIntersecting(false);
            setIframeLoaded(false);
          }
        });
      },
      {
        rootMargin: "300px", // Preload just-in-time and unload when 300px away
        threshold: 0.01,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (debounceTimeout) clearTimeout(debounceTimeout);
      observer.disconnect();
    };
  }, [vimeoId]);

  // Use dnt=1 to prevent third party cookie tracking, bypassing iframe sandboxing connection errors!
  const embedUrl = `https://player.vimeo.com/video/${vimeoId}?autoplay=1&muted=1&background=1&loop=1&playsinline=1&quality=360p&byline=0&portrait=0&title=0&badge=0&autopause=0&dnt=1`;

  return (
    <div ref={containerRef} className="relative w-full h-full bg-slate-950">
      {isIntersecting && (
        <iframe
          src={embedUrl}
          className="absolute inset-0 w-full h-full border-0 scale-[1.01] object-cover object-center"
          allow="autoplay; fullscreen; picture-in-picture"
          title={label}
          referrerPolicy="strict-origin-when-cross-origin" // crucial: send secure parent origin so Vimeo allows playback!
          onLoad={() => setIframeLoaded(true)}
        />
      )}
      
      {/* Static poster image / Skeleton placeholder overlay */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ease-in-out pointer-events-none ${
          iframeLoaded ? "opacity-0" : "opacity-100"
        }`}
      >
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={label}
            className="w-full h-full object-cover scale-[1.01]"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col justify-center items-center bg-slate-950 text-center p-4">
            <div className="w-10 h-10 border-2 border-amber-500/20 border-t-amber-500 animate-spin rounded-full mb-3" />
            <span className="text-[10px] text-white/40 font-mono tracking-widest uppercase">
              Fast Stream Loading...
            </span>
          </div>
        )}
      </div>
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
        {/* Embed lazy-loaded player in native video ratio */}
        <LazyVimeo vimeoId={item.vimeoId} label={item.label} isVertical={isVertical} />

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

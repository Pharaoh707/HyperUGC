import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Play } from "lucide-react";
import TextReveal from "./TextReveal";
import { getVimeoVideoData } from "./vimeoCache";
import { useCurrency } from "../lib/CurrencyContext";


interface FormatTypesSectionProps {
  onClaimClick: () => void;
  accentColor: "violet" | "gold";
}

interface FormatItem {
  id: string;
  format: string;
  description: string;
  vimeoId: string;
  badge: string;
  colSpan: string; // Dynamic widths
}

function LazyFormatVimeo({ vimeoId, label, isHovered }: { vimeoId: string; label: string; isHovered: boolean }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [isVertical, setIsVertical] = useState<boolean | null>(null);

  useEffect(() => {
    // 1. Fetch metadata via optimized/cached retriever
    getVimeoVideoData(vimeoId)
      .then((data) => {
        setThumbnailUrl(data.thumbnailUrl);
        setIsVertical(data.isVertical);
      })
      .catch((err) => {
        console.warn("Failed to load Vimeo metadata:", err);
      });
  }, [vimeoId]);

  // Use dnt=1 option to bypass Cloudflare security block inside sandbox browsers!
  const embedUrl = `https://player.vimeo.com/video/${vimeoId}?autoplay=1&muted=0&playsinline=1&quality=720p&byline=0&portrait=0&title=0&badge=0&autopause=0&dnt=1`;

  const aspectClass = isVertical === true ? "aspect-[9/16] max-h-[460px] sm:max-h-[520px]" : "aspect-video";

  return (
    <div 
      ref={containerRef} 
      className={`relative w-full ${aspectClass} mx-auto bg-slate-950 rounded-xl overflow-hidden shadow-inner font-sans transition-all duration-300 cursor-pointer group/vimeo`}
      onClick={() => setIsPlaying(true)}
    >
      {isPlaying ? (
        <iframe
          src={embedUrl}
          className="absolute inset-0 w-full h-full border-0 rounded-xl transform scale-[1.01]"
          allow="autoplay; fullscreen"
          title={label}
          referrerPolicy="strict-origin-when-cross-origin" // send correct site domain so Vimeo does not block request
          onLoad={() => setIframeLoaded(true)}
        />
      ) : (
        <div className="absolute inset-0 rounded-xl overflow-hidden">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={label}
              className="w-full h-full object-cover rounded-xl scale-[1.01] transition-transform duration-500 group-hover/vimeo:scale-105"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="absolute inset-0 flex justify-center items-center bg-slate-900">
              <div className="w-8 h-8 border-2 border-slate-700 border-t-slate-500 animate-spin rounded-full" />
            </div>
          )}

          {/* Premium golden glassmorphism play overlay facade */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover/vimeo:bg-black/40 transition-colors duration-300">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-slate-900/85 backdrop-blur-md border border-[#ebd07a]/30 flex items-center justify-center text-[#ebd07a] shadow-[0_8px_24px_rgba(201,168,76,0.35)] transition-all duration-300 group-hover/vimeo:scale-110 group-hover/vimeo:bg-[#C9A84C] group-hover/vimeo:text-slate-950 group-hover/vimeo:shadow-[0_12px_32px_rgba(201,168,76,0.5)]">
              <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current translate-x-0.5" />
            </div>
          </div>
        </div>
      )}

      {/* Loading state indicator on iframe mount */}
      {isPlaying && !iframeLoaded && (
        <div className="absolute inset-0 flex flex-col justify-center items-center bg-slate-950/80 backdrop-blur-xs text-center rounded-xl z-10 pointer-events-none">
          <div className="w-8 h-8 border-2 border-amber-500/20 border-t-amber-500 animate-spin rounded-full mb-2" />
          <span className="text-[9px] text-white/50 font-mono uppercase tracking-widest">
            Preparing High-Res Stream...
          </span>
        </div>
      )}
    </div>
  );
}

interface BentoCardProps {
  key?: string;
  item: FormatItem;
  idx: number;
  accentBorder: string;
  hoverBorderGlow: string;
  accentFill: string;
  accentText: string;
  hoveredCard: string | null;
  setHoveredCard: React.Dispatch<React.SetStateAction<string | null>>;
}

function BentoCard({
  item,
  idx,
  accentBorder,
  hoverBorderGlow,
  accentFill,
  accentText,
  hoveredCard,
  setHoveredCard
}: BentoCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [hasEntered, setHasEntered] = useState(false);
  const isHovered = hoveredCard === item.id;

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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Normalized position from -0.5 to 0.5
    const x = (e.clientX - rect.left) / width - 0.5;
    const y = (e.clientY - rect.top) / height - 0.5;
    
    // Calculate subtle rotation (max 7 degrees tilt)
    setRotateX(-y * 7);
    setRotateY(x * 7);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setHoveredCard(null);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={
        hasEntered
          ? {
              opacity: 1,
              rotateX: isHovered ? rotateX : 0,
              rotateY: isHovered ? rotateY : 0,
              scale: isHovered ? 1.015 : 1,
              y: isHovered ? -5 : 0
            }
          : { opacity: 0, y: 50 }
      }
      transition={{
        y: hasEntered
          ? isHovered
            ? { type: "spring", stiffness: 150, damping: 20 }
            : { type: "spring", stiffness: 85, damping: 16, delay: (idx % 3) * 0.08 }
          : { duration: 0.2 },
        opacity: { duration: 0.6, ease: "easeOut", delay: (idx % 3) * 0.08 },
        scale: { type: "spring", stiffness: 150, damping: 20 },
        rotateX: { type: "spring", stiffness: 150, damping: 20 },
        rotateY: { type: "spring", stiffness: 150, damping: 20 }
      }}
      onMouseEnter={() => setHoveredCard(item.id)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d"
      }}
      className={`glass-panel p-2.5 flex flex-col justify-between space-y-4 border ${accentBorder} ${hoverBorderGlow} transition-all duration-300 relative group overflow-hidden ${item.colSpan}`}
    >
      {/* Background radial highlight follow effect on hover */}
      {isHovered && (
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/5 via-transparent to-transparent pointer-events-none z-0" />
      )}

      {/* Embed lazy vimeo node with hovered play feedback state passed in */}
      <div style={{ transform: "translateZ(20px)" }} className="transition-transform duration-300 relative z-10">
        <LazyFormatVimeo vimeoId={item.vimeoId} label={item.format} isHovered={isHovered} />
      </div>

      {/* Info Text layout with 3D elevation */}
      <div 
        style={{ transform: "translateZ(40px)" }}
        className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white/70 backdrop-blur-sm rounded-xl transition-all duration-300 relative z-10 border border-white/40 shadow-sm"
      >
        <div className="space-y-1 text-left">
          <h4 className="text-base font-display font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>{item.format}</span>
            <span className={`w-1.5 h-1.5 rounded-full ${accentFill} ${isHovered ? "animate-ping" : ""}`} />
          </h4>
          <p className="text-xs text-slate-500 font-medium">
            {item.description}
          </p>
        </div>

        <span className={`self-start sm:self-center text-[10px] font-mono uppercase tracking-[0.15em] px-3 py-1 rounded bg-slate-100 ${accentText} font-bold border border-slate-200/50 shadow-xs`}>
          {item.badge}
        </span>
      </div>
    </motion.div>
  );
}

export default function FormatTypesSection({ onClaimClick, accentColor }: FormatTypesSectionProps) {
  const { currentCurrency } = useCurrency();
  const formats: FormatItem[] = [
    {
      id: "f1",
      format: "TV-Style Ad",
      description: "Polished, memorable, and broadcast-quality production standards.",
      vimeoId: "1188918140",
      badge: "Awareness",
      colSpan: "lg:col-span-8"
    },
    {
      id: "f2",
      format: "Unboxing",
      description: "The curiosity hook. First impressions with authentic reveal sequence.",
      vimeoId: "1188916883",
      badge: "Awareness",
      colSpan: "lg:col-span-4"
    },
    {
      id: "f3",
      format: "Product Review",
      description: "Trust in motion. Results-led, credibility-first consumer feedback.",
      vimeoId: "1188916214",
      badge: "Conversion",
      colSpan: "lg:col-span-4"
    },
    {
      id: "f4",
      format: "Testimonial Style",
      description: "Real person energy. Emotional, highly relatable, direct-to-lens address.",
      vimeoId: "1188917925",
      badge: "Trust",
      colSpan: "lg:col-span-8"
    },
    {
      id: "f5",
      format: "Tutorial Guide",
      description: "Educate to sell. Multi-step workflows showcasing product utility.",
      vimeoId: "1188916883",
      badge: "Conversion",
      colSpan: "lg:col-span-6"
    },
    {
      id: "f6",
      format: "Beauty Hero Reel",
      description: "Cinematic and tactile closeups highlighting clean fluid textures.",
      vimeoId: "1188917415",
      badge: "Awareness",
      colSpan: "lg:col-span-6"
    }
  ];

  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const accentText = accentColor === "violet" ? "text-purple-600" : "text-[#af8d31]";
  const accentFill = accentColor === "violet" ? "bg-purple-600" : "bg-[#C9A84C]";
  const accentBorder = accentColor === "violet" ? "border-purple-600/25" : "border-[#C9A84C]/25";
  const hoverBorderGlow = accentColor === "violet" ? "hover:border-purple-500/50 hover:shadow-[0_12px_24px_rgba(124,58,237,0.15)]" : "hover:border-amber-400/50 hover:shadow-[0_12px_24px_rgba(201,168,76,0.15)]";
  const btnBg = "bg-gradient-to-b from-[#e3c166] via-[#C9A84C] to-[#b08e33] border-b-[5px] border-[#8e732c] shadow-[0_8px_20px_rgba(201,168,76,0.35)] hover:brightness-105 active:translate-y-[3px] active:border-b-[1px] active:shadow-[0_2px_8px_rgba(201,168,76,0.2)]";

  return (
    <section className="relative py-24 px-4 sm:px-6 md:px-8 z-10 w-full overflow-hidden bg-transparent">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Head Block */}
        <div className="space-y-4 max-w-3xl">
          <span className="text-xs font-bold font-mono uppercase tracking-[0.25em] text-slate-500 block">
            OMNICHANNEL DIMENSIONAL SPECS
          </span>
          <div className="overflow-hidden">
            <motion.h2 
              initial={{ y: "100%" }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-slate-900 tracking-tight leading-none"
            >
              Every Format Your Ad Needs to Convert.
            </motion.h2>
          </div>
          <TextReveal
            tag="p"
            className="text-slate-600 font-medium text-base sm:text-lg max-w-xl"
            text="Ready to deploy immediately on TikTok, Meta, Google or YouTube — delivered fully pre-cut within 72 hours."
            delay={150}
          />
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
          {formats.map((item, idx) => (
            <BentoCard
              key={item.id}
              item={item}
              idx={idx}
              accentBorder={accentBorder}
              hoverBorderGlow={hoverBorderGlow}
              accentFill={accentFill}
              accentText={accentText}
              hoveredCard={hoveredCard}
              setHoveredCard={setHoveredCard}
            />
          ))}
        </div>

        {/* Shimmer button action block below grid */}
        <div className="text-center pt-8 flex flex-col items-center space-y-3 pb-4">
          <button
            onClick={onClaimClick}
            className={`shimmer-btn px-8 py-4.5 rounded-xl text-xs sm:text-sm font-black text-white cursor-pointer tracking-widest transition-all uppercase select-none ${btnBg}`}
          >
            CLAIM YOUR SPOT — {currentCurrency.symbol}{currentCurrency.deposit} DEPOSIT
          </button>
          <p className="text-slate-500 text-[11px] font-mono font-semibold uppercase">
            {currentCurrency.note}
          </p>
        </div>

      </div>
    </section>
  );
}

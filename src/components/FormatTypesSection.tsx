import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import TextReveal from "./TextReveal";

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
  const [isIntersecting, setIsIntersecting] = useState(true);

  useEffect(() => {
    // Keep observer active as a backup, but initialize to true to force immediate load on mount
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsIntersecting(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: "800px" }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full aspect-video bg-slate-950 rounded-xl overflow-hidden shadow-inner">
      {isIntersecting ? (
        <iframe
          src={`https://player.vimeo.com/video/${vimeoId}?autoplay=${isHovered ? "1" : "0"}&muted=1&background=1&loop=1`}
          className="absolute inset-0 w-full h-full border-0 rounded-xl pointer-events-none transform scale-[1.01]"
          allow="autoplay; fullscreen"
          title={label}
        />
      ) : (
        <div className="absolute inset-0 flex justify-center items-center bg-slate-900">
          <div className="w-8 h-8 border-2 border-slate-700 border-t-slate-500 animate-spin rounded-full" />
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
  const isHovered = hoveredCard === item.id;

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
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ delay: idx * 0.08, duration: 0.6 }}
      onMouseEnter={() => setHoveredCard(item.id)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: isHovered ? rotateX : 0,
        rotateY: isHovered ? rotateY : 0,
        scale: isHovered ? 1.015 : 1,
        y: isHovered ? -5 : 0
      }}
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
        <div className="text-center pt-8">
          <button
            onClick={onClaimClick}
            className={`shimmer-btn px-8 py-4.5 rounded-xl text-xs sm:text-sm font-black text-white cursor-pointer tracking-widest transition-all uppercase select-none ${btnBg}`}
          >
            CLAIM YOUR SPOT NOW
          </button>
        </div>

      </div>
    </section>
  );
}

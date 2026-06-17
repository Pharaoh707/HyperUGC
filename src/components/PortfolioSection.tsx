import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import TextReveal from "./TextReveal";

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

// Optimized Lazy loading Vimeo player wrapper with background stream optimization
function LazyVimeo({ vimeoId, label, aspectRatio }: { vimeoId: string; label: string; aspectRatio: string }) {
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
      {
        rootMargin: "600px", // Trigger earlier load for seamless speed
        threshold: 0.01,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={`relative w-full h-full bg-slate-950/40 rounded-2xl overflow-hidden ${aspectRatio}`}>
      {isIntersecting ? (
        <iframe
          src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1&muted=1&background=1&loop=1&playsinline=1&quality=720p`}
          className="absolute inset-0 w-full h-full border-0 rounded-2xl scale-[1.01]"
          allow="autoplay; fullscreen; picture-in-picture"
          title={label}
          style={{ objectFit: "cover" }}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col justify-center items-center bg-slate-900/60 border border-white/5 text-center p-4">
          <div className="w-10 h-10 border-2 border-amber-500/20 border-t-amber-500 animate-spin rounded-full mb-3" />
          <span className="text-[10px] text-white/40 font-mono tracking-widest uppercase">
            Fast Stream Loading...
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

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 60 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 80,
        damping: 15,
        mass: 1
      }
    }
  };

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

        {/* Floating vertical layout grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 pt-4"
        >
          {list.map((item, idx) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              style={{ originX: 0.5, originY: 0.5 }}
              // Asynchronous float offsets for floating cards theme
              className="relative p-2.5 rounded-[22px] bg-white/20 backdrop-blur-xl border border-white/25 shadow-[0_12px_40px_rgba(0,0,0,0.06)] group transition-all duration-300"
            >
              <div className={`relative ${item.aspectRatio} rounded-2xl overflow-hidden w-full bg-slate-950/20`}>
                {/* Embed lazy-loaded player in native video ratio */}
                <LazyVimeo vimeoId={item.vimeoId} label={item.label} aspectRatio={item.aspectRatio} />

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
          ))}
        </motion.div>

      </div>
    </section>
  );
}

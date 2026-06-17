import React, { useState, useRef } from "react";
import { motion } from "motion/react";
import { Star } from "lucide-react";

interface Testimonial {
  name: string;
  avatarUrl: string;
  position: string;
  brand: string;
  metric: string;
  headline: string;
  quote: string;
}

interface TestimonialCardProps {
  item: Testimonial;
  idx: number;
  accentBorder: string;
  accentFill: string;
  accentText: string;
  ringAccent: string;
}

// Emulate split-text animation by rendering individual words with dynamic delays
function HeadlineSplitText({ text, delayOffset }: { text: string; delayOffset: number }) {
  const words = text.split(" ");
  return (
    <h4 className="text-slate-900 font-sans font-extrabold text-[15px] sm:text-base tracking-tight leading-snug">
      {words.map((word, idx) => (
        <motion.span
          key={idx}
          initial={{ opacity: 0, y: 4 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            delay: delayOffset + idx * 0.05,
            duration: 0.35,
            ease: "easeOut"
          }}
          className="inline-block mr-1"
        >
          {word}
        </motion.span>
      ))}
    </h4>
  );
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  item,
  idx,
  accentBorder,
  accentFill,
  accentText,
  ringAccent
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [spotlightPos, setSpotlightPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [avatarLoaded, setAvatarLoaded] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Relative position from center of the card (-0.5 to 0.5)
    const x = (e.clientX - rect.left) / width - 0.5;
    const y = (e.clientY - rect.top) / height - 0.5;
    
    // Smooth relative spotlight position as percentages for radial gradient
    const spotlightX = ((e.clientX - rect.left) / width) * 100;
    const spotlightY = ((e.clientY - rect.top) / height) * 100;
    
    // Rotations (max 8 degrees for gentle, luxurious premium feel)
    const maxTilt = 8;
    const rX = -y * maxTilt;
    const rY = x * maxTilt;
    
    setRotateX(rX);
    setRotateY(rY);
    setSpotlightPos({ x: spotlightX, y: spotlightY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ delay: idx * 0.08, duration: 0.5 }} // Stagger entrance 80ms per card
      animate={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        z: isHovered ? 12 : 0,
        boxShadow: isHovered 
          ? "0 25px 50px -12px rgba(15,23,42,0.14)" 
          : "0 10px 30px -10px rgba(15,23,42,0.06)"
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1000 }}
      className={`glass-panel p-6 sm:p-8 flex flex-col justify-between space-y-6 relative border ${accentBorder} hover:border-[#C9A84C]/60 hover:border-slate-400/60 transition-all duration-300 group overflow-hidden cursor-default`}
    >
      {/* Spotlight gloss flare backdrop overlay */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100 mix-blend-screen"
        style={{
          background: `radial-gradient(circle 210px at ${spotlightPos.x}% ${spotlightPos.y}%, rgba(201,168,76,0.12) 0%, rgba(255,255,255,0.05) 40%, rgba(255,255,255,0) 80%)`
        }}
      />

      {/* Breath Animation Quote Marks in background (breathes 6% to 10% on 4s loop) */}
      <motion.span
        animate={{ opacity: [0.06, 0.10, 0.06] }}
        transition={{ repeat: Infinity, duration: 4.0, ease: "easeInOut" }}
        className="absolute right-6 top-4 font-serif text-8xl text-slate-400 select-none pointer-events-none"
      >
        “
      </motion.span>

      {/* Stars display and Performance Metric Badge */}
      <div className="space-y-4.5 z-10" style={{ transform: "translateZ(20px)" }}>
        <div className="flex justify-between items-center">
          {/* Illuminate left to right, 60ms stagger, 5th star glow pulse */}
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.div
                key={star}
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                className={accentText}
                animate={star === 5 ? {
                  filter: [
                    "drop-shadow(0 0 0px rgba(201,168,76,0))",
                    "drop-shadow(0 0 6px rgba(201,168,76,0.85))",
                    "drop-shadow(0 0 0px rgba(201,168,76,0))"
                  ]
                } : {}}
                transition={{
                  delay: (idx * 0.05) + (star * 0.06), // Stagger left->right (60ms per star)
                  type: "spring",
                  stiffness: 150,
                  filter: {
                    repeat: Infinity,
                    duration: 2.0,
                    ease: "easeInOut"
                  }
                }}
              >
                <Star className="w-4.5 h-4.5 fill-current" />
              </motion.div>
            ))}
          </div>

          <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${accentFill} text-white`}>
            {item.metric.split(" ")[0]} KPI
          </span>
        </div>

        {/* Outcome Headline (SplitText word reveal, 50ms per word) */}
        <HeadlineSplitText text={item.headline} delayOffset={(idx * 0.08) + 0.3} />

        {/* Specific metric block */}
        <div className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-1.5 self-start inline-block">
          <span className="text-xs font-mono font-extrabold text-slate-800 uppercase tracking-tight">
            🔥 KPI Result: <span className={accentText}>{item.metric}</span>
          </span>
        </div>

        <p className="text-slate-600 font-medium text-sm sm:text-[14px] leading-relaxed italic">
          "{item.quote}"
        </p>
      </div>

      {/* Author Row */}
      <div className="flex items-center space-x-3 pt-4 border-t border-slate-100 z-10 relative" style={{ transform: "translateZ(10px)" }}>
        {/* Avatar with visual stock pictures + ring fade on hover */}
        <div className="relative">
          <div className={`w-11 h-11 rounded-full bg-gradient-to-tr from-slate-100 to-slate-200 shadow-sm border border-white ring-2 ring-transparent transition-all duration-200 ${ringAccent} relative overflow-hidden flex-shrink-0 flex items-center justify-center`}>
            {/* Shimmer/Pulse preloader */}
            {!avatarLoaded && (
              <div className="absolute inset-0 bg-slate-200 animate-pulse flex items-center justify-center">
                <span className="text-[9px] font-mono font-bold text-slate-400">
                  {item.name.slice(0, 2).toUpperCase()}
                </span>
                {/* Micro premium absolute gold dust speck loader inside avatar */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C9A84C]/10 to-transparent animate-shimmer-pulse" />
              </div>
            )}
            <img
              src={item.avatarUrl}
              alt={item.name}
              referrerPolicy="no-referrer"
              onLoad={() => setAvatarLoaded(true)}
              className={`w-full h-full object-cover transition-all duration-500 ease-out ${
                avatarLoaded 
                  ? "opacity-100 scale-100 blur-0" 
                  : "opacity-0 scale-90 blur-md"
              }`}
            />
          </div>
        </div>

        <div className="text-left">
          <h5 className="text-xs sm:text-sm font-sans font-extrabold text-slate-800 tracking-tight">
            {item.name}
          </h5>
          <p className="text-[10px] sm:text-[11px] text-slate-400 font-semibold tracking-wide leading-none mt-0.5">
            {item.position} • <span className="text-slate-500 font-bold">{item.brand}</span>
          </p>
        </div>
      </div>

      {/* Glowing bar highlight on card border */}
      <div className={`absolute bottom-0 left-6 right-6 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity rounded-full ${accentFill}`} />
    </motion.div>
  );
};

export default TestimonialCard;

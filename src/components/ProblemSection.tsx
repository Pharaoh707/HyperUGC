import { motion } from "motion/react";

interface ProblemSectionProps {
  accentColor: "violet" | "gold";
}

export default function ProblemSection({ accentColor }: ProblemSectionProps) {
  const accentText = accentColor === "violet" ? "text-purple-600" : "text-[#C9A84C]";
  const accentBgLight = accentColor === "violet" ? "bg-purple-50" : "bg-amber-50";

  return (
    <section className="relative py-24 md:py-32 px-4 sm:px-6 md:px-8 z-10 overflow-hidden bg-transparent">
      
      {/* Absolute Decorative Graphic Elements */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-red-100/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-16 md:space-y-24">
        
        {/* Header Block with Split-Text type trigger */}
        <div className="text-center space-y-3">
          <div className="overflow-hidden">
            <motion.h2 
              initial={{ y: "100%" }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-slate-900 tracking-tight leading-tight"
            >
              You've already been let down by a creator.
            </motion.h2>
          </div>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className={`text-lg sm:text-xl font-mono uppercase tracking-widest ${accentText}`}
          >
            You're not making that mistake again.
          </motion.p>
        </div>

        {/* Narrative Paragraph Blocks */}
        <div className="space-y-8 md:space-y-12 text-slate-700 text-base sm:text-lg md:text-xl leading-relaxed max-w-3xl mx-auto font-sans font-medium">
          
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            Most UGC creators <span className="text-amber-600 font-bold">ignore your brief</span>, deliver <span className="text-amber-600 font-extrabold">generic click-bait content</span>, and <span className="text-amber-600 font-bold">ghost you</span> when you ask for revisions. 
            They skim a couple of bullet points, record on a <span className="text-amber-600 font-extrabold">legacy phone in a messy room</span>, and expect you to just "trust their process."
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            Some agreed to edit "a few things" — and sent back something <span className="text-amber-600 font-semibold italic">barely different</span>. 
            Then, they have the audacity to demand you <span className="text-amber-600 font-black">pay extra</span> for fixing their own basic mistakes, charging hidden <span className="text-amber-600 font-bold">licensing premiums</span> just to utilize static clips.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            You did everything right. You wrote a detailed brief. You paid upfront. You <span className="text-slate-900 font-extrabold">painfully waited two weeks</span> — only to receive a video clearly <span className="text-amber-600 font-bold">filmed in five minutes</span> with <span className="text-amber-600 font-black">zero conceptual thought</span> about your brand, your offer, or your target customer.
          </motion.p>

        </div>

        {/* Isolated stand out Callout Lines */}
        <div className="space-y-8 md:space-y-12 text-center max-w-2.5xl mx-auto pt-8">
          
          {[
            "Polished portfolios that have nothing to do with what shows up in your inbox.",
            "Paying for content you can't run — because it won't convert, and you know it.",
            "Two-week turnarounds that kill your campaign momentum before you even launch.",
            "This is the quiet frustration most brands carry alone.",
            "You start to wonder if it's your brief.",
            "Maybe your product is hard to film.",
            "Maybe you're asking for too much."
          ].map((line, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className="px-4 py-2 border-l-2 border-slate-200 text-slate-500 italic text-base sm:text-lg md:text-xl font-sans"
            >
              "{line}"
            </motion.div>
          ))}

          {/* Core Oversized conclusion triggers */}
          <div className="space-y-4 pt-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, type: "spring" }}
              className="flex justify-center"
            >
              <span className={`text-6xl sm:text-7xl md:text-8xl font-black font-display tracking-tight leading-none block px-12 sm:px-16 py-6 sm:py-8 rounded-[32px] shadow-sm ${accentText} ${accentBgLight}`}>
                You're not.
              </span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-slate-800 tracking-tight leading-normal"
            >
              You're just working with the wrong people.
            </motion.p>
          </div>

        </div>

        {/* Transition Close */}
        <motion.div 
          initial={{ opacity: 0, y: 45, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className={`relative max-w-2xl mx-auto text-center overflow-hidden rounded-3xl p-8 sm:p-10 md:p-12 border ${
            accentColor === 'violet' 
              ? 'bg-gradient-to-br from-white/95 via-purple-50/30 to-white/95 border-purple-200/80 shadow-[0_24px_55px_rgba(147,51,234,0.12)]' 
              : 'bg-gradient-to-br from-white/95 via-amber-50/45 to-white/95 border-amber-200/80 shadow-[0_24px_55px_rgba(201,168,76,0.15)]'
          }`}
        >
          {/* Active eye-catching interactive glow orbs */}
          <motion.div 
            animate={{ 
              scale: [1, 1.25, 1],
              opacity: [0.4, 0.7, 0.4],
              x: [-10, 15, -10],
              y: [-15, 10, -15]
            }}
            transition={{
              repeat: Infinity,
              duration: 7,
              ease: "easeInOut"
            }}
            className={`absolute top-0 left-1/3 w-40 h-40 rounded-full blur-3xl pointer-events-none ${
              accentColor === 'violet' ? 'bg-purple-300/30' : 'bg-amber-300/35'
            }`} 
          />
          <motion.div 
            animate={{ 
              scale: [1.1, 0.9, 1.1],
              opacity: [0.3, 0.6, 0.3],
              x: [15, -15, 15],
              y: [10, -10, 10]
            }}
            transition={{
              repeat: Infinity,
              duration: 8,
              ease: "easeInOut"
            }}
            className="absolute right-10 bottom-0 w-32 h-32 bg-blue-300/20 rounded-full blur-3xl pointer-events-none" 
          />

          {/* Staggered Content Animation Container */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.16,
                  delayChildren: 0.15
                }
              }
            }}
            className="relative space-y-5"
          >
            {/* Elegant Badge */}
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
              }}
              className="flex items-center justify-center space-x-2"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${accentColor === 'violet' ? 'bg-purple-400' : 'bg-[#C9A84C]'}`}></span>
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${accentColor === 'violet' ? 'bg-purple-500' : 'bg-[#C9A84C]'}`}></span>
              </span>
              <span className={`text-[11px] uppercase tracking-[0.28em] font-extrabold font-mono ${
                accentColor === 'violet' ? 'text-purple-700' : 'text-[#a1812a]'
              }`}>
                INSTANT DISPATCH PROTOCOL
              </span>
            </motion.div>

            {/* Description Text */}
            <motion.p 
              variants={{
                hidden: { opacity: 0, y: 18 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
              }}
              className="text-slate-700 text-sm sm:text-base md:text-lg leading-relaxed max-w-xl mx-auto font-medium select-none"
            >
              The moment you place your order, our team gets to work. <span className="font-semibold text-slate-900">No delays. Same day.</span>
            </motion.p>

            {/* High-Impact Main Callout Box */}
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 22, scale: 0.97 },
                visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
              }}
              className="pt-2"
            >
              <p className="text-2xl sm:text-3xl md:text-4xl font-display font-black text-slate-950 tracking-tight leading-none">
                Ready to go live in{" "}
                <span className={`relative inline-block px-1 ${
                  accentColor === 'violet' 
                    ? 'text-purple-700 font-extrabold' 
                    : 'text-amber-600 font-extrabold'
                }`}>
                  72 hours.
                </span>
              </p>
            </motion.div>

          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}

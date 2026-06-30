import { useEffect, useState, useRef } from "react";
import { motion } from "motion/react";
import { Sparkles, Clock, CheckCircle, HelpCircle, Layers, Star, MessageSquare, Flame, Cpu, Smartphone, Bot, Zap, GraduationCap, TrendingUp, Heart, Puzzle } from "lucide-react";

interface SolutionSectionProps {
  accentColor: "violet" | "gold";
}

export default function SolutionSection({ accentColor }: SolutionSectionProps) {
  // Counters for the cards
  const [hoursCount, setHoursCount] = useState(0);
  const [hooksCount, setHooksCount] = useState(0);
  const [hasEnteredGrid, setHasEnteredGrid] = useState(false);

  useEffect(() => {
    if (!hasEnteredGrid) return;
    
    // Count up 72 Hours
    const hoursTimer = setInterval(() => {
      setHoursCount((c) => {
        if (c >= 72) {
          clearInterval(hoursTimer);
          return 72;
        }
        return c + 2;
      });
    }, 30);

    // Count up 2 Hook variants
    const hooksTimer = setTimeout(() => {
      setHooksCount(1);
      const sub = setTimeout(() => setHooksCount(2), 350);
      return () => clearTimeout(sub);
    }, 200);

    return () => {
      clearInterval(hoursTimer);
      clearTimeout(hooksTimer);
    };
  }, [hasEnteredGrid]);

  const accentText = accentColor === "violet" ? "text-purple-600" : "text-[#af8d31]";
  const accentFill = accentColor === "violet" ? "bg-purple-600" : "bg-[#C9A84C]";
  const accentBorder = accentColor === "violet" ? "border-purple-600/30" : "border-[#C9A84C]/30";
  const hoverGlow = accentColor === "violet" ? "hover:border-purple-500/50 hover:shadow-[0_10px_25px_-5px_rgba(124,58,237,0.15)]" : "hover:border-[#C9A84C]/50 hover:shadow-[0_10px_25px_-5px_rgba(201,168,76,0.15)]";

  // Framer Motion staggered variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  };

  // Animated Steps data
  const steps = [
    {
      num: "01",
      title: "You send your brief. We actually read it",
      desc: "Every detail you share — your offer, your audience, your tone — shapes the content. Nothing gets skimmed, nothing gets ignored."
    },
    {
      num: "02",
      title: "Our team gets to work — same day",
      desc: "No availability checks. No scheduling calls - The moment you claim your spot, production begins."
    },
    {
      num: "03",
      title: "5 videos in your inbox within 72 hours",
      desc: "Cinematic quality. Conversion-focused structure. Cut and ready to go live across every major ad platform."
    }
  ];

  // Asymmetric Benefits Data Grid
  const benefitGrid = [
    {
      id: 1,
      icon: Sparkles,
      title: "On-brand. On time. Every order.",
      copy: "No exceptions. Delivery metrics are set in stone.",
      badge: null
    },
    {
      id: 2,
      icon: Flame,
      title: "Cinematic quality. Indistinguishable from live-action.",
      copy: "The benchmark is real creator content. We hit it.",
      badge: null
    },
    {
      id: 3,
      icon: Clock,
      title: "Live in {HOURS} Hours. Ready to launch.",
      copy: "Not two weeks. {HOURS} hours.",
      badge: null
    },
    {
      id: 4,
      icon: CheckCircle,
      title: "Built for your brand. No template faces.",
      copy: "No off-brand energy. Tailored cast structures only.",
      badge: null
    },
    {
      id: 5,
      icon: Layers,
      title: "Every format, zero extra fees.",
      copy: "9:16 · 1:1 · 16:9 — launch anywhere.",
      badge: null
    },
    {
      id: 6,
      icon: MessageSquare,
      title: "Built around your brand, specifically.",
      copy: "Not a template directory. Fully brief-matched bespoke production.",
      badge: null
    },
    {
      id: 7,
      icon: Star,
      title: "+{HOOKS} Hook Variants, free.",
      copy: "Same ad, two openings — instant split-test data.",
      badge: "INCLUDED"
    },
    {
      id: 8,
      icon: HelpCircle,
      title: "We don't ghost. We don't guess.",
      copy: "You get what you paid for — or we make it right.",
      badge: null
    }
  ];

  return (
    <section className="relative py-24 px-4 sm:px-6 md:px-8 z-10">
      <div className="max-w-7xl mx-auto space-y-20">
        
        {/* Headings */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="max-w-3xl space-y-4"
        >
          <div className="overflow-hidden">
            <motion.h2 
              variants={itemVariants}
              className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-slate-900 tracking-tight leading-tight"
            >
              Send your brief. Get 5 cinematic ad videos in 72 hours.
            </motion.h2>
          </div>
          <motion.p 
            variants={itemVariants}
            className="text-slate-600 text-base sm:text-lg md:text-xl font-medium tracking-tight"
          >
            Production-ready for TikTok, Meta, Google, and YouTube — no back-and-forth, no delays, no surprises.
          </motion.p>
        </motion.div>

        {/* Vertical/Horizontal Flow Steps */}
        <div className="space-y-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-200">
            <h3 className="text-lg font-mono font-bold uppercase tracking-widest text-slate-800">
              ⚡ Here's what working with us actually looks like
            </h3>
            <span className="text-xs text-slate-500 font-medium">Bespoke Production Timeline</span>
          </div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 relative"
          >
            {/* Horizontal timeline connector */}
            <div className="hidden md:block absolute top-[44px] left-[10%] right-[10%] h-[1px] bg-slate-200 z-0" />
            
            {steps.map((step) => (
              <motion.div
                key={step.num}
                variants={itemVariants}
                className="relative z-10 flex flex-col space-y-4 pt-4 bg-white/45 p-6 rounded-2xl border border-slate-200/40 backdrop-blur-xs"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono font-black text-xl bg-white shadow-sm border border-slate-200 ${accentText}`}>
                  {step.num}
                </div>
                <h4 className="text-lg font-sans font-bold text-slate-900 tracking-tight">
                  {step.title}
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed font-medium">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Commitment Block glassmorphism */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-panel p-8 md:p-10 border border-slate-300 grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
        >
          <div className="md:col-span-8 space-y-3">
            <h4 className="text-xl sm:text-2xl font-display font-black text-slate-950">
              Our Professional Direct-to-Delivery Promise:
            </h4>
            <motion.ul 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.2,
                    delayChildren: 0.1
                  }
                }
              }}
              className="space-y-3 text-slate-600 font-medium text-sm sm:text-base"
            >
              <motion.li 
                variants={{
                  hidden: { opacity: 0, y: 12, filter: "blur(2px)" },
                  visible: { 
                    opacity: 1, 
                    y: 0, 
                    filter: "blur(0px)",
                    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } 
                  }
                }}
                className="flex items-start space-x-2.5"
              >
                <span className="text-emerald-500 font-bold mt-0.5 shrink-0">✓</span>
                <span><strong>Revisions included:</strong> We build specifically to match your creative brief. If anything is off, we fix it immediately at no extra cost.</span>
              </motion.li>
              <motion.li 
                variants={{
                  hidden: { opacity: 0, y: 12, filter: "blur(2px)" },
                  visible: { 
                    opacity: 1, 
                    y: 0, 
                    filter: "blur(0px)",
                    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } 
                  }
                }}
                className="flex items-start space-x-2.5"
              >
                <span className="text-emerald-500 font-bold mt-0.5 shrink-0">✓</span>
                <span><strong>Dedicated Coordinator:</strong> Get one primary point of contact from brief onboarding to deployment.</span>
              </motion.li>
            </motion.ul>
          </div>
          <div className="md:col-span-4 p-5 rounded-2xl bg-white/50 border border-slate-200 flex flex-col justify-center items-center text-center space-y-2">
            <span className="text-2xl">❤️</span>
            <span className="text-sm font-bold text-slate-800">Your Ad Budget Deserves Content That Converts</span>
            <span className="text-xs text-slate-500 font-mono">Not content that might.</span>
          </div>
        </motion.div>

        {/* Benefits cards grid */}
        <div className="space-y-8">
          <div className="flex justify-between items-end border-b border-slate-100 pb-3">
            <h4 className="text-sm font-mono font-bold tracking-widest text-slate-500 uppercase">
              Our High-Converting Ad Creative Framework
            </h4>
            <span className="text-xs text-slate-500 font-mono">Engineered for ROAS & Conversions</span>
          </div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            onViewportEnter={() => setHasEnteredGrid(true)}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {benefitGrid.map((card, idx) => {
              const CardIcon = card.icon;
              
              // Map counters inside titles
              let finalTitle = card.title;
              if (card.id === 3) {
                finalTitle = card.title.replace("{HOURS}", String(hoursCount));
              } else if (card.id === 7) {
                finalTitle = card.title.replace("{HOOKS}", String(hooksCount));
              }

              let finalCopy = card.copy;
              if (card.id === 3) {
                finalCopy = card.copy.replace("{HOURS}", String(hoursCount));
              }

              return (
                <motion.div
                  key={card.id}
                  variants={itemVariants}
                  whileHover={{ 
                    y: -6,
                    rotateX: (idx % 2 === 0 ? 1.5 : -1.5), 
                    rotateY: (idx % 3 === 0 ? 1.5 : -1.5),
                    scale: 1.01 
                  }}
                  className={`magnetic-card glass-panel p-6 flex flex-col justify-between space-y-4 hover:border-slate-400 hover:shadow-lg transition-all duration-300 relative overflow-hidden group min-h-[190px] border ${accentBorder} ${hoverGlow}`}
                  style={{ perspective: "800px" }}
                >
                  {/* Card Glow Corner */}
                  <div className={`absolute -right-8 -top-8 w-16 h-16 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-xl ${accentFill}`} />

                  {/* Top: Icon & Badge */}
                  <div className="flex justify-between items-start">
                    <div className={`p-2.5 rounded-xl bg-white border border-slate-200/60 shadow-xs transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${accentText}`}>
                      <CardIcon className="w-5 h-5" />
                    </div>
                    {card.badge && (
                      <span className={`text-[9px] font-mono tracking-widest px-2.5 py-0.5 rounded font-black text-white ${accentFill}`}>
                        {card.badge}
                      </span>
                    )}
                  </div>

                  {/* Bottom: Title & Copy */}
                  <div className="space-y-1.5 pt-4">
                    <h5 className="text-sm sm:text-base font-display font-extrabold text-slate-900 tracking-tight leading-snug">
                      {finalTitle}
                    </h5>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed leading-snug">
                      {finalCopy}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Brand New Mini Section: Precision Engineered For */}
        <div className="space-y-10 pt-10 border-t border-slate-200/40">
          <div className="max-w-3xl space-y-3.5">
            <div className="inline-flex items-center space-x-2">
              <span className={`w-2 h-2 rounded-full ${accentFill}`} />
              <span className="text-xs text-slate-500 font-mono tracking-widest uppercase">Target Niches</span>
            </div>
            <h4 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-tight">
              UGC ad creatives built for high-ticket results.
            </h4>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              We hate generic, boring video templates just as much as you do. Instead of using the same overused faces, we build custom, high-converting video ads tailored exactly to your product use cases, target audience, and customer pain points. Here is how we help you acquire more active users across every major digital marketing channel:
            </p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-85px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.05,
                  delayChildren: 0.1
                }
              }
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              {
                title: "SaaS Founders & Marketing Managers",
                desc: "Turn complicated dashboard features into high-converting video ads. We show your software in action, tackling churn and lowering your customer acquisition cost (CAC).",
                icon: Cpu,
                badge: "Scale MRR"
              },
              {
                title: "App Founders & Builders",
                desc: "Stop the scroll on mobile feeds with high-velocity interactive mockups and finger-stopping UI demos that make your digital product feel instantly simple and premium.",
                icon: Smartphone,
                badge: "High CTR"
              },
              {
                title: "AI Founders & Solopreneurs",
                desc: "Get premium UGC video ads that explain your AI tool's 'aha' moment in under 3 seconds, turning organic traffic and cold ad campaigns into high-quality paying signups.",
                icon: Sparkles,
                badge: "Rapid Growth"
              },
              {
                title: "AI SaaS & Software Tools",
                desc: "No more complex technical jargon. We translate advanced AI features and complex automation models into human benefit stories that hook viewers and justify your premium pricing.",
                icon: Bot,
                badge: "Explain Value"
              },
              {
                title: "Mobile Apps (iOS & Android)",
                desc: "Drive cheaper app installs on TikTok, Instagram, and YouTube. We build native-feeling mobile ad creatives specifically optimized for App Store and Play Store conversion.",
                icon: Zap,
                badge: "App Installs"
              },
              {
                title: "EdTech & Learning Platforms",
                desc: "Create educational, value-packed story ads that resonate with curious learners. Connect emotionally to drive free-trial signups and boost lifetime value (LTV).",
                icon: GraduationCap,
                badge: "LTV Optimization"
              },
              {
                title: "FinTech & Trading Platforms",
                desc: "Build instant trust with clean, professional ad creatives. We showcase real trading interfaces and secure dashboards so safety-conscious users feel confident joining.",
                icon: TrendingUp,
                badge: "High-Trust Ads"
              },
              {
                title: "Productivity & Lifestyle Apps",
                desc: "Highlight daily-use habits and positive lifestyle transformations. We craft relatable story narratives that make viewers see exactly how your app solves their daily chaos.",
                icon: Heart,
                badge: "Viral Hooks"
              },
              {
                title: "Chrome Extensions & Add-ons",
                desc: "Demonstrate browser workflow simplicity and immediate time-saving results. Show your extension solving a daily browser headache in under 15 seconds.",
                icon: Puzzle,
                badge: "Instant Installs"
              }
            ].map((n, idx) => {
              const NicheIcon = n.icon;
              return (
                <motion.div
                  key={idx}
                  variants={{
                    hidden: { opacity: 0, y: 16, filter: "blur(2px)" },
                    visible: {
                      opacity: 1,
                      y: 0,
                      filter: "blur(0px)",
                      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
                    }
                  }}
                  whileHover={{ 
                    y: -5,
                    transition: { duration: 0.2, ease: "easeOut" }
                  }}
                  className={`relative p-6 rounded-2xl border border-slate-200/50 bg-white/40 backdrop-blur-xs transition-shadow duration-300 hover:shadow-md hover:border-slate-300/80 group flex flex-col justify-between space-y-4`}
                >
                  <div className="space-y-3">
                    {/* Header: Icon & Glowing dot + badge */}
                    <div className="flex justify-between items-center">
                      <div className={`p-2 rounded-xl bg-white border border-slate-100 shadow-2xs group-hover:scale-110 transition-transform duration-300 ${accentText}`}>
                        <NicheIcon className="w-4.5 h-4.5" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${accentColor === "violet" ? "bg-purple-400" : "bg-amber-400"}`}></span>
                          <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${accentColor === "violet" ? "bg-purple-500" : "bg-[#C9A84C]"}`}></span>
                        </span>
                        <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-medium">{n.badge}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-1">
                      <h5 className="text-sm sm:text-base font-display font-extrabold text-slate-900 tracking-tight">
                        {n.title}
                      </h5>
                      <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                        {n.desc}
                      </p>
                    </div>
                  </div>

                  {/* Aesthetic bottom highlight line */}
                  <div className={`h-[2px] w-0 group-hover:w-full transition-all duration-300 rounded-full ${accentFill} opacity-80`} />
                </motion.div>
              );
            })}
          </motion.div>
        </div>

      </div>
    </section>
  );
}

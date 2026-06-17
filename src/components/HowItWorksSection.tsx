import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { DollarSign, FileText, CheckCircle2 } from "lucide-react";

interface HowItWorksSectionProps {
  onClaimClick: () => void;
  accentColor: "violet" | "gold";
}

export default function HowItWorksSection({ onClaimClick, accentColor }: HowItWorksSectionProps) {
  const [fillPercent, setFillPercent] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

  const handleViewportEntry = () => {
    // Fill progress bar (1.8s duration)
    setFillPercent(100);

    // Stagger check milestones
    setTimeout(() => setActiveStep(1), 350);
    setTimeout(() => setActiveStep(2), 650);
    setTimeout(() => setActiveStep(3), 950);
  };

  const accentText = accentColor === "violet" ? "text-purple-600" : "text-[#af8d31]";
  const accentFill = accentColor === "violet" ? "bg-purple-600" : "bg-[#C9A84C]";
  const accentBorder = accentColor === "violet" ? "border-purple-600/30" : "border-[#C9A84C]/30";
  const accentShadow = accentColor === "violet" ? "shadow-[0_0_15px_#7C3AED]" : "shadow-[0_0_15px_#C9A84C]";

  const btnBg = "bg-gradient-to-b from-[#e3c166] via-[#C9A84C] to-[#b08e33] border-b-[5px] border-[#8e732c] shadow-[0_8px_20px_rgba(201,168,76,0.35)] hover:brightness-105 active:translate-y-[3px] active:border-b-[1px] active:shadow-[0_2px_8px_rgba(201,168,76,0.2)]";

  return (
    <section className="relative py-24 px-4 sm:px-6 md:px-8 z-10 w-full overflow-hidden">
      
      {/* Viewport tracking trigger */}
      <motion.div 
        onViewportEnter={handleViewportEntry}
        className="max-w-7xl mx-auto space-y-16"
      >
        
        {/* Header Block */}
        <div className="space-y-4 max-w-2xl">
          <span className="text-xs font-bold font-mono uppercase tracking-[0.25em] text-slate-500 block">
            INTAKE & PRODUCTION PIPELINE
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-slate-900 tracking-tight leading-none">
            From brief to live campaign — in three steps, under 72 hours.
          </h2>
          <p className="text-slate-600 font-medium text-base sm:text-lg">
            No endless onboarding calls. No back-and-forth. No wondering where your order is.
          </p>
        </div>

        {/* Green/Accent progress line stretching across top of steps */}
        <div className="relative w-full h-[5px] bg-slate-100/80 rounded-full overflow-hidden border border-slate-200/20">
          <div 
            className={`h-full transition-all duration-[1800ms] ease-out ${accentFill}`}
            style={{ width: `${fillPercent}%` }}
          />
        </div>

        {/* 3 Step modules */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
          
          {/* Step 1 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className={`glass-panel p-6 sm:p-8 flex flex-col justify-between space-y-6 border ${accentBorder} relative hover:border-slate-300 transition-all`}
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className={`text-[10px] font-mono leading-none font-bold uppercase py-1.5 px-3 rounded-full bg-white shadow-xs border border-slate-200 ${accentText} ${activeStep >= 1 ? accentShadow : ""}`}>
                  ⚡ Step 01 • 2 Minutes
                </span>
                
                <span className="text-md sm:text-lg font-mono font-bold text-slate-300">01</span>
              </div>

              <h3 className="text-xl font-display font-bold text-slate-950 tracking-tight">
                Lock your spot
              </h3>
              
              <p className="text-slate-600 text-sm leading-relaxed font-semibold">
                Pay your 50% deposit. Launch pricing frozen. Slot held from that exact moment. Takes two minutes.
              </p>
            </div>

            <div className="flex items-center space-x-2 pt-2 text-xs font-mono font-medium text-slate-400">
              <DollarSign className={`w-4 h-4 text-emerald-500`} />
              <span>Checkout secures place immediately</span>
            </div>
          </motion.div>

          {/* Step 2 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.45, duration: 0.6 }}
            className={`glass-panel p-6 sm:p-8 flex flex-col justify-between space-y-6 border ${accentBorder} relative hover:border-slate-300 transition-all`}
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className={`text-[10px] font-mono leading-none font-bold uppercase py-1.5 px-3 rounded-full bg-white shadow-xs border border-slate-200 ${accentText} ${activeStep >= 2 ? accentShadow : ""}`}>
                  ⚡ Step 02 • Under 10 Minutes
                </span>
                <span className="text-md sm:text-lg font-mono font-bold text-slate-300">02</span>
              </div>

              <h3 className="text-xl font-display font-bold text-slate-950 tracking-tight">
                Send your brief
              </h3>
              
              <p className="text-slate-600 text-sm leading-relaxed font-semibold">
                Focused form — product, audience, brand feel. No 40-page decks. No Zoom calls. Most clients finish in under ten minutes.
              </p>
            </div>

            <div className="flex items-center space-x-2 pt-2 text-xs font-mono font-medium text-slate-400">
              <FileText className={`w-4 h-4 text-amber-500`} />
              <span>Automated brief portal</span>
            </div>
          </motion.div>

          {/* Step 3 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.65, duration: 0.6 }}
            className={`glass-panel p-6 sm:p-8 flex flex-col justify-between space-y-6 border ${accentBorder} relative hover:border-slate-300 transition-all`}
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className={`text-[10px] font-mono leading-none font-bold uppercase py-1.5 px-3 rounded-full bg-white shadow-xs border border-slate-200 ${accentText} ${activeStep >= 3 ? accentShadow : ""}`}>
                  ⚡ Step 03 • 48–72 Hours
                </span>
                <span className="text-md sm:text-lg font-mono font-bold text-slate-300">03</span>
              </div>

              <h3 className="text-xl font-display font-bold text-slate-950 tracking-tight">
                Receive ready-to-run ads
              </h3>
              
              <p className="text-slate-600 text-sm leading-relaxed font-semibold">
                Every format. Every hook variant. Every aspect ratio. Drop straight into your ad account and go.
              </p>
            </div>

            <div className="flex items-center space-x-2 pt-2 text-xs font-mono font-medium text-slate-400">
              <CheckCircle2 className="w-4 h-4 text-blue-500" />
              <span>All assets ready for ad manager upload</span>
            </div>
          </motion.div>

        </div>

        {/* CTA fades in last */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.95, duration: 0.7 }}
          className="text-center pt-6"
        >
          <button
            onClick={onClaimClick}
            className={`shimmer-btn px-8 py-4.5 rounded-xl text-xs sm:text-sm font-black text-white cursor-pointer tracking-widest transition-all uppercase select-none ${btnBg}`}
          >
            CLAIM YOUR SPOT NOW
          </button>
        </motion.div>

      </motion.div>
    </section>
  );
}

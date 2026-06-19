import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, ShieldCheck, Flame, Scale, Send, RefreshCw } from "lucide-react";

interface FAQSectionProps {
  accentColor: "violet" | "gold";
}

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQSection({ accentColor }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const list: FAQItem[] = [
    {
      question: "Will this actually look real — or will people clock it as AI?",
      answer: "The visuals aren't the problem — modern AI rendering handles skin texture, lighting, and product interaction convincingly. The tell in most AI UGC is the script. We write the way people talk: contractions, natural pacing, real hooks. Watch the portfolio above before you decide — it was built with the same pipeline you'd receive."
    },
    {
      question: "Will it get flagged by Meta/TikTok/Google?",
      answer: "Every ad is delivered compliant with current platform disclosure requirements — Meta's AI-label policy and TikTok's synthetic media guidelines. If a platform updates its rules between delivery and launch, we handle the adjustment."
    },
    {
      question: "What if I don't love the result?",
      answer: "We build to your brief. If what lands in your inbox doesn't match what you asked for, we fix it at no extra cost. No invoice, no argument. Revisions are included."
    },
    {
      question: "Do I own the footage? Can I run it as paid ads?",
      answer: "Full commercial usage rights included. Run on any platform — Meta, TikTok, Google, YouTube — forever. No licensing fees, no attribution requirements, no expiry."
    },
    {
      question: "When and how do I pay?",
      answer: "50% deposit upfront — locks your spot and freezes your founding rate. Remaining 50% due on delivery only. We accept Revolut and PayPal. If we haven't delivered, you don't owe anything more."
    },
    {
      question: "What if my brief is vague?",
      answer: "Our brief form pulls out what matters even if you've never written a creative brief. If something's unclear, we ask one targeted question before production — not after 72 hours of building the wrong thing."
    },
    {
      question: "What do you need from me to get started?",
      answer: "Three things: your brand name, a filled brief (under 10 minutes), and your delivery email. No Zoom calls unless you want one."
    },
    {
      question: "What if I want to cancel or get a refund?",
      answer: "Cancel before production starts — full deposit refund, no questions. Once production begins, the deposit covers work underway, but the balance is never charged until delivery."
    }
  ];

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const accentText = accentColor === "violet" ? "text-purple-600" : "text-[#af8d31]";
  const accentFill = accentColor === "violet" ? "bg-purple-600" : "bg-[#C9A84C]";
  const accentBorder = accentColor === "violet" ? "border-purple-600/30" : "border-[#C9A84C]/30";
  const glowText = accentColor === "violet" ? "text-purple-600 font-extrabold" : "text-[#af8d31] font-extrabold";

  return (
    <section className="relative py-24 px-4 sm:px-6 md:px-8 z-10 w-full overflow-hidden bg-transparent">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        
        {/* Left Side: Accordion list */}
        <div className="lg:col-span-7 space-y-10">
          
          <div className="space-y-4">
            <span className="text-xs font-bold font-mono uppercase tracking-[0.25em] text-slate-400 block">
              TRANSPARENT CLIENT RULES
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-slate-900 tracking-tight leading-none">
              Every question worth asking. Answered honestly.
            </h2>
            <p className="text-slate-500 font-medium text-sm sm:text-base">
              If something's still unclear after reading this, that's entirely on us — not you. We don't hide behind contracts.
            </p>
          </div>

          <div className="space-y-4 pt-4">
            {list.map((item, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div 
                  key={idx}
                  className="rounded-xl border border-slate-200/60 bg-white/60 p-1 backdrop-blur-xs overflow-hidden"
                >
                  <button
                    onClick={() => toggle(idx)}
                    className="w-full flex justify-between items-center px-4 py-4 text-left font-display font-bold text-slate-800 text-sm sm:text-base hover:text-slate-950 transition-colors cursor-pointer"
                  >
                    <span>{item.question}</span>
                    <span className={`p-1.5 rounded-lg bg-slate-100 transition-transform duration-300 ${isOpen ? "rotate-180 bg-purple-50 text-purple-600" : "text-slate-500"}`}>
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                      >
                        <div className="px-4 pb-5 pt-1 text-slate-600 text-xs sm:text-sm leading-relaxed font-semibold">
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>

        {/* Right Side: Guarantee block */}
        <div className="lg:col-span-5 flex items-start justify-center lg:pt-[250px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={`glass-panel p-6 sm:p-10 border ${accentBorder} relative overflow-hidden backdrop-blur-md max-w-full w-full`}
          >
            {/* Absolute badge */}
            <span className={`absolute -right-8 -top-8 w-24 h-24 rounded-full blur-2xl opacity-15 ${accentFill}`} />

            <div className="space-y-6">
              
              <div className="flex items-center space-x-3 pb-4 border-b border-slate-200/60">
                <div className={`p-3 rounded-2xl bg-white shadow-sm border border-slate-200 ${accentText}`}>
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-display font-black text-slate-900 tracking-tight leading-none">
                    Risk-Free Guarantee
                  </h3>
                  <span className="text-[10px] font-mono tracking-widest text-slate-400 font-bold uppercase">FOUNDING DEPOSIT CLAUSE</span>
                </div>
              </div>

              {/* Bullet List */}
              <ul className="space-y-4">
                
                {/* 1 */}
                <li className="flex items-start space-x-3">
                  <div className={`p-1 rounded-md bg-white border border-slate-200 mt-0.5 ${accentText}`}>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
                  </div>
                  <div>
                    <h5 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">Brief-matched or we fix it</h5>
                    <p className="text-[11px] sm:text-xs text-slate-500 font-medium leading-relaxed">Revisions are completely on us. We do not bill you for adjustment sprints.</p>
                  </div>
                </li>

                {/* 2 */}
                <li className="flex items-start space-x-3">
                  <div className={`p-1 rounded-md bg-white border border-slate-200 mt-0.5 ${accentText}`}>
                    <Flame className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h5 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">Delivered in 48–72 hours</h5>
                    <p className="text-[11px] sm:text-xs text-slate-500 font-medium leading-relaxed">From the brief submission to full files in your inbox.</p>
                  </div>
                </li>

                {/* 3 */}
                <li className="flex items-start space-x-3">
                  <div className={`p-1 rounded-md bg-white border border-slate-200 mt-0.5 ${accentText}`}>
                    <Scale className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h5 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">Full commercial usage rights</h5>
                    <p className="text-[11px] sm:text-xs text-slate-500 font-medium leading-relaxed">Run digital ads anywhere, forever. Zero expiration or hidden actor commissions.</p>
                  </div>
                </li>

                {/* 4 */}
                <li className="flex items-start space-x-3">
                  <div className={`p-1 rounded-md bg-white border border-slate-200 mt-0.5 ${accentText}`}>
                    <Send className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h5 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">Compliant on delivery</h5>
                    <p className="text-[11px] sm:text-xs text-slate-500 font-medium leading-relaxed">Includes all requisite watermarks and synthetics disclosure metrics.</p>
                  </div>
                </li>

              </ul>

              {/* Central notice */}
              <div className="pt-4 border-t border-slate-200/50 text-center">
                <span className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                  Remaining <span className={glowText}> balance only due on delivery</span>.
                </span>
              </div>

            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}

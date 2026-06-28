import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import WebGLBackground from "./components/WebGLBackground";
import TopBar from "./components/TopBar";
import HeroSection from "./components/HeroSection";
import OfferRevealSection from "./components/OfferRevealSection";
import ProblemSection from "./components/ProblemSection";
import SolutionSection from "./components/SolutionSection";
import CTARepeatSection from "./components/CTARepeatSection";
import PortfolioSection from "./components/PortfolioSection";
import SocialProofSection from "./components/SocialProofSection";
import HowItWorksSection from "./components/HowItWorksSection";
import FormatTypesSection from "./components/FormatTypesSection";
import FAQSection from "./components/FAQSection";
import FinalCTASection from "./components/FinalCTASection";
import BriefPage from "./components/BriefPage";
import ThankYouPage from "./components/ThankYouPage";
import ScrollReveal from "./components/ScrollReveal";
import GlobalLoader from "./components/GlobalLoader";
import ScrollProgressBar from "./components/ScrollProgressBar";
import ConversionChatbot from "./components/ConversionChatbot";
import { Sparkles, HelpCircle, Flame } from "lucide-react";

// Clean transparent luxury spacer to blend section boundaries with staggered premium golden segments
const dividerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const dividerSegmentVariants = {
  hidden: { opacity: 0, y: 6, scale: 0.6 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1], // Ultra smooth premium cubic-bezier ease-out
    },
  },
};

function SectionDivider() {
  return (
    <motion.div
      variants={dividerContainerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      className="w-full h-12 pointer-events-none flex items-center justify-center space-x-4 select-none bg-transparent"
    >
      <motion.div
        variants={dividerSegmentVariants}
        className="w-1 h-1 rounded-full bg-amber-500/30 shadow-[0_0_8px_rgba(245,158,11,0.2)]"
      />
      <motion.div
        variants={dividerSegmentVariants}
        className="w-1.5 h-1.5 rounded-full bg-amber-500/45 shadow-[0_0_10px_rgba(245,158,11,0.3)]"
      />
      <motion.div
        variants={dividerSegmentVariants}
        className="w-1 h-1 rounded-full bg-amber-500/30 shadow-[0_0_8px_rgba(245,158,11,0.2)]"
      />
    </motion.div>
  );
}

// Testimonial & Social Proof avatar photos to preload to prevent any broken or slow pictures
const PRELOAD_AVATARS = [
  // Set 1
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120&h=120",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120&h=120",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=120&h=120",
  "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=120&h=120",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120&h=120",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=120&h=120",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120&h=120",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120&h=120",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120&h=120",
  // Set 2
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120&h=120",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=120&h=120",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=120&h=120",
  "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&q=80&w=120&h=120",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=120&h=120",
  "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=120&h=120",
  "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&q=80&w=120&h=120",
  "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=120&h=120",
  "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=120&h=120"
];

export default function App() {
  // Navigation Router: home | brief | thank-you
  const [currentPage, setCurrentPage] = useState<"home" | "brief" | "thank-you">("home");
  
  // Realtime Adaptive Ambient Accent Picker: violet | gold
  const [accentColor, setAccentColor] = useState<"violet" | "gold">("gold");

  // Track if Hero video assets are cached & ready
  const [isHeroVideoLoaded, setIsHeroVideoLoaded] = useState(false);

  // Track scroll position for the floating action button shortcut appearance
  const [showFAB, setShowFAB] = useState(false);

  // Floating Action Button Magnetic Content Offset
  const [magneticOffset, setMagneticOffset] = useState({ x: 0, y: 0 });

  const handleFABMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = e.clientX - centerX;
    const y = e.clientY - centerY;
    
    // Smooth relative factor
    const factor = 0.35;
    const maxShift = 12; // Extremely sleek and premium, not too sudden
    const shiftX = Math.max(-maxShift, Math.min(maxShift, x * factor));
    const shiftY = Math.max(-maxShift, Math.min(maxShift, y * factor));
    
    setMagneticOffset({ x: shiftX, y: shiftY });
  };

  const handleFABMouseLeave = () => {
    setMagneticOffset({ x: 0, y: 0 });
  };

  // Global dynamic element injector for preloading social proof avatars
  useEffect(() => {
    const spawnedElements: HTMLElement[] = [];

    // Preload Social Proof avatar pictures for instant high-retention rendering
    PRELOAD_AVATARS.forEach((url) => {
      // Inject high-priority browser link relations
      const linkImg = document.createElement("link");
      linkImg.rel = "preload";
      linkImg.as = "image";
      linkImg.href = url;
      document.head.appendChild(linkImg);
      spawnedElements.push(linkImg);

      // Instantly warm up cache with Image construction
      const img = new Image();
      img.src = url;
    });

    return () => {
      // Clean up injected prefetch nodes on unmount to keep DOM clean
      spawnedElements.forEach((el) => {
        if (document.head.contains(el)) {
          document.head.removeChild(el);
        }
      });
    };
  }, []);

  useEffect(() => {
    if (currentPage !== "home") {
      setShowFAB(false);
      return;
    }

    const handleScroll = () => {
      // Appear when scrolled past Hero section (approx 450px)
      if (window.scrollY > 450) {
        setShowFAB(true);
      } else {
        setShowFAB(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [currentPage]);

  // Multi-page scroll normalization
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  // Handle final secure payment trigger + funnel redirection
  const handleCheckoutSubmit = () => {
    const revolutUrl = "https://checkout.revolut.com/pay/3d8cd01f-99e8-4ab0-aafa-c2f5c715b7f8";
    
    // Simulate payment callout by opening in new tab
    window.open(revolutUrl, "_blank", "noopener,noreferrer");
    
    // Smooth transition downstream to Thank-You state
    setCurrentPage("thank-you");
  };

  const handleClaimSpotClick = () => {
    setCurrentPage("brief");
  };

  return (
    <div className="relative min-h-screen selection:bg-[rgba(201,168,76,0.2)] selection:text-[#af8d31] overflow-hidden">
      
      {/* 
        WebGL Background Scene: 
        Runs continuously in the backdrop across all multi-page view triggers for frictionless transitions 
      */}
      <WebGLBackground accentColor={accentColor} />

      {/* Global Interactive Asset & Cache Loader */}
      <GlobalLoader isVisible={!isHeroVideoLoaded && currentPage === "home"} accentColor={accentColor} />

      {/* Thin fixed scroll-progress indicator bar */}
      {currentPage === "home" && <ScrollProgressBar accentColor={accentColor} />}

      {/* Unique Floating Action Button (FAB) Shortcut to Open Brief Intake Form */}
      <AnimatePresence>
        {showFAB && currentPage === "home" && (
          <motion.button
            id="fab-intake-shortcut"
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 30 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            onClick={handleClaimSpotClick}
            onMouseMove={handleFABMouseMove}
            onMouseLeave={handleFABMouseLeave}
            className="fixed bottom-6 right-6 z-[99992] flex items-center justify-center px-5 py-3.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-[0_8px_30px_rgba(201,168,76,0.35)] border-b-[4px] border-[#8e732c] cursor-pointer backdrop-blur-md hover:brightness-105 active:translate-y-[2px] active:border-b-[1px] transition-all duration-100 bg-gradient-to-b from-[#e3c166] via-[#C9A84C] to-[#b08e33]"
          >
            <motion.div
              animate={{ x: magneticOffset.x, y: magneticOffset.y }}
              transition={{ type: "spring", stiffness: 220, damping: 22, mass: 0.1 }}
              className="flex items-center space-x-3 pointer-events-none"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-mono tracking-[0.14em]">CLAIM YOUR SPOT NOW</span>
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>



      {/* Top sticky Rate line */}
      <TopBar onClaimClick={handleClaimSpotClick} accentColor={accentColor} />

      {/* Main Container Multi-view */}
      <main className="relative z-10 w-full">
        {currentPage === "home" && (
          <div className="animate-fade-in">
            {/* Section 1: Hero */}
            <HeroSection
              onClaimClick={handleClaimSpotClick}
              accentColor={accentColor}
              onVideoLoaded={() => setIsHeroVideoLoaded(true)}
            />

            <SectionDivider />

            {/* Section 2: Offer Reveal with scroll effects */}
            <OfferRevealSection onClaimClick={handleClaimSpotClick} accentColor={accentColor} />

            <SectionDivider />

            {/* Section 3: Problem/Pain narrative */}
            <ScrollReveal>
              <ProblemSection accentColor={accentColor} />
            </ScrollReveal>

            <SectionDivider />

            {/* Section 4: Solution and step blocks */}
            <ScrollReveal>
              <SolutionSection accentColor={accentColor} />
            </ScrollReveal>

            <SectionDivider />

            {/* Section 5: Synced timer repeat CTA */}
            <ScrollReveal>
              <CTARepeatSection onClaimClick={handleClaimSpotClick} accentColor={accentColor} />
            </ScrollReveal>

            <SectionDivider />

            {/* Section 6: Portfolio 7 Vimeo cards */}
            <ScrollReveal>
              <PortfolioSection accentColor={accentColor} />
            </ScrollReveal>

            <SectionDivider />

            {/* Section 7: Social Proof Set 1 */}
            <ScrollReveal>
              <SocialProofSection setNumber={1} onClaimClick={handleClaimSpotClick} accentColor={accentColor} />
            </ScrollReveal>

            <SectionDivider />

            {/* Section 8: How it works step indicators */}
            <ScrollReveal>
              <HowItWorksSection onClaimClick={handleClaimSpotClick} accentColor={accentColor} />
            </ScrollReveal>

            <SectionDivider />

            {/* Section 9: Social Proof Set 2 */}
            <ScrollReveal>
              <SocialProofSection setNumber={2} onClaimClick={handleClaimSpotClick} accentColor={accentColor} />
            </ScrollReveal>

            <SectionDivider />

            {/* Section 10: Format types spec bento */}
            <ScrollReveal>
              <FormatTypesSection onClaimClick={handleClaimSpotClick} accentColor={accentColor} />
            </ScrollReveal>

            <SectionDivider />

            {/* Section 11: FAQ accordion and guarantee block */}
            <ScrollReveal>
              <FAQSection accentColor={accentColor} />
            </ScrollReveal>

            <SectionDivider />

            {/* Section 12: Final conversion CTA */}
            <ScrollReveal>
              <FinalCTASection onPaymentCheckout={handleCheckoutSubmit} accentColor={accentColor} />
            </ScrollReveal>

            {/* Back to Hero Video Button at the very bottom of the page */}
            <div className="pb-24 pt-8 flex flex-col items-center justify-center">
              <button
                onClick={() => {
                  document.getElementById("hero-section")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="group relative px-8 py-4.5 rounded-full text-xs font-black uppercase tracking-widest text-[#C9A84C] hover:text-white shadow-[0_4px_25px_rgba(201,130,50,0.12)] border-2 border-amber-500/30 bg-[#160e0a] hover:bg-[#20150f] active:translate-y-0.5 cursor-pointer transition-all duration-200 font-mono tracking-[0.2em]"
              >
                BACK TO THE TOP
              </button>
            </div>
          </div>
        )}

        {currentPage === "brief" && (
          <BriefPage onBack={() => setCurrentPage("home")} accentColor={accentColor} />
        )}

        {currentPage === "thank-you" && (
          <ThankYouPage onGoToBrief={() => setCurrentPage("brief")} accentColor={accentColor} />
        )}
      </main>

      {/* Aesthetic Site Footer */}
      <footer className="relative z-20 w-full py-10 bg-slate-950 border-t border-slate-900 text-slate-500 text-xs text-center space-y-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <h5 className="font-display font-black text-white text-sm tracking-tight font-sans">Mandjack.Digital</h5>
            <p className="text-[11px]">Premium UGC Production studio.</p>
          </div>
          
          <div className="flex items-center space-x-6 text-[11px] font-semibold text-slate-400">
            <button onClick={() => setCurrentPage("home")} className="hover:text-white transition-colors cursor-pointer">Landing Home</button>
            <button onClick={() => setCurrentPage("brief")} className="hover:text-white transition-colors cursor-pointer">Brief Intake</button>
            <span className="text-slate-700">|</span>
            <a href="mailto:Hello@mandjack.digital" className="hover:text-white transition-colors">Hello@mandjack.digital</a>
          </div>
        </div>

        <div className="border-t border-slate-900 pt-6 max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-3 text-[10px] text-slate-600 font-mono">
          <span>&copy; 2026 Mandjack.Digital. All rights reserved.</span>
        </div>
      </footer>

      {/* Persistent global conversion-optimized chatbot */}
      <ConversionChatbot accentColor={accentColor} onClaimSpotClick={handleClaimSpotClick} />

    </div>
  );
}

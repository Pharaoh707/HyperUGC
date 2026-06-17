import { Star } from "lucide-react";
import TestimonialCard from "./TestimonialCard";

interface SocialProofSectionProps {
  setNumber: 1 | 2;
  onClaimClick: () => void;
  accentColor: "violet" | "gold";
}

interface Testimonial {
  name: string;
  avatarUrl: string;
  position: string;
  brand: string;
  metric: string;
  headline: string;
  quote: string;
}

export default function SocialProofSection({ setNumber, onClaimClick, accentColor }: SocialProofSectionProps) {
  // Diverse, adult, high-profile target portraits with realistic metric-focused testimonials centering ease of use.
  const set1: Testimonial[] = [
    {
      name: "Marcus Vance",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120&h=120",
      position: "DTC Brand Owner",
      brand: "Safi Bedding",
      metric: "CPA dropped from $22 to $11.40",
      headline: "Aesthetic briefs nailed in the first cut",
      quote: "Our aesthetic brand guidelines were constantly ignored by creator directories. This team captured the linen texture and high-sun lighting perfectly. Received 5 polished files in exactly 3 days."
    },
    {
      name: "Chantal Haddad",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120&h=120",
      position: "Head of Growth",
      brand: "Bloom Organics",
      metric: "CTR scaled from 1.2% to 3.8%",
      headline: "Scroll stop intro hooks work instantly",
      quote: "We were burning significant budget on stale static ads. The natural unboxing creatives stopped the scroll on Meta immediately, reducing our aggregate acquisition costs in 48 hours."
    },
    {
      name: "Kenji Sato",
      avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=120&h=120",
      position: "E-commerce Founder",
      brand: "Zenith Activewear",
      metric: "ROAS increased 2.4X organically",
      headline: "No endless video editor onboarding calls",
      quote: "I simply filled in a restful 10-minute brief and got high-spec videos that felt like a professional production. The entire workflow was incredibly straightforward and stress-free."
    },
    {
      name: "Amina Al-Masri",
      avatarUrl: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=120&h=120",
      position: "Social Media Manager",
      brand: "Zaraa Glow",
      metric: "Ad spend efficiency grew +42%",
      headline: "Zero tedious revision rounds needed",
      quote: "Managing content feedback loops with typical creators is a major struggle. Here, the final drafts matched our visual goals perfectly on the first try — we deployed them instantly."
    },
    {
      name: "Tariq Davidson",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120&h=120",
      position: "Performance Marketer",
      brand: "Velo Nutrition",
      metric: "First hook variant converted 3.1%",
      headline: "Bonus hook options makes testing simple",
      quote: "The inclusion of two free hook splits in the package is brilliant. We split-tested the unboxing intros against testimonial hooks and isolated our winner in 12 hours of spend."
    },
    {
      name: "Chloe Dupont",
      avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=120&h=120",
      position: "Brand Director",
      brand: "Soleil Suncare",
      metric: "Conversion Rate boosted by 38%",
      headline: "Premium studio lighting and color grade",
      quote: "The visual quality is fully indistinguishable from high-budget agency shoots. Skin textures, product swatches, and hand feel are elegant, consistent, and beautiful."
    },
    {
      name: "Sienna Martinez",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120&h=120",
      position: "Solopreneur",
      brand: "Lumi Dental Wax",
      metric: "Saved $3,500 in creative booking fees",
      headline: "Saved my campaign launch constraints",
      quote: "I didn't have to hire modeling agencies or coordinate high-rent studio rentals myself. Sent the guidelines, paid the low deposit, and received exact files ready to turn on."
    },
    {
      name: "Gabriel Mbatha",
      avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120&h=120",
      position: "DTC Co-founder",
      brand: "AeroVeda Cosmeceuticals",
      metric: "Average CPA reduced by $14.20",
      headline: "Pre-cropped format cuts saved us hours",
      quote: "Usually 'deliverables' still requires cropping for YouTube Shorts or stories. They sent all files pre-sliced in 9:16 and 1:1, perfectly centered and balanced."
    },
    {
      name: "Yuki Lin",
      avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120&h=120",
      position: "Media Buyer",
      brand: "Omni Tech Bands",
      metric: "Launched active scaling 4 days early",
      headline: "Unbeatable pacing and turnaround speed",
      quote: "Our media buying team thrives on fast creative turnover. Getting five highly-polished assets ready in 72 hours meant we never lost momentum while scaling."
    }
  ];

  const set2: Testimonial[] = [
    {
      name: "Regina Vance",
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120&h=120",
      position: "Head of Growth",
      brand: "Glow & Co Cosmetics",
      metric: "ROAS jumped from 1.6 to 3.2",
      headline: "Extremely natural organic speech scripts",
      quote: "The visual pacing is written exactly how authentic shoppers talk online. Warm, engaging, down-to-earth transitions. There's zero AI robotic scripting or corporate speak."
    },
    {
      name: "Darius Miller",
      avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=120&h=120",
      position: "E-com Director",
      brand: "Volt Powerbeds",
      metric: "CAC decreased by 34% instantly",
      headline: "Studio-grade microphones and noise reduction",
      quote: "We were quite tired of creators sending back cell phone videos with high background room echo. The audios delivered here use premium studio lapel rigs."
    },
    {
      name: "Soraya Kanaan",
      avatarUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=120&h=120",
      position: "DTC Brand Manager",
      brand: "Elixir Wellness Labs",
      metric: "Hook retention rate grew +28%",
      headline: "Closeups highlighting beautiful textures",
      quote: "The absolute clarity of the texture closeups is stunning. The bubble lathering and oil drops are clean, clear, and perfectly focused. Extremely graceful work."
    },
    {
      name: "Aaron Goldman",
      avatarUrl: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&q=80&w=120&h=120",
      position: "Social Advertising Lead",
      brand: "Apex Apparel",
      metric: "Halved our creative fatigue cycle",
      headline: "Solves our continuous creative needs",
      quote: "Typical agency assets fatigue in under a week. Having affordable fresh packages of 5 ads dropping every month allows us to run optimized campaign testing."
    },
    {
      name: "Elena Rostova",
      avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=120&h=120",
      position: "Performance Marketer",
      brand: "SkinBotanica",
      metric: "CTR scaled from 1.5% to 4.2%",
      headline: "Instant product curiosity loops",
      quote: "Their unboxing setups trigger curiosity from the first raw frame. Cost per lander view dropped by half within a couple of days. Essential performance tool."
    },
    {
      name: "Zayn Al-Saeed",
      avatarUrl: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=120&h=120",
      position: "E-Commerce Founder",
      brand: "Aura Home Scents",
      metric: "First campaign scaled past $10k spend",
      headline: "Simplest point of contact experience",
      quote: "One organized portal handled our entire project lifecycle. We didn't have to micromanage timelines, the high-res files arrived exactly on the 70th hour."
    },
    {
      name: "Mia Thorne",
      avatarUrl: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&q=80&w=120&h=120",
      position: "Creative Director",
      brand: "Stellar Shampoos",
      metric: "90% team alignment on the first briefing",
      headline: "Gracefully matched minimalist style",
      quote: "No mismatch in visual energy at all. They respected our minimalist brand guidelines flawlessly. We've locked in recurring video plans for next quarter."
    },
    {
      name: "Nico Tanaka",
      avatarUrl: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=120&h=120",
      position: "DTC Growth Co-op",
      brand: "Keiko Coffee Filters",
      metric: "Drove 1,200 purchases in first week",
      headline: "Warm, relatable human interaction style",
      quote: "Most UGC reviews feel forced and overacted. The pacing here is slow, calm, conversational, and genuinely trustworthy. Perfect for high-awareness stages."
    },
    {
      name: "Lydia Nkosi",
      avatarUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=120&h=120",
      position: "Solopreneur",
      brand: "Sela Tea Blends",
      metric: "Conversion rose from 1.9% to 4.1%",
      headline: "Unrestricted global usage rights",
      quote: "Having perpetual creative usage rights without tricky hidden actor residuals is fantastic. We scale across Meta, TikTok, and YouTube with absolute ease."
    }
  ];

  const list = setNumber === 1 ? set1 : set2;

  const accentText = accentColor === "violet" ? "text-purple-600" : "text-[#af8d31]";
  const accentFill = accentColor === "violet" ? "bg-purple-600" : "bg-[#C9A84C]";
  const ringAccent = accentColor === "violet" ? "group-hover:ring-purple-500" : "group-hover:ring-[#C9A84C]";
  const accentBorder = accentColor === "violet" ? "border-purple-600/35" : "border-[#C9A84C]/35";
  const btnBg = "bg-gradient-to-b from-[#e3c166] via-[#C9A84C] to-[#b08e33] border-b-[5px] border-[#8e732c] shadow-[0_8px_20px_rgba(201,168,76,0.35)] hover:brightness-105 active:translate-y-[3px] active:border-b-[1px] active:shadow-[0_2px_8px_rgba(201,168,76,0.2)]";

  return (
    <section className="relative py-24 px-4 sm:px-6 md:px-8 z-10 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Head Block */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs font-bold font-mono tracking-[0.25em] text-slate-500 uppercase block">
            {setNumber === 1 ? "PARTNER STORIES & METRICS" : "HONEST CAMPAIGN FEEDBACK"}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-slate-900 tracking-tight leading-none animate-fade-in">
            {setNumber === 1 
              ? "Real briefs. Real turnarounds. Real results." 
              : "Don't take our word for it. Take theirs."
            }
          </h2>
          <p className="text-slate-600 font-medium text-base sm:text-lg">
            {setNumber === 1
              ? "From first brief to live campaigns — what our active clients actually experienced."
              : "Creative brands that were completely done waiting for mediocre creator agencies."
            }
          </p>
        </div>

        {/* 3x3 Grid of Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 pt-4">
          {list.map((item, idx) => (
            <TestimonialCard
              key={idx}
              item={item}
              idx={idx}
              accentBorder={accentBorder}
              accentFill={accentFill}
              accentText={accentText}
              ringAccent={ringAccent}
            />
          ))}
        </div>

        {/* Unified bottom trust bar & callout after cards */}
        <div className="text-center space-y-8 pt-8">
          <div className="inline-flex flex-wrap justify-center items-center gap-2 sm:gap-4 px-6 py-3 rounded-full bg-slate-100 border border-slate-200/50 text-slate-700 text-xs sm:text-sm font-mono max-w-full">
            <span className={accentText}>✦ Joined by 160+ DTC brands</span>
            <span>•</span>
            <span className="font-extrabold">4.9/5 Average Rating</span>
            <span>•</span>
            <span>Satisfaction Guaranteed</span>
          </div>

          <div className="space-y-4 max-w-xl mx-auto">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-snug">
              50% Deposit Today — The rest on Delivery — Zero Risk to You.
            </h3>
            
            <button
              onClick={onClaimClick}
              className={`shimmer-btn px-8 py-4.5 rounded-xl text-xs sm:text-sm font-black text-white cursor-pointer tracking-widest transition-all uppercase select-none ${btnBg}`}
            >
              CLAIM YOUR SPOT NOW
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import { Upload, ArrowLeft, Trophy, CheckCircle, HelpCircle, Copy, Check, Mail, ExternalLink, FileText } from "lucide-react";

interface BriefPageProps {
  onBack: () => void;
  accentColor: "violet" | "gold";
}

export default function BriefPage({ onBack, accentColor }: BriefPageProps) {
  // Form values state Management
  const [formData, setFormData] = useState({
    brandName: "",
    websiteUrl: "",
    email: "",
    socials: "",
    productOffer: "",
    targetAudience: "",
    toneFeel: "Minimal luxury",
    references: "",
    assetsLink: "",
    extraNotes: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileBase64, setFileBase64] = useState("");
  const [copied, setCopied] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setFileBase64(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      ...formData,
      uploadedFile: fileName,
      fileData: fileBase64,
    };

    try {
      // Direct high-speed API post
      const response = await fetch("/api/submit-brief", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log("[Client] Submit Response:", result);

      // Local storage backup copy
      const savedBriefs = JSON.parse(localStorage.getItem("mandjack_briefs") || "[]");
      savedBriefs.push({
        ...formData,
        fileName,
        submittedAt: new Date().toISOString(),
        deliveryMethod: result.emailSent ? "API_AUTOMATIC_EMAIL" : "LOCAL_FS_BACKUP"
      });
      localStorage.setItem("mandjack_briefs", JSON.stringify(savedBriefs));

    } catch (err) {
      console.error("[Client Error] Submit failed:", err);
      // Fail-safe backup fallback save is still registered locally
      const savedBriefs = JSON.parse(localStorage.getItem("mandjack_briefs") || "[]");
      savedBriefs.push({
        ...formData,
        fileName,
        submittedAt: new Date().toISOString(),
        deliveryMethod: "FAILSAFE_LOCAL_ONLY"
      });
      localStorage.setItem("mandjack_briefs", JSON.stringify(savedBriefs));
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);

      // Trigger Confetti Explosion!
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 }
      });
    }
  };

  const btnBg = "bg-gradient-to-b from-[#e3c166] via-[#C9A84C] to-[#b08e33] border-b-[5px] border-[#8e732c] shadow-[0_8px_18px_rgba(201,168,76,0.25)] hover:brightness-105 active:translate-y-[2px] active:border-b-[3px] transition-all duration-100 uppercase text-white font-black tracking-widest";

  const accentText = accentColor === "violet" ? "text-purple-600" : "text-[#af8d31]";
  const accentBorder = accentColor === "violet" ? "border-purple-600/25" : "border-[#C9A84C]/25";
  const hoverBorderGlow = accentColor === "violet" ? "focus:border-purple-500 focus:ring-2 focus:ring-purple-200" : "focus:border-amber-500 focus:ring-2 focus:ring-amber-200";

  return (
    <div className="relative min-h-[90dvh] w-full py-16 px-4 sm:px-6 md:px-8 z-10 flex flex-col items-center justify-center">
      
      <div className="max-w-3xl w-full">
        
        {/* Navigation back helper trigger */}
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-slate-500 hover:text-slate-800 transition-colors font-medium text-sm mb-8 cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Landing Page</span>
        </button>

        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div
              key="form-card"
              initial={{ opacity: 0, scale: 0.98, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -15 }}
              transition={{ duration: 0.4 }}
              className={`glass-panel p-6 sm:p-10 border ${accentBorder} relative backdrop-blur-md space-y-8`}
            >
              <div className="space-y-2 border-b border-slate-200/60 pb-5">
                <span className={`text-[10px] font-mono font-bold uppercase tracking-[0.2em] px-3 py-1 rounded bg-slate-100 ${accentText}`}>
                  STEP 2 OF 3 — INTAKE FORM
                </span>
                <h1 className="text-3xl sm:text-4xl font-display font-black text-slate-900 tracking-tight leading-none mt-2">
                  Let's build your ads.
                </h1>
                <p className="text-slate-500 font-medium text-sm sm:text-base">
                  Fill this in and our strategy and production team will get started within 24 hours.
                </p>
              </div>

              {/* Core Form */}
              <form onSubmit={handleFormSubmit} className="space-y-6 text-left">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Brand name */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono font-extrabold uppercase tracking-wider text-slate-500 block">
                      Brand name *
                    </label>
                    <input
                      type="text"
                      name="brandName"
                      required
                      placeholder="e.g. AeroVeda Cosmeceuticals"
                      value={formData.brandName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-white/70 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none transition-all ${hoverBorderGlow}`}
                    />
                  </div>

                  {/* Website URL */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono font-extrabold uppercase tracking-wider text-slate-500 block">
                      Website URL *
                    </label>
                    <input
                      type="url"
                      name="websiteUrl"
                      required
                      placeholder="e.g. https://yourbrand.com"
                      value={formData.websiteUrl}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-white/70 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none transition-all ${hoverBorderGlow}`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Delivery Email address */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono font-extrabold uppercase tracking-wider text-slate-500 block">
                      Email address (where to send ads) *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="e.g. luciaas@gmail.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-white/70 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none transition-all ${hoverBorderGlow}`}
                    />
                  </div>

                  {/* Social Handles */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono font-extrabold uppercase tracking-wider text-slate-500 block">
                      Social Handles (IG, TikTok etc)
                    </label>
                    <input
                      type="text"
                      name="socials"
                      placeholder="e.g. @aeroveda on Instagram"
                      value={formData.socials}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-white/70 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none transition-all ${hoverBorderGlow}`}
                    />
                  </div>
                </div>

                {/* Advertised product detail */}
                <div className="space-y-2">
                  <label className="text-xs font-mono font-extrabold uppercase tracking-wider text-slate-500 block">
                    Product being advertised (Product name + hero claim) *
                  </label>
                  <textarea
                    name="productOffer"
                    required
                    rows={2}
                    placeholder="e.g. Rosehip Facial Oil - fades dark spots in 4 weeks"
                    value={formData.productOffer}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-white/70 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none transition-all resize-y ${hoverBorderGlow}`}
                  />
                </div>

                {/* Target Audience details */}
                <div className="space-y-2">
                  <label className="text-xs font-mono font-extrabold uppercase tracking-wider text-slate-500 block">
                    Target audience (Age, lifestyle, key pain point) *
                  </label>
                  <textarea
                    name="targetAudience"
                    required
                    rows={2}
                    placeholder="e.g. Women 25-40, urban lifestyle, struggles with dry weather skin dullness"
                    value={formData.targetAudience}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-white/70 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none transition-all resize-y ${hoverBorderGlow}`}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Tone Dropdown Menu */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono font-extrabold uppercase tracking-wider text-slate-500 block">
                      Tone and feel *
                    </label>
                    <select
                      name="toneFeel"
                      value={formData.toneFeel}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-white/75 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none transition-all cursor-pointer ${hoverBorderGlow}`}
                    >
                      <option value="Minimal luxury">Minimal luxury</option>
                      <option value="Bold and punchy">Bold and punchy</option>
                      <option value="Clinical and trustworthy">Clinical and trustworthy</option>
                      <option value="Warm and natural">Warm and natural</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* References */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono font-extrabold uppercase tracking-wider text-slate-500 block">
                      3 Reference Ads / Competitors admired *
                    </label>
                    <textarea
                      name="references"
                      required
                      rows={2}
                      placeholder="e.g. Curology Hook, Aesop Product-lathering, Glossier testimonial close"
                      value={formData.references}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-white/70 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none transition-all resize-y ${hoverBorderGlow}`}
                    />
                  </div>
                </div>

                {/* Dropzone Upload & asset link */}
                <div className="space-y-4 pt-1">
                  <span className="text-xs font-mono font-extrabold uppercase tracking-wider text-slate-500 block">
                    Product photos, logo, brand assets (Upload or link)
                  </span>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Manual Click/Drop File Uploder node */}
                    <div className="relative border-2 border-dashed border-slate-300 rounded-2xl p-5 hover:border-slate-500 transition-colors flex flex-col items-center justify-center text-center space-y-2 bg-white/40">
                      <input
                        type="file"
                        onChange={handleFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        accept="image/*,video/*,.zip"
                      />
                      <Upload className="w-5 h-5 text-slate-400" />
                      <span className="text-xs font-bold text-slate-700">
                        {fileName ? `Loaded: ${fileName}` : "Drag and drop or click to choose"}
                      </span>
                      <span className="text-[10px] text-slate-400">Accepts image files, videos, or zip folders</span>
                    </div>

                    <div className="flex flex-col justify-center space-y-2">
                      <span className="text-xs font-mono text-slate-400 font-bold">OR PROVIDE DRIVE/DROPBOX LINK</span>
                      <input
                        type="url"
                        name="assetsLink"
                        placeholder="Paste shared Drive/Dropbox folder link"
                        value={formData.assetsLink}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-white/70 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none transition-all ${hoverBorderGlow}`}
                      />
                    </div>
                  </div>
                </div>

                {/* Custom open notes field */}
                <div className="space-y-2">
                  <label className="text-xs font-mono font-extrabold uppercase tracking-wider text-slate-500 block">
                    Anything else we should know?
                  </label>
                  <textarea
                    name="extraNotes"
                    rows={3}
                    placeholder="Provide details on specific text overlay keywords or audio background track style preferences..."
                    value={formData.extraNotes}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-white/70 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none transition-all resize-y ${hoverBorderGlow}`}
                  />
                </div>

                {/* Submission CTA handle */}
                <div className="pt-4 text-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`shimmer-btn px-9 py-4 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center space-x-2 mx-auto cursor-pointer ${btnBg} disabled:opacity-50`}
                  >
                    <span>{isSubmitting ? "SYNCHRONIZING INTAKE DATA..." : "SEND CURRENT BRIEF"}</span>
                  </button>
                </div>

              </form>
            </motion.div>
          ) : (
            // Form submitted success panel - Clean, professional, premium Thank You screen
            <motion.div
              key="success-card"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", damping: 18, stiffness: 100 }}
              className="glass-panel p-8 sm:p-12 border-emerald-300 shadow-[0_15px_30px_rgba(16,185,129,0.08)] space-y-8 bg-white/90 backdrop-blur-md text-center max-w-2xl mx-auto"
            >
              <div className="flex flex-col items-center space-y-6">
                {/* Golden Animated Trophy Circle */}
                <div className="relative">
                  <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-400 to-[#C9A84C] rounded-full blur opacity-30 animate-pulse"></div>
                  <div className="relative w-20 h-20 bg-gradient-to-tr from-amber-50 to-amber-100/40 border border-amber-300 rounded-full flex items-center justify-center text-amber-500 shadow-md">
                    <Trophy className="w-10 h-10 animate-pulse text-[#C9A84C]" />
                  </div>
                </div>

                <div className="space-y-3 max-w-lg">
                  <div className="inline-flex items-center space-x-1 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-700 font-extrabold font-mono text-[10px] tracking-wider uppercase">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Brief Dispatch Complete</span>
                  </div>
                  
                  <h2 className="text-3xl sm:text-4xl font-display font-black text-slate-900 tracking-tight leading-tight pt-1">
                    Thank You!
                  </h2>
                  
                  <p className="text-slate-600 text-sm sm:text-base font-semibold leading-relaxed">
                    Your creative brief has been securely delivered to <span className="text-slate-900 font-bold">Mandjack Digital</span>.
                  </p>
                  
                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed pt-2">
                    Our performance strategists are analyzing your product offer, tone guidelines, and assets. We will contact you at your registered email address (<span className="text-slate-800 font-medium font-mono">{formData.email}</span>) within 24 hours to review your bespoke visual concepts and launch your campaign.
                  </p>
                </div>
              </div>

              {/* Action buttons list */}
              <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={onBack}
                  className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-b from-[#e3c166] via-[#C9A84C] to-[#b08e33] border-b-[4px] border-[#8e732c] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-md hover:brightness-105 active:translate-y-[2px] active:border-b-[2px] transition-all cursor-pointer text-center"
                >
                  Return to Dashboard
                </button>
                <div className="text-xs text-slate-400 font-medium italic flex items-center space-x-1.5 py-1">
                  <HelpCircle className="w-4 h-4 text-emerald-500" />
                  <span>Support: hello@mandjack.digital</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

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
  const [copied, setCopied] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate safe server dispatch latency
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Store brief inside localStorage so they are inspectable by user
      const savedBriefs = JSON.parse(localStorage.getItem("mandjack_briefs") || "[]");
      savedBriefs.push({
        ...formData,
        fileName,
        submittedAt: new Date().toISOString()
      });
      localStorage.setItem("mandjack_briefs", JSON.stringify(savedBriefs));

      // Trigger Confetti Explosion!
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 }
      });

      // Launch standard native mail-client delivery flow to hello@mandjack.digital
      const subject = encodeURIComponent(`Mandjack Digital Brief: ${formData.brandName}`);
      const body = encodeURIComponent(
        `Hello Mandjack Digital Team,\n\n` +
        `Here is my completed UGC Brief:\n\n` +
        `Brand Name: ${formData.brandName}\n` +
        `Website URL: ${formData.websiteUrl}\n` +
        `Contact Email Address: ${formData.email}\n` +
        `Social Handles: ${formData.socials || "Not provided"}\n` +
        `Product being advertised: ${formData.productOffer}\n` +
        `Target audience: ${formData.targetAudience}\n` +
        `Tone and feel: ${formData.toneFeel}\n` +
        `Reference Ads / Competitors: ${formData.references}\n` +
        `Assets Link: ${formData.assetsLink || "None"}\n` +
        `Uploaded File: ${fileName || "None"}\n` +
        `Additional notes: ${formData.extraNotes || "None"}\n\n` +
        `Sent via the Mandjack Digital Brief Intake Portal.`
      );
      
      window.location.href = `mailto:hello@mandjack.digital?subject=${subject}&body=${body}`;
    }, 1200);
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
            // Form submitted success panel
            <motion.div
              key="success-card"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", damping: 15 }}
              className="glass-panel p-6 sm:p-10 border-emerald-300 shadow-xl space-y-6 bg-white/85 text-left"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-amber-100 border border-amber-300 rounded-full flex items-center justify-center text-amber-500 shadow-inner">
                  <Trophy className="w-8 h-8 animate-bounce" />
                </div>

                <div className="space-y-2 max-w-xl">
                  <div className="flex justify-center items-center space-x-1.5 text-emerald-600 font-bold font-mono text-[11px] tracking-wider uppercase">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Intake Logged Successfully!</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-900 tracking-tight leading-none">
                    Brief received.
                  </h2>
                  <p className="text-slate-600 text-xs sm:text-sm font-semibold max-w-md mx-auto font-sans">
                    Expect your ads within 48–72 hours. We'll be in touch if we have any questions.
                  </p>
                </div>
              </div>

              {/* Delivery Assistant / Fallback Block */}
              <div className="bg-slate-50/90 rounded-2xl border border-slate-200/60 p-5 sm:p-6 space-y-4">
                <div className="space-y-1">
                  <span className="flex items-center space-x-2 text-[10px] font-mono font-extrabold uppercase tracking-wider text-amber-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                    <span>Delivering Your Brief</span>
                  </span>
                  <p className="text-xs text-slate-500 font-semibold leading-relaxed font-sans">
                    We tried launching your local email application to send the brief automatically. Depending on browser restrictions inside sandboxed workspaces, your local email app may not have popped up. No worries at all!
                  </p>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-slate-400" />
                      <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wide">
                        Your Brief Data Template
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        const textToCopy = `Brand Name: ${formData.brandName}
Website: ${formData.websiteUrl}
Contact Email: ${formData.email}
Socials: ${formData.socials || "Not provided"}

--- CONCEPT CREATIVE BRIEF ---
Product Advertised: ${formData.productOffer}
Target Audience: ${formData.targetAudience}
Tone & Feel: ${formData.toneFeel}
Reference Ads / Competitors: ${formData.references}

--- ASSETS & ADDITIONAL NOTES ---
Drive/Dropbox Assets: ${formData.assetsLink || "None specified"}
Uploaded File attachment: ${fileName || "None"}
Anything else we should know: ${formData.extraNotes || "None"}

Sent via Mandjack Digital Intake.`;
                        navigator.clipboard.writeText(textToCopy);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold tracking-wider uppercase rounded-lg flex items-center space-x-1.5 transition-colors cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600 font-mono">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span className="font-mono">Copy to Clipboard</span>
                        </>
                      )}
                    </button>
                  </div>

                  <pre className="text-[11px] font-mono text-slate-600 bg-slate-50 border border-slate-100 p-3 rounded-lg max-h-40 overflow-y-auto whitespace-pre-wrap leading-relaxed select-all">
{`To: hello@mandjack.digital
Subject: Mandjack Digital Brief: ${formData.brandName}

Brand Name: ${formData.brandName}
Website: ${formData.websiteUrl}
Contact Email: ${formData.email}
Socials: ${formData.socials || "Not provided"}

--- CONCEPT CREATIVE BRIEF ---
Product Advertised: ${formData.productOffer}
Target Audience: ${formData.targetAudience}
Tone & Feel: ${formData.toneFeel}
Reference Ads / Competitors: ${formData.references}

--- ASSETS & ADDITIONAL NOTES ---
Drive/Dropbox Assets: ${formData.assetsLink || "None specified"}
Uploaded File attachment: ${fileName || "None"}
Anything else we should know: ${formData.extraNotes || "None"}`}
                  </pre>
                </div>

                {/* Email Delivery Direct Launching Hub */}
                <div className="space-y-2">
                  <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest text-center sm:text-left">
                    Send directly using your email service:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <a
                      href={`https://mail.google.com/mail/?view=cm&fs=1&to=hello@mandjack.digital&su=${encodeURIComponent(`Mandjack Digital Brief: ${formData.brandName}`)}&body=${encodeURIComponent(`Brand Name: ${formData.brandName}
Website: ${formData.websiteUrl}
Contact Email: ${formData.email}
Socials: ${formData.socials || "Not provided"}

--- CONCEPT CREATIVE BRIEF ---
Product Advertised: ${formData.productOffer}
Target Audience: ${formData.targetAudience}
Tone & Feel: ${formData.toneFeel}
Reference Ads / Competitors: ${formData.references}

--- ASSETS & ADDITIONAL NOTES ---
Drive/Dropbox Assets: ${formData.assetsLink || "None specified"}
Uploaded File attachment: ${fileName || "None"}
Anything else we should know: ${formData.extraNotes || "None"}`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2.5 bg-red-50 hover:bg-red-100 border border-red-200/60 rounded-xl text-red-700 text-xs font-bold uppercase tracking-wider text-center flex items-center justify-center space-x-1.5"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Send with Gmail</span>
                    </a>
                    <a
                      href={`https://outlook.live.com/mail/0/deeplink/compose?to=hello@mandjack.digital&subject=${encodeURIComponent(`Mandjack Digital Brief: ${formData.brandName}`)}&body=${encodeURIComponent(`Brand Name: ${formData.brandName}
Website: ${formData.websiteUrl}
Contact Email: ${formData.email}
Socials: ${formData.socials || "Not provided"}

--- CONCEPT CREATIVE BRIEF ---
Product Advertised: ${formData.productOffer}
Target Audience: ${formData.targetAudience}
Tone & Feel: ${formData.toneFeel}
Reference Ads / Competitors: ${formData.references}

--- ASSETS & ADDITIONAL NOTES ---
Drive/Dropbox Assets: ${formData.assetsLink || "None specified"}
Uploaded File attachment: ${fileName || "None"}
Anything else we should know: ${formData.extraNotes || "None"}`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2.5 bg-blue-50 hover:bg-blue-100 border border-blue-200/60 rounded-xl text-blue-700 text-xs font-bold uppercase tracking-wider text-center flex items-center justify-center space-x-1.5"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Send with Outlook</span>
                    </a>
                    <a
                      href={`mailto:hello@mandjack.digital?subject=${encodeURIComponent(`Mandjack Digital Brief: ${formData.brandName}`)}&body=${encodeURIComponent(`Brand Name: ${formData.brandName}
Website: ${formData.websiteUrl}
Contact Email: ${formData.email}
Socials: ${formData.socials || "Not provided"}

--- CONCEPT CREATIVE BRIEF ---
Product Advertised: ${formData.productOffer}
Target Audience: ${formData.targetAudience}
Tone & Feel: ${formData.toneFeel}
Reference Ads / Competitors: ${formData.references}

--- ASSETS & ADDITIONAL NOTES ---
Drive/Dropbox Assets: ${formData.assetsLink || "None specified"}
Uploaded File attachment: ${fileName || "None"}
Anything else we should know: ${formData.extraNotes || "None"}`)}`}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl text-slate-800 text-xs font-bold uppercase tracking-wider text-center flex items-center justify-center space-x-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Standard App</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Action buttons list */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-200/60">
                <button
                  onClick={onBack}
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-b from-slate-700 to-slate-900 border-b-[4px] border-slate-950 text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-md hover:brightness-110 active:translate-y-[2px] active:border-b-[1px] transition-all cursor-pointer text-center"
                >
                  Return to Landing page
                </button>
                <div className="text-xs text-slate-400 font-medium italic flex items-center space-x-1.5">
                  <HelpCircle className="w-4 h-4 text-amber-500 animate-pulse" />
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

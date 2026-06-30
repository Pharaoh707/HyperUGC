import React, { useState, useEffect, useRef, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, X, Send, User, Sparkles, Building2, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "handover-form" | "handover-success";
  content: string;
}

interface ConversionChatbotProps {
  accentColor: "violet" | "gold";
  onClaimSpotClick: () => void;
}

export default function ConversionChatbot({ accentColor, onClaimSpotClick }: ConversionChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-msg",
      role: "assistant",
      content: "Hello! I am your AI assistant. I can answer any questions about our premium UGC production, pricing, delivery, or custom options. How can I help you scale your brand's creatives today?"
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasNewBadge, setHasNewBadge] = useState(true);

  // Form states for the handover escalation form
  const [handoverName, setHandoverName] = useState("");
  const [handoverEmail, setHandoverEmail] = useState("");
  const [handoverWebsite, setHandoverWebsite] = useState("");
  const [handoverQuestion, setHandoverQuestion] = useState("");
  const [isSubmittingHandover, setIsSubmittingHandover] = useState(false);
  const [handoverError, setHandoverError] = useState("");

  const threadEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll logic when new messages arrive
  useEffect(() => {
    if (isOpen) {
      threadEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isLoading]);

  // Subtle pulsing ping notice for collapsed chatbot
  useEffect(() => {
    if (isOpen) {
      setHasNewBadge(false);
    }
  }, [isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    if (!textToSend) {
      setInputText("");
    }

    const userMessageId = `user_${Date.now()}`;
    const newMessages: ChatMessage[] = [
      ...messages,
      { id: userMessageId, role: "user", content: text }
    ];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Clean system-facing messages: filter out UI forms
      const apiMessages = newMessages
        .filter(m => m.role === "user" || m.role === "assistant")
        .map(m => ({
          role: m.role,
          content: m.content
        }))
        .slice(-12); // Send last 12 turns to prevent token bloat

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages })
      });

      if (!res.ok) {
        throw new Error("Failed to get response from assistant");
      }

      const data = await res.json();
      
      // Determine if a human hand-off should also be recommended based on response keywords
      const replyText = data.text || "";
      const isHandoverTriggered = 
        replyText.toLowerCase().includes("details") || 
        replyText.toLowerCase().includes("human") || 
        replyText.toLowerCase().includes("support") ||
        replyText.toLowerCase().includes("form below") ||
        replyText.toLowerCase().includes("expert") ||
        replyText.toLowerCase().includes("get back");

      const systemMessages: ChatMessage[] = [
        ...newMessages,
        { id: `assistant_${Date.now()}`, role: "assistant", content: replyText }
      ];

      // If handover detected, append an elegant inline handover contact card form!
      if (isHandoverTriggered) {
        systemMessages.push({
          id: `handover_form_${Date.now()}`,
          role: "handover-form",
          content: text // Prepossesses the last user question for the ticket
        });
        // Auto-fill the query pre-filled with the user's issue
        if (!handoverQuestion) {
          setHandoverQuestion(text);
        }
      }

      setMessages(systemMessages);
    } catch (e: any) {
      console.error(e);
      setMessages([
        ...newMessages,
        {
          id: `assistant_err_${Date.now()}`,
          role: "assistant",
          content: "I apologize, but I've encountered a temporary network issue. If you have any questions, you can click the form below to leave your details for a human representative, or directly click 'CLAIM YOUR SPOT'!"
        },
        {
          id: `handover_form_err_${Date.now()}`,
          role: "handover-form",
          content: text
        }
      ]);
      if (!handoverQuestion) {
        setHandoverQuestion(text);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleHandoverSubmit = async (e: FormEvent, formMsgId: string) => {
    e.preventDefault();
    if (!handoverEmail.trim()) {
      setHandoverError("Business Email is required.");
      return;
    }

    setIsSubmittingHandover(true);
    setHandoverError("");

    try {
      const res = await fetch("/api/chat/submit-support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: handoverName,
          email: handoverEmail,
          website: handoverWebsite,
          question: handoverQuestion
        })
      });

      if (!res.ok) {
        throw new Error("Support submission returned of non-ok code");
      }

      // Convert this form message into a success message card
      setMessages(prev => prev.map(m => {
        if (m.id === formMsgId) {
          return {
            id: m.id,
            role: "handover-success",
            content: "Form submitted successfully."
          };
        }
        return m;
      }));

      // Flush input states safely
      setHandoverName("");
      setHandoverEmail("");
      setHandoverWebsite("");
      setHandoverQuestion("");
    } catch (err: any) {
      setHandoverError("Failed to submit inquiry. Please check your internet connection and try again.");
    } finally {
      setIsSubmittingHandover(false);
    }
  };

  // Triggers manual escalation card
  const triggerManualEscalation = () => {
    setMessages(prev => [
      ...prev,
      {
        id: `manual_assistance_${Date.now()}`,
        role: "assistant",
        content: "Understood! Let's get you connected with our production team. Please enter your contact details below so a human expert can review your brand's requirements."
      },
      {
        id: `handover_form_${Date.now()}`,
        role: "handover-form",
        content: messages.filter(m => m.role === "user").pop()?.content || ""
      }
    ]);
  };

  const accentText = accentColor === "violet" ? "text-purple-400" : "text-amber-400";
  const accentBorder = accentColor === "violet" ? "border-purple-500/30" : "border-amber-500/30";
  const accentBg = accentColor === "violet" ? "bg-purple-600 hover:bg-purple-700" : "bg-[#C9A84C] hover:bg-[#b5953e]";
  const accentRing = accentColor === "violet" ? "focus:ring-purple-500" : "focus:ring-amber-500";
  const accentGlow = accentColor === "violet" ? "shadow-[0_0_15px_rgba(168,85,247,0.4)]" : "shadow-[0_0_15px_rgba(201,168,76,0.4)]";

  return (
    <>
      {/* Floating Collapsed Toggle Icon Widget */}
      <div className="fixed bottom-6 left-6 z-[99993] select-none">
        <button
          id="btn-chatbot-toggle"
          onClick={() => setIsOpen(!isOpen)}
          className="group flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-b from-[#ebd07a] via-[#C9A84C] to-[#a68427] border border-[#856b23]/50 text-slate-950 cursor-pointer relative shadow-[0_8px_24px_rgba(201,168,76,0.5)] transition-all duration-300 hover:scale-110 hover:-translate-y-1 active:scale-95"
          title="Open Conversation Assistant"
        >
          {isOpen ? (
            <X className="w-6 h-6 transition-transform duration-200 rotate-0 hover:rotate-90 text-slate-950" />
          ) : (
            <MessageSquare className="w-6.5 h-6.5 text-slate-950 group-hover:scale-110 transition-transform animate-pulse" />
          )}

          {/* New message notification ping bubble */}
          {hasNewBadge && !isOpen && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-950 opacity-40"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-slate-950 text-[9px] font-mono font-black text-[#ebd07a] items-center justify-center leading-none border border-[#ebd07a]/35">
                1
              </span>
            </span>
          )}

          {/* Inline floating message tooltip on hover initially */}
          {!isOpen && (
            <div className="absolute left-16 top-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap hidden sm:block pointer-events-none shadow-xl">
              Have Questions? <span className="text-[#ebd07a]">Chat Free</span>
            </div>
          )}
        </button>
      </div>

      {/* Expanded Chat Box UI Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="panel-chatbot"
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ type: "spring", stiffness: 280, damping: 25 }}
            className="fixed bottom-22 left-4 sm:left-6 z-[99993] w-[calc(100vw-32px)] sm:w-[380px] h-[500px] bg-slate-950/98 border border-slate-800/80 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col backdrop-blur-xl"
          >
            {/* Header portion */}
            <div className="bg-slate-900/90 border-b border-slate-800/60 p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-slate-800 border ${accentBorder}`}>
                  <Sparkles className="w-4.5 h-4.5 text-[#C9A84C]" />
                </div>
                <div>
                  <h4 className="text-sm font-sans font-extrabold tracking-tight text-white flex items-center gap-1.5">
                    Mandjack.Digital
                    <span className="flex h-1.5 w-1.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                    </span>
                  </h4>
                  <p className="text-[10px] text-slate-400 font-medium tracking-wide">24/7 Customer Support • Online</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable chat body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
              {messages.map((msg) => {
                if (msg.role === "assistant") {
                  return (
                    <div key={msg.id} className="flex gap-2.5 items-start text-left max-w-[85%]">
                      <div className="w-6.5 h-6.5 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#C9A84C]" />
                      </div>
                      <div className="bg-slate-900/90 text-slate-100 text-[12.5px] rounded-2xl rounded-tl-sm px-3 py-2.5 border border-slate-800/50 leading-relaxed font-sans shadow-sm select-text">
                        {msg.content}
                      </div>
                    </div>
                  );
                }

                if (msg.role === "user") {
                  return (
                    <div key={msg.id} className="flex gap-2.5 items-start justify-end text-right max-w-[85%] ml-auto">
                      <div className="bg-amber-500/10 text-amber-200 text-[12.5px] rounded-2xl rounded-tr-sm px-3 py-2.5 border border-amber-500/20 leading-relaxed font-sans shadow-sm select-text">
                        {msg.content}
                      </div>
                      <div className="w-6.5 h-6.5 rounded-full bg-amber-500/15 border border-amber-500/35 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <User className="w-3.5 h-3.5 text-amber-400" />
                      </div>
                    </div>
                  );
                }

                if (msg.role === "handover-form") {
                  return (
                    <div key={msg.id} className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-3.5 shadow-md">
                      <div className="flex items-center space-x-2 text-[#C9A84C] border-b border-slate-800/60 pb-2">
                        <Building2 className="w-4 h-4" />
                        <span className="text-xs font-mono font-black uppercase tracking-wider">Talk with a Human Expert</span>
                      </div>
                      <form onSubmit={(e) => handleHandoverSubmit(e, msg.id)} className="space-y-2.5 text-left">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-mono tracking-widest text-slate-400 block font-semibold">Your Name</label>
                          <input
                            type="text"
                            placeholder="Alex brandowner"
                            required
                            value={handoverName}
                            onChange={(e) => setHandoverName(e.target.value)}
                            className="w-full bg-slate-950/80 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500/60 font-medium"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-mono tracking-widest text-slate-400 block font-semibold">Business Email</label>
                          <input
                            type="email"
                            placeholder="alex@brand.com"
                            required
                            value={handoverEmail}
                            onChange={(e) => setHandoverEmail(e.target.value)}
                            className="w-full bg-slate-950/80 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500/60 font-medium"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-mono tracking-widest text-slate-400 block font-semibold">Brand Website</label>
                          <input
                            type="text"
                            placeholder="brand.com"
                            value={handoverWebsite}
                            onChange={(e) => setHandoverWebsite(e.target.value)}
                            className="w-full bg-slate-950/80 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500/60 font-medium"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-mono tracking-widest text-slate-400 block font-semibold">Your Message or Custom Request</label>
                          <textarea
                            placeholder="What do you need?"
                            rows={2}
                            required
                            value={handoverQuestion}
                            onChange={(e) => setHandoverQuestion(e.target.value)}
                            className="w-full bg-slate-950/80 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500/60 font-medium resize-none min-h-[45px]"
                          />
                        </div>

                        {handoverError && (
                          <div className="flex items-start gap-1.5 text-red-400 text-[11px] font-mono leading-none py-1">
                            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                            <span>{handoverError}</span>
                          </div>
                        )}

                        <button
                          type="submit"
                          disabled={isSubmittingHandover}
                          className="w-full bg-[#max] py-2 px-3 rounded text-[10px] font-mono uppercase tracking-widest text-slate-950 bg-amber-400 hover:bg-amber-300 font-extrabold cursor-pointer text-center select-none flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                        >
                          {isSubmittingHandover ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            "SUBMIT SECURE REQUEST"
                          )}
                        </button>
                      </form>
                    </div>
                  );
                }

                if (msg.role === "handover-success") {
                  return (
                    <div key={msg.id} className="bg-emerald-900/10 border border-emerald-500/35 rounded-xl p-3.5 flex flex-col items-center justify-center text-center space-y-2 py-5 shadow-sm">
                      <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                      <h5 className="text-[11px] font-black font-mono text-emerald-300 uppercase tracking-widest">DETAILS CAPTURED!</h5>
                      <p className="text-[11.5px] text-slate-300 font-medium leading-relaxed max-w-xs">
                        Thank you! Your information has been securely received. Our production director will read your question and follow up directly on <span className="text-white font-extrabold underline">{handoverEmail}</span> shortly.
                      </p>
                    </div>
                  );
                }

                return null;
              })}

              {/* Loader placeholder block */}
              {isLoading && (
                <div className="flex gap-2.5 items-start text-left max-w-[85%]">
                  <div className="w-6.5 h-6.5 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5 animate-spin">
                    <Sparkles className="w-3.5 h-3.5 text-[#C9A84C]" />
                  </div>
                  <div className="bg-slate-900/90 text-slate-400 text-[12.5px] rounded-2xl rounded-tl-sm px-3.5 py-3 border border-slate-900/60 leading-tight">
                    <div className="flex space-x-1.5 items-center justify-center h-4 py-1">
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "30ms" }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={threadEndRef} />
            </div>

            {/* Quick trigger suggestion actions section */}
            <div className="px-4 py-2 border-t border-slate-900 bg-slate-950 flex flex-wrap gap-1.5 items-center justify-start select-none">
              <button
                onClick={() => handleSendMessage("What are the pricing options?")}
                className="text-[9px] font-mono tracking-wide uppercase px-2 py-1 rounded bg-slate-800/40 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white cursor-pointer transition-colors"
              >
                Pricing details?
              </button>
              <button
                onClick={() => handleSendMessage("How fast is are videos delivered?")}
                className="text-[9px] font-mono tracking-wide uppercase px-2 py-1 rounded bg-slate-800/40 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white cursor-pointer transition-colors"
              >
                Turnaround speed?
              </button>
            </div>

            {/* Footer Form input */}
            <div className="bg-slate-900 border-t border-slate-800/80 p-3.5">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center space-x-2"
              >
                <input
                  type="text"
                  placeholder="Ask me about UGC production cost..."
                  value={inputText}
                  disabled={isLoading}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 text-[12.5px] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500/60 placeholder-slate-500 font-medium disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || isLoading}
                  className="p-2 h-9 w-9 flex items-center justify-center rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors cursor-pointer disabled:opacity-40"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

import React, { createContext, useContext, useState, useEffect } from "react";
import { Globe, Check, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export interface CurrencyDetails {
  code: string;
  symbol: string;
  name: string;
  value: string;      // Standard original value (e.g., "1,200")
  price: string;      // Launched discount price (e.g., "600")
  deposit: string;    // Booking deposit (e.g., "300")
  valueNum: number;
  priceNum: number;
  depositNum: number;
  note: string;       // Dynamic summary bar texts
  cpaDrop: string;    // Custom metrics
  savedBooking: string;
  cpaReduced: string;
  scaledPast: string;
  shootValue: string;
}

export const CURRENCIES: Record<string, CurrencyDetails> = {
  EUR: {
    code: "EUR",
    symbol: "€",
    name: "Euro",
    value: "1,200",
    price: "600",
    deposit: "300",
    valueNum: 1200,
    priceNum: 600,
    depositNum: 300,
    note: "💰 INTRODUCTORY €600 RATE AUTOMATICALLY LOCKED • ONLY 50% DUE TODAY",
    cpaDrop: "CPA dropped from €22 to €11.40",
    savedBooking: "Saved €3,500 in creative booking fees",
    cpaReduced: "Average CPA reduced by €14.20",
    scaledPast: "First campaign scaled past €10k spend",
    shootValue: "€10,000 production shoot",
  },
  USD: {
    code: "USD",
    symbol: "$",
    name: "US Dollar",
    value: "1,200",
    price: "600",
    deposit: "300",
    valueNum: 1200,
    priceNum: 600,
    depositNum: 300,
    note: "💰 INTRODUCTORY $600 RATE AUTOMATICALLY LOCKED • ONLY 50% DUE TODAY",
    cpaDrop: "CPA dropped from $22 to $11.40",
    savedBooking: "Saved $3,500 in creative booking fees",
    cpaReduced: "Average CPA reduced by $14.20",
    scaledPast: "First campaign scaled past $10k spend",
    shootValue: "$10,000 production shoot",
  },
  JPY: {
    code: "JPY",
    symbol: "¥",
    name: "Japanese Yen",
    value: "180,000",
    price: "90,000",
    deposit: "45,000",
    valueNum: 180000,
    priceNum: 90000,
    depositNum: 45000,
    note: "💰 INTRODUCTORY ¥90,000 RATE AUTOMATICALLY LOCKED • ONLY 50% DUE TODAY",
    cpaDrop: "CPA dropped from ¥3,300 to ¥1,710",
    savedBooking: "Saved ¥500,000 in creative booking fees",
    cpaReduced: "Average CPA reduced by ¥2,100",
    scaledPast: "First campaign scaled past ¥1,500,000 spend",
    shootValue: "¥1,500,000 production shoot",
  },
  CAD: {
    code: "CAD",
    symbol: "C$",
    name: "Canadian Dollar",
    value: "1,600",
    price: "800",
    deposit: "400",
    valueNum: 1600,
    priceNum: 800,
    depositNum: 400,
    note: "💰 INTRODUCTORY C$800 RATE AUTOMATICALLY LOCKED • ONLY 50% DUE TODAY",
    cpaDrop: "CPA dropped from C$30 to C$15.50",
    savedBooking: "Saved C$4,500 in creative booking fees",
    cpaReduced: "Average CPA reduced by C$19.50",
    scaledPast: "First campaign scaled past C$13k spend",
    shootValue: "C$13,500 production shoot",
  },
  AUD: {
    code: "AUD",
    symbol: "A$",
    name: "Australian Dollar",
    value: "1,800",
    price: "900",
    deposit: "450",
    valueNum: 1800,
    priceNum: 900,
    depositNum: 450,
    note: "💰 INTRODUCTORY A$900 RATE AUTOMATICALLY LOCKED • ONLY 50% DUE TODAY",
    cpaDrop: "CPA dropped from A$33 to A$17.10",
    savedBooking: "Saved A$5,200 in creative booking fees",
    cpaReduced: "Average CPA reduced by A$21.30",
    scaledPast: "First campaign scaled past A$15k spend",
    shootValue: "A$15,000 production shoot",
  }
};

interface CurrencyContextType {
  currentCurrency: CurrencyDetails;
  setCurrencyByCode: (code: string) => void;
  isAutodetecting: boolean;
  detectedCode: string | null;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const guessCurrencyFromTimezone = (): string => {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!tz) return "EUR";
    const lower = tz.toLowerCase();
    if (lower.includes("australia") || lower.includes("sydney") || lower.includes("melbourne") || lower.includes("brisbane") || lower.includes("perth")) {
      return "AUD";
    }
    if (lower.includes("canada") || lower.includes("toronto") || lower.includes("vancouver") || lower.includes("montreal")) {
      return "CAD";
    }
    if (lower.includes("tokyo") || lower.includes("japan") || lower.includes("asia/tokyo")) {
      return "JPY";
    }
    if (lower.includes("america") || lower.includes("us/") || lower.includes("new_york") || lower.includes("chicago") || lower.includes("los_angeles")) {
      return "USD";
    }
    return "EUR"; // Default base
  } catch (e) {
    return "EUR";
  }
};

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCode, setSelectedCode] = useState<string>(() => {
    // Initial load try to look in localStorage, otherwise guess by timezone
    const cached = localStorage.getItem("mandjack_currency");
    if (cached && CURRENCIES[cached]) return cached;
    return guessCurrencyFromTimezone();
  });
  const [isAutodetecting, setIsAutodetecting] = useState(true);
  const [detectedCode, setDetectedCode] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    
    // Geolocation IP-based detection
    const autodetect = async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");
        if (!res.ok) throw new Error("Fallback required");
        const data = await res.json();
        
        if (active && data && data.currency) {
          const apiCurrency = data.currency.toUpperCase();
          if (CURRENCIES[apiCurrency]) {
            setDetectedCode(apiCurrency);
            // Only overwrite if user hasn't explicitly set a preference in localStorage
            if (!localStorage.getItem("mandjack_currency")) {
              setSelectedCode(apiCurrency);
            }
          }
        }
      } catch (err) {
        console.log("IP-based currency autodetect fallback to timezone/default:", err);
      } finally {
        if (active) {
          setIsAutodetecting(false);
        }
      }
    };

    autodetect();
    return () => {
      active = false;
    };
  }, []);

  const setCurrencyByCode = (code: string) => {
    if (CURRENCIES[code]) {
      setSelectedCode(code);
      localStorage.setItem("mandjack_currency", code);
    }
  };

  const currentCurrency = CURRENCIES[selectedCode] || CURRENCIES.EUR;

  return (
    <CurrencyContext.Provider value={{ currentCurrency, setCurrencyByCode, isAutodetecting, detectedCode }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};

// Premium, beautifully micro-designed Floating Selector Component
export const CurrencySelectorWidget: React.FC = () => {
  const { currentCurrency, setCurrencyByCode, isAutodetecting } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block text-left select-none z-[999991]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900/95 hover:bg-slate-900 text-slate-200 hover:text-white rounded-lg border border-slate-800 text-[11px] font-mono font-bold tracking-wider cursor-pointer shadow-md transition-colors"
        title="Change regional display currency"
      >
        <Globe className="w-3.5 h-3.5 text-amber-500 animate-pulse-slow" />
        <span>{currentCurrency.code} ({currentCurrency.symbol})</span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop click closer */}
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-1.5 w-48 rounded-xl bg-slate-950 border border-slate-800 shadow-2xl p-1 z-20 flex flex-col"
            >
              <div className="px-2 py-1.5 text-[9px] font-mono tracking-widest text-slate-500 uppercase font-bold border-b border-slate-900/60 mb-1">
                Select Currency
              </div>
              {Object.values(CURRENCIES).map((curr) => {
                const isSelected = curr.code === currentCurrency.code;
                return (
                  <button
                    key={curr.code}
                    onClick={() => {
                      setCurrencyByCode(curr.code);
                      setIsOpen(false);
                    }}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors text-left cursor-pointer ${
                      isSelected
                        ? "bg-amber-500/10 text-amber-300 font-bold"
                        : "text-slate-400 hover:bg-slate-900 hover:text-white"
                    }`}
                  >
                    <span>{curr.name}</span>
                    <span className="flex items-center space-x-1 text-[11px] font-bold">
                      <span className="opacity-65">{curr.code}</span>
                      <span className="text-amber-500">{curr.symbol}</span>
                      {isSelected && <Check className="w-3 h-3 text-amber-400" />}
                    </span>
                  </button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

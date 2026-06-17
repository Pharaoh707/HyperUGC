import React, { useEffect, useRef, useState } from "react";

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "p" | "span";
}

export default function TextReveal({ text, className = "", delay = 0, tag = "h2" }: TextRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -30px 0px"
      }
    );

    observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  const Tag = tag;

  return (
    <Tag ref={ref as any} className={`overflow-hidden block ${className}`}>
      <span
        className={`inline-block transition-all duration-[1100ms] cubic-bezier(0.16, 1, 0.3, 1) transform ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full"
        }`}
        style={{ transitionDelay: `${delay}ms` }}
      >
        {text}
      </span>
    </Tag>
  );
}

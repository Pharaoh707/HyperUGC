import React, { useEffect, useRef } from "react";

interface PremiumSparklesEffectProps {
  color?: "gold" | "violet" | "white";
}

export default function PremiumSparklesEffect({ color = "gold" }: PremiumSparklesEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; px: number; py: number; active: boolean; moved: boolean }>({
    x: 0,
    y: 0,
    px: 0,
    py: 0,
    active: false,
    moved: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set styling of parent to support absolute clipping
    parent.style.position = "relative";
    parent.style.overflow = "hidden";

    // Setup High DPI Canvas
    const resizeCanvas = () => {
      const rect = parent.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });
    resizeObserver.observe(parent);

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      maxSize: number;
      rotation: number;
      rotSpeed: number;
      alpha: number;
      decay: number;
      color: string;
      isSparkle: boolean;
    }

    let particles: Particle[] = [];

    // Sparkle colors based on selection
    const getColors = () => {
      if (color === "violet") {
        return ["#a855f7", "#c084fc", "#e9d5ff", "#ffffff"];
      } else if (color === "white") {
        return ["#ffffff", "#f1f5f9", "#e2e8f0", "#cbd5e1"];
      } else {
        // Gold / Amber
        return ["#f59e0b", "#fbbf24", "#fef3c7", "#ffffff", "#d97706"];
      }
    };

    const colors = getColors();

    const createParticle = (x: number, y: number, forceSpawn = false) => {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 1.5 + 0.3;
      const size = Math.random() * 6 + 4;
      const isSparkle = Math.random() > 0.45 || forceSpawn;

      return {
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.2, // slight upward float
        size,
        maxSize: size,
        rotation: Math.random() * Math.PI,
        rotSpeed: (Math.random() - 0.5) * 0.08,
        alpha: 1,
        decay: Math.random() * 0.02 + 0.015,
        color: colors[Math.floor(Math.random() * colors.length)],
        isSparkle,
      };
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      mouseRef.current.px = mouseRef.current.x;
      mouseRef.current.py = mouseRef.current.y;
      mouseRef.current.x = x;
      mouseRef.current.y = y;
      mouseRef.current.moved = true;

      // Spawn trail particles based on mouse speed
      const dist = Math.hypot(x - mouseRef.current.px, y - mouseRef.current.py);
      const spawnCount = Math.min(Math.floor(dist / 4) + 1, 4);

      if (mouseRef.current.active) {
        for (let i = 0; i < spawnCount; i++) {
          const ratio = spawnCount > 1 ? i / (spawnCount - 1) : 1;
          const lerpX = mouseRef.current.px + (x - mouseRef.current.px) * ratio;
          const lerpY = mouseRef.current.py + (y - mouseRef.current.py) * ratio;
          particles.push(createParticle(lerpX, lerpY));
        }
      }
    };

    const handleMouseEnter = () => {
      mouseRef.current.active = true;
      // Burst of particles upon entry
      const rect = parent.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      for (let i = 0; i < 8; i++) {
        particles.push(createParticle(
          centerX + (Math.random() - 0.5) * 40,
          centerY + (Math.random() - 0.5) * 15,
          true
        ));
      }
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    parent.addEventListener("mousemove", handleMouseMove);
    parent.addEventListener("mouseenter", handleMouseEnter);
    parent.addEventListener("mouseleave", handleMouseLeave);

    // Draw custom 4-pointed premium star sparkle
    const drawSparkleStar = (
      c: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      size: number,
      pColor: string,
      alpha: number,
      rotation: number
    ) => {
      c.save();
      c.translate(cx, cy);
      c.rotate(rotation);
      c.globalAlpha = alpha;
      c.fillStyle = pColor;

      const inner = size * 0.16;
      c.beginPath();
      c.moveTo(0, -size);
      c.quadraticCurveTo(0, -inner, inner, -inner);
      c.quadraticCurveTo(inner, 0, size, 0);
      c.quadraticCurveTo(inner, 0, inner, inner);
      c.quadraticCurveTo(0, inner, 0, size);
      c.quadraticCurveTo(0, inner, -inner, inner);
      c.quadraticCurveTo(-inner, 0, -size, 0);
      c.quadraticCurveTo(-inner, 0, -inner, -inner);
      c.quadraticCurveTo(0, -inner, 0, -size);
      c.closePath();

      // Subtle outer bloom glow
      c.shadowBlur = size * 0.7;
      c.shadowColor = pColor;
      c.fill();
      c.restore();
    };

    let animationFrameId: number;

    const render = () => {
      const rect = parent.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      // Periodically spawn minor sparkles if hovered and static to maintain twinkle effect
      if (mouseRef.current.active && Math.random() < 0.12) {
        particles.push(createParticle(
          mouseRef.current.x + (Math.random() - 0.5) * 20,
          mouseRef.current.y + (Math.random() - 0.5) * 20
        ));
      }

      // Update and draw particles
      particles = particles.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotSpeed;
        p.alpha -= p.decay;

        if (p.alpha <= 0) return false;

        const size = p.size * p.alpha;

        if (p.isSparkle) {
          drawSparkleStar(ctx, p.x, p.y, size * 1.5, p.color, p.alpha, p.rotation);
        } else {
          // Circular particle
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.shadowBlur = size * 0.5;
          ctx.shadowColor = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, size * 0.6, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        return true;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      parent.removeEventListener("mousemove", handleMouseMove);
      parent.removeEventListener("mouseenter", handleMouseEnter);
      parent.removeEventListener("mouseleave", handleMouseLeave);
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, [color]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-25 block"
      style={{ mixBlendMode: "screen" }}
    />
  );
}

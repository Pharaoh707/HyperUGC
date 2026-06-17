import { useEffect, useRef } from "react";

interface WebGLBackgroundProps {
  accentColor: "violet" | "gold";
}

export default function WebGLBackground({ accentColor }: WebGLBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Dynamic sizing helper
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Track mouse coordinates for parallax
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize coordinate offset from center (-0.5 to 0.5)
      mouseRef.current.targetX = (e.clientX / window.innerWidth) - 0.5;
      mouseRef.current.targetY = (e.clientY / window.innerHeight) - 0.5;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Particle field generation and setup
    const isMobile = width < 768;
    const particleCount = isMobile ? 300 : 700;
    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      alpha: number;
      phase: number;
    }> = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.15,
        speedY: -(Math.random() * 0.25 + 0.1), // Drift upwards
        alpha: Math.random() * 0.5 + 0.15,
        phase: Math.random() * Math.PI * 2,
      });
    }

    // Floating fluid bubble blobs - centralized and diffused to avoid harsh differences in section lighting
    const blobs = [
      {
        baseX: width * 0.5,
        baseY: height * 0.35,
        x: width * 0.5,
        y: height * 0.35,
        radius: isMobile ? 220 : 455,
        color1: "rgba(218, 165, 32, 0.17)", // Rich gold, softer
        color2: "rgba(184, 134, 11, 0.08)",  // Soft warm bronze
        speed: 0.0004,
        angleX: 0,
        angleY: Math.PI / 3,
        driftX: 50,
        driftY: 40,
      },
      {
        baseX: width * 0.5,
        baseY: height * 0.65,
        x: width * 0.5,
        y: height * 0.65,
        radius: isMobile ? 240 : 510,
        color1: "rgba(255, 215, 0, 0.15)", // Luminous yellow, softer
        color2: "rgba(245, 158, 11, 0.07)", // Soft premium amber
        speed: 0.0003,
        angleX: Math.PI / 2,
        angleY: 0,
        driftX: 40,
        driftY: 50,
      },
      {
        baseX: width * 0.5,
        baseY: height * 0.85,
        x: width * 0.5,
        y: height * 0.85,
        radius: isMobile ? 200 : 400,
        color1: "rgba(197, 160, 89, 0.11)", // Champagne white gold, softer
        color2: "rgba(253, 230, 138, 0.05)", // Softest fuzzy amber
        speed: 0.0002,
        angleX: Math.PI,
        angleY: Math.PI / 4,
        driftX: 60,
        driftY: 30,
      }
    ];

    let lastTime = 0;

    // Core Animation Frame Loop
    const draw = (time: number) => {
      // Soft luxury warm champagne/cream background instead of cold gray/white
      ctx.fillStyle = "#faf7f2";
      ctx.fillRect(0, 0, width, height);

      // Interpolate mouse movement (lerp)
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      const deltaX = mouseRef.current.x * 45; // Subtle parallax offset limit
      const deltaY = mouseRef.current.y * 45;

      // Mouse interpolation and particle movement is retained, while removing golden shadow spotlights and grid lines to meet user formatting requirements.


      // Draw aesthetic floating dust particle field
      particles.forEach((p) => {
        p.phase += 0.005;
        // Animate particles with slight sinus lateral motion and continuous upward drift
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.phase) * 0.1;

        // Screen wrap particles
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        // Calculate opacity modulation
        const currentAlpha = p.alpha * (0.6 + Math.sin(p.phase) * 0.4);

        // Apply mouse horizontal offset to particles based on depth (size helper)
        const particleParallaxX = p.x + deltaX * (p.size * 0.2);
        const particleParallaxY = p.y + deltaY * (p.size * 0.2);

        ctx.fillStyle = accentColor === "violet" 
          ? `rgba(218, 165, 32, ${currentAlpha + 0.15})` // Champagne gold sparkle
          : `rgba(217, 119, 6, ${currentAlpha + 0.15})`; // Amber gold sparkle
        
        ctx.beginPath();
        ctx.arc(particleParallaxX, particleParallaxY, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw a highly faint top lighting overlay to bind elements
      const lightOverlay = ctx.createLinearGradient(0, 0, 0, height);
      lightOverlay.addColorStop(0, "rgba(255, 255, 255, 0.4)");
      lightOverlay.addColorStop(0.3, "rgba(255, 255, 255, 0)");
      lightOverlay.addColorStop(1, "rgba(240, 242, 248, 0.15)");
      ctx.fillStyle = lightOverlay;
      ctx.fillRect(0, 0, width, height);

      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [accentColor]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}

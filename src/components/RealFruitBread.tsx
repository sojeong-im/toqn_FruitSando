import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/soundEffects';

interface RealFruitBreadProps {
  className?: string;
  autoPlaySound?: boolean;
}

interface Sparkle {
  id: number;
  x: number;
  y: number;
  icon: string;
  size: number;
  delay: number;
}

export const RealFruitBread: React.FC<RealFruitBreadProps> = ({
  className = '',
  autoPlaySound = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isProcessed, setIsProcessed] = useState(false);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [isTwinkling, setIsTwinkling] = useState(false);

  // 75P 초특급 화려한 뾰로롱 마법 효과 + 컨페티 + 사운드
  const triggerGrandMagic = () => {
    setIsTwinkling(true);
    sounds.playFruitMagicGrand();

    // 🎊 Colorful Confetti Cannon (Kiwi green, orange, fig pink/red, gold)
    try {
      confetti({
        particleCount: 40,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#84CC16', '#F97316', '#EC4899', '#FBBF24', '#38BDF8'],
        ticks: 120,
        shapes: ['circle', 'square'],
      });
    } catch {
      // Confetti fallback
    }

    // 🌟 Abundant floating fruit & star sparkles (20+ items)
    const fruitIcons = ['🥝', '🍊', '✨', '🌟', '💫', '🍓', '🍇', '💖', '🪄', '⭐', '🌈', '🎉'];
    const newSparkles: Sparkle[] = Array.from({ length: 20 }, (_, i) => ({
      id: Date.now() + i,
      x: 5 + Math.random() * 90, // %
      y: 5 + Math.random() * 90, // %
      icon: fruitIcons[Math.floor(Math.random() * fruitIcons.length)],
      size: 18 + Math.random() * 22,
      delay: Math.random() * 0.5,
    }));

    setSparkles(newSparkles);

    setTimeout(() => {
      setIsTwinkling(false);
    }, 1500);
  };

  useEffect(() => {
    const img = new Image();
    img.src = '/fruit-bread.jpg';
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      try {
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        // Remove black background around the bread slice with smooth feathering
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const maxVal = Math.max(r, g, b);

          if (maxVal < 38) {
            data[i + 3] = 0; // Completely transparent
          } else if (maxVal < 60) {
            // Smooth edge alpha
            data[i + 3] = Math.round(((maxVal - 38) / 22) * 255);
          }
        }

        ctx.putImageData(imgData, 0, 0);
        setIsProcessed(true);

        // Auto trigger grand magic effect
        if (autoPlaySound) {
          triggerGrandMagic();
        }
      } catch (err) {
        console.error('Fruit bread canvas processing:', err);
      }
    };
  }, []);

  return (
    <div
      onClick={triggerGrandMagic}
      title="터치하면 초특급 과일 뾰로롱✨ 효과가 재생돼요!"
      className={`relative flex items-center justify-center cursor-pointer select-none group ${className}`}
    >
      {/* 🌈 Multi-color Radiant Rainbow Halo */}
      <div className="absolute inset-0 -m-8 rounded-full bg-gradient-to-tr from-lime-300/40 via-amber-300/50 to-rose-400/40 blur-3xl animate-haloPulse pointer-events-none" />

      {/* ✨ Floating Fruit & Sparkle Particle Stars */}
      <div className="absolute inset-0 pointer-events-none z-30 overflow-visible">
        {sparkles.map((sp) => (
          <span
            key={sp.id}
            className="absolute animate-sparkleFloat pointer-events-none drop-shadow-md"
            style={{
              left: `${sp.x}%`,
              top: `${sp.y}%`,
              fontSize: `${sp.size}px`,
              animationDelay: `${sp.delay}s`,
            }}
          >
            {sp.icon}
          </span>
        ))}
      </div>

      {/* Processed canvas with transparent background & magic pop animation */}
      <canvas
        ref={canvasRef}
        className={`w-full h-full object-contain filter drop-shadow-[0_18px_36px_rgba(217,119,6,0.38)] transition-transform duration-300 group-hover:scale-105 active:scale-95 ${
          isTwinkling ? 'animate-magicPop' : 'animate-popIn'
        }`}
        style={{ display: isProcessed ? 'block' : 'none' }}
      />

      {/* Fallback image */}
      {!isProcessed && (
        <img
          src="/fruit-bread.jpg"
          alt="키위·무화과·귤 생과일이 올라간 산도"
          className="w-full h-full object-contain rounded-2xl filter drop-shadow-md animate-magicPop"
        />
      )}

      {/* Dazzling indicator tooltip badge */}
      <div className="absolute -bottom-2.5 z-20 bg-gradient-to-r from-lime-600 via-amber-500 to-orange-500 hover:opacity-95 text-white text-[11px] font-black px-3 py-0.5 rounded-full shadow-lg border border-amber-200/90 backdrop-blur-sm flex items-center gap-1.5 transition-transform group-hover:scale-110">
        <span>🥝</span>
        <span>화려한 과일 뾰로롱!</span>
        <span>🍊</span>
      </div>
    </div>
  );
};

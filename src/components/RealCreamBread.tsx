import React, { useEffect, useRef, useState } from 'react';
import { sounds } from '../utils/soundEffects';

interface RealCreamBreadProps {
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

export const RealCreamBread: React.FC<RealCreamBreadProps> = ({
  className = '',
  autoPlaySound = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isProcessed, setIsProcessed] = useState(false);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [isTwinkling, setIsTwinkling] = useState(false);

  // Generate magical sparkles for the "뾰로롱" effect
  const triggerMagicSparkles = () => {
    setIsTwinkling(true);
    sounds.playMagicTwinkle();

    const icons = ['✨', '⭐', '💫', '🌟', '🪄', '🧁'];
    const newSparkles: Sparkle[] = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      x: 10 + Math.random() * 80, // %
      y: 10 + Math.random() * 80, // %
      icon: icons[Math.floor(Math.random() * icons.length)],
      size: 16 + Math.random() * 18,
      delay: Math.random() * 0.4,
    }));

    setSparkles(newSparkles);

    setTimeout(() => {
      setIsTwinkling(false);
    }, 1200);
  };

  useEffect(() => {
    const img = new Image();
    img.src = '/cream-bread.jpg';
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

        // Trigger 뾰로롱 animation & sound
        if (autoPlaySound) {
          triggerMagicSparkles();
        }
      } catch (err) {
        console.error('Cream bread canvas processing:', err);
      }
    };
  }, []);

  return (
    <div
      onClick={triggerMagicSparkles}
      title="터치하면 뾰로롱✨ 효과가 재생돼요!"
      className={`relative flex items-center justify-center cursor-pointer select-none group ${className}`}
    >
      {/* 🌟 Radiant Halo / Aura effect */}
      <div className="absolute inset-0 -m-6 rounded-full bg-gradient-to-tr from-amber-300/40 via-rose-200/50 to-yellow-200/40 blur-2xl animate-haloPulse pointer-events-none" />

      {/* ✨ Floating Sparkle Particle Stars */}
      <div className="absolute inset-0 pointer-events-none z-30 overflow-visible">
        {sparkles.map((sp) => (
          <span
            key={sp.id}
            className="absolute animate-sparkleFloat pointer-events-none"
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
        className={`w-full h-full object-contain filter drop-shadow-[0_16px_32px_rgba(217,119,6,0.35)] transition-transform duration-300 group-hover:scale-105 active:scale-95 ${
          isTwinkling ? 'animate-magicPop' : 'animate-popIn'
        }`}
        style={{ display: isProcessed ? 'block' : 'none' }}
      />

      {/* Fallback image */}
      {!isProcessed && (
        <img
          src="/cream-bread.jpg"
          alt="생크림이 발린 우유식빵"
          className="w-full h-full object-contain rounded-2xl filter drop-shadow-md animate-magicPop"
        />
      )}

      {/* Magic wand indicator tooltip badge */}
      <div className="absolute -bottom-2 z-20 bg-amber-500/90 hover:bg-amber-600 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-md border border-amber-300/80 backdrop-blur-sm flex items-center gap-1 transition-transform group-hover:scale-110">
        <span>✨</span>
        <span>뾰로롱 생크림</span>
      </div>
    </div>
  );
};

import React, { useEffect, useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/soundEffects';

interface RealSandoVisualizerProps {
  currentPoints: number;
  className?: string;
}

type SandoStage = 'bread' | 'cream' | 'fruit';

interface Sparkle {
  id: number;
  x: number;
  y: number;
  icon: string;
  size: number;
  delay: number;
}

// Global in-memory cache for processed transparent data URLs
const transparentCache: {
  bread: string | null;
  cream: string | null;
  fruit: string | null;
} = {
  bread: null,
  cream: null,
  fruit: null,
};

// Offscreen processor to strip black background with smooth feathering
const processImageToTransparentDataUrl = (src: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve(src);
        }
        ctx.drawImage(img, 0, 0);

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const maxVal = Math.max(r, g, b);

          if (maxVal < 38) {
            data[i + 3] = 0; // Transparent
          } else if (maxVal < 60) {
            data[i + 3] = Math.round(((maxVal - 38) / 22) * 255); // Smooth feathering
          }
        }

        ctx.putImageData(imgData, 0, 0);
        const dataUrl = canvas.toDataURL('image/png');
        resolve(dataUrl);
      } catch (e) {
        console.error('Canvas processing error:', e);
        resolve(src);
      }
    };
    img.onerror = reject;
  });
};

export const RealSandoVisualizer: React.FC<RealSandoVisualizerProps> = ({
  currentPoints,
  className = '',
}) => {
  const [cachedImages, setCachedImages] = useState(transparentCache);
  const [isLoaded, setIsLoaded] = useState(
    Boolean(transparentCache.bread && transparentCache.cream && transparentCache.fruit)
  );

  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [isBouncing, setIsBouncing] = useState(false);

  // Determine current stage
  const currentStage: SandoStage =
    currentPoints >= 75 ? 'fruit' : currentPoints >= 50 ? 'cream' : 'bread';

  const prevStageRef = useRef<SandoStage>(currentStage);
  const isInitialMount = useRef(true);

  // Preload and process all 3 images once
  useEffect(() => {
    let isSubscribed = true;

    const loadAll = async () => {
      const promises: Promise<void>[] = [];

      if (!transparentCache.bread) {
        promises.push(
          processImageToTransparentDataUrl('/milk-bread.jpg').then((url) => {
            transparentCache.bread = url;
          })
        );
      }
      if (!transparentCache.cream) {
        promises.push(
          processImageToTransparentDataUrl('/cream-bread.jpg').then((url) => {
            transparentCache.cream = url;
          })
        );
      }
      if (!transparentCache.fruit) {
        promises.push(
          processImageToTransparentDataUrl('/fruit-bread.jpg').then((url) => {
            transparentCache.fruit = url;
          })
        );
      }

      await Promise.all(promises);
      if (isSubscribed) {
        setCachedImages({ ...transparentCache });
        setIsLoaded(true);
      }
    };

    loadAll();

    return () => {
      isSubscribed = false;
    };
  }, []);

  // Trigger smooth effects and sound when stage changes
  const triggerStageEffects = (stage: SandoStage, isManualClick = false) => {
    setIsBouncing(true);

    if (stage === 'fruit') {
      sounds.playFruitMagicGrand();

      try {
        confetti({
          particleCount: 35,
          spread: 65,
          origin: { y: 0.62 },
          colors: ['#84CC16', '#F97316', '#EC4899', '#FBBF24', '#38BDF8'],
          ticks: 100,
        });
      } catch {
        // Fallback
      }

      const icons = ['🥝', '🍊', '✨', '🌟', '💫', '🍓', '🍇', '💖', '🪄'];
      const newSparkles: Sparkle[] = Array.from({ length: 16 }, (_, i) => ({
        id: Date.now() + i,
        x: 8 + Math.random() * 84,
        y: 8 + Math.random() * 84,
        icon: icons[Math.floor(Math.random() * icons.length)],
        size: 18 + Math.random() * 18,
        delay: Math.random() * 0.4,
      }));
      setSparkles(newSparkles);
    } else if (stage === 'cream') {
      sounds.playMagicTwinkle();

      const icons = ['✨', '⭐', '💫', '🌟', '🪄', '🧁'];
      const newSparkles: Sparkle[] = Array.from({ length: 12 }, (_, i) => ({
        id: Date.now() + i,
        x: 10 + Math.random() * 80,
        y: 10 + Math.random() * 80,
        icon: icons[Math.floor(Math.random() * icons.length)],
        size: 16 + Math.random() * 16,
        delay: Math.random() * 0.35,
      }));
      setSparkles(newSparkles);
    } else if (isManualClick) {
      sounds.playBreadCover();
    }

    setTimeout(() => {
      setIsBouncing(false);
    }, 800);
  };

  // Watch for stage transitions
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevStageRef.current = currentStage;
      return;
    }

    if (prevStageRef.current !== currentStage) {
      triggerStageEffects(currentStage, false);
      prevStageRef.current = currentStage;
    }
  }, [currentStage]);

  const handleManualTap = () => {
    triggerStageEffects(currentStage, true);
  };

  return (
    <div className={`flex flex-col items-center justify-center text-center ${className}`}>
      {/* 🥪 Artisanal Layered Sando Visualizer with Seamless Cross-fading */}
      <div
        onClick={handleManualTap}
        title="터치하면 뾰로롱 효과가 재생돼요!"
        className="relative w-48 h-48 sm:w-56 sm:h-56 cursor-pointer select-none group flex items-center justify-center"
      >
        {/* 🌟 Dynamic Radiant Halo that transitions smoothly with stage */}
        <div
          className={`absolute inset-0 -m-8 rounded-full blur-3xl pointer-events-none transition-all duration-1000 ease-out ${
            currentStage === 'fruit'
              ? 'bg-gradient-to-tr from-lime-300/45 via-amber-300/50 to-orange-400/40 scale-110 animate-haloPulse'
              : currentStage === 'cream'
              ? 'bg-gradient-to-tr from-amber-300/40 via-rose-200/50 to-yellow-200/40 scale-100 animate-haloPulse'
              : 'bg-amber-200/20 scale-95 opacity-50'
          }`}
        />

        {/* ✨ Floating Sparkle Particle Stars */}
        <div className="absolute inset-0 pointer-events-none z-40 overflow-visible">
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

        {/* 🍞 Main Bread Stage Canvas Layers Container with Spring Transform */}
        <div
          className={`relative w-full h-full flex items-center justify-center transition-transform duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) group-hover:scale-105 active:scale-95 ${
            isBouncing ? 'scale-[1.08] -rotate-1' : 'scale-100 rotate-0'
          }`}
        >
          {/* Subtle loading placeholder until first render */}
          {!isLoaded && (
            <div className="w-40 h-40 rounded-2xl bg-amber-100/60 animate-pulse border-2 border-dashed border-amber-300" />
          )}

          {/* Layer 0: 🍞 Base Milk Bread (Always in place, rock-solid anchor) */}
          {cachedImages.bread && (
            <img
              src={cachedImages.bread}
              alt="촉촉한 우유식빵"
              className="absolute inset-0 w-full h-full object-contain filter drop-shadow-[0_14px_28px_rgba(180,83,9,0.25)] transition-all duration-700 ease-in-out"
            />
          )}

          {/* Layer 1: 🥛 Cream Bread (Smoothly cross-fades on top at 50P) */}
          {cachedImages.cream && (
            <img
              src={cachedImages.cream}
              alt="우유 생크림 식빵"
              className={`absolute inset-0 w-full h-full object-contain filter drop-shadow-[0_16px_32px_rgba(217,119,6,0.32)] transition-opacity duration-700 ease-in-out ${
                currentStage === 'cream' || currentStage === 'fruit'
                  ? 'opacity-100'
                  : 'opacity-0 pointer-events-none'
              }`}
            />
          )}

          {/* Layer 2: 🥝🍊 Fruit Bread (Smoothly cross-fades on top at 75P) */}
          {cachedImages.fruit && (
            <img
              src={cachedImages.fruit}
              alt="키위·무화과·귤 생과일 산도"
              className={`absolute inset-0 w-full h-full object-contain filter drop-shadow-[0_18px_36px_rgba(217,119,6,0.38)] transition-opacity duration-700 ease-in-out ${
                currentStage === 'fruit' ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            />
          )}
        </div>

        {/* Interactive Badge Indicator */}
        <div
          className={`absolute -bottom-2 z-30 text-[11px] font-black px-3 py-0.5 rounded-full shadow-md backdrop-blur-sm flex items-center gap-1.5 transition-all duration-500 group-hover:scale-110 ${
            currentStage === 'fruit'
              ? 'bg-gradient-to-r from-lime-600 via-amber-500 to-orange-500 text-white border border-amber-200/90'
              : currentStage === 'cream'
              ? 'bg-amber-500/95 text-white border border-amber-300'
              : 'bg-stone-700/80 text-white border border-stone-500'
          }`}
        >
          <span>{currentStage === 'fruit' ? '🥝' : currentStage === 'cream' ? '✨' : '🍞'}</span>
          <span>
            {currentStage === 'fruit'
              ? '화려한 과일 뾰로롱!'
              : currentStage === 'cream'
              ? '뾰로롱 생크림'
              : '폭신한 우유식빵'}
          </span>
        </div>
      </div>

      {/* 🏷️ Status Description Pill below */}
      <div className="mt-4 transition-all duration-500">
        <span
          className={`text-xs font-black px-4 py-1.5 rounded-full border shadow-sm inline-flex items-center gap-1.5 transition-all duration-500 ${
            currentStage === 'fruit'
              ? 'bg-gradient-to-r from-lime-100 via-amber-100 to-orange-100 border-amber-300 text-amber-950'
              : currentStage === 'cream'
              ? 'bg-amber-100 border-amber-300 text-amber-900'
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}
        >
          <span>{currentStage === 'fruit' ? '🥝' : currentStage === 'cream' ? '✨' : '🍞'}</span>
          <span>
            {currentStage === 'fruit'
              ? '75P 단계: 키위·무화과·귤 생과일이 화려하게 안착!'
              : currentStage === 'cream'
              ? '50P 단계: 부드러운 우유 생크림이 뾰로롱~ 발라졌어요!'
              : '0P 단계: 부드럽고 폭신한 우유식빵 준비 완료!'}
          </span>
          <span>{currentStage === 'fruit' ? '🍊' : currentStage === 'cream' ? '✨' : '🍞'}</span>
        </span>
        <p className="text-[11px] text-stone-500 mt-1.5 font-medium transition-all duration-500">
          {currentStage === 'fruit'
            ? '식빵을 터치하면 화려한 과일 팡파르가 터져요! (100P 달성 시 대각선 컷팅!)'
            : currentStage === 'cream'
            ? '식빵을 터치하면 마법 사운드(뾰로롱✨)가 울려요! (75P 과일 얹기 대기 중)'
            : '미션을 인증하여 50P에 도달하면 달콤한 생크림이 뾰로롱 발라집니다! ✨'}
        </p>
      </div>
    </div>
  );
};

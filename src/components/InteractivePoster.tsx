import React, { useState } from 'react';
import { sounds } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import { Sparkles, Volume2 } from 'lucide-react';

interface InteractivePosterProps {
  onOpenNotice: () => void;
}

export const InteractivePoster: React.FC<InteractivePosterProps> = ({ onOpenNotice }) => {
  // Active animated character dialogue state
  const [activeSpeech, setActiveSpeech] = useState<{
    text: string;
    charId: 'left' | 'center' | 'right' | 'sandos';
  } | null>(null);

  // Trigger left character (Magnifying glass agent)
  const handleLeftClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playFruitPop();
    setActiveSpeech({
      charId: 'left',
      text: '보물 영혼을 돋보기로 찾았다! 타찾 10P!',
    });
    confetti({
      particleCount: 15,
      spread: 40,
      origin: { x: 0.35, y: 0.5 },
      colors: ['#FF3366', '#FFB703'],
    });
  };

  // Trigger center character (Excited leader agent)
  const handleCenterClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playFanfare();
    setActiveSpeech({
      charId: 'center',
      text: '우리 구역 100POINT 달성하고 1등 가자!!',
    });
    confetti({
      particleCount: 25,
      spread: 60,
      origin: { x: 0.5, y: 0.45 },
      colors: ['#38A137', '#FF5A1F', '#FFD166'],
    });
  };

  // Trigger right character (Winking cheerful agent)
  const handleRightClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playCream();
    setActiveSpeech({
      charId: 'right',
      text: '달콤한 수제 과일산도 우선 선택권은 우리 것!',
    });
    confetti({
      particleCount: 15,
      spread: 40,
      origin: { x: 0.65, y: 0.5 },
      colors: ['#52B788', '#FB8500'],
    });
  };

  // Trigger bottom sandos
  const handleSandosClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playSlash();
    setActiveSpeech({
      charId: 'sandos',
      text: '스윽-싹! 100POINT마다 영롱한 과일산도 완성!',
    });
  };

  return (
    <div className="relative w-full max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-300 select-none group bg-stone-900">
      {/* Background Poster Image */}
      <img
        src="/poster.jpg"
        alt="새신자부 열매산도 쟁탈전 공식 포스터"
        className="w-full h-auto block object-cover"
      />

      {/* Floating Sparkle Elements that gently drift */}
      <div className="absolute top-4 left-6 pointer-events-none animate-pulse text-amber-300 text-lg">✨</div>
      <div className="absolute top-8 right-8 pointer-events-none animate-bounce text-amber-200 text-xl">⭐</div>
      <div className="absolute top-24 left-1/2 -translate-x-1/2 pointer-events-none text-white/40 text-sm">✦</div>

      {/* Interactive Clickable Character Hotspots over the Poster */}
      
      {/* 1. Left Character Hotspot (Magnifying Glass Detective) */}
      <button
        type="button"
        onClick={handleLeftClick}
        aria-label="사과 돋보기 탐정 터치"
        className="absolute top-[37%] left-[6%] w-[28%] h-[26%] rounded-full cursor-pointer hover:bg-amber-400/20 active:scale-95 transition-all flex items-start justify-center group/left"
      >
        <span className="opacity-0 group-hover/left:opacity-100 transition-opacity bg-stone-900/80 text-amber-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow border border-amber-400 -mt-2">
          터치! 🔍
        </span>
      </button>

      {/* 2. Center Character Hotspot (Center Excited Detective) */}
      <button
        type="button"
        onClick={handleCenterClick}
        aria-label="가운데 탐정 대장 터치"
        className="absolute top-[34%] left-[36%] w-[28%] h-[28%] rounded-full cursor-pointer hover:bg-emerald-400/20 active:scale-95 transition-all flex items-start justify-center group/center"
      >
        <span className="opacity-0 group-hover/center:opacity-100 transition-opacity bg-stone-900/80 text-emerald-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow border border-emerald-400 -mt-2">
          터치! 🎩
        </span>
      </button>

      {/* 3. Right Character Hotspot (Right Winking Detective) */}
      <button
        type="button"
        onClick={handleRightClick}
        aria-label="오른쪽 윙크 탐정 터치"
        className="absolute top-[37%] right-[6%] w-[28%] h-[26%] rounded-full cursor-pointer hover:bg-orange-400/20 active:scale-95 transition-all flex items-start justify-center group/right"
      >
        <span className="opacity-0 group-hover/right:opacity-100 transition-opacity bg-stone-900/80 text-orange-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow border border-orange-400 -mt-2">
          터치! ✨
        </span>
      </button>

      {/* 4. Bottom Fruit Sandos Board Hotspot */}
      <button
        type="button"
        onClick={handleSandosClick}
        aria-label="과일산도 도마 터치"
        className="absolute bottom-[10%] left-[8%] w-[84%] h-[22%] rounded-2xl cursor-pointer hover:bg-white/15 active:scale-[0.98] transition-all flex items-center justify-center group/sando"
      >
        <span className="opacity-0 group-hover/sando:opacity-100 transition-opacity bg-stone-900/90 text-amber-200 text-xs font-black px-3 py-1 rounded-full shadow border border-amber-300">
          6가지 수제산도 컷팅! 🥪
        </span>
      </button>

      {/* Speech Bubble Overlay when a character is tapped */}
      {activeSpeech && (
        <div className="absolute top-[28%] left-1/2 -translate-x-1/2 w-[85%] z-20 animate-popIn pointer-events-none">
          <div className="bg-white/95 text-stone-900 px-4 py-2.5 rounded-2xl shadow-2xl border-2 border-amber-400 text-center relative">
            <p className="text-xs sm:text-sm font-black text-amber-950">
              {activeSpeech.text}
            </p>
            {/* Bubble tail */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-b-2 border-r-2 border-amber-400 rotate-45"></div>
          </div>
        </div>
      )}

      {/* Bottom Floating Interactive Guide Bar */}
      <div className="absolute bottom-2 inset-x-2 bg-black/60 backdrop-blur-md py-1.5 px-3 rounded-2xl flex items-center justify-between text-white text-[11px] font-bold border border-white/20">
        <span className="flex items-center gap-1 text-amber-300 animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          <span>탐정과 산도를 터치하면 움직여요!</span>
        </span>
        <button
          type="button"
          onClick={onOpenNotice}
          className="underline hover:text-amber-300 transition-colors text-[11px]"
        >
          행사 요강 보기
        </button>
      </div>
    </div>
  );
};

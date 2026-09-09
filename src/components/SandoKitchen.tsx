import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { District, SandoRecipe } from '../types';
import { getRandomRecipe } from '../utils/sandoRecipes';
import { sounds } from '../utils/soundEffects';
import { Sparkles, Utensils, CheckCircle2, ChevronRight, Trophy } from 'lucide-react';

interface SandoKitchenProps {
  district: District;
  onSandoCompleted: (districtId: number, recipe: SandoRecipe, contributors: string[]) => void;
  onOpenMissionModal: () => void;
  activeContributor: string;
}

export const SandoKitchen: React.FC<SandoKitchenProps> = ({
  district,
  onSandoCompleted,
  onOpenMissionModal,
  activeContributor,
}) => {
  // Slicing animation state: 'idle' | 'covering' | 'slashing' | 'split' | 'celebrating'
  const [sliceStep, setSliceStep] = useState<'idle' | 'covering' | 'slashing' | 'split' | 'celebrating'>('idle');
  const [currentRecipe, setCurrentRecipe] = useState<SandoRecipe | null>(null);

  const currentPoints = district.currentPoints; // 0 to 99
  const progressPercent = Math.min(100, Math.max(0, currentPoints));
  const pointsRemaining = Math.max(0, 100 - currentPoints);

  // Check if 100 points reached to trigger the cut animation sequence
  useEffect(() => {
    if (district.currentPoints >= 100 && sliceStep === 'idle') {
      const nextRecipe = getRandomRecipe(district.completedSandos.length + 1);
      setCurrentRecipe(nextRecipe);
      startSlicingSequence(nextRecipe);
    }
  }, [district.currentPoints, sliceStep]);

  const startSlicingSequence = (recipe: SandoRecipe) => {
    // Step 1: Bread cover descends (0ms)
    setSliceStep('covering');
    sounds.playBreadCover();

    // Step 2: Slash blade animation (600ms)
    setTimeout(() => {
      setSliceStep('slashing');
      sounds.playSlash();
    }, 650);

    // Step 3: Split into two triangles & reveal cross section (1100ms)
    setTimeout(() => {
      setSliceStep('split');
      sounds.playFanfare();
      triggerConfetti();
    }, 1200);

    // Step 4: Celebration popup & finish (1600ms)
    setTimeout(() => {
      setSliceStep('celebrating');
    }, 1600);
  };

  const triggerConfetti = () => {
    // Multi-stage celebratory confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF3366', '#FFB703', '#52B788', '#FB8500', '#FFFFFF', '#6A4C93'],
    });
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0.1, y: 0.6 },
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 0.9, y: 0.6 },
      });
    }, 250);
  };

  const handleFinishCelebration = () => {
    if (currentRecipe) {
      const contributorList = activeContributor ? [activeContributor] : ['구역원 일동'];
      onSandoCompleted(district.id, currentRecipe, contributorList);
    }
    setSliceStep('idle');
    setCurrentRecipe(null);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-amber-100/90 to-amber-50/90 p-5 md:p-7 shadow-xl border-2 border-amber-200/80">
      {/* Background cute kitchen texture decorations */}
      <div className="absolute top-2 right-4 text-3xl opacity-20 pointer-events-none select-none">🥪 🍓 🍇 🥛</div>
      <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-rose-200/30 rounded-full blur-2xl pointer-events-none"></div>

      {/* Header Info */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500 text-white text-xs font-bold shadow-sm">
              <Utensils className="w-3.5 h-3.5" />
              {district.name} 열매산도 조립대
            </span>
            <span className="text-xs text-stone-500 font-medium">구역장: {district.leader}</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-stone-800 mt-1.5 tracking-tight flex items-center gap-2">
            🥪 {district.completedSandos.length + 1}번째 산도 만드는 중!
          </h2>
        </div>

        {/* Quick Action Button */}
        <button
          onClick={onOpenMissionModal}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 text-white font-bold text-sm shadow-md hover:shadow-lg active:scale-95 transition-all"
        >
          <Sparkles className="w-4 h-4 text-amber-200" />
          <span>미션 인증 / 점수 등록</span>
        </button>
      </div>

      {/* Progress Bar towards 100P */}
      <div className="mb-6 bg-white/90 rounded-2xl p-4 shadow-sm border border-amber-200/60">
        <div className="flex justify-between items-baseline mb-2">
          <span className="text-sm font-bold text-stone-700 flex items-center gap-1.5">
            <span className="text-rose-500 font-extrabold text-base">{currentPoints}</span>
            <span className="text-stone-400">/ 100 POINT</span>
          </span>
          <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
            {pointsRemaining === 0 ? '✨ 100P 달성! 완성 연출 진행 중!' : `다음 산도까지 ${pointsRemaining}P 남음!`}
          </span>
        </div>

        {/* Outer Bar */}
        <div className="relative w-full h-4 bg-amber-100 rounded-full overflow-hidden p-0.5 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-amber-400 via-rose-400 to-rose-500 rounded-full transition-all duration-500 shadow-sm relative overflow-hidden"
            style={{ width: `${progressPercent}%` }}
          >
            <div className="absolute inset-0 bg-white/25 animate-shimmer"></div>
          </div>
        </div>

        {/* Step checkpoints (25P, 50P, 75P, 100P) */}
        <div className="flex justify-between text-[11px] text-stone-500 mt-2 px-1 font-medium">
          <span className={currentPoints >= 25 ? 'text-rose-600 font-bold' : ''}>🍞 식빵 베이스</span>
          <span className={currentPoints >= 50 ? 'text-rose-600 font-bold' : ''}>🥛 생크림 듬뿍</span>
          <span className={currentPoints >= 75 ? 'text-rose-600 font-bold' : ''}>🍓 생과일 콕콕</span>
          <span className={currentPoints >= 100 ? 'text-rose-600 font-bold' : ''}>✂️ 스윽-싹 컷팅!</span>
        </div>
      </div>

      {/* Interactive Sando Construction & Slice Stage */}
      <div className="relative w-full min-h-[300px] md:min-h-[340px] flex items-center justify-center bg-gradient-to-b from-white/80 to-amber-50/70 rounded-2xl border border-amber-200/60 p-4">
        {/* If Not Slicing (Current Assembly Visual) */}
        {sliceStep === 'idle' && (
          <div className="flex flex-col items-center justify-center w-full">
            {/* 3D Sando Layer Staging */}
            <div className="relative w-64 md:w-72 h-52 flex items-center justify-center">
              {/* Bottom Bread Slice */}
              <div className="absolute bottom-6 w-56 md:w-64 h-14 bg-amber-200 rounded-2xl border-4 border-amber-300/90 shadow-lg flex items-center justify-center">
                <span className="text-amber-700/60 text-xs font-bold tracking-wider">🌾 촉촉한 우유 식빵 베이스</span>
              </div>

              {/* Whipped Cream Layer (appears when points >= 20, thickens with points) */}
              {currentPoints >= 15 && (
                <div
                  className="absolute bottom-12 w-52 md:w-60 bg-white/95 rounded-2xl border-2 border-stone-100 shadow-md transition-all duration-700 flex items-center justify-center overflow-hidden"
                  style={{
                    height: `${Math.min(56, 20 + (currentPoints / 100) * 36)}px`,
                  }}
                >
                  {/* Cream fluff texture */}
                  <div className="w-full flex justify-around opacity-40">
                    <span className="w-6 h-6 rounded-full bg-amber-50"></span>
                    <span className="w-8 h-8 rounded-full bg-amber-50"></span>
                    <span className="w-7 h-7 rounded-full bg-amber-50"></span>
                    <span className="w-6 h-6 rounded-full bg-amber-50"></span>
                  </div>
                  <div className="absolute text-stone-400 text-[11px] font-semibold">
                    🥛 100% 동물성 생크림 충전중 ({Math.min(100, currentPoints * 1.2).toFixed(0)}%)
                  </div>
                </div>
              )}

              {/* Fruits Pop In Layer */}
              <div className="absolute bottom-16 w-48 md:w-56 flex justify-center items-center gap-3">
                {currentPoints >= 30 && (
                  <div className="animate-popIn text-4xl filter drop-shadow-md hover:scale-125 transition-transform cursor-pointer" title="딸기">
                    🍓
                  </div>
                )}
                {currentPoints >= 50 && (
                  <div className="animate-popIn text-4xl filter drop-shadow-md hover:scale-125 transition-transform cursor-pointer" title="샤인머스캣">
                    🍇
                  </div>
                )}
                {currentPoints >= 70 && (
                  <div className="animate-popIn text-4xl filter drop-shadow-md hover:scale-125 transition-transform cursor-pointer" title="애플망고">
                    🥭
                  </div>
                )}
                {currentPoints >= 85 && (
                  <div className="animate-popIn text-4xl filter drop-shadow-md hover:scale-125 transition-transform cursor-pointer" title="제주감귤">
                    🍊
                  </div>
                )}
              </div>

              {/* Guide Overlay when empty */}
              {currentPoints < 15 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-white/60 backdrop-blur-[2px] rounded-xl border border-dashed border-amber-300">
                  <span className="text-3xl mb-1 animate-bounce">🥪</span>
                  <p className="text-sm font-bold text-stone-700">미션을 수행하여 과일을 채워주세요!</p>
                  <p className="text-xs text-stone-500 mt-0.5">100P가 쌓이면 대각선 슬라이스 컷팅이 시작됩니다.</p>
                </div>
              )}
            </div>

            {/* Hint message under assembly */}
            <div className="mt-3 text-center">
              <span className="text-xs font-semibold text-amber-800/80 bg-amber-100/70 px-3 py-1 rounded-full">
                💡 점수를 올릴 때마다 생크림과 과일이 실시간으로 조립됩니다!
              </span>
            </div>
          </div>
        )}

        {/* ✂️ SLICING SEQUENCE: Covering Bread Top */}
        {sliceStep === 'covering' && (
          <div className="flex flex-col items-center justify-center animate-popIn">
            <div className="relative w-64 h-56 flex items-center justify-center">
              {/* Entire uncut sandwich with top bread falling */}
              <div className="w-56 h-40 bg-amber-200 rounded-3xl border-4 border-amber-400 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden">
                <div className="w-full h-8 bg-amber-300 rounded-t-2xl flex items-center justify-center text-amber-800 text-xs font-black">
                  🍞 식빵 뚜껑 착! 덮임
                </div>
                <div className="flex items-center justify-center h-20 bg-white w-full border-y-2 border-stone-200">
                  <span className="text-3xl animate-pulse">🍓 🥭 🍇</span>
                </div>
                <div className="w-full h-8 bg-amber-300 rounded-b-2xl"></div>
              </div>
            </div>
            <p className="text-sm font-black text-rose-600 mt-2 animate-bounce">100P 완성! 컷팅 준비 중...</p>
          </div>
        )}

        {/* ✂️ SLICING SEQUENCE: Sharp Blade Slash */}
        {sliceStep === 'slashing' && (
          <div className="relative w-64 h-56 flex items-center justify-center">
            {/* The Sandwich */}
            <div className="w-56 h-40 bg-amber-200 rounded-3xl border-4 border-amber-400 shadow-2xl flex items-center justify-center relative">
              <div className="text-4xl">🥪</div>
              {/* Slashing Blade Laser / Flash effect */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-72 h-1.5 bg-white shadow-[0_0_20px_#fff,0_0_40px_#ff0055] rotate-[-45deg] animate-slash"></div>
              </div>
            </div>
          </div>
        )}

        {/* ✂️ SLICING SEQUENCE: Split Left & Right Revealing Fresh Cut Fruits! */}
        {(sliceStep === 'split' || sliceStep === 'celebrating') && currentRecipe && (
          <div className="flex flex-col items-center justify-center w-full animate-popIn">
            {/* The Two Split Halves */}
            <div className="relative flex items-center justify-center gap-4 my-2">
              {/* Left Triangular Sando Half */}
              <div className="animate-splitLeft">
                <div className="w-28 md:w-32 h-44 bg-white rounded-l-2xl border-l-4 border-y-4 border-amber-300 shadow-xl overflow-hidden relative flex flex-col justify-between p-2">
                  <div className="text-xs font-bold text-rose-500">✨ {currentRecipe.fruits[0]?.name}</div>
                  <div className="flex flex-col items-center justify-center gap-1 my-auto">
                    <span className="text-4xl filter drop-shadow">{currentRecipe.fruits[0]?.emoji}</span>
                    <span className="text-2xl filter drop-shadow">{currentRecipe.fruits[1]?.emoji || '🍓'}</span>
                  </div>
                  <div className="w-full h-2 bg-amber-300 rounded-full"></div>
                </div>
              </div>

              {/* Right Triangular Sando Half */}
              <div className="animate-splitRight">
                <div className="w-28 md:w-32 h-44 bg-white rounded-r-2xl border-r-4 border-y-4 border-amber-300 shadow-xl overflow-hidden relative flex flex-col justify-between p-2">
                  <div className="text-xs font-bold text-amber-600 text-right">✨ {currentRecipe.fruits[1]?.name || '생크림'}</div>
                  <div className="flex flex-col items-center justify-center gap-1 my-auto">
                    <span className="text-4xl filter drop-shadow">{currentRecipe.fruits[1]?.emoji || '🥭'}</span>
                    <span className="text-2xl filter drop-shadow">{currentRecipe.fruits[2]?.emoji || '🍇'}</span>
                  </div>
                  <div className="w-full h-2 bg-amber-300 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Celebration Card Overlay */}
            {sliceStep === 'celebrating' && (
              <div className="mt-3 bg-white/95 rounded-2xl p-4 shadow-lg border-2 border-rose-300 text-center max-w-md w-full animate-popIn">
                <div className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-rose-100 text-rose-600 text-xs font-bold mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  {currentRecipe.tag}
                </div>
                <h3 className="text-xl font-black text-stone-800">{currentRecipe.name}</h3>
                <p className="text-xs text-stone-600 mt-1">{currentRecipe.description}</p>
                <div className="text-xs text-stone-400 mt-1 font-medium">
                  {district.name}의 {district.completedSandos.length + 1}번째 완성 산도!
                </div>

                <button
                  onClick={handleFinishCelebration}
                  className="mt-3 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-extrabold text-sm shadow-md flex items-center justify-center gap-1.5 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>우리 구역 진열대에 보관하기!</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Info / Mission Shortcuts */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-600">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          완성된 산도: <strong className="text-rose-600 font-bold">{district.completedSandos.length}개</strong>
        </span>
        <button
          onClick={onOpenMissionModal}
          className="text-rose-600 hover:text-rose-700 font-bold flex items-center gap-0.5 underline underline-offset-2"
        >
          미션 전체 점수표 보기
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

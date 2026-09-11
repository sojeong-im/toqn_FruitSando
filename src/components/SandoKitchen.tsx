import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { District, SandoRecipe } from '../types';
import { getRandomRecipe } from '../utils/sandoRecipes';
import { sounds } from '../utils/soundEffects';
import { PlusCircle, CheckCircle2 } from 'lucide-react';
import {
  BreadSliceBase,
  BreadSliceTop,
  FluffyCreamLayer,
  IllustratedFruit,
} from './BreadIllustrations';
import { RealMilkBread } from './RealMilkBread';
import { RealCreamBread } from './RealCreamBread';
import { RealFruitBread } from './RealFruitBread';

interface SandoKitchenProps {
  district: District;
  onSandoCompleted: (districtId: string, recipe: SandoRecipe, contributors: string[]) => void;
  onOpenMissionModal: () => void;
  activeContributor: string;
}

export const SandoKitchen: React.FC<SandoKitchenProps> = ({
  district,
  onSandoCompleted,
  onOpenMissionModal,
  activeContributor,
}) => {
  const [sliceStep, setSliceStep] = useState<'idle' | 'covering' | 'slashing' | 'split' | 'celebrating'>('idle');
  const [currentRecipe, setCurrentRecipe] = useState<SandoRecipe | null>(null);

  const currentPoints = district.currentPoints; // 0 to 99
  const progressPercent = Math.min(100, Math.max(0, currentPoints));
  const pointsRemaining = Math.max(0, 100 - currentPoints);

  // Trigger slicing sequence when reaching 100 points
  useEffect(() => {
    if (district.currentPoints >= 100 && sliceStep === 'idle') {
      const nextRecipe = getRandomRecipe(district.completedSandos.length + 1);
      setCurrentRecipe(nextRecipe);
      startSlicingSequence(nextRecipe);
    }
  }, [district.currentPoints, sliceStep]);

  const startSlicingSequence = (_recipe: SandoRecipe) => {
    setSliceStep('covering');
    sounds.playBreadCover();

    setTimeout(() => {
      setSliceStep('slashing');
      sounds.playSlash();
    }, 650);

    setTimeout(() => {
      setSliceStep('split');
      sounds.playFanfare();
      triggerConfetti();
    }, 1200);

    setTimeout(() => {
      setSliceStep('celebrating');
    }, 1600);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#FF5A1F', '#38A137', '#FFAA00', '#FFFFFF'],
    });
  };

  const handleFinishCelebration = () => {
    if (currentRecipe) {
      const contributorList = activeContributor ? [activeContributor] : ['구역원'];
      onSandoCompleted(district.id, currentRecipe, contributorList);
    }
    setSliceStep('idle');
    setCurrentRecipe(null);
  };

  return (
    <div className="rounded-3xl bg-white p-5 sm:p-6 shadow-md border border-amber-200/80">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 text-xs font-bold">
              {district.name}
            </span>
            <span className="text-xs text-stone-500 font-medium">
              구역장: {district.leader}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 mt-1">
            {district.completedSandos.length + 1}번째 열매산도 조립 중
          </h2>
        </div>

        {/* Primary Action Button */}
        <button
          onClick={onOpenMissionModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white text-sm font-bold shadow-sm transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>미션 인증 / 점수 등록</span>
        </button>
      </div>

      {/* Progress Bar towards 100P */}
      <div className="bg-amber-50/60 rounded-2xl p-4 border border-amber-200/70 mb-5">
        <div className="flex justify-between items-baseline mb-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-amber-900">{currentPoints}</span>
            <span className="text-xs font-semibold text-stone-500">/ 100 POINT</span>
          </div>
          <span className="text-xs font-bold text-amber-800">
            {pointsRemaining === 0 ? '100P 달성! 완성 연출 진행 중' : `다음 산도까지 ${pointsRemaining}P 남음`}
          </span>
        </div>

        {/* Progress Bar Track */}
        <div className="w-full h-3.5 bg-amber-200/50 rounded-full overflow-hidden p-0.5">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex justify-between text-[11px] text-stone-500 mt-2 px-0.5 font-medium">
          <span className={currentPoints < 50 ? 'text-amber-900 font-black underline underline-offset-2' : ''}>
            0P (우유식빵)
          </span>
          <span>→</span>
          <span className={currentPoints >= 50 && currentPoints < 75 ? 'text-amber-900 font-black underline underline-offset-2' : ''}>
            50P (생크림)
          </span>
          <span>→</span>
          <span className={currentPoints >= 75 && currentPoints < 100 ? 'text-amber-900 font-black underline underline-offset-2' : ''}>
            75P (과일얹기)
          </span>
          <span>→</span>
          <span className={currentPoints >= 100 ? 'text-amber-900 font-black underline underline-offset-2' : ''}>
            100P (대각선 컷팅)
          </span>
        </div>
      </div>

      {/* Illustrated Artisanal Sando Assembly & Cutting Stage */}
      <div className="relative min-h-[300px] flex items-center justify-center bg-[#FBF7F0] rounded-2xl border-2 border-amber-200/60 p-6 overflow-hidden">
        {/* Regular Assembly Stage with 3-tier Real Bread Progression */}
        {sliceStep === 'idle' && (
          <>
            {/* 🍞 1단계: 0P ~ 49P (우유식빵 단계) - 촉촉한 기본 우유식빵 */}
            {currentPoints < 50 ? (
              <div className="flex flex-col items-center justify-center text-center animate-popIn">
                <RealMilkBread className="w-48 h-48 sm:w-56 sm:h-56" />
                <div className="mt-3">
                  <span className="text-xs text-amber-900 font-black bg-amber-100 px-3.5 py-1 rounded-full border border-amber-300 shadow-sm">
                    🍞 0P 단계: 부드럽고 폭신한 우유식빵 준비 완료!
                  </span>
                  <p className="text-[11px] text-stone-500 mt-1.5 font-medium">
                    미션을 인증하여 50P에 도달하면 달콤한 생크림이 뾰로롱 발라집니다! ✨
                  </p>
                </div>
              </div>
            ) : currentPoints < 75 ? (
              /* ✨ 2단계: 50P ~ 74P (생크림 단계) - 뾰로롱 우유 생크림 식빵 */
              <div className="flex flex-col items-center justify-center text-center animate-magicPop">
                <RealCreamBread className="w-48 h-48 sm:w-56 sm:h-56" />
                <div className="mt-3">
                  <span className="text-xs text-amber-900 font-black bg-gradient-to-r from-amber-100 via-amber-200 to-amber-100 px-4 py-1.5 rounded-full border border-amber-300 shadow-sm flex items-center justify-center gap-1.5">
                    <span>✨</span>
                    <span>50P 단계: 부드러운 우유 생크림이 뾰로롱~ 발라졌어요!</span>
                    <span>✨</span>
                  </span>
                  <p className="text-[11px] text-stone-500 mt-1.5 font-medium">
                    식빵을 터치하면 마법 사운드(뾰로롱✨)가 울려요! (75P 과일 얹기 대기 중)
                  </p>
                </div>
              </div>
            ) : (
              /* 🥝🍊 3단계: 75P ~ 99P (과일얹기 단계) - 키위·무화과·귤 초특급 화려한 뾰로롱 과일 산도! */
              <div className="flex flex-col items-center justify-center text-center animate-magicPop">
                <RealFruitBread className="w-48 h-48 sm:w-56 sm:h-56" />
                <div className="mt-3">
                  <span className="text-xs text-amber-950 font-black bg-gradient-to-r from-lime-200 via-amber-200 to-orange-200 px-4 py-1.5 rounded-full border border-amber-300 shadow-md flex items-center justify-center gap-1.5">
                    <span>🥝</span>
                    <span>75P 단계: 키위·무화과·귤 생과일이 화려하게 뾰로롱 안착!</span>
                    <span>🍊</span>
                  </span>
                  <p className="text-[11px] text-stone-500 mt-1.5 font-medium">
                    식빵을 터치하면 화려한 과일 팡파르가 터져요! (100P 달성 시 대각선 컷팅!)
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {/* Covering Top Illustrated Bread */}
        {sliceStep === 'covering' && (
          <div className="flex flex-col items-center justify-center animate-popIn text-center">
            <div className="relative w-64 flex flex-col items-center justify-center">
              {/* Top Loaf Slice descending */}
              <div className="animate-bounce mb-[-12px] z-20 filter drop-shadow-lg">
                <BreadSliceTop />
              </div>

              {/* Cream & Fruits inside */}
              <div className="w-48 h-10 bg-white rounded-lg border border-stone-200 flex items-center justify-center gap-3 z-10">
                <IllustratedFruit type="strawberry" />
                <IllustratedFruit type="mango" />
                <IllustratedFruit type="shine" />
              </div>

              {/* Bottom Bread Slice */}
              <div className="mt-[-8px] z-0 filter drop-shadow-md">
                <BreadSliceBase />
              </div>
            </div>

            <p className="text-xs font-black text-amber-900 mt-4 animate-pulse">
              식빵 뚜껑 착! 덮임! 100P 대각선 컷팅 준비 중...
            </p>
          </div>
        )}

        {/* Slicing Knife Animation */}
        {sliceStep === 'slashing' && (
          <div className="relative w-64 h-40 flex items-center justify-center">
            <div className="relative w-56 flex flex-col items-center justify-center">
              <BreadSliceTop className="mb-[-12px] z-20" />
              <div className="w-48 h-10 bg-white rounded border border-stone-200 z-10 flex items-center justify-center gap-2">
                <IllustratedFruit type="strawberry" />
                <IllustratedFruit type="mango" />
              </div>
              <BreadSliceBase className="mt-[-8px] z-0" />

              {/* Diagonal Slashing Laser / Blade */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                <div className="w-72 h-1.5 bg-white shadow-[0_0_16px_#fff,0_0_24px_#ffaa00] rotate-[-45deg] animate-slash"></div>
              </div>
            </div>
          </div>
        )}

        {/* Slices Split open & Celebration */}
        {(sliceStep === 'split' || sliceStep === 'celebrating') && currentRecipe && (
          <div className="flex flex-col items-center justify-center w-full animate-popIn text-center">
            {/* Split Sando Halves with Illustrated Crust and Cream */}
            <div className="flex items-center justify-center gap-4 my-2">
              {/* Left Triangle Half */}
              <div className="animate-splitLeft w-28 h-40 bg-white rounded-l-2xl border-l-8 border-y-4 border-[#C97A28] shadow-xl p-2.5 flex flex-col justify-between relative overflow-hidden">
                <div className="w-full h-2 bg-[#A85717] rounded-full shrink-0"></div>
                <div className="flex flex-col items-center justify-center gap-1.5 my-auto">
                  <IllustratedFruit type="strawberry" />
                  <span className="text-xs font-black text-stone-800">{currentRecipe.fruits[0]?.name}</span>
                </div>
                <div className="w-full h-2 bg-[#A85717] rounded-full shrink-0"></div>
              </div>

              {/* Right Triangle Half */}
              <div className="animate-splitRight w-28 h-40 bg-white rounded-r-2xl border-r-8 border-y-4 border-[#C97A28] shadow-xl p-2.5 flex flex-col justify-between relative overflow-hidden">
                <div className="w-full h-2 bg-[#A85717] rounded-full shrink-0"></div>
                <div className="flex flex-col items-center justify-center gap-1.5 my-auto">
                  <IllustratedFruit type="shine" />
                  <span className="text-xs font-black text-stone-800">{currentRecipe.fruits[1]?.name || '생크림'}</span>
                </div>
                <div className="w-full h-2 bg-[#A85717] rounded-full shrink-0"></div>
              </div>
            </div>

            {/* Popup Celebration Card */}
            {sliceStep === 'celebrating' && (
              <div className="mt-3 bg-white rounded-2xl p-4 shadow-xl border-2 border-amber-400 max-w-sm w-full animate-popIn">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold mb-1">
                  {currentRecipe.tag}
                </span>
                <h3 className="text-lg font-black text-stone-900">{currentRecipe.name}</h3>
                <p className="text-xs text-stone-500 mt-1">{currentRecipe.description}</p>

                <button
                  onClick={handleFinishCelebration}
                  className="mt-3 w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow transition-all"
                >
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>우리 구역 진열대에 보관하기</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

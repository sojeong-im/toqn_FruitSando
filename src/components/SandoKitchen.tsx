import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { District, SandoRecipe } from '../types';
import { getRandomRecipe } from '../utils/sandoRecipes';
import { sounds } from '../utils/soundEffects';
import { PlusCircle, Sparkles, CheckCircle2 } from 'lucide-react';

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
            {district.completedSandos.length + 1}번째 열매산도 만드는 중
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
          <span>0P (시작)</span>
          <span>50P (생크림)</span>
          <span>75P (과일 얹기)</span>
          <span>100P (산도 컷팅)</span>
        </div>
      </div>

      {/* Interactive Assembly & Cutting Stage */}
      <div className="relative min-h-[260px] flex items-center justify-center bg-stone-50 rounded-2xl border border-stone-200 p-6 overflow-hidden">
        {/* Regular Assembly Stage */}
        {sliceStep === 'idle' && (
          <div className="flex flex-col items-center justify-center text-center">
            {/* Visual Sandwich Layers */}
            <div className="relative w-56 h-36 flex flex-col items-center justify-center">
              {/* Bottom Bread */}
              <div className="w-48 h-10 bg-[#F0D5B5] rounded-xl border-2 border-[#D9AF7E] shadow-sm flex items-center justify-center">
                <span className="text-[11px] text-stone-600 font-bold">식빵 베이스</span>
              </div>

              {/* Cream Layer if points >= 20 */}
              {currentPoints >= 20 && (
                <div
                  className="w-44 bg-white rounded-lg border border-stone-200 shadow-inner flex items-center justify-center transition-all duration-500 my-1"
                  style={{ height: `${Math.min(40, 16 + (currentPoints / 100) * 24)}px` }}
                >
                  <span className="text-[10px] text-stone-400 font-semibold">
                    부드러운 우유 생크림
                  </span>
                </div>
              )}

              {/* Fresh Fruits if points >= 50 */}
              {currentPoints >= 50 && (
                <div className="flex items-center justify-center gap-3 animate-popIn my-1">
                  <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 text-xs font-bold">
                    딸기
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 text-xs font-bold">
                    샤인머스캣
                  </span>
                  {currentPoints >= 75 && (
                    <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-xs font-bold">
                      망고
                    </span>
                  )}
                </div>
              )}

              {/* Empty state instruction */}
              {currentPoints < 20 && (
                <p className="text-xs text-stone-400 mt-3 font-medium">
                  미션을 완수하여 점수를 쌓으면 산도가 완성됩니다.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Covering Top Bread */}
        {sliceStep === 'covering' && (
          <div className="flex flex-col items-center justify-center animate-popIn text-center">
            <div className="w-48 h-28 bg-[#F0D5B5] rounded-2xl border-2 border-[#D9AF7E] shadow-lg flex flex-col items-center justify-center">
              <div className="text-xs font-bold text-stone-700">식빵 뚜껑 덮임</div>
              <div className="w-40 h-8 bg-white my-1 rounded border border-stone-200 flex items-center justify-center text-xs font-semibold text-stone-500">
                100P 달성 완료
              </div>
            </div>
            <p className="text-xs font-bold text-amber-700 mt-3 animate-pulse">
              100POINT 달성! 대각선 컷팅 준비 중...
            </p>
          </div>
        )}

        {/* Slicing Knife Animation */}
        {sliceStep === 'slashing' && (
          <div className="relative w-48 h-28 flex items-center justify-center">
            <div className="w-48 h-28 bg-[#F0D5B5] rounded-2xl border-2 border-[#D9AF7E] shadow-lg flex items-center justify-center">
              <span className="text-xs font-bold text-stone-600">컷팅 중</span>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-56 h-1 bg-white shadow-[0_0_12px_#fff] rotate-[-45deg] animate-slash"></div>
              </div>
            </div>
          </div>
        )}

        {/* Slices Split open & Celebration */}
        {(sliceStep === 'split' || sliceStep === 'celebrating') && currentRecipe && (
          <div className="flex flex-col items-center justify-center w-full animate-popIn text-center">
            {/* Split Sando Halves */}
            <div className="flex items-center justify-center gap-3 my-2">
              <div className="animate-splitLeft w-24 h-36 bg-white rounded-l-xl border-l-4 border-y-4 border-[#EAD2B2] shadow-md p-2 flex flex-col justify-between">
                <span className="text-[11px] font-bold text-amber-800">{currentRecipe.name}</span>
                <div className="text-xs font-semibold text-stone-600">{currentRecipe.fruits[0]?.name}</div>
                <div className="w-full h-1.5 bg-[#D9AF7E] rounded-full"></div>
              </div>

              <div className="animate-splitRight w-24 h-36 bg-white rounded-r-xl border-r-4 border-y-4 border-[#EAD2B2] shadow-md p-2 flex flex-col justify-between">
                <span className="text-[11px] font-bold text-stone-400 text-right">단면</span>
                <div className="text-xs font-semibold text-stone-600">{currentRecipe.fruits[1]?.name || '생크림'}</div>
                <div className="w-full h-1.5 bg-[#D9AF7E] rounded-full"></div>
              </div>
            </div>

            {/* Popup Info Card */}
            {sliceStep === 'celebrating' && (
              <div className="mt-2 bg-white rounded-2xl p-4 shadow-md border border-amber-200 max-w-sm w-full animate-popIn">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold mb-1">
                  {currentRecipe.tag}
                </span>
                <h3 className="text-lg font-black text-stone-900">{currentRecipe.name}</h3>
                <p className="text-xs text-stone-500 mt-1">{currentRecipe.description}</p>

                <button
                  onClick={handleFinishCelebration}
                  className="mt-3 w-full py-2 px-4 rounded-xl bg-stone-900 hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
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

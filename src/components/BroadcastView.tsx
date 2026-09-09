import React from 'react';
import { District } from '../types';
import { Crown, Trophy, Sparkles, Flame, Volume2, X } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface BroadcastViewProps {
  districts: District[];
  onExit: () => void;
  latestEvent: string;
}

export const BroadcastView: React.FC<BroadcastViewProps> = ({
  districts,
  onExit,
  latestEvent,
}) => {
  const sortedDistricts = [...districts].sort((a, b) => {
    if (b.completedSandos.length !== a.completedSandos.length) {
      return b.completedSandos.length - a.completedSandos.length;
    }
    return b.points - a.points;
  });

  const first = sortedDistricts[0];
  const second = sortedDistricts[1];
  const third = sortedDistricts[2];
  const others = sortedDistricts.slice(3);

  const totalSandosAllDistricts = districts.reduce((sum, d) => sum + d.completedSandos.length, 0);

  return (
    <div className="fixed inset-0 z-50 bg-stone-950 text-white flex flex-col justify-between p-6 md:p-10 overflow-hidden select-none">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-amber-500/10 blur-[130px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[300px] bg-rose-500/10 blur-[120px] pointer-events-none"></div>

      {/* Top Header Bar */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <span className="text-4xl animate-bounce">🍓🥪🍇</span>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-0.5 rounded-full bg-rose-600 text-white text-xs font-black tracking-widest uppercase animate-pulse">
                LIVE
              </span>
              <span className="text-xs text-amber-300 font-bold">새신자부 찾기팀 중계 센터</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-black tracking-tight text-amber-100 mt-1">
              열매산도 쟁탈전 실시간 전광판
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <span className="text-xs text-stone-400 block font-medium">전체 완성된 산도 합계</span>
            <span className="text-2xl md:text-3xl font-black text-amber-400">🥪 {totalSandosAllDistricts}개</span>
          </div>

          <button
            onClick={onExit}
            className="p-2.5 rounded-2xl bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
            title="일반 모드로 복귀"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Center Stage: Huge Top 3 Podium */}
      <div className="my-auto max-w-5xl w-full mx-auto grid grid-cols-3 gap-4 md:gap-8 items-end relative z-10 pt-12 pb-4">
        {/* 2nd Place */}
        {second && (
          <div className="flex flex-col items-center">
            <div className="text-center mb-3">
              <span className="text-sm md:text-lg font-bold text-stone-300">{second.name}</span>
              <div className="text-xs md:text-sm text-stone-400 font-semibold">총 {second.points}P ({second.currentPoints}/100P)</div>
            </div>
            <div className="w-full h-44 md:h-64 rounded-3xl bg-gradient-to-t from-stone-900 to-stone-800 border-t-8 border-stone-300 flex flex-col items-center justify-between p-4 shadow-2xl">
              <span className="text-xl md:text-2xl font-black text-stone-300">2위 🥈</span>
              <div className="text-center">
                <span className="text-4xl md:text-6xl font-black text-white">🥪 {second.completedSandos.length}</span>
                <span className="block text-xs md:text-sm text-stone-400 mt-1">완성 산도</span>
              </div>
              <span className="text-xs md:text-sm font-bold text-stone-300 bg-stone-700/60 px-3 py-1 rounded-full">
                2등 수제산도
              </span>
            </div>
          </div>
        )}

        {/* 1st Place (Champion) */}
        {first && (
          <div className="flex flex-col items-center relative -translate-y-4">
            <div className="absolute -top-12 animate-bounce">
              <Crown className="w-12 h-12 md:w-16 md:h-16 text-amber-400 fill-amber-400 filter drop-shadow-[0_0_20px_#f59e0b]" />
            </div>
            <div className="text-center mb-3 mt-4">
              <span className="text-base md:text-2xl font-black text-amber-300 flex items-center justify-center gap-1.5">
                {first.name}
                <Sparkles className="w-5 h-5 text-amber-400 animate-spin" />
              </span>
              <div className="text-xs md:text-sm text-amber-200/80 font-bold">총 {first.points}P ({first.currentPoints}/100P)</div>
            </div>
            <div className="w-full h-56 md:h-80 rounded-3xl bg-gradient-to-t from-amber-950 via-amber-900 to-amber-600 border-t-8 border-amber-300 flex flex-col items-center justify-between p-5 shadow-2xl shadow-amber-950/80 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
              <span className="text-2xl md:text-3xl font-black text-amber-200">1위 👑</span>
              <div className="text-center relative z-10">
                <span className="text-5xl md:text-7xl font-black text-white drop-shadow-lg">
                  🥪 {first.completedSandos.length}
                </span>
                <span className="block text-xs md:text-sm text-amber-200 font-extrabold mt-1">
                  완성 산도
                </span>
              </div>
              <span className="text-xs md:text-sm font-black text-amber-950 bg-amber-300 px-4 py-1 rounded-full shadow-md relative z-10">
                산도 우선 선택권!
              </span>
            </div>
          </div>
        )}

        {/* 3rd Place */}
        {third && (
          <div className="flex flex-col items-center">
            <div className="text-center mb-3">
              <span className="text-sm md:text-lg font-bold text-amber-200">{third.name}</span>
              <div className="text-xs md:text-sm text-stone-400 font-semibold">총 {third.points}P ({third.currentPoints}/100P)</div>
            </div>
            <div className="w-full h-36 md:h-52 rounded-3xl bg-gradient-to-t from-stone-900 to-amber-950 border-t-8 border-amber-700 flex flex-col items-center justify-between p-4 shadow-2xl">
              <span className="text-lg md:text-xl font-black text-amber-500">3위 🥉</span>
              <div className="text-center">
                <span className="text-3xl md:text-5xl font-black text-white">🥪 {third.completedSandos.length}</span>
                <span className="block text-xs md:text-sm text-stone-400 mt-1">완성 산도</span>
              </div>
              <span className="text-xs md:text-sm font-bold text-amber-300 bg-stone-800/80 px-3 py-1 rounded-full">
                3등 수제산도
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom News Ticker / Latest Activity */}
      <div className="relative z-10 bg-stone-900/90 rounded-2xl p-4 border border-stone-800 flex items-center gap-3">
        <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 text-xs font-black shrink-0 flex items-center gap-1">
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          실시간 현장 속보
        </span>
        <div className="text-sm font-bold text-white truncate">
          {latestEvent || '🔥 각 구역 미션 활발히 수행 중! 100POINT를 향해 달려가는 중입니다!'}
        </div>
      </div>
    </div>
  );
};

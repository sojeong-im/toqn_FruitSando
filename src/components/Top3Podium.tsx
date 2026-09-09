import React from 'react';
import { District } from '../types';
import { Crown, Trophy, Medal, Sparkles, ChevronUp, Flame } from 'lucide-react';

interface Top3PodiumProps {
  districts: District[];
  onSelectDistrict: (districtId: number) => void;
  activeDistrictId: number;
}

export const Top3Podium: React.FC<Top3PodiumProps> = ({
  districts,
  onSelectDistrict,
  activeDistrictId,
}) => {
  // Sort districts: 1st by completedSandos count (desc), 2nd by total cumulative points (desc)
  const sortedDistricts = [...districts].sort((a, b) => {
    if (b.completedSandos.length !== a.completedSandos.length) {
      return b.completedSandos.length - a.completedSandos.length;
    }
    return b.points - a.points;
  });

  const firstPlace = sortedDistricts[0];
  const secondPlace = sortedDistricts[1];
  const thirdPlace = sortedDistricts[2];
  const restDistricts = sortedDistricts.slice(3);

  return (
    <div className="rounded-3xl bg-gradient-to-b from-stone-900 to-stone-950 p-5 md:p-7 text-white shadow-2xl border border-amber-500/30 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-96 h-40 bg-amber-500/15 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-rose-500/10 blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="text-center mb-6 relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-black tracking-wider uppercase mb-2">
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          TOP 3 우승 쟁탈 랭킹
        </div>
        <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center justify-center gap-2">
          🏆 명예의 산도 시상대
        </h2>
        <p className="text-stone-400 text-xs md:text-sm mt-1">
          가장 많은 열매산도를 완성한 <strong className="text-amber-300">상위 3개 구역</strong>에게 찾기팀 수제 과일산도 증정!
        </p>
      </div>

      {/* 🏅 TOP 3 PODIUM DISPLAY */}
      <div className="grid grid-cols-3 gap-2 md:gap-4 items-end max-w-2xl mx-auto pt-8 pb-4 relative z-10">
        {/* 2nd Place (Silver) */}
        {secondPlace && (
          <div
            onClick={() => onSelectDistrict(secondPlace.id)}
            className={`cursor-pointer group flex flex-col items-center transition-transform hover:-translate-y-1.5 ${
              activeDistrictId === secondPlace.id ? 'scale-105' : ''
            }`}
          >
            <div className="flex flex-col items-center mb-2">
              <span className="p-2 rounded-full bg-stone-700/80 border-2 border-stone-300 text-stone-200 shadow-md">
                <Medal className="w-5 h-5 md:w-6 md:h-6 text-stone-200" />
              </span>
              <span className="text-xs md:text-sm font-bold mt-1 text-stone-200 truncate max-w-[90px] md:max-w-none">
                {secondPlace.name}
              </span>
              <span className="text-[11px] text-stone-400">총 {secondPlace.points}P</span>
            </div>

            {/* Silver Pedestal */}
            <div className="w-full h-32 md:h-40 rounded-2xl bg-gradient-to-t from-stone-800 to-stone-700/90 border-t-4 border-stone-300 flex flex-col items-center justify-between p-3 shadow-lg group-hover:border-stone-100 transition-colors">
              <span className="text-lg md:text-xl font-black text-stone-300">2위</span>
              <div className="flex flex-col items-center">
                <span className="text-2xl md:text-3xl font-black text-white group-hover:scale-110 transition-transform">
                  🥪 {secondPlace.completedSandos.length}
                </span>
                <span className="text-[11px] text-stone-400 font-semibold mt-0.5">
                  진행중 {secondPlace.currentPoints}P
                </span>
              </div>
              <span className="text-[10px] text-stone-400 bg-stone-900/60 px-2 py-0.5 rounded-full">🥈 은빛 산도</span>
            </div>
          </div>
        )}

        {/* 1st Place (Gold) - Champion */}
        {firstPlace && (
          <div
            onClick={() => onSelectDistrict(firstPlace.id)}
            className={`cursor-pointer group flex flex-col items-center transition-transform hover:-translate-y-2 ${
              activeDistrictId === firstPlace.id ? 'scale-105' : ''
            }`}
          >
            {/* Crown & Avatar */}
            <div className="flex flex-col items-center mb-2 relative">
              <div className="absolute -top-6 animate-bounce">
                <Crown className="w-8 h-8 md:w-9 md:h-9 text-amber-400 fill-amber-400 filter drop-shadow-[0_0_8px_#f59e0b]" />
              </div>
              <span className="p-2.5 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-400 border-2 border-amber-200 text-stone-950 shadow-xl mt-2">
                <Trophy className="w-6 h-6 md:w-7 md:h-7 text-amber-950" />
              </span>
              <span className="text-sm md:text-base font-black mt-1 text-amber-300 truncate max-w-[100px] md:max-w-none flex items-center gap-1">
                {firstPlace.name}
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              </span>
              <span className="text-xs text-amber-200/80 font-semibold">총 {firstPlace.points}P</span>
            </div>

            {/* Gold Pedestal */}
            <div className="w-full h-44 md:h-52 rounded-2xl bg-gradient-to-t from-amber-950/90 via-amber-800/80 to-amber-600 border-t-4 border-amber-300 flex flex-col items-center justify-between p-3.5 shadow-2xl shadow-amber-950/60 group-hover:border-amber-200 transition-all relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
              <span className="text-xl md:text-2xl font-black text-amber-200">1위 👑</span>
              <div className="flex flex-col items-center relative z-10">
                <span className="text-3xl md:text-4xl font-black text-white group-hover:scale-110 transition-transform">
                  🥪 {firstPlace.completedSandos.length}
                </span>
                <span className="text-xs text-amber-200 font-bold mt-1">
                  진행중 {firstPlace.currentPoints}P
                </span>
              </div>
              <span className="text-[11px] text-amber-950 font-black bg-amber-300 px-2.5 py-0.5 rounded-full shadow-sm relative z-10">
                산도 우선 선택권!
              </span>
            </div>
          </div>
        )}

        {/* 3rd Place (Bronze) */}
        {thirdPlace && (
          <div
            onClick={() => onSelectDistrict(thirdPlace.id)}
            className={`cursor-pointer group flex flex-col items-center transition-transform hover:-translate-y-1.5 ${
              activeDistrictId === thirdPlace.id ? 'scale-105' : ''
            }`}
          >
            <div className="flex flex-col items-center mb-2">
              <span className="p-2 rounded-full bg-amber-900/60 border-2 border-amber-700 text-amber-400 shadow-md">
                <Medal className="w-5 h-5 md:w-6 md:h-6 text-amber-500" />
              </span>
              <span className="text-xs md:text-sm font-bold mt-1 text-amber-200 truncate max-w-[90px] md:max-w-none">
                {thirdPlace.name}
              </span>
              <span className="text-[11px] text-stone-400">총 {thirdPlace.points}P</span>
            </div>

            {/* Bronze Pedestal */}
            <div className="w-full h-28 md:h-36 rounded-2xl bg-gradient-to-t from-stone-900 to-amber-950/80 border-t-4 border-amber-700 flex flex-col items-center justify-between p-3 shadow-lg group-hover:border-amber-500 transition-colors">
              <span className="text-base md:text-lg font-black text-amber-500">3위</span>
              <div className="flex flex-col items-center">
                <span className="text-2xl md:text-3xl font-black text-white group-hover:scale-110 transition-transform">
                  🥪 {thirdPlace.completedSandos.length}
                </span>
                <span className="text-[11px] text-stone-400 font-semibold mt-0.5">
                  진행중 {thirdPlace.currentPoints}P
                </span>
              </div>
              <span className="text-[10px] text-amber-400 bg-stone-900/60 px-2 py-0.5 rounded-full">🥉 동빛 산도</span>
            </div>
          </div>
        )}
      </div>

      {/* Prize Notice Ribbon */}
      <div className="mt-4 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center gap-2 text-center">
        <Flame className="w-4 h-4 text-amber-400 shrink-0" />
        <span className="text-xs md:text-sm font-bold text-amber-200">
          동점일 경우 <span className="underline underline-offset-2">누적 총 POINT가 높은 구역</span>이 우선 선발됩니다!
        </span>
      </div>

      {/* Remaining Districts Leaderboard */}
      {restDistricts.length > 0 && (
        <div className="mt-6 pt-5 border-t border-stone-800">
          <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">
            전체 구역 순위표 (4위 ~ {districts.length}위)
          </h4>
          <div className="space-y-2">
            {restDistricts.map((d, index) => {
              const rank = index + 4;
              const isSelected = activeDistrictId === d.id;
              return (
                <div
                  key={d.id}
                  onClick={() => onSelectDistrict(d.id)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-amber-500/20 border border-amber-400/50'
                      : 'bg-stone-800/60 hover:bg-stone-800 border border-stone-700/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-center font-bold text-stone-400 text-sm">{rank}위</span>
                    <div>
                      <span className="font-bold text-white text-sm">{d.name}</span>
                      <span className="text-xs text-stone-400 ml-2">({d.leader})</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <span className="text-sm font-black text-amber-400">🥪 {d.completedSandos.length}개</span>
                      <span className="text-xs text-stone-400 ml-2">({d.currentPoints}/100P)</span>
                    </div>
                    <span className="text-xs text-stone-400 font-semibold w-16 text-right">총 {d.points}P</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

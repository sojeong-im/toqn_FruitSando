import React from 'react';
import { District } from '../types';
import { Trophy, Medal } from 'lucide-react';

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
    <div className="rounded-3xl bg-white p-5 sm:p-6 shadow-md border border-amber-200/80">
      {/* Header */}
      <div className="text-center mb-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/70 text-amber-900 text-xs font-bold mb-1.5">
          <Trophy className="w-3.5 h-3.5 text-amber-700" />
          <span>실시간 구역 랭킹</span>
        </div>
        <h3 className="text-xl font-black text-stone-900">
          우승 경쟁 현황
        </h3>
        <p className="text-xs text-stone-500 mt-0.5">
          완성된 산도 개수 기준 (동점 시 누적 포인트 반영)
        </p>
      </div>

      {/* TOP 3 Podium in warm, clean style */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 items-end max-w-lg mx-auto pt-4 pb-3">
        {/* 2nd Place */}
        {secondPlace && (
          <div
            onClick={() => onSelectDistrict(secondPlace.id)}
            className={`cursor-pointer flex flex-col items-center transition-all ${
              activeDistrictId === secondPlace.id ? 'scale-105' : ''
            }`}
          >
            <div className="text-center mb-1.5">
              <span className="text-xs font-bold text-stone-700 truncate block max-w-[80px]">
                {secondPlace.name}
              </span>
              <span className="text-[10px] text-stone-400">{secondPlace.points}P</span>
            </div>

            <div className="w-full h-24 sm:h-28 rounded-2xl bg-stone-100 border border-stone-300 flex flex-col items-center justify-between p-2 shadow-sm">
              <span className="text-xs font-bold text-stone-500">2위</span>
              <div className="text-center">
                <span className="text-xl sm:text-2xl font-black text-stone-800">
                  {secondPlace.completedSandos.length}개
                </span>
                <span className="block text-[10px] text-stone-400">
                  {secondPlace.currentPoints}/100P
                </span>
              </div>
              <span className="text-[9px] font-semibold text-stone-500 bg-white px-2 py-0.5 rounded-full border border-stone-200">
                수제산도
              </span>
            </div>
          </div>
        )}

        {/* 1st Place (Winner) */}
        {firstPlace && (
          <div
            onClick={() => onSelectDistrict(firstPlace.id)}
            className={`cursor-pointer flex flex-col items-center transition-all ${
              activeDistrictId === firstPlace.id ? 'scale-105' : ''
            }`}
          >
            <div className="text-center mb-1.5">
              <span className="inline-block px-2 py-0.5 rounded-full bg-amber-400 text-stone-950 text-[10px] font-black mb-0.5">
                1위
              </span>
              <span className="text-xs sm:text-sm font-black text-stone-900 truncate block max-w-[90px]">
                {firstPlace.name}
              </span>
              <span className="text-[11px] font-bold text-amber-800">{firstPlace.points}P</span>
            </div>

            <div className="w-full h-32 sm:h-36 rounded-2xl bg-gradient-to-t from-amber-100 to-amber-50 border-2 border-amber-400 flex flex-col items-center justify-between p-2.5 shadow-md">
              <span className="text-xs font-black text-amber-900">우승 후보</span>
              <div className="text-center">
                <span className="text-2xl sm:text-3xl font-black text-amber-950">
                  {firstPlace.completedSandos.length}개
                </span>
                <span className="block text-[10px] text-amber-800 font-bold">
                  {firstPlace.currentPoints}/100P
                </span>
              </div>
              <span className="text-[10px] font-black text-amber-900 bg-amber-300 px-2.5 py-0.5 rounded-full">
                우선 선택권
              </span>
            </div>
          </div>
        )}

        {/* 3rd Place */}
        {thirdPlace && (
          <div
            onClick={() => onSelectDistrict(thirdPlace.id)}
            className={`cursor-pointer flex flex-col items-center transition-all ${
              activeDistrictId === thirdPlace.id ? 'scale-105' : ''
            }`}
          >
            <div className="text-center mb-1.5">
              <span className="text-xs font-bold text-stone-700 truncate block max-w-[80px]">
                {thirdPlace.name}
              </span>
              <span className="text-[10px] text-stone-400">{thirdPlace.points}P</span>
            </div>

            <div className="w-full h-20 sm:h-24 rounded-2xl bg-stone-100 border border-stone-200 flex flex-col items-center justify-between p-2 shadow-sm">
              <span className="text-xs font-bold text-stone-400">3위</span>
              <div className="text-center">
                <span className="text-lg sm:text-xl font-black text-stone-800">
                  {thirdPlace.completedSandos.length}개
                </span>
                <span className="block text-[10px] text-stone-400">
                  {thirdPlace.currentPoints}/100P
                </span>
              </div>
              <span className="text-[9px] font-semibold text-stone-500 bg-white px-2 py-0.5 rounded-full border border-stone-200">
                수제산도
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Leaderboard Table for other districts */}
      {restDistricts.length > 0 && (
        <div className="mt-4 pt-4 border-t border-stone-100 space-y-1.5">
          {restDistricts.map((d, index) => {
            const rank = index + 4;
            const isSelected = activeDistrictId === d.id;
            return (
              <div
                key={d.id}
                onClick={() => onSelectDistrict(d.id)}
                className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer text-xs transition-colors ${
                  isSelected
                    ? 'bg-amber-100 text-stone-900 font-bold'
                    : 'bg-stone-50 hover:bg-stone-100 text-stone-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 text-center font-bold text-stone-400">{rank}위</span>
                  <span className="font-semibold text-stone-800">{d.name}</span>
                  <span className="text-[11px] text-stone-400">({d.leader})</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-bold text-stone-900">산도 {d.completedSandos.length}개</span>
                  <span className="text-stone-400 font-medium">총 {d.points}P</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

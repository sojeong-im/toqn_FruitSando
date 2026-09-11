import React, { useState } from 'react';
import { District } from '../types';
import { sounds } from '../utils/soundEffects';
import { ArrowLeft, Sparkles, CheckCircle2, Trophy } from 'lucide-react';

interface TeamDistrictPickerProps {
  districts: District[];
  onSelectDistrictAndStart: (districtId: string) => void;
  onBackToPoster: () => void;
}

export const TeamDistrictPicker: React.FC<TeamDistrictPickerProps> = ({
  districts,
  onSelectDistrictAndStart,
  onBackToPoster,
}) => {
  const [selectedTeam, setSelectedTeam] = useState<number>(1);

  const teams = [
    { number: 1, name: '1팀', emoji: '🍓', color: 'from-rose-500 to-red-500' },
    { number: 2, name: '2팀', emoji: '🥝', color: 'from-lime-500 to-emerald-500' },
    { number: 3, name: '3팀', emoji: '🍊', color: 'from-amber-500 to-orange-500' },
    { number: 4, name: '4팀', emoji: '🍇', color: 'from-purple-500 to-indigo-500' },
    { number: 5, name: '5팀', emoji: '🥭', color: 'from-yellow-500 to-amber-500' },
    { number: 6, name: '6팀', emoji: '🫐', color: 'from-blue-500 to-cyan-500' },
  ];

  const currentTeamDistricts = districts.filter((d) => d.team === selectedTeam);

  const handleDistrictClick = (districtId: string) => {
    sounds.playFruitPop();
    onSelectDistrictAndStart(districtId);
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] p-4 sm:p-6 md:p-10 flex flex-col justify-between animate-popIn">
      <div className="max-w-3xl mx-auto w-full space-y-6">
        {/* Top Header with Back to Poster button */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBackToPoster}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white hover:bg-stone-100 text-stone-700 font-bold text-xs sm:text-sm shadow-sm border border-stone-200 transition-all hover:-translate-x-0.5"
          >
            <ArrowLeft className="w-4 h-4 text-amber-600" />
            <span>포스터로 돌아가기</span>
          </button>

          <span className="text-xs font-black px-3 py-1 bg-amber-100 text-amber-900 rounded-full border border-amber-300">
            총 30개 구역 참가
          </span>
        </div>

        {/* Title Banner */}
        <div className="text-center space-y-2 pt-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/10 text-amber-800 text-xs font-black border border-amber-300/60">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>새신자부 열매산도 쟁탈전</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-stone-900 tracking-tight">
            우리 팀 & 구역을 선택해주세요! 🥪
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 font-medium">
            구역을 누르면 <strong className="text-amber-700 font-black">미션 선택 창이 바로 열립니다.</strong>
          </p>
        </div>

        {/* Team Selection Tabs (1팀 ~ 6팀) */}
        <div className="bg-white p-3 rounded-3xl border border-amber-200 shadow-sm">
          <div className="text-[11px] font-bold text-stone-400 mb-2 px-1">팀 선택:</div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {teams.map((t) => {
              const isSelected = selectedTeam === t.number;
              const teamDistricts = districts.filter((d) => d.team === t.number);
              const totalSandos = teamDistricts.reduce((acc, d) => acc + d.completedSandos.length, 0);

              return (
                <button
                  key={t.number}
                  type="button"
                  onClick={() => {
                    sounds.playFruitPop();
                    setSelectedTeam(t.number);
                  }}
                  className={`p-3 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 border-2 ${
                    isSelected
                      ? 'bg-stone-900 text-white border-stone-900 shadow-md scale-105'
                      : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border-stone-200 hover:border-amber-300'
                  }`}
                >
                  <span className="text-xl sm:text-2xl mb-1">{t.emoji}</span>
                  <span className="text-sm font-black">{t.name}</span>
                  <span className={`text-[10px] mt-0.5 font-semibold ${isSelected ? 'text-amber-300' : 'text-stone-400'}`}>
                    산도 {totalSandos}개
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Districts Grid for Selected Team */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm sm:text-base font-black text-stone-800 flex items-center gap-1.5">
              <span>{teams.find((t) => t.number === selectedTeam)?.emoji}</span>
              <span>{selectedTeam}팀 소속 구역 목록</span>
            </h2>
            <span className="text-xs text-stone-500 font-medium">클릭 시 미션 선택창 자동 오픈</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {currentTeamDistricts.map((d) => {
              const sandosCount = d.completedSandos.length;
              return (
                <button
                  key={d.id}
                  onClick={() => handleDistrictClick(d.id)}
                  className="p-4 rounded-2xl bg-white hover:bg-amber-50/50 border-2 border-amber-200 hover:border-amber-500 shadow-sm hover:shadow-md transition-all text-left flex flex-col justify-between group relative overflow-hidden"
                >
                  {/* Subtle top decoration bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-orange-400 opacity-80" />

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-base sm:text-lg font-black text-stone-900 group-hover:text-amber-800 transition-colors">
                        {d.name}
                      </span>
                    </div>
                    <span className="text-[11px] font-black px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                      {d.currentPoints}P
                    </span>
                  </div>

                  {/* Sando stats & Progress */}
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between text-xs text-stone-600 font-medium">
                      <span>완성된 열매산도</span>
                      <strong className="text-stone-900 font-bold">{sandosCount}개</strong>
                    </div>
                    <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, d.currentPoints)}%` }}
                      />
                    </div>
                  </div>

                  {/* Action CTA inside card */}
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs font-black text-amber-800 group-hover:text-amber-900">
                    <span>미션 인증하러 가기</span>
                    <span className="text-amber-500 group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* All 30 Districts Quick Sheet (Accordion / Bottom Grid) */}
        <div className="bg-[#F3EDE2] p-4 sm:p-5 rounded-3xl border border-amber-200/80 text-center">
          <p className="text-xs text-stone-600 font-semibold mb-3">
            혹시 다른 팀이신가요? 번호로 바로 선택하기:
          </p>
          <div className="flex flex-wrap justify-center gap-1.5 max-w-xl mx-auto">
            {districts.map((d) => (
              <button
                key={d.id}
                onClick={() => handleDistrictClick(d.id)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  d.team === selectedTeam
                    ? 'bg-amber-500 text-white font-black shadow-sm'
                    : 'bg-white text-stone-700 hover:bg-amber-100 border border-amber-200/60'
                }`}
              >
                {d.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer info */}
      <footer className="mt-8 text-center text-xs text-stone-400 py-3">
        새신자부 찾기팀 열매산도 쟁탈전 • 100POINT마다 열매산도 1개 완성!
      </footer>
    </div>
  );
};

import React, { useState } from 'react';
import { District } from '../types';
import { Calendar, Clock, Trophy, Info, X, Check } from 'lucide-react';

interface EventHeaderProps {
  districts: District[];
  activeDistrictId: string;
  onSelectDistrict: (id: string) => void;
}

export const EventHeader: React.FC<EventHeaderProps> = ({
  districts,
  activeDistrictId,
  onSelectDistrict,
}) => {
  const [showNoticeModal, setShowNoticeModal] = useState(false);

  // Active district object
  const activeDistrict = districts.find((d) => d.id === activeDistrictId) || districts[0];

  // Derive current team (1 ~ 6) from active district id (e.g. '3-2' -> team 3)
  const activeTeamNumber = parseInt(activeDistrictId.split('-')[0], 10) || 1;
  const [selectedTeamTab, setSelectedTeamTab] = useState<number>(activeTeamNumber);

  // Teams list 1 ~ 6
  const teams = [1, 2, 3, 4, 5, 6];

  // Districts belonging to the selected team tab
  const currentTeamDistricts = districts.filter((d) => d.team === selectedTeamTab);

  return (
    <header className="mb-6">
      {/* Poster-centered Hero Banner */}
      <div className="rounded-3xl bg-white p-5 sm:p-6 shadow-md border border-amber-200/80 flex flex-col md:flex-row items-center gap-6">
        {/* Actual Poster Image */}
        <div className="w-full md:w-52 max-w-[220px] shrink-0 rounded-2xl overflow-hidden shadow-lg border-2 border-amber-300">
          <img
            src="/poster.jpg"
            alt="새신자부 열매산도 쟁탈전 공식 포스터"
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Event Information & Context */}
        <div className="flex-1 text-center md:text-left space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-stone-700 text-xs font-semibold">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-amber-600" />
              43.9.12 (토)
            </span>
            <span className="text-stone-300">•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              하루 종일 ~ 21시 마감
            </span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-stone-900 tracking-tight">
              새신자부 열매산도 쟁탈전
            </h1>
            <p className="text-amber-800 text-sm sm:text-base font-bold mt-1">
              미션을 수행하고 우리 구역의 열매산도를 완성하라!
            </p>
          </div>

          <p className="text-xs sm:text-sm text-stone-500 max-w-xl leading-relaxed">
            총 30개 구역(1-1 ~ 6-5) 참여! 미션 성공으로 <strong className="text-amber-900 font-bold">100POINT</strong>가 모일 때마다 
            포스터 속 수제 과일산도 1개가 완성됩니다.
          </p>

          <div className="pt-1 flex flex-wrap items-center justify-center md:justify-start gap-2">
            <button
              onClick={() => setShowNoticeModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold transition-colors"
            >
              <Info className="w-3.5 h-3.5 text-amber-700" />
              <span>공식 요강 & 상품 안내</span>
            </button>
            <span className="text-xs text-stone-400 font-medium px-2.5 py-1 bg-stone-100 rounded-lg">
              발신: 새신자부 찾기팀
            </span>
          </div>
        </div>
      </div>

      {/* 30 Districts Smart Selector */}
      <div className="mt-4 bg-white p-4 rounded-3xl border border-amber-200 shadow-sm space-y-3">
        {/* Active District Status Ribbon */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-500">현재 선택된 구역:</span>
            <span className="px-3 py-1 rounded-xl bg-amber-500 text-white font-black text-sm shadow-sm flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" />
              {activeDistrict.name}
            </span>
          </div>

          {/* Quick jump select dropdown for all 30 groups */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-stone-400">빠른 이동:</span>
            <select
              value={activeDistrictId}
              onChange={(e) => {
                const newId = e.target.value;
                onSelectDistrict(newId);
                const team = parseInt(newId.split('-')[0], 10);
                if (team) setSelectedTeamTab(team);
              }}
              className="bg-stone-50 border border-stone-200 text-xs font-bold text-stone-800 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-amber-400"
            >
              {districts.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} (산도 {d.completedSandos.length}개 / {d.currentPoints}P)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 1. Team Tabs (1팀 ~ 6팀) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-bold text-stone-400 pr-1 shrink-0">팀 선택:</span>
          {teams.map((teamNum) => {
            const isCurrentTeam = selectedTeamTab === teamNum;
            return (
              <button
                key={teamNum}
                onClick={() => setSelectedTeamTab(teamNum)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                  isCurrentTeam
                    ? 'bg-stone-900 text-white shadow-sm'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                }`}
              >
                {teamNum}팀
              </button>
            );
          })}
        </div>

        {/* 2. Sub-districts for selected team (e.g. 1-1, 1-2, 1-3, 1-4, 1-5) */}
        <div className="grid grid-cols-5 gap-1.5 sm:gap-2 pt-1">
          {currentTeamDistricts.map((d) => {
            const isSelected = activeDistrictId === d.id;
            return (
              <button
                key={d.id}
                onClick={() => onSelectDistrict(d.id)}
                className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-0.5 ${
                  isSelected
                    ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                    : 'bg-amber-50/70 hover:bg-amber-100 text-stone-800 border border-amber-200/60'
                }`}
              >
                <span className="text-xs font-extrabold">{d.name.replace('구역', '')}</span>
                <span
                  className={`text-[10px] font-semibold ${
                    isSelected ? 'text-amber-100' : 'text-amber-800'
                  }`}
                >
                  산도 {d.completedSandos.length}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Official Announcement Modal */}
      {showNoticeModal && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowNoticeModal(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-stone-200 relative animate-popIn"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowNoticeModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
                공식 행사 공지
              </span>
              <h3 className="text-xl font-black text-stone-900 mt-2">새신자부 열매산도 쟁탈전</h3>
              <p className="text-xs text-stone-500 mt-0.5">발신: 새신자부 찾기팀 | 수신: 새신자부 전성도</p>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-stone-700 bg-stone-50 p-4 rounded-2xl border border-stone-200 leading-relaxed">
              <div>
                <strong className="text-stone-900 block font-bold mb-1">일정 안내</strong>
                <p>• 날짜: 43.9.12 (토)</p>
                <p>• 시간: 하루 종일 ~ 21시 마감</p>
                <p>• 대상: 1-1 ~ 6-5 전 구역</p>
              </div>

              <div>
                <strong className="text-stone-900 block font-bold mb-1">진행 방식</strong>
                <p>1. 공개된 미션 확인 후 구역별로 미션 수행</p>
                <p>2. 미션 성공 후 '과일산도판' 인증 (100P마다 산도 1개 완성)</p>
              </div>

              <div className="p-3 bg-amber-100/60 rounded-xl border border-amber-200">
                <strong className="text-stone-900 flex items-center gap-1 font-bold mb-1">
                  <Trophy className="w-4 h-4 text-amber-600" />
                  최종 우승 상품
                </strong>
                <p className="font-semibold text-stone-800">• 1위 구역: 수제 과일산도 우선 선택권</p>
                <p className="font-semibold text-stone-800">• 2위 구역: 수제 과일산도</p>
                <p className="font-semibold text-stone-800">• 3위 구역: 수제 과일산도</p>
                <p className="text-[11px] text-stone-500 mt-1">
                  찾기팀이 직접 만들어주는 스페셜 수제 과일산도 증정
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowNoticeModal(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-stone-900 hover:bg-black text-white font-bold text-sm"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

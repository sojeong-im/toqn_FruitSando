import React, { useState } from 'react';
import { District } from '../types';
import { Calendar, Clock, Trophy, Info, X, Check, ArrowLeft } from 'lucide-react';

interface EventHeaderProps {
  districts: District[];
  activeDistrictId: string;
  onSelectDistrict: (id: string) => void;
  onBackToPoster: () => void;
}

export const EventHeader: React.FC<EventHeaderProps> = ({
  districts,
  activeDistrictId,
  onSelectDistrict,
  onBackToPoster,
}) => {
  const [showNoticeModal, setShowNoticeModal] = useState(false);

  const activeDistrict = districts.find((d) => d.id === activeDistrictId) || districts[0];
  const activeTeamNumber = parseInt(activeDistrictId.split('-')[0], 10) || 1;
  const [selectedTeamTab, setSelectedTeamTab] = useState<number>(activeTeamNumber);

  const teams = [1, 2, 3, 4, 5, 6];
  const currentTeamDistricts = districts.filter((d) => d.team === selectedTeamTab);

  return (
    <header className="mb-6 space-y-4">
      {/* Top Compact Navigation & Title Bar */}
      <div className="rounded-3xl bg-white p-4 sm:p-5 shadow-md border border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Back to Poster Button */}
          <button
            onClick={onBackToPoster}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs transition-colors shrink-0 shadow-sm"
            title="포스터 메인 화면으로 돌아가기"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>포스터 보기</span>
          </button>

          <div>
            <h1 className="text-lg sm:text-xl font-black text-stone-900 leading-tight">
              새신자부 열매산도 쟁탈전
            </h1>
            <span className="text-xs text-amber-800 font-semibold">
              100POINT마다 열매산도 1개 완성!
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => setShowNoticeModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors"
          >
            <Info className="w-3.5 h-3.5 text-stone-500" />
            <span>행사 요강</span>
          </button>
          <span className="text-[11px] text-stone-400 font-medium px-2 py-1 bg-stone-50 rounded-lg">
            새신자부 찾기팀
          </span>
        </div>
      </div>

      {/* 30 Districts Smart Selector */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-amber-200 shadow-sm space-y-3">
        {/* Active District Status Ribbon */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-500">현재 보고 있는 구역:</span>
            <span className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-white font-black text-sm shadow-sm flex items-center gap-1.5">
              <Check className="w-4 h-4" />
              {activeDistrict.name}
            </span>
            <span className="text-xs text-stone-500 font-semibold">
              (완성 산도 {activeDistrict.completedSandos.length}개 / {activeDistrict.currentPoints}P)
            </span>
          </div>

          {/* Quick jump select dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-stone-400">빠른 구역 이동:</span>
            <select
              value={activeDistrictId}
              onChange={(e) => {
                const newId = e.target.value;
                onSelectDistrict(newId);
                const team = parseInt(newId.split('-')[0], 10);
                if (team) setSelectedTeamTab(team);
              }}
              className="bg-stone-50 border border-stone-200 text-xs font-bold text-stone-800 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-400"
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
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all shrink-0 ${
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
        <div className="grid grid-cols-5 gap-2 pt-1">
          {currentTeamDistricts.map((d) => {
            const isSelected = activeDistrictId === d.id;
            return (
              <button
                key={d.id}
                onClick={() => onSelectDistrict(d.id)}
                className={`py-2.5 px-1 rounded-2xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-0.5 ${
                  isSelected
                    ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20 scale-105'
                    : 'bg-amber-50/70 hover:bg-amber-100 text-stone-800 border border-amber-200/70'
                }`}
              >
                <span className="text-xs sm:text-sm font-extrabold">{d.name.replace('구역', '')}</span>
                <span
                  className={`text-[10px] sm:text-[11px] font-semibold ${
                    isSelected ? 'text-amber-100' : 'text-amber-800'
                  }`}
                >
                  산도 {d.completedSandos.length}개
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

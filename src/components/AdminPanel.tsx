import React, { useState } from 'react';
import { District } from '../types';
import { Settings, Plus, RotateCcw, Sparkles, Volume2, Monitor, ChevronDown, ChevronUp } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface AdminPanelProps {
  districts: District[];
  activeDistrictId: number;
  onSelectDistrict: (id: number) => void;
  onAddDirectPoints: (districtId: number, points: number) => void;
  onResetAllData: () => void;
  isBroadcastMode: boolean;
  onToggleBroadcastMode: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  districts,
  activeDistrictId,
  onSelectDistrict,
  onAddDirectPoints,
  onResetAllData,
  isBroadcastMode,
  onToggleBroadcastMode,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const activeDistrict = districts.find((d) => d.id === activeDistrictId) || districts[0];

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-stone-900/90 hover:bg-stone-900 text-amber-300 font-bold text-xs shadow-2xl backdrop-blur-md border border-amber-500/40 transition-all hover:scale-105 active:scale-95"
      >
        <Settings className="w-4 h-4 text-amber-400" />
        <span>진행팀 관리자 패널</span>
        {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
      </button>

      {/* Expanded Admin Panel */}
      {isOpen && (
        <div className="absolute bottom-12 right-0 w-80 md:w-96 rounded-3xl bg-stone-900/95 backdrop-blur-xl p-5 text-white shadow-2xl border-2 border-amber-500/40 animate-popIn">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-black text-amber-300">찾기팀 행사 운영도구</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-stone-400 hover:text-white text-xs font-bold"
            >
              닫기
            </button>
          </div>

          {/* District Selector */}
          <div className="mt-3">
            <label className="text-xs text-stone-400 font-medium">관리 대상 구역 선택:</label>
            <select
              value={activeDistrictId}
              onChange={(e) => onSelectDistrict(Number(e.target.value))}
              className="mt-1 w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-xs text-amber-200 font-bold focus:outline-none"
            >
              {districts.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.leader}) - 산도 {d.completedSandos.length}개 / 진행 {d.currentPoints}P
                </option>
              ))}
            </select>
          </div>

          {/* Quick Points Injector */}
          <div className="mt-3">
            <label className="text-xs text-stone-400 font-medium">
              [{activeDistrict.name}] 포인트 즉시 가산:
            </label>
            <div className="grid grid-cols-4 gap-1.5 mt-1.5">
              {[+5, +10, +25, +50, +100].map((pts) => (
                <button
                  key={pts}
                  onClick={() => onAddDirectPoints(activeDistrict.id, pts)}
                  className="py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 text-xs font-black transition-colors"
                >
                  +{pts}P
                </button>
              ))}
            </div>
          </div>

          {/* Mode & Sound Actions */}
          <div className="mt-4 pt-3 border-t border-stone-800 space-y-2">
            <button
              onClick={onToggleBroadcastMode}
              className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                isBroadcastMode
                  ? 'bg-amber-400 text-stone-950 font-black shadow-lg shadow-amber-400/20'
                  : 'bg-stone-800 hover:bg-stone-700 text-stone-300'
              }`}
            >
              <Monitor className="w-4 h-4" />
              <span>{isBroadcastMode ? '일반 모드로 복귀' : '본당 전광판 중계 모드 (빔프로젝터용)'}</span>
            </button>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  sounds.playSlash();
                  setTimeout(() => sounds.playFanfare(), 300);
                }}
                className="flex-1 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-[11px] font-semibold flex items-center justify-center gap-1"
              >
                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                <span>컷팅 사운드 테스트</span>
              </button>

              <button
                onClick={() => {
                  if (window.confirm('모든 점수와 산도를 초기 상태로 리셋하시겠습니까?')) {
                    onResetAllData();
                  }
                }}
                className="py-1.5 px-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-[11px] font-bold border border-rose-500/40 flex items-center justify-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>리셋</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

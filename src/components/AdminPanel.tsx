import React, { useState } from 'react';
import { District } from '../types';
import { Settings, Sparkles, Volume2, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface AdminPanelProps {
  districts: District[];
  activeDistrictId: string;
  onSelectDistrict: (id: string) => void;
  onAddDirectPoints: (districtId: string, points: number) => void;
  onResetAllData: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  districts,
  activeDistrictId,
  onSelectDistrict,
  onAddDirectPoints,
  onResetAllData,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const activeDistrict = districts.find((d) => d.id === activeDistrictId) || districts[0];

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-stone-900/95 hover:bg-black text-amber-300 font-bold text-xs shadow-xl backdrop-blur-md border border-amber-500/40 transition-all"
      >
        <Settings className="w-3.5 h-3.5 text-amber-400" />
        <span>진행팀 관리 패널</span>
        {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
      </button>

      {/* Expanded Admin Panel */}
      {isOpen && (
        <div className="absolute bottom-12 right-0 w-80 sm:w-96 rounded-3xl bg-stone-900/95 backdrop-blur-xl p-5 text-white shadow-2xl border border-stone-700 animate-popIn">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-black text-amber-300">찾기팀 행사 관리</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-stone-400 hover:text-white text-xs font-bold"
            >
              닫기
            </button>
          </div>

          {/* District Selector (30 Groups) */}
          <div className="mt-3">
            <label className="text-xs text-stone-400 font-medium">관리 대상 구역 (총 30개):</label>
            <select
              value={activeDistrictId}
              onChange={(e) => onSelectDistrict(e.target.value)}
              className="mt-1 w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-xs text-amber-200 font-bold focus:outline-none"
            >
              {districts.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} - 산도 {d.completedSandos.length}개 / 진행 {d.currentPoints}P (총 {d.points}P)
                </option>
              ))}
            </select>
          </div>

          {/* Quick Points Injector */}
          <div className="mt-3">
            <label className="text-xs text-stone-400 font-medium">
              [{activeDistrict.name}] 포인트 즉시 가산:
            </label>
            <div className="grid grid-cols-5 gap-1.5 mt-1.5">
              {[+5, +10, +25, +50, +100].map((pts) => (
                <button
                  key={pts}
                  onClick={() => onAddDirectPoints(activeDistrict.id, pts)}
                  className="py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 text-xs font-black transition-colors"
                >
                  +{pts}
                </button>
              ))}
            </div>
          </div>

          {/* Sound & Reset Actions */}
          <div className="mt-4 pt-3 border-t border-stone-800 flex gap-2">
            <button
              onClick={() => {
                sounds.playSlash();
                setTimeout(() => sounds.playFanfare(), 300);
              }}
              className="flex-1 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-400" />
              <span>사운드 테스트</span>
            </button>

            <button
              onClick={() => {
                if (window.confirm('모든 점수와 산도를 초기 상태로 리셋하시겠습니까?')) {
                  onResetAllData();
                }
              }}
              className="py-2 px-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold border border-rose-500/40 flex items-center justify-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>리셋</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

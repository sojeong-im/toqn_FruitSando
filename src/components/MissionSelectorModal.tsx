import React, { useState } from 'react';
import { Mission, MissionCategory, District } from '../types';
import { OFFICIAL_MISSIONS } from '../utils/missions';
import { X, User, Check, Gift } from 'lucide-react';

interface MissionSelectorModalProps {
  district: District;
  onClose: () => void;
  onSelectForScratch: (mission: Mission, contributorName: string) => void;
  onQuickApply: (mission: Mission, contributorName: string) => void;
}

export const MissionSelectorModal: React.FC<MissionSelectorModalProps> = ({
  district,
  onClose,
  onSelectForScratch,
  onQuickApply,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<MissionCategory | '전체'>('전체');
  const [contributor, setContributor] = useState<string>(district.members[0]?.name || '');
  const [customName, setCustomName] = useState<string>('');

  const categories: (MissionCategory | '전체')[] = ['전체', '노방', '지인', '팀/소모임', '개척', '찾기', '특별'];

  const filteredMissions = selectedCategory === '전체'
    ? OFFICIAL_MISSIONS
    : OFFICIAL_MISSIONS.filter((m) => m.category === selectedCategory);

  const activeContributorName = customName.trim() || contributor || '구역원';

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-lg w-full max-h-[88vh] flex flex-col shadow-2xl border border-stone-200 relative animate-popIn">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div>
            <span className="text-xs font-bold text-amber-800">
              {district.name} 미션 인증
            </span>
            <h3 className="text-lg sm:text-xl font-black text-stone-900 mt-0.5">
              공식 미션 점수표
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Member Selector (간결하게) */}
        <div className="my-3 p-3 rounded-2xl bg-stone-50 border border-stone-200">
          <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700 mb-2">
            <User className="w-3.5 h-3.5 text-stone-500" />
            <span>수행자 선택 (새신자/구역원):</span>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-2">
            {district.members.map((m) => (
              <button
                key={m.name}
                type="button"
                onClick={() => {
                  setContributor(m.name);
                  setCustomName('');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  contributor === m.name && !customName
                    ? 'bg-amber-500 text-white shadow-sm font-bold'
                    : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                {m.name}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="직접 입력 (예: 새신자 민우)"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            className="w-full text-xs px-3 py-2 rounded-xl bg-white border border-stone-200 focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex gap-1 overflow-x-auto pb-2 mb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Missions List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {filteredMissions.map((m) => (
            <div
              key={m.id}
              className="p-3 rounded-2xl bg-white hover:bg-amber-50/40 border border-stone-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-sm"
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-600">
                    {m.category}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-stone-900">{m.title}</h4>
                </div>
                {m.description && (
                  <p className="text-[11px] text-stone-400 mt-0.5">{m.description}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 shrink-0">
                <span className="text-xs sm:text-sm font-black text-amber-900 bg-amber-100 px-2 py-1 rounded-lg">
                  +{m.points}P
                </span>

                <button
                  onClick={() => onSelectForScratch(m, activeContributorName)}
                  className="px-2.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-sm flex items-center gap-1"
                >
                  <Gift className="w-3.5 h-3.5" />
                  <span>복권 긁기</span>
                </button>

                <button
                  onClick={() => onQuickApply(m, activeContributorName)}
                  className="px-2.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>바로 적립</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400">
          <span>100POINT마다 열매산도 1개가 완성됩니다.</span>
          <button
            onClick={onClose}
            className="text-stone-600 font-bold hover:underline"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

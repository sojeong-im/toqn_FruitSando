import React, { useState } from 'react';
import { Mission, MissionCategory, District } from '../types';
import { OFFICIAL_MISSIONS } from '../utils/missions';
import { X, Sparkles, User, Check, Gift } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 md:p-4">
      <div className="bg-white rounded-3xl p-5 md:p-7 max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border-2 border-amber-300 relative animate-popIn">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div>
            <span className="text-xs font-bold text-rose-500 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              {district.name} 미션 인증
            </span>
            <h3 className="text-xl font-black text-stone-800 mt-0.5">
              공식 미션 점수표 (과일 획득)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contributor Selector (1인 1재료 / 기여도 장치) */}
        <div className="my-3 p-3 rounded-2xl bg-amber-50/80 border border-amber-200">
          <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700 mb-2">
            <User className="w-3.5 h-3.5 text-amber-600" />
            <span>미션 수행자 (새신자/구역원 이름):</span>
          </div>

          <div className="flex flex-wrap gap-2 mb-2">
            {district.members.map((m) => (
              <button
                key={m.name}
                type="button"
                onClick={() => {
                  setContributor(m.name);
                  setCustomName('');
                }}
                className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                  contributor === m.name && !customName
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'bg-white text-stone-600 hover:bg-rose-50 border border-stone-200'
                }`}
              >
                <span>{m.roleFruit}</span>
                <span>{m.name}</span>
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="직접 입력 (예: 새신자 민우)"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            className="w-full text-xs px-3 py-2 rounded-xl bg-white border border-stone-200 focus:outline-none focus:border-rose-400 font-medium"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-stone-800 text-white shadow-sm'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Missions List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {filteredMissions.map((m) => (
            <div
              key={m.id}
              className="p-3.5 rounded-2xl bg-white hover:bg-amber-50/50 border border-stone-200 hover:border-amber-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl p-1.5 bg-amber-50 rounded-xl">{m.icon}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${m.badgeColor}`}>
                      {m.category}
                    </span>
                    <h4 className="text-sm font-bold text-stone-800">{m.title}</h4>
                  </div>
                  {m.description && (
                    <p className="text-xs text-stone-500 mt-0.5">{m.description}</p>
                  )}
                </div>
              </div>

              {/* Point & Action Buttons */}
              <div className="flex items-center justify-end gap-2 shrink-0">
                <span className="text-base font-black text-rose-600 bg-rose-50 px-2.5 py-1 rounded-xl border border-rose-200">
                  +{m.points}P
                </span>

                {/* 1. Scratch Lottery button */}
                <button
                  onClick={() => onSelectForScratch(m, activeContributorName)}
                  className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-stone-950 text-xs font-extrabold shadow-sm flex items-center gap-1 active:scale-95 transition-all"
                  title="새신자/구역원이 직접 복권을 긁어 점수 확인!"
                >
                  <Gift className="w-3.5 h-3.5" />
                  <span>즉석 복권 긁기</span>
                </button>

                {/* 2. Direct apply button */}
                <button
                  onClick={() => onQuickApply(m, activeContributorName)}
                  className="px-2.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold flex items-center gap-1 active:scale-95 transition-all"
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
          <span>💡 100POINT마다 열매산도 1개가 즉시 조립 및 컷팅됩니다!</span>
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

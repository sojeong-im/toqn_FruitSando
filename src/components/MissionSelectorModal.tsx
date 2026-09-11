import React, { useState } from 'react';
import { Mission, MissionCategory, District } from '../types';
import { OFFICIAL_MISSIONS } from '../utils/missions';
import { X, Check } from 'lucide-react';

interface MissionSelectorModalProps {
  district: District;
  onClose: () => void;
  onQuickApply: (mission: Mission, contributorName: string) => void;
}

export const MissionSelectorModal: React.FC<MissionSelectorModalProps> = ({
  district,
  onClose,
  onQuickApply,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<MissionCategory | '전체'>('전체');

  const categories: (MissionCategory | '전체')[] = ['전체', '노방', '지인', '팀/소모임', '개척', '찾기', '특별'];

  const filteredMissions = selectedCategory === '전체'
    ? OFFICIAL_MISSIONS
    : OFFICIAL_MISSIONS.filter((m) => m.category === selectedCategory);

  const activeContributorName = `${district.name} 구역원`;

  // Category badge colors for visual distinction
  const getCategoryBadgeClass = (category: MissionCategory) => {
    switch (category) {
      case '노방':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case '지인':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case '팀/소모임':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case '개척':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case '찾기':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case '특별':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-3xl p-5 sm:p-7 max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border-2 border-amber-300 relative animate-popIn">
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-3.5 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
                {district.name} 미션 인증
              </span>
              <span className="text-xs text-stone-500 font-medium">100P 달성 시 산도 1개 완성</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-stone-900 mt-1">
              공식 미션 항목 및 점수표
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 🏷️ Prominent Category Filter Tabs Bar */}
        <div className="py-3.5 my-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black text-stone-700">카테고리 선택:</span>
            <span className="text-xs font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              {selectedCategory === '전체' ? '전체 항목' : `${selectedCategory} 미션`} ({filteredMissions.length}개)
            </span>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => {
              const count = cat === '전체' 
                ? OFFICIAL_MISSIONS.length 
                : OFFICIAL_MISSIONS.filter((m) => m.category === cat).length;

              const isSelected = selectedCategory === cat;

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 border-2 ${
                    isSelected
                      ? 'bg-amber-500 text-white border-amber-500 shadow-md scale-105'
                      : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border-stone-200 hover:border-amber-300'
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`text-[11px] px-1.5 py-0.5 rounded-full font-black ${
                    isSelected ? 'bg-black/20 text-white' : 'bg-stone-200/80 text-stone-600'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Spacious, Highly Readable Missions List */}
        <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 py-1">
          {filteredMissions.map((m) => (
            <div
              key={m.id}
              className="p-4 sm:p-5 rounded-2xl bg-white hover:bg-amber-50/30 border-2 border-stone-200 hover:border-amber-400 transition-all shadow-sm flex flex-col gap-3"
            >
              {/* Card Header: Category Badge + Big Point Badge */}
              <div className="flex items-center justify-between gap-2">
                <span className={`text-xs font-black px-2.5 py-1 rounded-lg border ${getCategoryBadgeClass(m.category)}`}>
                  {m.category} 미션
                </span>

                <span className="text-base sm:text-lg font-black text-amber-950 bg-gradient-to-r from-amber-200 to-amber-300 px-3.5 py-1 rounded-xl shadow-inner border border-amber-400">
                  +{m.points} POINT
                </span>
              </div>

              {/* Mission Content: Large bold title and readable description spanning lines freely */}
              <div>
                <h4 className="text-base sm:text-lg font-black text-stone-900 leading-snug break-keep">
                  {m.title}
                </h4>
                {m.description && (
                  <p className="text-xs sm:text-sm text-stone-600 font-medium mt-1.5 leading-relaxed break-keep">
                    {m.description}
                  </p>
                )}
              </div>

              {/* Action Button: Direct Apply */}
              <div className="pt-2.5 border-t border-stone-100 flex items-center justify-end">
                <button
                  onClick={() => onQuickApply(m, activeContributorName)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white text-xs sm:text-sm font-black shadow-sm flex items-center justify-center gap-2 transition-all hover:shadow"
                >
                  <Check className="w-4 h-4 text-white stroke-[3]" />
                  <span>바로 {m.points}P 적립하기</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="mt-3.5 pt-3 border-t border-stone-200 flex items-center justify-between text-xs sm:text-sm text-stone-500">
          <span>과일 100개가 모일 때마다 수제 과일산도가 1개씩 완성됩니다.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

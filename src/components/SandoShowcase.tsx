import React, { useState } from 'react';
import { CompletedSando, District } from '../types';
import { Users } from 'lucide-react';

interface SandoShowcaseProps {
  district: District;
}

export const SandoShowcase: React.FC<SandoShowcaseProps> = ({ district }) => {
  const [selectedSando, setSelectedSando] = useState<CompletedSando | null>(null);

  return (
    <div className="rounded-3xl bg-white p-5 sm:p-6 shadow-md border border-amber-200/80">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-bold text-amber-800">
            {district.name} 산도 컬렉션
          </span>
          <h3 className="text-lg sm:text-xl font-black text-stone-900 mt-0.5">
            완성된 열매산도 진열대
          </h3>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
          총 {district.completedSandos.length}개
        </span>
      </div>

      {/* Empty state */}
      {district.completedSandos.length === 0 ? (
        <div className="py-10 px-4 rounded-2xl bg-stone-50 border border-dashed border-stone-300 text-center">
          <p className="font-bold text-stone-700 text-sm">아직 완성된 산도가 없습니다.</p>
          <p className="text-xs text-stone-400 mt-1">
            100POINT를 모으면 포스터 속 수제 과일산도가 이곳에 진열됩니다.
          </p>
        </div>
      ) : (
        /* Poster Style Clean Wood Board */
        <div className="p-3 sm:p-4 rounded-2xl bg-[#F4EDE2] border border-amber-200">
          <div className="wood-board rounded-2xl p-4 sm:p-5 relative overflow-hidden">
            <div className="text-[11px] font-bold text-amber-200/90 mb-3 flex items-center justify-between">
              <span>원목 진열 도마</span>
              <span className="text-[10px] text-amber-200/70">
                산도를 클릭하면 상세 정보를 볼 수 있습니다
              </span>
            </div>

            {/* Sando Cards on Wood Board */}
            <div className="flex items-end gap-3 sm:gap-4 overflow-x-auto pb-3 pt-2 scrollbar-none">
              {district.completedSandos.map((sando, idx) => {
                const recipe = sando.recipe;
                return (
                  <div
                    key={sando.id || idx}
                    onClick={() => setSelectedSando(sando)}
                    className="cursor-pointer flex flex-col items-center shrink-0 transition-transform duration-300 hover:-translate-y-2 group"
                  >
                    {/* Real Completed Fruit Sando Image */}
                    <div className="relative w-20 sm:w-24 h-28 sm:h-36 flex items-center justify-center">
                      <img
                        src="/completed-sando.png"
                        alt={recipe.name}
                        className="w-full h-full object-contain filter drop-shadow-[0_12px_18px_rgba(0,0,0,0.45)] group-hover:scale-110 transition-transform duration-300"
                      />
                      <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full shadow border border-amber-200">
                        #{idx + 1}
                      </span>
                    </div>

                    {/* Label */}
                    <div className="mt-2 text-center">
                      <p className="text-[11px] font-bold text-amber-100 truncate max-w-[80px] bg-black/45 px-2 py-0.5 rounded-md border border-amber-200/20 shadow-sm">
                        {recipe.name.replace(' 산도', '')}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Sando Detail Modal */}
      {selectedSando && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedSando(null)}
        >
          <div
            className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-stone-200 animate-popIn text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold mb-2">
              #{selectedSando.sandoNumber}번째 완성 산도
            </span>

            {/* Sando Showcase Image in Modal */}
            <div className="relative my-3 flex items-center justify-center">
              <div className="absolute inset-0 bg-amber-200/40 rounded-full blur-xl -m-2" />
              <img
                src="/completed-sando.png"
                alt={selectedSando.recipe.name}
                className="w-32 h-44 object-contain filter drop-shadow-[0_16px_28px_rgba(180,83,9,0.35)] animate-popIn z-10"
              />
            </div>

            <h3 className="text-lg font-black text-stone-900">{selectedSando.recipe.name}</h3>
            <p className="text-xs text-stone-500 mt-1">{selectedSando.recipe.subName}</p>
            <p className="text-xs text-stone-600 mt-3 bg-stone-50 p-3 rounded-xl border border-stone-200">
              "{selectedSando.recipe.description}"
            </p>

            <div className="mt-4 pt-3 border-t border-stone-100 text-xs text-stone-500 flex items-center justify-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-stone-400" />
              <span>함께한 구역원:</span>
              <strong className="text-stone-800">
                {selectedSando.contributors?.join(', ') || '구역원'}
              </strong>
            </div>

            <button
              onClick={() => setSelectedSando(null)}
              className="mt-5 w-full py-2 rounded-xl bg-stone-900 hover:bg-black text-white font-bold text-xs"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

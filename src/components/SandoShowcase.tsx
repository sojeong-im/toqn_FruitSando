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

            {/* Sando Cards */}
            <div className="flex items-end gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-none">
              {district.completedSandos.map((sando, idx) => {
                const recipe = sando.recipe;
                return (
                  <div
                    key={sando.id || idx}
                    onClick={() => setSelectedSando(sando)}
                    className="cursor-pointer flex flex-col items-center shrink-0 transition-transform hover:-translate-y-1.5"
                  >
                    {/* Sando Body */}
                    <div className="w-16 sm:w-20 h-28 sm:h-36 bg-white rounded-t-xl border-x-4 border-t-4 border-[#EAD2B2] shadow-md flex flex-col justify-between overflow-hidden">
                      <div className="w-full h-2 bg-[#D1A066] shrink-0" />
                      <div className="flex-1 w-full bg-white flex flex-col items-center justify-center p-1 text-center">
                        <span className="text-xs font-extrabold text-stone-800">
                          {recipe.fruits[0]?.name}
                        </span>
                        <span className="text-[10px] text-stone-400 mt-0.5">산도</span>
                      </div>
                      <div className="w-full h-2 bg-[#D1A066] shrink-0" />
                    </div>

                    {/* Label */}
                    <div className="mt-1.5 text-center">
                      <span className="text-[10px] font-bold text-amber-200 bg-black/40 px-1.5 py-0.5 rounded">
                        #{idx + 1}
                      </span>
                      <p className="text-[11px] font-semibold text-amber-100 truncate max-w-[70px] mt-0.5">
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

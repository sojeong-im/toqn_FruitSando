import React, { useState } from 'react';
import { CompletedSando, District } from '../types';
import { Sparkles, Users } from 'lucide-react';

interface SandoShowcaseProps {
  district: District;
}

// Visual layout helper representing the upright standing sando slice from the poster
const SandoSliceGraphic: React.FC<{ recipeId: string; fruits: { emoji: string; name: string }[] }> = ({
  recipeId,
  fruits,
}) => {
  // Render slice pattern based on recipe
  if (recipeId === 'mango') {
    // 3 yellow mango cubes in cream
    return (
      <div className="flex flex-col items-center justify-around h-full py-1">
        <div className="w-7 h-7 bg-amber-400 rounded-md shadow-sm border border-amber-500/50 flex items-center justify-center text-xs">🥭</div>
        <div className="w-7 h-7 bg-amber-400 rounded-md shadow-sm border border-amber-500/50 flex items-center justify-center text-xs">🥭</div>
        <div className="w-7 h-7 bg-amber-400 rounded-md shadow-sm border border-amber-500/50 flex items-center justify-center text-xs">🥭</div>
      </div>
    );
  }

  if (recipeId === 'greengrape') {
    // 4 round green grape halves
    return (
      <div className="flex flex-col items-center justify-around h-full py-1">
        <div className="w-7 h-7 bg-emerald-300 rounded-full shadow-sm border border-emerald-400 flex items-center justify-center text-xs">🍇</div>
        <div className="w-7 h-7 bg-emerald-300 rounded-full shadow-sm border border-emerald-400 flex items-center justify-center text-xs">🍇</div>
        <div className="w-7 h-7 bg-emerald-300 rounded-full shadow-sm border border-emerald-400 flex items-center justify-center text-xs">🍇</div>
      </div>
    );
  }

  if (recipeId === 'fig') {
    // 3 round fig slices with pink ruby seeds
    return (
      <div className="flex flex-col items-center justify-around h-full py-1">
        <div className="w-7 h-7 bg-rose-200 rounded-full shadow-sm border-2 border-rose-600 flex items-center justify-center text-xs">🌰</div>
        <div className="w-7 h-7 bg-rose-200 rounded-full shadow-sm border-2 border-rose-600 flex items-center justify-center text-xs">🌰</div>
        <div className="w-7 h-7 bg-rose-200 rounded-full shadow-sm border-2 border-rose-600 flex items-center justify-center text-xs">🌰</div>
      </div>
    );
  }

  if (recipeId === 'tangerine') {
    // Bright orange mandarin segments
    return (
      <div className="flex flex-col items-center justify-around h-full py-1">
        <div className="w-8 h-6 bg-orange-400 rounded-t-full shadow-sm border border-orange-500 flex items-center justify-center text-xs">🍊</div>
        <div className="w-8 h-6 bg-orange-400 rounded-t-full shadow-sm border border-orange-500 flex items-center justify-center text-xs">🍊</div>
        <div className="w-8 h-6 bg-orange-400 rounded-t-full shadow-sm border border-orange-500 flex items-center justify-center text-xs">🍊</div>
      </div>
    );
  }

  if (recipeId === 'strawberry') {
    // 3 fresh red strawberry cuts
    return (
      <div className="flex flex-col items-center justify-around h-full py-1">
        <div className="text-xl filter drop-shadow">🍓</div>
        <div className="text-xl filter drop-shadow">🍓</div>
        <div className="text-xl filter drop-shadow">🍓</div>
      </div>
    );
  }

  // Kiwi & Mango Mix (kiwi wheels + mango cube)
  return (
    <div className="flex flex-col items-center justify-around h-full py-1">
      <div className="w-7 h-7 bg-lime-400 rounded-full shadow-sm border border-lime-600 flex items-center justify-center text-xs">🥝</div>
      <div className="w-7 h-7 bg-amber-400 rounded-md shadow-sm border border-amber-500 flex items-center justify-center text-xs">🥭</div>
      <div className="w-7 h-7 bg-lime-400 rounded-full shadow-sm border border-lime-600 flex items-center justify-center text-xs">🥝</div>
    </div>
  );
};

export const SandoShowcase: React.FC<SandoShowcaseProps> = ({ district }) => {
  const [selectedSando, setSelectedSando] = useState<CompletedSando | null>(null);

  return (
    <div className="rounded-3xl bg-white/95 p-5 md:p-6 shadow-xl border-2 border-amber-200/80">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>포스터 스타일 수제 산도 진열대</span>
          </div>
          <h3 className="text-xl font-black text-stone-800 mt-0.5">
            🥪 {district.name}의 과일산도 도마 진열장
          </h3>
        </div>
        <span className="px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-black">
          총 {district.completedSandos.length}개 보관중
        </span>
      </div>

      {/* Empty State */}
      {district.completedSandos.length === 0 ? (
        <div className="py-12 px-4 rounded-2xl bg-amber-50/60 border border-dashed border-amber-300 text-center flex flex-col items-center justify-center">
          <div className="text-4xl mb-2 animate-pulse">🍞</div>
          <p className="font-bold text-stone-700 text-sm">아직 완성된 열매산도가 없습니다.</p>
          <p className="text-xs text-stone-500 mt-1 max-w-xs">
            100POINT를 달성하여 포스터에 나오는 6가지 명품 과일산도를 도마 위에 진열해보세요!
          </p>
        </div>
      ) : (
        /* Poster Style Wooden Cutting Board on Green Gingham Fabric */
        <div className="p-3 sm:p-5 rounded-2xl gingham-pattern border border-emerald-200 shadow-inner">
          {/* The Rich Wood Board from the Poster */}
          <div className="wood-board rounded-2xl p-4 sm:p-5 relative overflow-hidden">
            <div className="text-[11px] font-black text-amber-200/80 mb-3 flex items-center justify-between">
              <span>🪵 {district.name} 전용 오크 원목 도마</span>
              <span className="text-[10px] bg-amber-950/40 px-2 py-0.5 rounded text-amber-300">
                클릭하면 상세 정보 확인
              </span>
            </div>

            {/* Sandos Standing Upright Side-by-Side */}
            <div className="flex items-end gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-none">
              {district.completedSandos.map((sando, idx) => {
                const recipe = sando.recipe;
                return (
                  <div
                    key={sando.id || idx}
                    onClick={() => setSelectedSando(sando)}
                    className="group cursor-pointer flex flex-col items-center shrink-0 transition-transform hover:-translate-y-2"
                  >
                    {/* Sandos upright rectangle body */}
                    <div className="w-16 sm:w-20 h-32 sm:h-40 bg-white rounded-t-xl border-x-4 border-t-4 border-[#EAD2B2] shadow-2xl flex flex-col justify-between overflow-hidden relative group-hover:border-amber-300">
                      {/* Top bread crust edge */}
                      <div className="w-full h-2 bg-[#D1A066] shrink-0"></div>

                      {/* Pure White Whipped Cream with Fruit Slices */}
                      <div className="flex-1 w-full bg-white flex flex-col items-center justify-center px-1">
                        <SandoSliceGraphic recipeId={recipe.id} fruits={recipe.fruits} />
                      </div>

                      {/* Bottom bread crust edge */}
                      <div className="w-full h-2 bg-[#D1A066] shrink-0"></div>
                    </div>

                    {/* Sando Base Shadow & Label */}
                    <div className="mt-2 text-center">
                      <span className="inline-block px-1.5 py-0.5 rounded-full bg-amber-950/60 text-[10px] font-black text-amber-200">
                        #{idx + 1}
                      </span>
                      <p className="text-[11px] font-extrabold text-amber-100 truncate max-w-[75px] mt-0.5">
                        {recipe.fruits[0]?.name}
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
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedSando(null)}
        >
          <div
            className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border-2 border-amber-400 animate-popIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold mb-2">
                #{selectedSando.sandoNumber}번째 완성 산도
              </span>
              <div className="w-24 h-32 mx-auto my-3 rounded-xl bg-white border-4 border-[#EAD2B2] flex flex-col items-center justify-center shadow-md p-2">
                <SandoSliceGraphic
                  recipeId={selectedSando.recipe.id}
                  fruits={selectedSando.recipe.fruits}
                />
              </div>
              <h3 className="text-xl font-black text-stone-800">{selectedSando.recipe.name}</h3>
              <p className="text-xs text-amber-700 font-bold mt-1">{selectedSando.recipe.subName}</p>
              <p className="text-sm text-stone-600 mt-3 bg-amber-50 p-3 rounded-xl border border-amber-200">
                "{selectedSando.recipe.description}"
              </p>

              {/* Contributors */}
              <div className="mt-4 pt-3 border-t border-stone-100 text-xs text-stone-500">
                <div className="flex items-center justify-center gap-1 font-bold text-stone-700">
                  <Users className="w-3.5 h-3.5 text-amber-600" />
                  <span>함께 만든 구역원:</span>
                </div>
                <div className="mt-1 font-bold text-rose-600">
                  {selectedSando.contributors?.join(', ') || '구역원 연합'}
                </div>
              </div>

              <button
                onClick={() => setSelectedSando(null)}
                className="mt-5 w-full py-2.5 rounded-xl bg-stone-800 hover:bg-stone-900 text-white font-bold text-sm transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

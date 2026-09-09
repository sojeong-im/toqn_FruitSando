import React, { useState } from 'react';
import { InteractivePoster } from './InteractivePoster';
import { Calendar, Clock, Trophy, Info, X, ChevronRight, Sparkles } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface LandingPosterHeroProps {
  onStartEvent: () => void;
}

export const LandingPosterHero: React.FC<LandingPosterHeroProps> = ({ onStartEvent }) => {
  const [showNoticeModal, setShowNoticeModal] = useState(false);

  const handleStart = () => {
    sounds.playSlash();
    setTimeout(() => sounds.playFanfare(), 250);
    onStartEvent();
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex flex-col items-center justify-center p-4 sm:p-6 select-none">
      <div className="max-w-md w-full space-y-4 text-center animate-popIn">
        {/* Top Event Date Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-stone-800 text-xs sm:text-sm font-bold shadow-sm">
          <span className="flex items-center gap-1 text-amber-900">
            <Calendar className="w-3.5 h-3.5 text-amber-700" />
            43.9.12 (토)
          </span>
          <span className="text-amber-400">•</span>
          <span className="flex items-center gap-1 text-amber-900">
            <Clock className="w-3.5 h-3.5 text-amber-700" />
            21시 마감
          </span>
          <span className="text-amber-400">•</span>
          <span className="text-rose-600 font-extrabold">100P = 산도 1개 완성!</span>
        </div>

        {/* Big Interactive Poster (Characters speak and animate when tapped!) */}
        <div className="w-full shadow-2xl rounded-3xl">
          <InteractivePoster onOpenNotice={() => setShowNoticeModal(true)} />
        </div>

        {/* Touch hint */}
        <div className="text-xs text-amber-800 font-bold flex items-center justify-center gap-1 pt-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
          <span>포스터 속 탐정들을 직접 터치해보세요!</span>
        </div>

        {/* Big Prominent "행사 시작하기" CTA Button */}
        <div className="pt-2 space-y-2">
          <button
            onClick={handleStart}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-black text-lg sm:text-xl shadow-xl hover:shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span>🥪 행사 시작하기</span>
            <ChevronRight className="w-5 h-5 text-white/90" />
          </button>

          {/* Sub-action: Official Notice Modal */}
          <button
            onClick={() => setShowNoticeModal(true)}
            className="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-stone-800 font-semibold underline underline-offset-2 py-1 transition-colors"
          >
            <Info className="w-3.5 h-3.5 text-stone-400" />
            <span>행사 요강 및 우승 상품 보기</span>
          </button>
        </div>
      </div>

      {/* Official Announcement Modal */}
      {showNoticeModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowNoticeModal(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-stone-200 relative animate-popIn text-left"
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
                <p>• 대상: 1-1 ~ 6-5 전 구역 (총 30개 구역)</p>
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
    </div>
  );
};

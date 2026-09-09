import React, { useState } from 'react';
import { District } from '../types';
import { Calendar, Clock, Trophy, Info, X, Image as ImageIcon } from 'lucide-react';

interface EventHeaderProps {
  districts: District[];
  activeDistrictId: number;
  onSelectDistrict: (id: number) => void;
}

export const EventHeader: React.FC<EventHeaderProps> = ({
  districts,
  activeDistrictId,
  onSelectDistrict,
}) => {
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [showPosterModal, setShowPosterModal] = useState(false);

  return (
    <header className="mb-6">
      {/* Top Banner styled like the official poster */}
      <div className="rounded-3xl bg-gradient-to-b from-[#FFFDF9] via-[#FFF9F0] to-[#FDF4E6] p-5 sm:p-7 md:p-8 shadow-xl border-2 border-amber-200/80 relative overflow-hidden text-center">
        {/* Background greenhouse warm foliage accents */}
        <div className="absolute -top-10 -left-10 w-44 h-44 bg-green-200/30 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -right-10 w-52 h-52 bg-amber-300/25 rounded-full blur-3xl pointer-events-none"></div>

        {/* Schedule & 100P Badge */}
        <div className="inline-flex flex-wrap items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/90 border border-amber-300 text-stone-800 text-xs md:text-sm font-black shadow-sm mb-3">
          <span className="flex items-center gap-1 text-amber-900">
            <Calendar className="w-3.5 h-3.5 text-amber-700" />
            43.9.12 (토)
          </span>
          <span className="text-amber-400">•</span>
          <span className="flex items-center gap-1 text-amber-900">
            <Clock className="w-3.5 h-3.5 text-amber-700" />
            하루 종일 ~ 21시 마감
          </span>
          <span className="text-amber-400">•</span>
          <span className="text-rose-600 font-extrabold bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
            100P = 산도 1개 완성!
          </span>
        </div>

        {/* Poster 3D Style Titles & Cute Detectives */}
        <div className="flex flex-col items-center justify-center">
          {/* 3 Cute Gat Detective Agents from the poster */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 my-1">
            <div className="text-2xl sm:text-3xl filter drop-shadow hover:scale-110 transition-transform cursor-pointer" title="찾기 탐정 1">
              🕵️‍♂️🍎
            </div>
            <div className="text-4xl sm:text-5xl filter drop-shadow-lg hover:scale-110 transition-transform cursor-pointer" title="찾기 탐정 리더">
              🎩✨
            </div>
            <div className="text-2xl sm:text-3xl filter drop-shadow hover:scale-110 transition-transform cursor-pointer" title="찾기 탐정 3">
              🕵️‍♂️🍇
            </div>
          </div>

          {/* 3D Typography exactly as on poster */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
            <span className="text-3xl sm:text-5xl md:text-6xl font-black poster-title-orange tracking-tight">
              열매산도
            </span>
            <span className="text-3xl sm:text-5xl md:text-6xl font-black poster-title-green tracking-tight">
              쟁탈전
            </span>
          </div>

          <p className="text-amber-900 text-sm sm:text-base font-extrabold mt-2 flex items-center justify-center gap-1.5">
            <span>🔥 구역 VS 구역, 열매 쟁탈전이 시작된다!! 🔥</span>
          </p>
        </div>

        {/* Action Buttons: View Poster & Notice */}
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setShowPosterModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-xs md:text-sm font-bold text-white shadow-sm transition-all active:scale-95"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>공식 포스터 원본 보기</span>
          </button>

          <button
            onClick={() => setShowNoticeModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-amber-50 text-xs md:text-sm font-bold text-stone-700 border border-amber-300 shadow-sm transition-all active:scale-95"
          >
            <Info className="w-3.5 h-3.5 text-amber-600" />
            <span>행사 요강 & 우승 상품</span>
          </button>
        </div>
      </div>

      {/* District Selector Tabs (Gingham & Wood vibe) */}
      <div className="mt-4 bg-white/95 p-2 rounded-2xl border border-amber-200 shadow-sm flex items-center gap-2 overflow-x-auto scrollbar-none">
        <span className="text-xs font-black text-amber-900/80 pl-3 whitespace-nowrap flex items-center gap-1">
          <span>🥪</span>
          <span>구역 선택:</span>
        </span>
        {districts.map((d) => {
          const isSelected = activeDistrictId === d.id;
          return (
            <button
              key={d.id}
              onClick={() => onSelectDistrict(d.id)}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20 scale-105'
                  : 'bg-stone-100 hover:bg-amber-100/60 text-stone-700'
              }`}
            >
              <span>{d.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                  isSelected ? 'bg-white/30 text-white' : 'bg-amber-100 text-amber-800'
                }`}
              >
                🥪 {d.completedSandos.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Official Poster Modal */}
      {showPosterModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4"
          onClick={() => setShowPosterModal(false)}
        >
          <div
            className="relative max-w-md w-full bg-stone-900 rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-400 animate-popIn"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowPosterModal(false)}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src="/poster.jpg"
              alt="새신자부 열매산도 쟁탈전 공식 포스터"
              className="w-full h-auto object-contain max-h-[80vh]"
            />
            <div className="p-3 bg-stone-900 text-center">
              <p className="text-xs text-amber-300 font-bold">
                🍓 새신자부 찾기팀 공식 포스터 🍇
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Official Announcement Modal */}
      {showNoticeModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowNoticeModal(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl border-2 border-amber-400 relative animate-popIn"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowNoticeModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-4">
              <span className="text-3xl">🍓🥪🍇</span>
              <h3 className="text-2xl font-black text-stone-800 mt-1">새신자부 열매산도 쟁탈전</h3>
              <p className="text-xs text-rose-600 font-bold mt-0.5">발신 : 새신자부 찾기팀 | 수신 : 새신자부 전성도</p>
            </div>

            <div className="space-y-4 text-xs md:text-sm text-stone-700 leading-relaxed bg-amber-50/60 p-4 rounded-2xl border border-amber-200">
              <div>
                <strong className="text-stone-900 block font-bold mb-1">🎯 일정 & 진행 안내</strong>
                <p>• 날짜 : 43.9.12 (토)</p>
                <p>• 시간 : 하루 종일 ~ 21시 마감</p>
                <p>• 진행 : 구역별 미션 수행 및 포인트 획득</p>
              </div>

              <div>
                <strong className="text-stone-900 block font-bold mb-1">🥪 열매 누적 & 완성 룰</strong>
                <p>• 미션 성공 후 '과일산도판' 인증</p>
                <p>• <strong>100POINT(과일 100개)</strong>가 쌓일 때마다 실시간으로 열매산도 1개 완성!</p>
              </div>

              <div className="p-3 bg-gradient-to-r from-amber-100 to-rose-100 rounded-xl border border-amber-300">
                <strong className="text-stone-900 flex items-center gap-1 font-black mb-1.5">
                  <Trophy className="w-4 h-4 text-amber-600" />
                  🏆🏆 최종 우승 상품 🏆🏆
                </strong>
                <p className="font-bold text-rose-700">🥇 1위 구역: 산도 우선 선택권!</p>
                <p className="font-bold text-stone-700">🥈 2위 구역: 2등 수제 과일산도</p>
                <p className="font-bold text-stone-700">🥉 3위 구역: 3등 수제 과일산도</p>
                <p className="text-[11px] text-stone-500 mt-1">
                  🫐 찾기팀이 직접 만들어주는 수제 과일산도 증정!
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowNoticeModal(false)}
              className="mt-5 w-full py-3 rounded-2xl bg-stone-800 hover:bg-stone-900 text-white font-bold text-sm"
            >
              확인 완료
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

import React, { useState } from 'react';
import { District } from '../types';
import { Calendar, Clock, Trophy, Info, X } from 'lucide-react';

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

  return (
    <header className="mb-6">
      {/* Poster-centered Hero Banner */}
      <div className="rounded-3xl bg-white p-5 sm:p-6 shadow-md border border-amber-200/80 flex flex-col md:flex-row items-center gap-6">
        {/* Actual Poster Image with clean framing */}
        <div className="w-full md:w-52 max-w-[240px] shrink-0 rounded-2xl overflow-hidden shadow-lg border-2 border-amber-300 group">
          <img
            src="/poster.jpg"
            alt="새신자부 열매산도 쟁탈전 공식 포스터"
            className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Event Information & Context */}
        <div className="flex-1 text-center md:text-left space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-stone-700 text-xs font-semibold">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-amber-600" />
              43.9.12 (토)
            </span>
            <span className="text-stone-300">•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              하루 종일 ~ 21시 마감
            </span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-stone-900 tracking-tight">
              새신자부 열매산도 쟁탈전
            </h1>
            <p className="text-amber-800 text-sm sm:text-base font-bold mt-1">
              미션을 수행하고 우리 구역의 열매산도를 완성하라!
            </p>
          </div>

          <p className="text-xs sm:text-sm text-stone-500 max-w-xl leading-relaxed">
            미션 성공 시 포인트를 획득하며, <strong className="text-amber-900 font-bold">100POINT</strong>가 모일 때마다 
            포스터 속 6가지 수제 과일산도 중 1개가 완성됩니다. 가장 많은 산도를 완성한 상위 3개 구역에게 상품이 주어집니다.
          </p>

          <div className="pt-1 flex flex-wrap items-center justify-center md:justify-start gap-2">
            <button
              onClick={() => setShowNoticeModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold transition-colors"
            >
              <Info className="w-3.5 h-3.5 text-amber-700" />
              <span>공식 요강 & 상품 안내</span>
            </button>
            <span className="text-xs text-stone-400 font-medium px-2 py-1 bg-stone-100 rounded-lg">
              발신: 새신자부 찾기팀
            </span>
          </div>
        </div>
      </div>

      {/* Clean District Selector Bar */}
      <div className="mt-4 bg-white p-2 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        <span className="text-xs font-bold text-stone-500 pl-3 pr-1 whitespace-nowrap">
          구역 선택:
        </span>
        {districts.map((d) => {
          const isSelected = activeDistrictId === d.id;
          return (
            <button
              key={d.id}
              onClick={() => onSelectDistrict(d.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-100'
              }`}
            >
              <span>{d.name}</span>
              <span
                className={`text-[11px] px-1.5 py-0.5 rounded-md font-bold ${
                  isSelected ? 'bg-white/25 text-white' : 'bg-amber-100 text-amber-800'
                }`}
              >
                산도 {d.completedSandos.length}개
              </span>
            </button>
          );
        })}
      </div>

      {/* Official Announcement Modal */}
      {showNoticeModal && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowNoticeModal(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-stone-200 relative animate-popIn"
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
                <p>• 진행: 구역별 미션 수행 및 포인트 획득</p>
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
    </header>
  );
};

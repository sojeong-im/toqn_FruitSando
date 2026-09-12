import React, { useState } from 'react';
import { District } from '../types';
import { Lock, Sparkles, CheckCircle2, AlertCircle, X, ArrowRight } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface EventClosedScreenProps {
  districts: District[];
  onAdminLoginSuccess: () => void;
}

export const EventClosedScreen: React.FC<EventClosedScreenProps> = ({
  districts,
  onAdminLoginSuccess,
}) => {
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Total completed sandos across all 30 districts
  const totalSandos = districts.reduce((acc, d) => acc + (d.completedSandos?.length || 0), 0);
  const totalPoints = districts.reduce((acc, d) => acc + (d.points || 0), 0);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '0314') {
      sounds.playFanfare();
      sessionStorage.setItem('fruit_sando_admin_auth', 'true');
      setShowPinModal(false);
      onAdminLoginSuccess();
    } else {
      sounds.playSlash();
      setPinError(true);
      setPinInput('');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] p-4 sm:p-6 md:p-10 flex flex-col justify-between items-center text-center animate-popIn">
      <div className="max-w-2xl w-full space-y-6 my-auto py-6">
        {/* Closed Announcement Badge */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-rose-500/10 text-rose-700 text-xs sm:text-sm font-black border border-rose-300 shadow-sm animate-pulse">
          <Sparkles className="w-4 h-4 text-rose-600" />
          <span>새신자부 열매산도 쟁탈전 • 행사 마감</span>
        </div>

        {/* Big Completed Sando Showcase */}
        <div className="relative flex items-center justify-center my-2">
          <div className="absolute inset-0 -m-8 rounded-full bg-gradient-to-tr from-amber-300/40 via-rose-200/50 to-yellow-200/40 blur-3xl animate-haloPulse pointer-events-none" />
          <img
            src="/completed-sando.png"
            alt="완성된 열매산도"
            className="w-36 h-48 sm:w-44 sm:h-56 object-contain filter drop-shadow-[0_20px_35px_rgba(180,83,9,0.35)] animate-popIn z-10"
          />
        </div>

        {/* Main Title & Closing Thank-You Message */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-stone-900 tracking-tight leading-tight">
            새신자부 열매산도 쟁탈전이<br />
            <span className="text-amber-700">은혜 가운데 마감되었습니다!</span> 🥪✨
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 font-medium leading-relaxed max-w-md mx-auto break-keep">
            모든 미션 인증 및 과일산도 조리가 공식 마감되었습니다.<br />
            함께 마음 모아 연합해주신 모든 새신자 및 구역원 여러분께 진심으로 감사드립니다!
          </p>
        </div>

        {/* Event Stats Summary */}
        <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
          <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-sm text-center">
            <span className="text-xs text-stone-500 font-bold">총 완성된 산도</span>
            <p className="text-2xl font-black text-amber-900 mt-1">🥪 {totalSandos}개</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-sm text-center">
            <span className="text-xs text-stone-500 font-bold">전체 누적 포인트</span>
            <p className="text-2xl font-black text-amber-900 mt-1">✨ {totalPoints}P</p>
          </div>
        </div>


        {/* 🔒 Administrator Access Button */}
        <div className="pt-2">
          <button
            onClick={() => {
              setPinInput('');
              setPinError(false);
              setShowPinModal(true);
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-stone-900 hover:bg-black text-white text-xs sm:text-sm font-black shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            <Lock className="w-4 h-4 text-amber-400" />
            <span>진행팀 / 관리자 입장</span>
            <ArrowRight className="w-4 h-4 text-stone-400" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-xs text-stone-400 py-3">
        새신자부 찾기팀 열매산도 쟁탈전 • 수고 많으셨습니다!
      </footer>

      {/* 🔐 Admin Password PIN Modal */}
      {showPinModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowPinModal(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 sm:p-7 max-w-xs sm:max-w-sm w-full shadow-2xl border-2 border-amber-300 animate-popIn text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto mb-3 text-amber-700">
              <Lock className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-black text-stone-900">진행팀 관리자 인증</h3>
            <p className="text-xs text-stone-500 mt-1">
              관리자 비밀번호 4자리를 입력해주세요.
            </p>

            <form onSubmit={handlePinSubmit} className="mt-4 space-y-3">
              <input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={8}
                autoFocus
                placeholder="비밀번호 입력"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                className={`w-full text-center text-xl tracking-widest font-black py-3 rounded-xl border-2 focus:outline-none transition-all ${
                  pinError
                    ? 'border-rose-400 bg-rose-50 text-rose-900 animate-wobble'
                    : 'border-stone-300 focus:border-amber-500 bg-stone-50'
                }`}
              />

              {pinError && (
                <div className="flex items-center justify-center gap-1 text-xs text-rose-600 font-bold">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>비밀번호가 올바르지 않습니다.</span>
                </div>
              )}

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowPinModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs shadow"
                >
                  입장하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

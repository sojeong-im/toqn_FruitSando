import React, { useState } from 'react';
import { District } from '../types';
import {
  firebaseService,
  getSavedFirebaseConfig,
  saveFirebaseConfig,
  clearFirebaseConfig,
  FirebaseConfig,
} from '../services/firebase';
import {
  ShieldCheck,
  Flame,
  ArrowLeft,
  Database,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Volume2,
  Lock,
  Search,
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface AdminPageProps {
  districts: District[];
  isFirebaseConnected: boolean;
  onSelectDistrict: (id: string) => void;
  onAddDirectPoints: (districtId: string, points: number) => void;
  onResetAllData: () => void;
  onBackToMain: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  districts,
  isFirebaseConnected,
  onAddDirectPoints,
  onResetAllData,
  onBackToMain,
}) => {
  // Simple Security PIN gate
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('fruit_sando_admin_auth') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Search & Team filter
  const [selectedTeam, setSelectedTeam] = useState<number | 'all'>('all');
  const [searchKeyword, setSearchKeyword] = useState('');

  // Firebase Config Editor State
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [fbConfig, setFbConfig] = useState<FirebaseConfig>(() => {
    const saved = getSavedFirebaseConfig();
    return (
      saved || {
        apiKey: '',
        authDomain: '',
        projectId: '',
        storageBucket: '',
        messagingSenderId: '',
        appId: '',
      }
    );
  });
  const [configMessage, setConfigMessage] = useState<string | null>(null);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Official organizer PIN: 00347
    if (pinInput === '00347') {
      setIsAuthenticated(true);
      sessionStorage.setItem('fruit_sando_admin_auth', 'true');
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleSaveConfig = () => {
    if (!fbConfig.projectId || !fbConfig.apiKey) {
      alert('API Key와 Project ID는 필수 입력값입니다.');
      return;
    }
    saveFirebaseConfig(fbConfig);
    const ok = firebaseService.init(fbConfig);
    if (ok) {
      setConfigMessage('파이어베이스 설정이 성공적으로 저장 및 연결되었습니다!');
      setTimeout(() => {
        setShowConfigModal(false);
        setConfigMessage(null);
        window.location.reload();
      }, 1000);
    } else {
      setConfigMessage('연결 실패: 입력하신 설정을 다시 확인해주세요.');
    }
  };

  const handleSeedDistrictsToFirebase = async () => {
    if (!window.confirm('현재 30개 구역 데이터를 파이어베이스에 업로드(동기화)하시겠습니까?')) return;
    try {
      await firebaseService.seedDistricts(districts);
      alert('파이어베이스에 30개 구역 데이터가 성공적으로 동기화되었습니다!');
    } catch (err) {
      alert('동기화 실패: ' + String(err));
    }
  };

  // Filter districts
  const filteredDistricts = districts.filter((d) => {
    const matchTeam = selectedTeam === 'all' || d.team === selectedTeam;
    const matchSearch = !searchKeyword || d.name.includes(searchKeyword) || d.id.includes(searchKeyword);
    return matchTeam && matchSearch;
  });

  const totalSandos = districts.reduce((sum, d) => sum + d.completedSandos.length, 0);
  const totalPoints = districts.reduce((sum, d) => sum + d.points, 0);

  // If not authenticated: PIN Gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FAF6F0] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-xl border border-amber-200 text-center animate-popIn">
          <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-amber-800">
            <Lock className="w-7 h-7" />
          </div>

          <h2 className="text-xl font-black text-stone-900">찾기팀 관리자 페이지</h2>
          <p className="text-xs text-stone-500 mt-1">
            행사 진행자 전용 비밀번호(PIN)를 입력해주세요.
          </p>

          <form onSubmit={handlePinSubmit} className="mt-5 space-y-3">
            <input
              type="password"
              placeholder="관리자 비밀번호 입력"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-300 text-center text-lg font-bold tracking-widest focus:outline-none focus:border-amber-500"
              autoFocus
            />

            {pinError && (
              <p className="text-xs text-rose-500 font-bold">
                비밀번호가 올바르지 않습니다.
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-stone-900 hover:bg-black text-white font-bold text-sm transition-colors"
            >
              관리자 로그인
            </button>
          </form>

          <button
            onClick={onBackToMain}
            className="mt-4 text-xs text-stone-400 hover:text-stone-600 font-medium"
          >
            ← 참가자 화면으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF6F0] p-4 sm:p-6 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Top Header Bar */}
        <div className="rounded-3xl bg-white p-5 sm:p-6 shadow-md border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToMain}
              className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
              title="참가자 화면으로 돌아가기"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-white text-[11px] font-black">
                  ADMIN
                </span>
                <span className="text-xs text-stone-400 font-bold">새신자부 찾기팀</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-stone-900 mt-0.5">
                열매산도 쟁탈전 통합 관리자 센터
              </h1>
            </div>
          </div>

          {/* Firebase Connection Status & Config Button */}
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${
                isFirebaseConnected
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isFirebaseConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                }`}
              />
              <span>{isFirebaseConnected ? '파이어베이스 실시간 연동됨' : '로컬 모드 (연동 대기)'}</span>
            </div>

            <button
              onClick={() => setShowConfigModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-bold transition-colors shadow-sm"
            >
              <Database className="w-3.5 h-3.5 text-amber-400" />
              <span>연동 설정</span>
            </button>
          </div>
        </div>

        {/* Global Summary Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white rounded-2xl p-4 border border-amber-200/80 shadow-sm text-center">
            <span className="text-xs text-stone-400 font-semibold block">전체 구역 수</span>
            <span className="text-2xl font-black text-stone-800">30개 구역</span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-amber-200/80 shadow-sm text-center">
            <span className="text-xs text-stone-400 font-semibold block">완성된 총 산도 수</span>
            <span className="text-2xl font-black text-amber-900">🥪 {totalSandos}개</span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-amber-200/80 shadow-sm text-center">
            <span className="text-xs text-stone-400 font-semibold block">누적 총 POINT</span>
            <span className="text-2xl font-black text-rose-600">{totalPoints}P</span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-amber-200/80 shadow-sm flex flex-col items-center justify-center gap-1.5">
            <button
              onClick={() => {
                sounds.playSlash();
                setTimeout(() => sounds.playFanfare(), 300);
              }}
              className="w-full py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold flex items-center justify-center gap-1"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>사운드 테스트</span>
            </button>
            <button
              onClick={() => {
                if (window.confirm('경고: 모든 구역의 점수와 산도를 초기 상태로 리셋하시겠습니까?')) {
                  onResetAllData();
                }
              }}
              className="w-full py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center justify-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>전체 데이터 리셋</span>
            </button>
          </div>
        </div>

        {/* 30 Districts Real-time Table / Grid Management */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-md border border-amber-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-stone-900">
                30개 구역 실시간 점수 관리
              </h2>
              <p className="text-xs text-stone-500">
                점수 버튼을 클릭하면 모든 참가자 스마트폰 화면에 실시간으로 즉시 반영됩니다.
              </p>
            </div>

            {/* Team Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setSelectedTeam('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedTeam === 'all'
                    ? 'bg-stone-900 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                전체 (30)
              </button>
              {[1, 2, 3, 4, 5, 6].map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTeam(t)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedTeam === t
                      ? 'bg-amber-500 text-white font-black'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {t}팀
                </button>
              ))}
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="구역 검색 (예: 2-3, 4-1)"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-400 font-medium"
            />
          </div>

          {/* Districts List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[560px] overflow-y-auto pr-1">
            {filteredDistricts.map((d) => (
              <div
                key={d.id}
                className="p-4 rounded-2xl bg-stone-50/70 border border-stone-200 hover:border-amber-300 transition-all flex flex-col justify-between gap-2 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-base font-black text-stone-900 mr-2">{d.name}</span>
                    <span className="text-xs text-stone-400">({d.leader})</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-xl bg-amber-100 text-amber-900 text-xs font-black">
                      🥪 {d.completedSandos.length}개
                    </span>
                    <span className="text-xs font-bold text-stone-500">
                      진행 {d.currentPoints}/100P
                    </span>
                  </div>
                </div>

                {/* Score Controls (+5, +10, +25, +50, +100, -10) */}
                <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between gap-1">
                  <span className="text-[11px] text-stone-400 font-medium">점수 가산:</span>
                  <div className="flex items-center gap-1">
                    {[+5, +10, +25, +50, +100].map((pts) => (
                      <button
                        key={pts}
                        onClick={() => onAddDirectPoints(d.id, pts)}
                        className="px-2.5 py-1 rounded-lg bg-white hover:bg-amber-400 hover:text-stone-950 text-stone-800 text-xs font-extrabold border border-stone-200 shadow-sm active:scale-95 transition-all"
                      >
                        +{pts}
                      </button>
                    ))}
                    <button
                      onClick={() => onAddDirectPoints(d.id, -10)}
                      className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 active:scale-95 transition-all"
                      title="10점 차감"
                    >
                      -10
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Firebase Config Modal */}
      {showConfigModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowConfigModal(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 relative animate-popIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-black text-stone-900">파이어베이스 실시간 연동 설정</h3>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                className="text-stone-400 hover:text-stone-600 text-sm font-bold"
              >
                닫기
              </button>
            </div>

            <p className="text-xs text-stone-500 mt-3 leading-relaxed">
              Firebase 콘솔의 <strong>[프로젝트 설정] ➔ [일반] ➔ [내 앱 (웹)]</strong>에 있는 SDK 설정값을 아래 칸에 입력하시면
              모든 구역원의 스마트폰과 실시간으로 연동됩니다.
            </p>

            {configMessage && (
              <div className="my-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600" />
                <span>{configMessage}</span>
              </div>
            )}

            <div className="space-y-3 mt-4 text-xs font-medium">
              <div>
                <label className="text-stone-600 font-bold block mb-1">API Key (apiKey):</label>
                <input
                  type="text"
                  placeholder="AIzaSy..."
                  value={fbConfig.apiKey}
                  onChange={(e) => setFbConfig({ ...fbConfig, apiKey: e.target.value.trim() })}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 font-mono text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-stone-600 font-bold block mb-1">Project ID (projectId):</label>
                <input
                  type="text"
                  placeholder="fruit-sando-battle..."
                  value={fbConfig.projectId}
                  onChange={(e) => setFbConfig({ ...fbConfig, projectId: e.target.value.trim() })}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 font-mono text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-stone-600 font-bold block mb-1">Auth Domain (authDomain):</label>
                <input
                  type="text"
                  placeholder="project-id.firebaseapp.com"
                  value={fbConfig.authDomain}
                  onChange={(e) => setFbConfig({ ...fbConfig, authDomain: e.target.value.trim() })}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 font-mono text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-stone-600 font-bold block mb-1">App ID (appId):</label>
                <input
                  type="text"
                  placeholder="1:123456789:web:abcdef"
                  value={fbConfig.appId}
                  onChange={(e) => setFbConfig({ ...fbConfig, appId: e.target.value.trim() })}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 font-mono text-xs focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-stone-100 flex flex-col sm:flex-row items-center gap-2">
              <button
                onClick={handleSaveConfig}
                className="w-full sm:flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow transition-colors"
              >
                설정 저장 및 연결 테스트
              </button>

              <button
                onClick={handleSeedDistrictsToFirebase}
                className="w-full sm:flex-1 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-900 text-white font-bold text-xs transition-colors"
              >
                30개 구역 DB 초기화 업로드
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { District, Mission, SandoRecipe, CompletedSando } from './types';
import { EventHeader } from './components/EventHeader';
import { SandoKitchen } from './components/SandoKitchen';
import { Top3Podium } from './components/Top3Podium';
import { SandoShowcase } from './components/SandoShowcase';
import { MissionSelectorModal } from './components/MissionSelectorModal';
import { ScratchMissionModal } from './components/ScratchMissionModal';
import { AdminPanel } from './components/AdminPanel';
import { BroadcastView } from './components/BroadcastView';
import { createInitialDistricts } from './utils/districtData';
import { sounds } from './utils/soundEffects';
import { Utensils, Trophy } from 'lucide-react';

export function App() {
  const [districts, setDistricts] = useState<District[]>(() => {
    const saved = localStorage.getItem('fruit_sando_districts_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 30) {
          return parsed;
        }
      } catch {
        // fallback to fresh 30 districts
      }
    }
    return createInitialDistricts();
  });

  const [activeDistrictId, setActiveDistrictId] = useState<string>('1-1');
  const [activeTab, setActiveTab] = useState<'kitchen' | 'ranking'>('kitchen');

  const [isMissionModalOpen, setIsMissionModalOpen] = useState(false);
  const [scratchModalData, setScratchModalData] = useState<{
    mission: Mission;
    contributorName: string;
  } | null>(null);

  const [isBroadcastMode, setIsBroadcastMode] = useState(false);
  const [latestEventText, setLatestEventText] = useState('새신자부 열매산도 쟁탈전이 진행 중입니다.');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('fruit_sando_districts_v2', JSON.stringify(districts));
  }, [districts]);

  const activeDistrict = districts.find((d) => d.id === activeDistrictId) || districts[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Add points
  const handleAddPoints = (districtId: string, addedPoints: number, missionTitle?: string, contributor?: string) => {
    sounds.playCream();
    setTimeout(() => sounds.playFruitPop(), 150);

    setDistricts((prev) =>
      prev.map((d) => {
        if (d.id !== districtId) return d;
        const newCurrent = d.currentPoints + addedPoints;
        const newTotal = d.points + addedPoints;
        return {
          ...d,
          points: newTotal,
          currentPoints: newCurrent,
        };
      })
    );

    const eventDesc = `[${activeDistrict.name}] ${contributor ? `${contributor} 님이 ` : ''}'${missionTitle || '미션'}' 완료 (+${addedPoints}P)`;
    setLatestEventText(eventDesc);
    showToast(eventDesc);
  };

  // Handle sando completion
  const handleSandoCompleted = (districtId: string, recipe: SandoRecipe, contributors: string[]) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setDistricts((prev) =>
      prev.map((d) => {
        if (d.id !== districtId) return d;
        const newNumber = d.completedSandos.length + 1;
        const newSando: CompletedSando = {
          id: `sando_${districtId}_${Date.now()}`,
          districtId: d.id,
          districtName: d.name,
          recipe,
          sandoNumber: newNumber,
          completedAt: nowTime,
          contributors,
        };

        const remainingCurrent = Math.max(0, d.currentPoints - 100);

        return {
          ...d,
          currentPoints: remainingCurrent,
          completedSandos: [...d.completedSandos, newSando],
        };
      })
    );

    const eventDesc = `[${activeDistrict.name}] ${activeDistrict.completedSandos.length + 1}번째 '${recipe.name}' 완성!`;
    setLatestEventText(eventDesc);
    showToast(eventDesc);
  };

  const handleResetAllData = () => {
    const fresh = createInitialDistricts();
    setDistricts(fresh);
    localStorage.setItem('fruit_sando_districts_v2', JSON.stringify(fresh));
    showToast('30개 구역 데이터가 초기화되었습니다.');
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] p-3 sm:p-5 md:p-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-stone-900 text-white px-5 py-2.5 rounded-2xl shadow-xl text-xs sm:text-sm font-semibold animate-popIn">
          {toastMessage}
        </div>
      )}

      {/* Broadcast Mode */}
      {isBroadcastMode ? (
        <BroadcastView
          districts={districts}
          onExit={() => setIsBroadcastMode(false)}
          latestEvent={latestEventText}
        />
      ) : (
        <div className="max-w-4xl mx-auto space-y-5">
          {/* Header with 30 Districts Smart Selector */}
          <EventHeader
            districts={districts}
            activeDistrictId={activeDistrictId}
            onSelectDistrict={(id) => setActiveDistrictId(id)}
          />

          {/* Simple Tab Switcher */}
          <div className="flex bg-stone-200/80 p-1 rounded-2xl max-w-sm mx-auto shadow-inner">
            <button
              onClick={() => setActiveTab('kitchen')}
              className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'kitchen'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Utensils className="w-4 h-4 text-amber-600" />
              <span>우리 구역 산도</span>
            </button>
            <button
              onClick={() => setActiveTab('ranking')}
              className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'ranking'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Trophy className="w-4 h-4 text-amber-600" />
              <span>실시간 랭킹 (30개 구역)</span>
            </button>
          </div>

          {/* Tab 1: Our District Kitchen & Showcase */}
          {activeTab === 'kitchen' && (
            <div className="space-y-5 animate-popIn">
              <SandoKitchen
                district={activeDistrict}
                onSandoCompleted={handleSandoCompleted}
                onOpenMissionModal={() => setIsMissionModalOpen(true)}
                activeContributor={activeDistrict.members[0]?.name || '구역원'}
              />

              <SandoShowcase district={activeDistrict} />
            </div>
          )}

          {/* Tab 2: Live Leaderboard for all 30 Groups */}
          {activeTab === 'ranking' && (
            <div className="animate-popIn">
              <Top3Podium
                districts={districts}
                onSelectDistrict={(id) => {
                  setActiveDistrictId(id);
                  setActiveTab('kitchen');
                }}
                activeDistrictId={activeDistrictId}
              />
            </div>
          )}
        </div>
      )}

      {/* Mission Selection Modal */}
      {isMissionModalOpen && (
        <MissionSelectorModal
          district={activeDistrict}
          onClose={() => setIsMissionModalOpen(false)}
          onSelectForScratch={(mission, contributor) => {
            setIsMissionModalOpen(false);
            setScratchModalData({ mission, contributorName: contributor });
          }}
          onQuickApply={(mission, contributor) => {
            setIsMissionModalOpen(false);
            handleAddPoints(activeDistrict.id, mission.points, mission.title, contributor);
          }}
        />
      )}

      {/* Scratch Lottery Modal */}
      {scratchModalData && (
        <ScratchMissionModal
          mission={scratchModalData.mission}
          contributorName={scratchModalData.contributorName}
          onClose={() => setScratchModalData(null)}
          onApplyPoints={(pts, title) => {
            handleAddPoints(
              activeDistrict.id,
              pts,
              title,
              scratchModalData.contributorName
            );
          }}
        />
      )}

      {/* Coordinator Admin Panel */}
      <AdminPanel
        districts={districts}
        activeDistrictId={activeDistrictId}
        onSelectDistrict={(id) => setActiveDistrictId(id)}
        onAddDirectPoints={(id, pts) => handleAddPoints(id, pts, '관리자 포인트 가산')}
        onResetAllData={handleResetAllData}
        isBroadcastMode={isBroadcastMode}
        onToggleBroadcastMode={() => setIsBroadcastMode(!isBroadcastMode)}
      />
    </div>
  );
}

export default App;

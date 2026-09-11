import React, { useState, useEffect } from 'react';
import { District, Mission, SandoRecipe, CompletedSando } from './types';
import { EventHeader } from './components/EventHeader';
import { SandoKitchen } from './components/SandoKitchen';
import { SandoShowcase } from './components/SandoShowcase';
import { MissionSelectorModal } from './components/MissionSelectorModal';
import { ScratchMissionModal } from './components/ScratchMissionModal';
import { AdminPanel } from './components/AdminPanel';
import { LandingPosterHero } from './components/LandingPosterHero';
import { createInitialDistricts } from './utils/districtData';
import { sounds } from './utils/soundEffects';

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
        // fallback
      }
    }
    return createInitialDistricts();
  });

  // Landing intro state: when entering, show ONLY the big poster!
  const [hasStarted, setHasStarted] = useState<boolean>(false);

  const [activeDistrictId, setActiveDistrictId] = useState<string>('1-1');

  const [isMissionModalOpen, setIsMissionModalOpen] = useState(false);
  const [scratchModalData, setScratchModalData] = useState<{
    mission: Mission;
    contributorName: string;
  } | null>(null);

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
    showToast(eventDesc);
  };

  const handleResetAllData = () => {
    const fresh = createInitialDistricts();
    setDistricts(fresh);
    localStorage.setItem('fruit_sando_districts_v2', JSON.stringify(fresh));
    showToast('30개 구역 데이터가 초기화되었습니다.');
  };

  // 1. If not started yet: Show ONLY the big poster screen!
  if (!hasStarted) {
    return <LandingPosterHero onStartEvent={() => setHasStarted(true)} />;
  }

  // 2. If started: Show full event application (Ranking removed)
  return (
    <div className="min-h-screen bg-[#FAF6F0] p-3 sm:p-5 md:p-8 animate-popIn">
      {/* Clean Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-stone-900 text-white px-5 py-2.5 rounded-2xl shadow-xl text-xs sm:text-sm font-semibold animate-popIn">
          {toastMessage}
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-5">
        {/* Header with 30 Districts Smart Selector & Back to Poster button */}
        <EventHeader
          districts={districts}
          activeDistrictId={activeDistrictId}
          onSelectDistrict={(id) => setActiveDistrictId(id)}
          onBackToPoster={() => setHasStarted(false)}
        />

        {/* Our District Kitchen & Showcase (Focused Sando Assembly) */}
        <div className="space-y-5">
          <SandoKitchen
            district={activeDistrict}
            onSandoCompleted={handleSandoCompleted}
            onOpenMissionModal={() => setIsMissionModalOpen(true)}
            activeContributor={activeDistrict.members[0]?.name || '구역원'}
          />

          <SandoShowcase district={activeDistrict} />
        </div>
      </div>

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
      />
    </div>
  );
}

export default App;

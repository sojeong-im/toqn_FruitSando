import React, { useState, useEffect, useRef } from 'react';
import { District, Mission, SandoRecipe, CompletedSando } from './types';
import { EventHeader } from './components/EventHeader';
import { SandoKitchen } from './components/SandoKitchen';
import { SandoShowcase } from './components/SandoShowcase';
import { MissionSelectorModal } from './components/MissionSelectorModal';
import { ScratchMissionModal } from './components/ScratchMissionModal';
import { AdminPage } from './components/AdminPage';
import { LandingPosterHero } from './components/LandingPosterHero';
import { createInitialDistricts } from './utils/districtData';
import { sounds } from './utils/soundEffects';
import { firebaseService } from './services/firebase';
import { Lock } from 'lucide-react';

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

  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(false);

  // Landing intro state: when entering, show ONLY the big poster!
  const [hasStarted, setHasStarted] = useState<boolean>(false);

  // Separate Admin Page state (Accessible via URL #admin or discreet footer button)
  const [isAdminPage, setIsAdminPage] = useState<boolean>(() => {
    return window.location.hash === '#admin' || window.location.search.includes('admin=true');
  });

  const [activeDistrictId, setActiveDistrictId] = useState<string>('1-1');

  const [isMissionModalOpen, setIsMissionModalOpen] = useState(false);
  const [scratchModalData, setScratchModalData] = useState<{
    mission: Mission;
    contributorName: string;
  } | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const districtsRef = useRef(districts);
  districtsRef.current = districts;

  // Initialize Firebase and subscribe to real-time changes
  useEffect(() => {
    const initialized = firebaseService.init();
    setIsFirebaseConnected(initialized);

    if (initialized) {
      const unsub = firebaseService.subscribeDistricts((fbDistricts) => {
        if (fbDistricts && fbDistricts.length === 30) {
          setDistricts(fbDistricts);
          localStorage.setItem('fruit_sando_districts_v2', JSON.stringify(fbDistricts));
        } else if (fbDistricts && fbDistricts.length === 0) {
          // If Firestore collection is empty, seed with initial 30 districts
          firebaseService.seedDistricts(districtsRef.current);
        }
      });

      return () => {
        unsub();
      };
    }
  }, []);

  // Save to localStorage as offline backup
  useEffect(() => {
    localStorage.setItem('fruit_sando_districts_v2', JSON.stringify(districts));
  }, [districts]);

  // Sync hash change for admin navigation (#admin)
  useEffect(() => {
    const handleHashChange = () => {
      setIsAdminPage(window.location.hash === '#admin');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const activeDistrict = districts.find((d) => d.id === activeDistrictId) || districts[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Add points (Syncs with Firebase Firestore in real-time)
  const handleAddPoints = async (
    districtId: string,
    addedPoints: number,
    missionTitle?: string,
    contributor?: string
  ) => {
    sounds.playCream();
    setTimeout(() => sounds.playFruitPop(), 150);

    const targetDistrict = districts.find((d) => d.id === districtId);
    const currentPoints = targetDistrict ? targetDistrict.currentPoints : 0;

    // Optimistic local update
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

    // Sync with Firebase Firestore
    if (firebaseService.isReady()) {
      try {
        await firebaseService.addPoints(districtId, addedPoints, currentPoints);
      } catch (err) {
        console.error('Failed to sync points to Firebase:', err);
      }
    }

    const eventDesc = `[${activeDistrict.name}] ${contributor ? `${contributor} 님이 ` : ''}'${missionTitle || '미션'}' 완료 (+${addedPoints}P)`;
    showToast(eventDesc);
  };

  // Handle sando completion (Syncs with Firebase Firestore in real-time)
  const handleSandoCompleted = async (
    districtId: string,
    recipe: SandoRecipe,
    contributors: string[]
  ) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const targetDistrict = districts.find((d) => d.id === districtId) || activeDistrict;
    const newNumber = targetDistrict.completedSandos.length + 1;
    const newSando: CompletedSando = {
      id: `sando_${districtId}_${Date.now()}`,
      districtId: targetDistrict.id,
      districtName: targetDistrict.name,
      recipe,
      sandoNumber: newNumber,
      completedAt: nowTime,
      contributors,
    };

    const remainingCurrent = Math.max(0, targetDistrict.currentPoints - 100);

    // Optimistic local update
    setDistricts((prev) =>
      prev.map((d) => {
        if (d.id !== districtId) return d;
        return {
          ...d,
          currentPoints: remainingCurrent,
          completedSandos: [...d.completedSandos, newSando],
        };
      })
    );

    // Sync with Firebase Firestore
    if (firebaseService.isReady()) {
      try {
        await firebaseService.completeSando(districtId, newSando, remainingCurrent);
      } catch (err) {
        console.error('Failed to sync completed sando to Firebase:', err);
      }
    }

    const eventDesc = `[${activeDistrict.name}] ${newNumber}번째 '${recipe.name}' 완성!`;
    showToast(eventDesc);
  };

  const handleResetAllData = async () => {
    const fresh = createInitialDistricts();
    setDistricts(fresh);
    localStorage.setItem('fruit_sando_districts_v2', JSON.stringify(fresh));

    if (firebaseService.isReady()) {
      try {
        await firebaseService.resetAll(fresh);
      } catch (err) {
        console.error('Failed to reset Firebase:', err);
      }
    }
    showToast('30개 구역 데이터가 초기화되었습니다.');
  };

  // 1. Separate Admin Page View
  if (isAdminPage) {
    return (
      <AdminPage
        districts={districts}
        isFirebaseConnected={isFirebaseConnected}
        onSelectDistrict={(id) => setActiveDistrictId(id)}
        onAddDirectPoints={(id, pts) => handleAddPoints(id, pts, '관리자 포인트 가산')}
        onResetAllData={handleResetAllData}
        onBackToMain={() => {
          window.location.hash = '';
          setIsAdminPage(false);
        }}
      />
    );
  }

  // 2. Landing Poster Screen (Before starting event)
  if (!hasStarted) {
    return <LandingPosterHero onStartEvent={() => setHasStarted(true)} />;
  }

  // 3. Regular Participant Event Application
  return (
    <div className="min-h-screen bg-[#FAF6F0] p-3 sm:p-5 md:p-8 animate-popIn flex flex-col justify-between">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-stone-900 text-white px-5 py-2.5 rounded-2xl shadow-xl text-xs sm:text-sm font-semibold animate-popIn">
          {toastMessage}
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-5 w-full">
        {/* Header with 30 Districts Smart Selector & Back to Poster button */}
        <EventHeader
          districts={districts}
          activeDistrictId={activeDistrictId}
          onSelectDistrict={(id) => setActiveDistrictId(id)}
          onBackToPoster={() => setHasStarted(false)}
        />

        {/* Focused Sando Assembly & Showcase */}
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

      {/* Discreet Footer with Admin Page Link */}
      <footer className="mt-12 text-center text-xs text-stone-400 py-4 border-t border-stone-200/60 flex items-center justify-center gap-4">
        <span>새신자부 찾기팀 열매산도 쟁탈전</span>
        <span>•</span>
        <button
          onClick={() => {
            window.location.hash = '#admin';
            setIsAdminPage(true);
          }}
          className="text-stone-400 hover:text-amber-800 flex items-center gap-1 transition-colors font-medium"
        >
          <Lock className="w-3 h-3" />
          <span>진행팀 관리자</span>
        </button>
      </footer>

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
    </div>
  );
}

export default App;

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
import { SANDO_RECIPES } from './utils/sandoRecipes';
import { sounds } from './utils/soundEffects';

const INITIAL_DISTRICTS: District[] = [
  {
    id: 1,
    name: '1구역',
    leader: '김은혜',
    points: 245,
    currentPoints: 45,
    completedSandos: [
      {
        id: 'sando_1_1',
        districtId: 1,
        districtName: '1구역',
        recipe: SANDO_RECIPES[0], // Berry
        sandoNumber: 1,
        completedAt: '11:20',
        contributors: ['김은혜(리더)', '민수(딸기)'],
      },
      {
        id: 'sando_1_2',
        districtId: 1,
        districtName: '1구역',
        recipe: SANDO_RECIPES[1], // Green
        sandoNumber: 2,
        completedAt: '13:45',
        contributors: ['새신자 지우', '민수'],
      },
    ],
    members: [
      { name: '김은혜(구역장)', roleFruit: '🍞 식빵', avatar: '👩‍🦰' },
      { name: '새신자 지우', roleFruit: '🍓 딸기', avatar: '👧' },
      { name: '박민수', roleFruit: '🥛 생크림', avatar: '🧑' },
      { name: '이하은', roleFruit: '🍇 샤인머스캣', avatar: '👩' },
    ],
  },
  {
    id: 2,
    name: '2구역',
    leader: '박준형',
    points: 380,
    currentPoints: 80,
    completedSandos: [
      {
        id: 'sando_2_1',
        districtId: 2,
        districtName: '2구역',
        recipe: SANDO_RECIPES[2], // Tropical
        sandoNumber: 1,
        completedAt: '10:50',
        contributors: ['박준형', '정우'],
      },
      {
        id: 'sando_2_2',
        districtId: 2,
        districtName: '2구역',
        recipe: SANDO_RECIPES[0], // Berry
        sandoNumber: 2,
        completedAt: '12:15',
        contributors: ['새신자 수진', '수아'],
      },
      {
        id: 'sando_2_3',
        districtId: 2,
        districtName: '2구역',
        recipe: SANDO_RECIPES[5], // Legendary
        sandoNumber: 3,
        completedAt: '15:10',
        contributors: ['2구역 전원 연합'],
      },
    ],
    members: [
      { name: '박준형(구역장)', roleFruit: '🍞 식빵', avatar: '👨' },
      { name: '새신자 수진', roleFruit: '🥭 애플망고', avatar: '👧' },
      { name: '최정우', roleFruit: '🍊 감귤', avatar: '🧑' },
      { name: '김수아', roleFruit: '🫐 블루베리', avatar: '👩' },
    ],
  },
  {
    id: 3,
    name: '3구역',
    leader: '이민지',
    points: 270,
    currentPoints: 70,
    completedSandos: [
      {
        id: 'sando_3_1',
        districtId: 3,
        districtName: '3구역',
        recipe: SANDO_RECIPES[3], // Citrus
        sandoNumber: 1,
        completedAt: '11:05',
        contributors: ['이민지', '찬우'],
      },
      {
        id: 'sando_3_2',
        districtId: 3,
        districtName: '3구역',
        recipe: SANDO_RECIPES[1], // Green
        sandoNumber: 2,
        completedAt: '14:30',
        contributors: ['새신자 영호', '다솜'],
      },
    ],
    members: [
      { name: '이민지(구역장)', roleFruit: '🍞 식빵', avatar: '👩' },
      { name: '새신자 영호', roleFruit: '🍇 샤인머스캣', avatar: '🧑' },
      { name: '강찬우', roleFruit: '🍓 딸기', avatar: '👦' },
      { name: '윤다솜', roleFruit: '🥛 생크림', avatar: '👧' },
    ],
  },
  {
    id: 4,
    name: '4구역',
    leader: '최도윤',
    points: 160,
    currentPoints: 60,
    completedSandos: [
      {
        id: 'sando_4_1',
        districtId: 4,
        districtName: '4구역',
        recipe: SANDO_RECIPES[4], // Blueberry
        sandoNumber: 1,
        completedAt: '13:00',
        contributors: ['최도윤', '새신자 서연'],
      },
    ],
    members: [
      { name: '최도윤(구역장)', roleFruit: '🍞 식빵', avatar: '👨' },
      { name: '새신자 서연', roleFruit: '🫐 블루베리', avatar: '👩' },
      { name: '임재현', roleFruit: '🥭 망고', avatar: '🧑' },
    ],
  },
  {
    id: 5,
    name: '5구역',
    leader: '정소율',
    points: 90,
    currentPoints: 90,
    completedSandos: [],
    members: [
      { name: '정소율(구역장)', roleFruit: '🍞 식빵', avatar: '👩' },
      { name: '새신자 현우', roleFruit: '🍓 딸기', avatar: '👦' },
      { name: '오세린', roleFruit: '🍊 감귤', avatar: '👧' },
    ],
  },
  {
    id: 6,
    name: '6구역',
    leader: '한시온',
    points: 75,
    currentPoints: 75,
    completedSandos: [],
    members: [
      { name: '한시온(구역장)', roleFruit: '🍞 식빵', avatar: '👨' },
      { name: '새신자 나은', roleFruit: '🍇 샤인머스캣', avatar: '👧' },
      { name: '송원빈', roleFruit: '🥛 생크림', avatar: '🧑' },
    ],
  },
];

export function App() {
  const [districts, setDistricts] = useState<District[]>(() => {
    const saved = localStorage.getItem('fruit_sando_districts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_DISTRICTS;
      }
    }
    return INITIAL_DISTRICTS;
  });

  const [activeDistrictId, setActiveDistrictId] = useState<number>(2); // Default to 2구역
  const [isMissionModalOpen, setIsMissionModalOpen] = useState(false);
  const [scratchModalData, setScratchModalData] = useState<{
    mission: Mission;
    contributorName: string;
  } | null>(null);

  const [isBroadcastMode, setIsBroadcastMode] = useState(false);
  const [latestEventText, setLatestEventText] = useState('🔥 새신자부 열매산도 쟁탈전 현장 중계가 시작되었습니다!');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('fruit_sando_districts', JSON.stringify(districts));
  }, [districts]);

  const activeDistrict = districts.find((d) => d.id === activeDistrictId) || districts[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // 1. Add points to a district
  const handleAddPoints = (districtId: number, addedPoints: number, missionTitle?: string, contributor?: string) => {
    // Play cream & pop sound
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

    const eventDesc = `🎉 [${activeDistrict.name}] ${contributor ? `${contributor} 님이 ` : ''}'${missionTitle || '미션'}' 완료 (+${addedPoints}P)!`;
    setLatestEventText(eventDesc);
    showToast(eventDesc);
  };

  // 2. Handle Sando completion (called when 100P reached and cut animation completes)
  const handleSandoCompleted = (districtId: number, recipe: SandoRecipe, contributors: string[]) => {
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

        // Subtract 100 points from currentPoints
        const remainingCurrent = Math.max(0, d.currentPoints - 100);

        return {
          ...d,
          currentPoints: remainingCurrent,
          completedSandos: [...d.completedSandos, newSando],
        };
      })
    );

    const eventDesc = `🚨 [${activeDistrict.name}] ${activeDistrict.completedSandos.length + 1}번째 '${recipe.name}' 완성!! 🏆`;
    setLatestEventText(eventDesc);
    showToast(eventDesc);
  };

  const handleResetAllData = () => {
    setDistricts(INITIAL_DISTRICTS);
    localStorage.removeItem('fruit_sando_districts');
    showToast('모든 데이터가 초기화되었습니다.');
  };

  return (
    <div className="min-h-screen bg-cream-50/70 p-3 sm:p-5 md:p-8 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-stone-900/95 text-white px-5 py-3 rounded-2xl shadow-2xl border-2 border-amber-400 flex items-center gap-2 text-xs md:text-sm font-black animate-popIn">
          <span className="text-lg">📢</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Broadcast Screen Mode */}
      {isBroadcastMode ? (
        <BroadcastView
          districts={districts}
          onExit={() => setIsBroadcastMode(false)}
          latestEvent={latestEventText}
        />
      ) : (
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <EventHeader
            districts={districts}
            activeDistrictId={activeDistrictId}
            onSelectDistrict={(id) => setActiveDistrictId(id)}
          />

          {/* Main 2-Column or Stacked Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Active District Sando Assembly & Cutting Kitchen (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <SandoKitchen
                district={activeDistrict}
                onSandoCompleted={handleSandoCompleted}
                onOpenMissionModal={() => setIsMissionModalOpen(true)}
                activeContributor={activeDistrict.members[0]?.name || '구역원'}
              />

              {/* Showcase of completed sandos for active district */}
              <SandoShowcase district={activeDistrict} />
            </div>

            {/* Right: TOP 3 Victory Podium & Overall Leaderboard (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <Top3Podium
                districts={districts}
                onSelectDistrict={(id) => setActiveDistrictId(id)}
                activeDistrictId={activeDistrictId}
              />
            </div>
          </div>
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

      {/* Organizer / Finding Team Admin Control Panel */}
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

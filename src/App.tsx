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
import { Utensils, Trophy } from 'lucide-react';

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
        recipe: SANDO_RECIPES[0], // Strawberry
        sandoNumber: 1,
        completedAt: '11:20',
        contributors: ['김은혜', '박민수'],
      },
      {
        id: 'sando_1_2',
        districtId: 1,
        districtName: '1구역',
        recipe: SANDO_RECIPES[2], // Green grape
        sandoNumber: 2,
        completedAt: '13:45',
        contributors: ['새신자 지우', '이하은'],
      },
    ],
    members: [
      { name: '김은혜(구역장)', roleFruit: '식빵', avatar: '' },
      { name: '새신자 지우', roleFruit: '딸기', avatar: '' },
      { name: '박민수', roleFruit: '생크림', avatar: '' },
      { name: '이하은', roleFruit: '샤인머스캣', avatar: '' },
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
        recipe: SANDO_RECIPES[3], // Mango
        sandoNumber: 1,
        completedAt: '10:50',
        contributors: ['박준형', '최정우'],
      },
      {
        id: 'sando_2_2',
        districtId: 2,
        districtName: '2구역',
        recipe: SANDO_RECIPES[0], // Strawberry
        sandoNumber: 2,
        completedAt: '12:15',
        contributors: ['새신자 수진', '김수아'],
      },
      {
        id: 'sando_2_3',
        districtId: 2,
        districtName: '2구역',
        recipe: SANDO_RECIPES[5], // Kiwi mango mix
        sandoNumber: 3,
        completedAt: '15:10',
        contributors: ['2구역 연합'],
      },
    ],
    members: [
      { name: '박준형(구역장)', roleFruit: '식빵', avatar: '' },
      { name: '새신자 수진', roleFruit: '애플망고', avatar: '' },
      { name: '최정우', roleFruit: '감귤', avatar: '' },
      { name: '김수아', roleFruit: '블루베리', avatar: '' },
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
        recipe: SANDO_RECIPES[1], // Tangerine
        sandoNumber: 1,
        completedAt: '11:05',
        contributors: ['이민지', '강찬우'],
      },
      {
        id: 'sando_3_2',
        districtId: 3,
        districtName: '3구역',
        recipe: SANDO_RECIPES[4], // Fig
        sandoNumber: 2,
        completedAt: '14:30',
        contributors: ['새신자 영호', '윤다솜'],
      },
    ],
    members: [
      { name: '이민지(구역장)', roleFruit: '식빵', avatar: '' },
      { name: '새신자 영호', roleFruit: '샤인머스캣', avatar: '' },
      { name: '강찬우', roleFruit: '딸기', avatar: '' },
      { name: '윤다솜', roleFruit: '생크림', avatar: '' },
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
        recipe: SANDO_RECIPES[0], // Strawberry
        sandoNumber: 1,
        completedAt: '13:00',
        contributors: ['최도윤', '새신자 서연'],
      },
    ],
    members: [
      { name: '최도윤(구역장)', roleFruit: '식빵', avatar: '' },
      { name: '새신자 서연', roleFruit: '블루베리', avatar: '' },
      { name: '임재현', roleFruit: '망고', avatar: '' },
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
      { name: '정소율(구역장)', roleFruit: '식빵', avatar: '' },
      { name: '새신자 현우', roleFruit: '딸기', avatar: '' },
      { name: '오세린', roleFruit: '감귤', avatar: '' },
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
      { name: '한시온(구역장)', roleFruit: '식빵', avatar: '' },
      { name: '새신자 나은', roleFruit: '샤인머스캣', avatar: '' },
      { name: '송원빈', roleFruit: '생크림', avatar: '' },
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

  const [activeDistrictId, setActiveDistrictId] = useState<number>(2);
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
    localStorage.setItem('fruit_sando_districts', JSON.stringify(districts));
  }, [districts]);

  const activeDistrict = districts.find((d) => d.id === activeDistrictId) || districts[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Add points
  const handleAddPoints = (districtId: number, addedPoints: number, missionTitle?: string, contributor?: string) => {
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
    setDistricts(INITIAL_DISTRICTS);
    localStorage.removeItem('fruit_sando_districts');
    showToast('데이터가 초기화되었습니다.');
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] p-3 sm:p-5 md:p-8">
      {/* Clean Toast Notification */}
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
          {/* Header with Poster Feature */}
          <EventHeader
            districts={districts}
            activeDistrictId={activeDistrictId}
            onSelectDistrict={(id) => setActiveDistrictId(id)}
          />

          {/* Simple Tab Switcher (우리 구역 산도 vs 실시간 랭킹) */}
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
              <span>실시간 랭킹</span>
            </button>
          </div>

          {/* Tab 1: Our District Kitchen & Sando Showcase */}
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

          {/* Tab 2: Live Leaderboard / Ranking */}
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

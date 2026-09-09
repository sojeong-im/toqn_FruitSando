import { Mission } from '../types';

export const OFFICIAL_MISSIONS: Mission[] = [
  // 🔴 노방
  {
    id: 'm_nobang_1',
    category: '노방',
    title: '바이브 노방 시뮬 동글뱅이',
    points: 1,
    description: '구역원과 함께 밝은 텐션으로 시뮬레이션 완주!',
    icon: '✨',
    badgeColor: 'bg-rose-500 text-white',
  },
  {
    id: 'm_nobang_2',
    category: '노방',
    title: '부찾교에게 노방멘트 시뮬 컨펌',
    points: 5,
    description: '자연스러운 멘트 피드백 & 컨펌 완료',
    icon: '🎙️',
    badgeColor: 'bg-rose-500 text-white',
  },
  {
    id: 'm_nobang_3',
    category: '노방',
    title: '말걸기 10회 달성',
    points: 5,
    description: '용기 내어 따뜻한 인사와 말걸기 10회 성공',
    icon: '💬',
    badgeColor: 'bg-rose-500 text-white',
  },
  {
    id: 'm_nobang_4',
    category: '노방',
    title: '스탑 1회 성공',
    points: 2,
    description: '발걸음을 멈추고 귀 기울여준 영혼과의 만남',
    icon: '🛑',
    badgeColor: 'bg-rose-500 text-white',
  },

  // 🔴 지인
  {
    id: 'm_friend_1',
    category: '지인',
    title: '지인 피드백 투두이행 1개',
    points: 2,
    description: '소중한 관계를 위해 정성스런 투두 이행',
    icon: '💌',
    badgeColor: 'bg-orange-500 text-white',
  },

  // 🔴 팀/소모임 점수
  {
    id: 'm_team_1',
    category: '팀/소모임',
    title: '티엠(소모임, 노방 등) 1회',
    points: 1,
    description: '구역원들이 한마음으로 모여 기도하고 연합!',
    icon: '🤝',
    badgeColor: 'bg-amber-500 text-white',
  },

  // 🔴 개척 활동
  {
    id: 'm_pioneer_1',
    category: '개척',
    title: '개척지인 글 올리기',
    points: 2,
    description: '정성 가득한 나눔글 등록 완료',
    icon: '📝',
    badgeColor: 'bg-emerald-500 text-white',
  },
  {
    id: 'm_pioneer_2',
    category: '개척',
    title: '개척지인 9양식지 완성',
    points: 3,
    description: '세심하게 채운 9양식지 완성',
    icon: '📋',
    badgeColor: 'bg-emerald-500 text-white',
  },

  // 🔴 찾기 점수
  {
    id: 'm_find_1',
    category: '찾기',
    title: '타찾 컨펌',
    points: 10,
    description: '보석 같은 영혼 찾기 컨펌 완료!',
    icon: '💎',
    badgeColor: 'bg-blue-500 text-white',
  },
  {
    id: 'm_find_2',
    category: '찾기',
    title: '상예 컨펌',
    points: 20,
    description: '대박 성과! 상예 컨펌 완료 (20점 점프!)',
    icon: '🌟',
    badgeColor: 'bg-indigo-600 text-white',
  },

  // 🔴 특별 점수
  {
    id: 'm_special_1',
    category: '특별',
    title: '담당 팀장님 동명이인 타찾',
    points: 25,
    description: '기적 같은 발견! 팀장님과 동명이인 타찾 성공!',
    icon: '👑',
    badgeColor: 'bg-purple-600 text-white',
  },
  {
    id: 'm_special_2',
    category: '특별',
    title: '지역장님 동명이인 타찾',
    points: 30,
    description: '초대박 보너스! 지역장님과 동명이인 타찾 달성!!',
    icon: '🔥',
    badgeColor: 'bg-fuchsia-600 text-white',
  },
];

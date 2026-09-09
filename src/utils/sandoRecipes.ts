import { SandoRecipe } from '../types';

export const SANDO_RECIPES: SandoRecipe[] = [
  {
    id: 'strawberry',
    name: '생딸기 듬뿍 산도',
    subName: 'Fresh Strawberry Sando',
    type: 'berry',
    description: '포스터 5번째 산도! 달콤한 설향 딸기가 콕콕 박힌 클래식 베스트셀러',
    tag: '달콤스테디셀러',
    bgGradient: 'from-rose-400 to-pink-500',
    fruits: [
      { emoji: '🍓', name: '설향딸기', color: '#FF3366' },
      { emoji: '🍓', name: '산딸기', color: '#E60039' },
      { emoji: '🥛', name: '우유생크림', color: '#FFFFFF' },
    ],
  },
  {
    id: 'tangerine',
    name: '통귤 & 오렌지 산도',
    subName: 'Jeju Mandarin Sando',
    type: 'citrus',
    description: '포스터 4번째 산도! 톡 터지는 새콤달콤 귤 알갱이가 가득한 비타민 산도',
    tag: '과즙팡팡',
    bgGradient: 'from-orange-400 to-amber-500',
    fruits: [
      { emoji: '🍊', name: '제주통귤', color: '#FB8500' },
      { emoji: '🍊', name: '오렌지', color: '#F77F00' },
      { emoji: '🥛', name: '우유생크림', color: '#FFFFFF' },
    ],
  },
  {
    id: 'greengrape',
    name: '청포도 & 샤인머스캣 산도',
    subName: 'Green Grape & Shine Muscat',
    type: 'green',
    description: '포스터 2번째 산도! 탱글탱글 아삭한 청포도와 샤인머스캣의 싱그러움',
    tag: '싱그러운청량함',
    bgGradient: 'from-emerald-400 to-green-500',
    fruits: [
      { emoji: '🍇', name: '샤인머스캣', color: '#74C69D' },
      { emoji: '🍈', name: '청포도', color: '#52B788' },
      { emoji: '🥛', name: '우유생크림', color: '#FFFFFF' },
    ],
  },
  {
    id: 'mango',
    name: '골든 망고 큐브 산도',
    subName: 'Golden Mango Cube Sando',
    type: 'tropical',
    description: '포스터 1번째 산도! 진한 노란빛의 프리미엄 망고 큐브가 듬뿍',
    tag: '달콤과즙폭발',
    bgGradient: 'from-amber-400 to-yellow-500',
    fruits: [
      { emoji: '🥭', name: '망고큐브', color: '#FFB703' },
      { emoji: '🍍', name: '골드파인', color: '#FD9E02' },
      { emoji: '🥛', name: '우유생크림', color: '#FFFFFF' },
    ],
  },
  {
    id: 'fig',
    name: '루비빛 무화과 산도',
    subName: 'Sweet Fig Sando',
    type: 'berry',
    description: '포스터 3번째 산도! 부드럽고 은은한 단맛의 제철 무화과 단면',
    tag: '감성가득',
    bgGradient: 'from-rose-500 to-red-600',
    fruits: [
      { emoji: '🌰', name: '생무화과', color: '#B93E54' },
      { emoji: '🍇', name: '루비씨앗', color: '#8E283B' },
      { emoji: '🥛', name: '우유생크림', color: '#FFFFFF' },
    ],
  },
  {
    id: 'kiwi_mango_mix',
    name: '골드키위 & 망고 믹스 산도',
    subName: 'Kiwi & Mango Special Sando',
    type: 'legendary',
    description: '포스터 6번째 산도! 상큼한 키위 휠과 달콤한 망고의 완벽한 앙상블',
    tag: '스페셜믹스',
    bgGradient: 'from-lime-500 to-amber-500',
    fruits: [
      { emoji: '🥝', name: '골드키위', color: '#52B788' },
      { emoji: '🥭', name: '망고큐브', color: '#FFB703' },
      { emoji: '🥛', name: '우유생크림', color: '#FFFFFF' },
    ],
  },
];

export function getRandomRecipe(sandoCount: number): SandoRecipe {
  // Cycle through or randomize the 6 poster recipes
  const index = (sandoCount - 1) % SANDO_RECIPES.length;
  return SANDO_RECIPES[index >= 0 ? index : Math.floor(Math.random() * SANDO_RECIPES.length)];
}

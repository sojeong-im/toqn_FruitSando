export type MissionCategory = '노방' | '지인' | '팀/소모임' | '개척' | '찾기' | '특별';

export interface Mission {
  id: string;
  category: MissionCategory;
  title: string;
  points: number;
  description?: string;
  icon: string;
  badgeColor: string;
}

export interface SandoRecipe {
  id: string;
  name: string;
  subName: string;
  type: 'berry' | 'green' | 'tropical' | 'citrus' | 'blueberry' | 'legendary';
  description: string;
  fruits: { emoji: string; name: string; color: string }[];
  tag: string;
  bgGradient: string;
}

export interface CompletedSando {
  id: string;
  districtId: number;
  districtName: string;
  recipe: SandoRecipe;
  sandoNumber: number; // e.g. "우리 구역 3번째 산도"
  completedAt: string;
  contributors: string[]; // e.g. ["민수", "소정", "은혜"]
}

export interface District {
  id: number;
  name: string;
  leader: string;
  points: number; // total cumulative points
  currentPoints: number; // points towards next sando (0 ~ 99)
  completedSandos: CompletedSando[];
  members: { name: string; roleFruit: string; avatar: string }[];
}

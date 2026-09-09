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
  districtId: string;
  districtName: string;
  recipe: SandoRecipe;
  sandoNumber: number;
  completedAt: string;
  contributors: string[];
}

export interface District {
  id: string; // e.g. '1-1', '2-3'
  name: string; // e.g. '1-1구역'
  team: number; // 1 ~ 6
  leader: string;
  points: number; // total cumulative points
  currentPoints: number; // points towards next sando (0 ~ 99)
  completedSandos: CompletedSando[];
  members: { name: string; roleFruit: string; avatar: string }[];
}

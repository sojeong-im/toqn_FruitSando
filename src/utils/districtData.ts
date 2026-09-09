import { District } from '../types';

export function createInitialDistricts(): District[] {
  const districts: District[] = [];

  for (let team = 1; team <= 6; team++) {
    for (let sub = 1; sub <= 5; sub++) {
      const id = `${team}-${sub}`;
      const name = `${team}-${sub}구역`;

      districts.push({
        id,
        name,
        team,
        leader: `${id} 구역장`,
        points: 0,
        currentPoints: 0,
        completedSandos: [],
        members: [
          { name: `${id} 구역장`, roleFruit: '식빵', avatar: '' },
          { name: '새신자', roleFruit: '딸기', avatar: '' },
          { name: '구역원 1', roleFruit: '생크림', avatar: '' },
          { name: '구역원 2', roleFruit: '샤인머스캣', avatar: '' },
        ],
      });
    }
  }

  // Pre-seed a few sample points for realistic leaderboard preview if empty
  // (e.g. 2-3 has 2 sandos, 1-2 has 1 sando, 3-4 has 1 sando)
  const seedTarget1 = districts.find((d) => d.id === '2-3');
  if (seedTarget1) {
    seedTarget1.points = 145;
    seedTarget1.currentPoints = 45;
  }

  const seedTarget2 = districts.find((d) => d.id === '1-2');
  if (seedTarget2) {
    seedTarget2.points = 120;
    seedTarget2.currentPoints = 20;
  }

  const seedTarget3 = districts.find((d) => d.id === '3-1');
  if (seedTarget3) {
    seedTarget3.points = 80;
    seedTarget3.currentPoints = 80;
  }

  return districts;
}

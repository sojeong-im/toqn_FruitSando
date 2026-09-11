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

  return districts;
}

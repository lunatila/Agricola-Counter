import { ResourceType } from '../types';

/**
 * Calculates the score contribution of a single resource category.
 * Implements the official Agricola scoring table.
 *
 * Extracted from GameContext so it can be reasoned about and tested
 * independently of React state.
 */
export function scoreResource(type: ResourceType, count: number): number {
  switch (type) {
    case 'soil':
      // 0-1: -1 | 2: 1 | 3: 2 | 4: 3 | 5+: 4
      if (count <= 1) return -1;
      if (count === 2) return 1;
      if (count === 3) return 2;
      if (count === 4) return 3;
      return 4;

    case 'fence':
    case 'vegetable':
      // 0: -1 | 1: 1 | 2: 2 | 3: 3 | 4+: 4
      if (count === 0) return -1;
      if (count === 1) return 1;
      if (count === 2) return 2;
      if (count === 3) return 3;
      return 4;

    case 'grain':
    case 'sheep':
      // 0: -1 | 1-3: 1 | 4-5: 2 | 6-7: 3 | 8+: 4
      if (count === 0) return -1;
      if (count <= 3) return 1;
      if (count <= 5) return 2;
      if (count <= 7) return 3;
      return 4;

    case 'boar':
      // 0: -1 | 1-2: 1 | 3-4: 2 | 5-6: 3 | 7+: 4
      if (count === 0) return -1;
      if (count <= 2) return 1;
      if (count <= 4) return 2;
      if (count <= 6) return 3;
      return 4;

    case 'cattle':
      // 0: -1 | 1: 1 | 2-3: 2 | 4-5: 3 | 6+: 4
      if (count === 0) return -1;
      if (count === 1) return 1;
      if (count <= 3) return 2;
      if (count <= 5) return 3;
      return 4;

    case 'empty':
      return -count; // -1 per empty space

    case 'fencedStable':
      return Math.min(count, 4); // 0-4, capped at 4

    case 'clayHouse':
      return count; // 1 per room

    case 'stoneHouse':
      return count * 2; // 2 per room

    case 'familyMembers':
      return count * 3; // 3 per member

    case 'bonus':
      return count; // 1 per bonus point

    case 'starve':
      return -count * 3; // -3 per begging card

    default:
      return 0;
  }
}

/**
 * Sums the score across all of a player's resources.
 */
export function calculatePlayerScore(
  resources: { type: ResourceType; count: number }[]
): number {
  return resources.reduce(
    (total, resource) => total + scoreResource(resource.type, resource.count),
    0
  );
}

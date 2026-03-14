import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Player, GameState, GamePhase, Resource, ResourceType } from '../types';
import { calculatePlayerScore } from '../utils/scoring';

// Resource icons — keyed by ResourceType for O(1) lookup.
const RESOURCE_ICONS: Record<ResourceType, ReturnType<typeof require>> = {
  soil: require('../../assets/images/soil_icon.png'),
  fence: require('../../assets/images/fence_icon.png'),
  grain: require('../../assets/images/grain_icon.png'),
  vegetable: require('../../assets/images/vegetable_icon.png'),
  sheep: require('../../assets/images/sheep_icon.png'),
  boar: require('../../assets/images/boar_icon.png'),
  cattle: require('../../assets/images/cattle_icon.png'),
  empty: require('../../assets/images/empty_icon.png'),
  fencedStable: require('../../assets/images/fencedStable_icon.png'),
  clayHouse: require('../../assets/images/clayHouse_icon.png'),
  stoneHouse: require('../../assets/images/stoneHouse_icon.png'),
  familyMembers: require('../../assets/images/initialFamily_icon.png'),
  bonus: require('../../assets/images/bonus_icon.png'),
  starve: require('../../assets/images/starve_icon.png'),
};

// Separate icons for each family-member count (2–5).
const FAMILY_ICONS: Record<number, ReturnType<typeof require>> = {
  2: require('../../assets/images/initialFamily_icon.png'),
  3: require('../../assets/images/3family_icon.png'),
  4: require('../../assets/images/4family_icon.png'),
  5: require('../../assets/images/5family_icon.png'),
};

const RESOURCE_NAMES: Record<ResourceType, string> = {
  soil: 'Fields',
  fence: 'Fences',
  grain: 'Grain',
  vegetable: 'Vegetables',
  sheep: 'Sheep',
  boar: 'Wild Boar',
  cattle: 'Cattle',
  empty: 'Empty Spaces',
  fencedStable: 'Fenced Stables',
  clayHouse: 'Clay Rooms',
  stoneHouse: 'Stone Rooms',
  familyMembers: 'Family Members',
  bonus: 'Bonus Points',
  starve: 'Begging Cards',
};

const RESOURCE_ORDER: ResourceType[] = [
  'soil', 'fence', 'grain', 'vegetable', 'sheep', 'boar', 'cattle',
  'empty', 'fencedStable', 'clayHouse', 'stoneHouse', 'familyMembers',
  'bonus', 'starve',
];

const DEFAULT_PLAYER_COLORS = ['#4ecda9ff', '#eee01bff', '#e1ba66ff', '#7f1522'];

const createInitialResources = (): Resource[] =>
  RESOURCE_ORDER.map((type) => ({
    type,
    name: RESOURCE_NAMES[type],
    icon: RESOURCE_ICONS[type],
    count: type === 'familyMembers' ? 2 : 0,
  }));

// ---------------------------------------------------------------------------

interface GameContextType {
  gameState: GameState;
  initializeGame: (playerCount: number) => void;
  setPlayerColor: (playerId: number, color: string) => void;
  updateResource: (playerId: number, resourceType: ResourceType, delta: number) => void;
  setPlayerReady: (playerId: number, ready: boolean) => void;
  setPhase: (phase: GamePhase) => void;
  calculateScores: () => void;
  resetGame: () => void;
  setExpansion: (value: boolean) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

const INITIAL_STATE: GameState = {
  playerCount: 0,
  players: [],
  currentPhase: 'color-selection',
  playersReady: [],
  isFarmersOfTheMoor: false,
};

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);

  const initializeGame = (playerCount: number) => {
    const players: Player[] = Array.from({ length: playerCount }, (_, i) => ({
      id: i,
      color: DEFAULT_PLAYER_COLORS[i] ?? '#CCCCCC',
      resources: createInitialResources(),
      score: 0,
    }));

    setGameState((prev) => ({
      playerCount,
      players,
      currentPhase: 'color-selection',
      playersReady: Array(playerCount).fill(false),
      isFarmersOfTheMoor: prev.isFarmersOfTheMoor, // preserve expansion selection
    }));
  };

  const setPlayerColor = (playerId: number, color: string) => {
    setGameState((prev) => ({
      ...prev,
      players: prev.players.map((player) =>
        player.id === playerId ? { ...player, color } : player
      ),
    }));
  };

  const updateResource = (playerId: number, resourceType: ResourceType, delta: number) => {
    setGameState((prev) => ({
      ...prev,
      players: prev.players.map((player) => {
        if (player.id !== playerId) return player;

        return {
          ...player,
          resources: player.resources.map((resource) => {
            if (resource.type !== resourceType) return resource;

            if (resourceType === 'familyMembers') {
              const newCount = Math.max(2, Math.min(5, resource.count + delta));
              return {
                ...resource,
                count: newCount,
                icon: FAMILY_ICONS[newCount] ?? FAMILY_ICONS[2],
              };
            }

            return { ...resource, count: Math.max(0, resource.count + delta) };
          }),
        };
      }),
    }));
  };

  const setPlayerReady = (playerId: number, ready: boolean) => {
    setGameState((prev) => {
      const playersReady = [...prev.playersReady];
      playersReady[playerId] = ready;
      return { ...prev, playersReady };
    });
  };

  const setPhase = (phase: GamePhase) => {
    setGameState((prev) => ({ ...prev, currentPhase: phase }));
  };

  const calculateScores = () => {
    setGameState((prev) => ({
      ...prev,
      players: prev.players.map((player) => ({
        ...player,
        score: calculatePlayerScore(player.resources),
      })),
    }));
  };

  const resetGame = () => {
    setGameState(INITIAL_STATE);
  };

  const setExpansion = (value: boolean) => {
    setGameState((prev) => ({ ...prev, isFarmersOfTheMoor: value }));
  };

  const value: GameContextType = {
    gameState,
    initializeGame,
    setPlayerColor,
    updateResource,
    setPlayerReady,
    setPhase,
    calculateScores,
    resetGame,
    setExpansion,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

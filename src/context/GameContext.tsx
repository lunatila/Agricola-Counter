import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Player, GameState, Resource, ResourceType } from '../types';

// Resource icons mapping
const resourceIcons = {
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
  familyMembers: require('../../assets/images/initialFamily_icon.png'), // Start with 2 members
  bonus: require('../../assets/images/bonus_icon.png'),
  starve: require('../../assets/images/starve_icon.png'),
};

// Family member icons for different counts
const familyIcons = {
  2: require('../../assets/images/initialFamily_icon.png'),
  3: require('../../assets/images/3family_icon.png'),
  4: require('../../assets/images/4family_icon.png'),
  5: require('../../assets/images/5family_icon.png'),
};

// Resource names in Portuguese
const resourceNames = {
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

// Initialize resources for a player
const createInitialResources = (): Resource[] => {
  const resourceTypes: ResourceType[] = [
    'soil',
    'fence',
    'grain',
    'vegetable',
    'sheep',
    'boar',
    'cattle',
    'empty',
    'fencedStable',
    'clayHouse',
    'stoneHouse',
    'familyMembers',
    'bonus',
    'starve',
  ];

  return resourceTypes.map((type) => ({
    type,
    name: resourceNames[type],
    icon: resourceIcons[type],
    count: type === 'familyMembers' ? 2 : 0, // Family starts with 2 members
  }));
};

interface GameContextType {
  gameState: GameState;
  initializeGame: (playerCount: number) => void;
  setPlayerColor: (playerId: number, color: string) => void;
  updateResource: (playerId: number, resourceType: ResourceType, delta: number) => void;
  setPlayerReady: (playerId: number, ready: boolean) => void;
  setPhase: (phase: GameState['currentPhase']) => void;
  calculateScores: () => void;
  resetGame: () => void;
  setExpansion: (value: boolean) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
};

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>({
    playerCount: 0,
    players: [],
    currentPhase: 'color-selection',
    playersReady: [],
    isFarmersOfTheMoor: false,
  });

  // Initialize game with specified number of players
  const initializeGame = (playerCount: number) => {
    // Default colors: Teal, Yellow, Wood, Vinho
    const defaultColors = ['#4ecda9ff', '#eee01bff', '#e1ba66ff', '#7f1522'];

    const players: Player[] = Array.from({ length: playerCount }, (_, i) => ({
      id: i,
      color: defaultColors[i] || '#CCCCCC', // Use default colors
      resources: createInitialResources(),
      score: 0,
    }));

    setGameState({
      playerCount,
      players,
      currentPhase: 'color-selection',
      playersReady: Array(playerCount).fill(false),
      isFarmersOfTheMoor: gameState.isFarmersOfTheMoor, // Maintain selection
    });
  };

  // Set color for a specific player
  const setPlayerColor = (playerId: number, color: string) => {
    setGameState((prev) => ({
      ...prev,
      players: prev.players.map((player) =>
        player.id === playerId ? { ...player, color } : player
      ),
    }));
  };

  // Update resource count for a player
  const updateResource = (playerId: number, resourceType: ResourceType, delta: number) => {
    setGameState((prev) => ({
      ...prev,
      players: prev.players.map((player) => {
        if (player.id === playerId) {
          return {
            ...player,
            resources: player.resources.map((resource) => {
              if (resource.type === resourceType) {
                let newCount = resource.count + delta;

                // Special handling for familyMembers: min=2, max=5
                if (resourceType === 'familyMembers') {
                  newCount = Math.max(2, Math.min(5, newCount));
                  // Update icon based on count
                  const newIcon = familyIcons[newCount as keyof typeof familyIcons] || familyIcons[2];
                  return { ...resource, count: newCount, icon: newIcon };
                } else {
                  newCount = Math.max(0, newCount);
                  return { ...resource, count: newCount };
                }
              }
              return resource;
            }),
          };
        }
        return player;
      }),
    }));
  };

  // Mark player as ready
  const setPlayerReady = (playerId: number, ready: boolean) => {
    setGameState((prev) => {
      const newReady = [...prev.playersReady];
      newReady[playerId] = ready;
      return {
        ...prev,
        playersReady: newReady,
      };
    });
  };

  // Set current game phase
  const setPhase = (phase: GameState['currentPhase']) => {
    setGameState((prev) => ({
      ...prev,
      currentPhase: phase,
    }));
  };

  // Calculate scores based on Agricola scoring rules
  const calculateScores = () => {
    setGameState((prev) => ({
      ...prev,
      players: prev.players.map((player) => {
        let score = 0;

        player.resources.forEach((resource) => {
          const count = resource.count;

          switch (resource.type) {
            case 'soil':
              // 0-1: -1P, 2: 1P, 3: 2P, 4: 3P, 5+: 4P
              if (count <= 1) score -= 1;
              else if (count === 2) score += 1;
              else if (count === 3) score += 2;
              else if (count === 4) score += 3;
              else score += 4;
              break;

            case 'fence':
              // 0: -1P, 1: 1P, 2: 2P, 3: 3P, 4+: 4P
              if (count === 0) score -= 1;
              else if (count === 1) score += 1;
              else if (count === 2) score += 2;
              else if (count === 3) score += 3;
              else score += 4;
              break;

            case 'grain':
              // 0: -1P, 1-3: 1P, 4-5: 2P, 6-7: 3P, 8+: 4P
              if (count === 0) score -= 1;
              else if (count >= 1 && count <= 3) score += 1;
              else if (count >= 4 && count <= 5) score += 2;
              else if (count >= 6 && count <= 7) score += 3;
              else score += 4;
              break;

            case 'vegetable':
              // 0: -1P, 1: 1P, 2: 2P, 3: 3P, 4+: 4P
              if (count === 0) score -= 1;
              else if (count === 1) score += 1;
              else if (count === 2) score += 2;
              else if (count === 3) score += 3;
              else score += 4;
              break;

            case 'sheep':
              // 0: -1P, 1-3: 1P, 4-5: 2P, 6-7: 3P, 8+: 4P
              if (count === 0) score -= 1;
              else if (count >= 1 && count <= 3) score += 1;
              else if (count >= 4 && count <= 5) score += 2;
              else if (count >= 6 && count <= 7) score += 3;
              else score += 4;
              break;

            case 'boar':
              // 0: -1P, 1-2: 1P, 3-4: 2P, 5-6: 3P, 7+: 4P
              if (count === 0) score -= 1;
              else if (count >= 1 && count <= 2) score += 1;
              else if (count >= 3 && count <= 4) score += 2;
              else if (count >= 5 && count <= 6) score += 3;
              else score += 4;
              break;

            case 'cattle':
              // 0: -1P, 1: 1P, 2-3: 2P, 4-5: 3P, 6+: 4P
              if (count === 0) score -= 1;
              else if (count === 1) score += 1;
              else if (count >= 2 && count <= 3) score += 2;
              else if (count >= 4 && count <= 5) score += 3;
              else score += 4;
              break;

            case 'empty':
              // -1P for each
              score -= count;
              break;

            case 'fencedStable':
              // 0: 0, 1: 1P, 2: 2P, 3: 3P, 4+: 4P
              if (count === 1) score += 1;
              else if (count === 2) score += 2;
              else if (count === 3) score += 3;
              else if (count >= 4) score += 4;
              break;

            case 'clayHouse':
              // 1P for each
              score += count;
              break;

            case 'stoneHouse':
              // 2P for each
              score += count * 2;
              break;

            case 'familyMembers':
              // 3P for each
              score += count * 3;
              break;

            case 'bonus':
              // 1P for each
              score += count;
              break;

            case 'starve':
              // -3P for each
              score -= count * 3;
              break;
          }
        });

        return { ...player, score };
      }),
    }));
  };

  // Reset game to initial state
  const resetGame = () => {
    setGameState({
      playerCount: 0,
      players: [],
      currentPhase: 'color-selection',
      playersReady: [],
      isFarmersOfTheMoor: false,
    });
  };

  const setExpansion = (value: boolean) => {
    setGameState((prev) => ({
      ...prev,
      isFarmersOfTheMoor: value,
    }));
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

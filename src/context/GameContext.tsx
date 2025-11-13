import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Player, GameState, Resource, ResourceType } from '../types';

// Resource icons mapping (placeholders - actual images should be placed in assets/images/)
const resourceIcons = {
  sheep: require('../../assets/images/sheep_icon.png'),
  boar: require('../../assets/images/boar_icon.png'),
  cattle: require('../../assets/images/cattle_icon.png'),
  grain: require('../../assets/images/grain_icon.png'),
  vegetable: require('../../assets/images/vegetable_icon.png'),
  wood: require('../../assets/images/wood_icon.png'),
  clay: require('../../assets/images/clay_icon.png'),
  stone: require('../../assets/images/stone_icon.png'),
  reed: require('../../assets/images/reed_icon.png'),
};

// Resource names in Portuguese
const resourceNames = {
  sheep: 'Ovelhas',
  boar: 'Javali',
  cattle: 'Gado',
  grain: 'Grãos',
  vegetable: 'Legumes',
  wood: 'Madeira',
  clay: 'Argila',
  stone: 'Pedra',
  reed: 'Junco',
};

// Initialize resources for a player
const createInitialResources = (): Resource[] => {
  const resourceTypes: ResourceType[] = [
    'sheep',
    'boar',
    'cattle',
    'grain',
    'vegetable',
    'wood',
    'clay',
    'stone',
    'reed',
  ];

  return resourceTypes.map((type) => ({
    type,
    name: resourceNames[type],
    icon: resourceIcons[type],
    count: 0,
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
  });

  // Initialize game with specified number of players
  const initializeGame = (playerCount: number) => {
    const players: Player[] = Array.from({ length: playerCount }, (_, i) => ({
      id: i,
      color: '#CCCCCC', // Default color
      resources: createInitialResources(),
      score: 0,
    }));

    setGameState({
      playerCount,
      players,
      currentPhase: 'color-selection',
      playersReady: Array(playerCount).fill(false),
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
                const newCount = Math.max(0, resource.count + delta);
                return { ...resource, count: newCount };
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

  // Calculate scores based on Agricola scoring rules (simplified version)
  const calculateScores = () => {
    setGameState((prev) => ({
      ...prev,
      players: prev.players.map((player) => {
        let score = 0;

        // Simplified scoring: each resource type contributes points
        player.resources.forEach((resource) => {
          // Animals score differently
          if (resource.type === 'sheep') {
            score += Math.min(resource.count, 1) > 0 ? 1 : -1;
            if (resource.count >= 4) score += 1;
            if (resource.count >= 6) score += 1;
            if (resource.count >= 8) score += 1;
          } else if (resource.type === 'boar') {
            score += Math.min(resource.count, 1) > 0 ? 1 : -1;
            if (resource.count >= 3) score += 1;
            if (resource.count >= 5) score += 1;
            if (resource.count >= 7) score += 1;
          } else if (resource.type === 'cattle') {
            score += Math.min(resource.count, 1) > 0 ? 1 : -1;
            if (resource.count >= 2) score += 1;
            if (resource.count >= 4) score += 1;
            if (resource.count >= 6) score += 1;
          } else if (resource.type === 'grain' || resource.type === 'vegetable') {
            // Grain and vegetables
            if (resource.count >= 1) score += 1;
            if (resource.count >= 4) score += 1;
            if (resource.count >= 6) score += 1;
            if (resource.count >= 8) score += 1;
          } else {
            // Other resources contribute 1 point per 3 items
            score += Math.floor(resource.count / 3);
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
    });
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
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

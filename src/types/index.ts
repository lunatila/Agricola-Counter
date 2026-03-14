import { ImageSourcePropType } from 'react-native';

export type ResourceType =
  | 'soil'
  | 'fence'
  | 'grain'
  | 'vegetable'
  | 'sheep'
  | 'boar'
  | 'cattle'
  | 'empty'
  | 'fencedStable'
  | 'clayHouse'
  | 'stoneHouse'
  | 'familyMembers'
  | 'bonus'
  | 'starve';

export interface Resource {
  type: ResourceType;
  name: string;
  icon: ImageSourcePropType;
  count: number;
}

export interface Player {
  id: number;
  color: string;
  resources: Resource[];
  score: number;
}

export type GamePhase = 'color-selection' | 'resource-counting' | 'scoring';

export interface GameState {
  playerCount: number;
  players: Player[];
  currentPhase: GamePhase;
  playersReady: boolean[];
  isFarmersOfTheMoor: boolean;
}

export type RootStackParamList = {
  MainMenu: undefined;
  About: undefined;
  ExpansionSelect: undefined;
  PlayerCountSelection: undefined;
  GameScreen: { playerCount: number };
  ScoreScreen: undefined;
};

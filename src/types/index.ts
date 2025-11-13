// Type definitions for Agricola Counter app

export type ResourceType =
  | 'sheep'
  | 'boar'
  | 'cattle'
  | 'grain'
  | 'vegetable'
  | 'wood'
  | 'clay'
  | 'stone'
  | 'reed';

export interface Resource {
  type: ResourceType;
  name: string;
  icon: any; // Image source
  count: number;
}

export interface Player {
  id: number;
  color: string;
  resources: Resource[];
  score: number;
}

export interface GameState {
  playerCount: number;
  players: Player[];
  currentPhase: 'color-selection' | 'resource-counting' | 'scoring';
  playersReady: boolean[];
}

export type RootStackParamList = {
  MainMenu: undefined;
  About: undefined;
  PlayerCountSelection: undefined;
  GameScreen: { playerCount: number };
  ScoreScreen: undefined;
};

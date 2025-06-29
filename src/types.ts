export interface Point {
  x: number;
  y: number;
}

export interface PlacedPoint extends Point {
  t: number;
}

export interface Curve {
  name: string;
  func: (t: number) => Point;
  t_min: number;
  t_max: number;
  description: string;
}

export interface RoundData {
  roundNumber: number;
  curve: string;
  placedPoints: PlacedPoint[];
  approximatedLength: number;
  actualLength: number;
  score: number;
}

export interface GameData {
  gameId: string;
  playerSessionId: string;
  startTime: number;
  endTime: number | null;
  rounds: RoundData[];
  totalScore: number;
}
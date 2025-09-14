export interface Player {
  id: string;
  nickname: string;
  cards: string[];
}

export interface RoomData {
  roomId: string;
  hostID: string;
  players: Player[];
  timer: number;
  cards: number;
  deck: string[];
  status: "menu" | "game" | "complete";
  turn: string;
  numTurns: number;
}

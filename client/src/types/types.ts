export interface RoomData {
  roomId: string;
  hostId: string;
  players: [{ nickname: string; id: string; cards: [] }];
  timer: number;
  cards: number;
  deck: [];
  status: "menu" | "game" | "complete";
}

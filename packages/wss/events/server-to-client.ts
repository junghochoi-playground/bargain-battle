import { UserPresencePayload } from "./common";
import { Participant } from "../types";

export type GameStateUpdatePayload = {
  raceState: {
    roomId: string;
    participants: Participant[]
  };
};

export type SessionCreatePayload = {
  sessionID: string
}

export interface ServerToClientEvents {
  UserJoin: (payload: UserPresencePayload) => void;
  UserLeave: (payload: UserPresencePayload) => void;
  GameStateUpdate: (payload: GameStateUpdatePayload) => void;
  SessionCreate: (payload: SessionCreatePayload) => void; 
}
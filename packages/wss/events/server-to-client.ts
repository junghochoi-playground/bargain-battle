import { UserPresencePayload } from "./common";
import { Participant } from "../types";

export type GameStateUpdatePayload = {
  roomId: string;
  participants: Participant[]
  
};

export type UserInitializationPayload = {
  sessionID: string,
  userId: string
  userData?: Participant
}

export interface ServerToClientEvents {
  UserJoin: (payload: UserPresencePayload) => void;
  UserLeave: (payload: UserPresencePayload) => void;
  GameStateUpdate: (payload: GameStateUpdatePayload) => void;
  UserInitialization: (payload: UserInitializationPayload) => void; 
}
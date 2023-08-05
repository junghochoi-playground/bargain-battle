import { UserPresencePayload } from "./common";

export interface ServerToClientEvents {
  UserJoin: (payload: UserPresencePayload) => void;
  UserLeave: (payload: UserPresencePayload) => void;
}
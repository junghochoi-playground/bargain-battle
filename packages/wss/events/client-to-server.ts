import { UserPresencePayload } from "./common";

export interface ClientToServerEvents {
  UserJoin: (payload: UserPresencePayload) => void;
  UserLeave: (payload: UserPresencePayload) => void;
}




  
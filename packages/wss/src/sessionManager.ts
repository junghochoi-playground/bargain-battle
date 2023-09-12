import { UserPresencePayload } from "../events"; 

type SessionID = string;


/* abstract */ class SessionStore {
    findSession(id: SessionID) {}
    saveSession(id: SessionID, session: UserPresencePayload) {}
    findAllSessions() {}
  }
  


class InMemorySessionStore extends SessionStore {
    sessions: Map<SessionID, UserPresencePayload>;
    constructor() {
        super();
        this.sessions = new Map();
    }

    findSession(id: SessionID): UserPresencePayload | undefined{
        return this.sessions.get(id);
    }

    saveSession(id: SessionID, session: UserPresencePayload): void {
        this.sessions.set(id, session);
    }

    findAllSessions() {
        return [...this.sessions.values()];
    }
} 

export { InMemorySessionStore }
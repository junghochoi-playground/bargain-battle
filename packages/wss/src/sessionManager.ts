type SessionID = string;
interface SessionData {
    userId: string,
    connected: boolean
}
/* abstract */ class SessionStore {
    findSession(id: SessionID) {}
    saveSession(id: SessionID, session: SessionData) {}
    findAllSessions() {}
  }



class InMemorySessionStore extends SessionStore {
    sessions: Map<SessionID, SessionData>;
    constructor() {
        super();
        this.sessions = new Map();
    }

    findSession(id: SessionID): SessionData | undefined{
        return this.sessions.get(id);
    }

    saveSession(id: SessionID, session: SessionData): void {
        this.sessions.set(id, session);
    }

    findAllSessions() {
        return [...this.sessions.values()];
    }
} 

export { InMemorySessionStore }
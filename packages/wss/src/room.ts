interface User {
  username: string,
  socketId: string
}


type SocketId = string;




export class Room {
    private id: string;
    private participants: Map<SocketId, User>;
  
    constructor(id: string) {
      this.id = id;
      this.participants = new Map();
    }
  
    get roomId(): string {
      return this.id;
    }
  
    addParticipant(user: User): void {
      this.participants.set(user.socketId, user);
    }
  
    removeParticipant(socketId: string): void {
      this.participants.delete(socketId);
    }
  
    getParticipantCount(): number {
      return this.participants.size;
    }
  }
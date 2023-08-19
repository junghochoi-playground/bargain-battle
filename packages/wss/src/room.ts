import { Participant, SocketId } from "../types";





export class Room {
  private id: string;
  private participants: Map<SocketId, Participant>;

  constructor(id: string) {
    this.id = id;
    this.participants = new Map();
  }

  get roomId(): string {
    return this.id;
  }

  addParticipant(user: Participant): void {
    this.participants.set(user.socketId, user);
  }

  removeParticipant(socketId: SocketId): void {
    this.participants.delete(socketId);
  }

  getParticipantCount(): number {
    return this.participants.size;
  }
  getParticipants(): Participant[] {
    return Array.from(this.participants.values());
  }
  hasParticipant(socketId: SocketId): boolean {
    return this.participants.has(socketId);
  }
 }
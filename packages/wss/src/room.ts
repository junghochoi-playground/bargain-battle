import { Participant } from "../types";



type SocketId = string;




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

  removeParticipant(socketId: string): void {
    this.participants.delete(socketId);
  }

  getParticipantCount(): number {
    return this.participants.size;
  }
  getParticipants(): Participant[] {
    return Array.from(this.participants.values());
  }
 }
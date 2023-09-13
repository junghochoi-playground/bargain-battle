import { Participant, UserId } from "../types";





export class Room {
  private id: string;
  private participants: Map<UserId, Participant>;

  constructor(id: string) {
    this.id = id;
    this.participants = new Map();
  }

  get roomId(): string {
    return this.id;
  }

  addParticipant(user: Participant): void {
    this.participants.set(user.id, user);
  }

  removeParticipant(userId: UserId): void {
    this.participants.delete(userId);
  }

  getParticipantCount(): number {
    return this.participants.size;
  }
  getParticipants(): Participant[] {
    return Array.from(this.participants.values());
  }
  hasParticipant(userId: UserId): boolean {
    return this.participants.has(userId);
  }
 }
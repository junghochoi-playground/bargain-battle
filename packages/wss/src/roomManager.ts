import { Participant, UserId } from '../types';
import { Room } from './room'

type RoomId = string;

export class RoomManager {
    private rooms: Map<RoomId, Room>;
  
    constructor() {
      this.rooms = new Map();
    }
  
    createRoom(id: string): Room {
      const room: Room = new Room(id);
      this.rooms.set(id, room);
      console.log(`CREATED ROOM - "${id}"`);
      return room;
    }

    deleteRoom(id: string): void {
      this.rooms.delete(id);
    }
  
    joinRoom(roomId: string, user: Participant): boolean {

      if (!this.rooms.has(roomId)) {
        this.createRoom(roomId);
      }


      const room = this.rooms.get(roomId);
      if (room) {
        room.addParticipant(user);
        return true;
      }
      return false;
    }

   

  
    leaveRoom(roomId: RoomId, userId: UserId): boolean {
      const room = this.rooms.get(roomId);
      if (room) {
        room.removeParticipant(userId);
        if (room.getParticipantCount() === 0) {
          this.deleteRoom(roomId);
        }
        return true;
      }
      return false;
    }

    handleUserDisconnect(socketId: UserId): RoomId {
      for (let [roomId, room] of this.rooms) {
        if (room.hasParticipant(socketId)) {
          this.leaveRoom(roomId, socketId);
          return roomId;
        }
        
      }
      return '';
    }

    getParticipant(roomId: RoomId, userId: UserId): Participant | undefined{
      const room = this.rooms.get(roomId);
      if (room) {
        return room.getParticipant(userId)
      }
      console.log(`ROOM NOT FOUND: "${roomId}"`);
      return undefined;
    }


    getParticipants(roomId: RoomId): Participant[] {
      const room = this.rooms.get(roomId);
      if (room) {
        return room.getParticipants();
      }

      console.log(`ROOM NOT FOUND: "${roomId}"`);
      return []
    }
   }
  
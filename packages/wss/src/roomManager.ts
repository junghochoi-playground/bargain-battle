import { Participant, SocketId } from '../types';
import { Room } from './room'

type RoomId = string;

export class RoomManager {
    private rooms: Map<RoomId, Room>;
  
    constructor() {
      this.rooms = new Map();
    }
  
    private createRoom(id: string): Room {
      const room: Room = new Room(id);
      this.rooms.set(id, room);

      console.log(`CREATED ROOM - "${id}"`);
      return room;
    }
  
    deleteRoom(id: string): void {
      this.rooms.delete(id);
    }
  
    joinRoom(roomId: string, socketId: string, username: string): boolean {

      if (!this.rooms.has(roomId)) {
        this.createRoom(roomId);
      }


      const room = this.rooms.get(roomId);
      if (room) {
        room.addParticipant({username, socketId, roomId});
        return true;
      }
      return false;
    }

   

  
    leaveRoom(roomId: RoomId, socketId: SocketId): boolean {
      const room = this.rooms.get(roomId);
      if (room) {
        room.removeParticipant(socketId);
        if (room.getParticipantCount() === 0) {
          this.deleteRoom(roomId);
        }
        return true;
      }
      return false;
    }

    getParticiapnts(roomId: RoomId): Participant[] {
      const room = this.rooms.get(roomId);
      if (room) {
        return room.getParticipants();
      }

      console.log(`ROOM NOT FOUND: "${roomId}"`);
      return []
    }
   }
  
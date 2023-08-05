import { Room } from './room'

export class RoomManager {
    private rooms: Map<string, Room>;
  
    constructor() {
      this.rooms = new Map();
    }
  
    createRoom(id: string): Room {
      const room: Room = new Room(id);
      this.rooms.set(id, room);

      console.log("created room");
      return room;
    }
  
    deleteRoom(id: string): void {
      this.rooms.delete(id);
    }
  
    joinRoom(roomId: string, socketId: string, username: string): boolean {
      const room = this.rooms.get(roomId);
      if (room) {
        room.addParticipant({username, socketId});
        return true;
      }
      return false;
    }
  
    leaveRoom(roomId: string, socketId:string): boolean {
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
  }
  
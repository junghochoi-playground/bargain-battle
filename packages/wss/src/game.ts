
import { ClientToServerEvents, ServerToClientEvents } from "../events";
import { Socket, type Server } from "socket.io";
import { RoomManager } from "./roomManager";
import { SocketId, RoomId, Participant } from "../types";

export class Game {
  private roomManager = new RoomManager(); 

  constructor( private server: Server<ClientToServerEvents, ServerToClientEvents>) {
    this.initialize();
  }


  private initialize() {
    this.server.on("connection", (socket) => {
      socket.on("UserJoin", (payload) => {
        
        console.log(`USER_JOIN:${payload.username} - received`)
        if (this.roomManager.joinRoom(payload.roomId, payload.socketId, payload.username)){
          socket.join(payload.roomId);
          this.emitGameState(payload.roomId);
          console.log(`GAME STATE UPDATE: emitted`)
        }


      });

      socket.on("UserLeave", (payload) => {
        socket.leave(payload.roomId);
        socket.emit("UserLeave", payload);
        
        console.log("USER_LEAVE - emitted");
      })

      socket.on("disconnecting", (reason) => {
        console.log(`Disconnecting ${socket.id} for "${reason}"`)

        const exitRoomId = this.roomManager.handleUserDisconnect(socket.id);
        this.emitGameState(exitRoomId);
      })
      
    });
  }

  private emitGameState(roomId: RoomId): void {
    this.server.to(roomId).emit("GameStateUpdate", {
      raceState: {
        roomId: roomId,
        participants: this.roomManager.getParticiapnts(roomId)
      }
    })
    console.log(`GAME STATE UPDATE: emitted`)
  }
}
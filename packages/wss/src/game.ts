
import { ClientToServerEvents, ServerToClientEvents } from "../events";
import { type Server } from "socket.io";
import { RoomManager } from "./roomManager";
import { SocketId, RoomId, Participant } from "../types";

export class Game {

  private participants = new Map<SocketId, Participant>();
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
          this.server.to(payload.roomId).emit("GameStateUpdate", {
            raceState: {
              roomId: payload.roomId,
              participants: this.roomManager.getParticiapnts(payload.roomId)
            }
          })
          console.log(`GAME STATE UPDATE: emitted`)
        }


      });

      socket.on("UserLeave", (payload) => {
        socket.leave(payload.roomId);
        socket.emit("UserLeave", payload);
        
        console.log("USER_LEAVE - emitted");
      })

      socket.on("disconnect", (payload) => {
        // Have to handle a user disconnecting
        // roomManager.removeUser({})
      })
      
    });
  }
}
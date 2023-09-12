
import { ClientToServerEvents, ServerToClientEvents, SocketData } from "../events";
import { Socket, type Server } from "socket.io";
import { RoomManager } from "./roomManager";
import { InMemorySessionStore as SessionStore } from "./sessionManager";
import { SocketId, RoomId, Participant } from "../types";

export class Game {
  private roomManager = new RoomManager(); 
  private sessionStore = new SessionStore();

  constructor( private server: Server<ClientToServerEvents, ServerToClientEvents, {}, SocketData >) {
    this.initialize();
  }


  private initialize() {
    // this.server.use((socket, next) => {
    //   console.log("Session Method")
    //   const sessionID = socket.handshake.auth.sessionID;
    //   if (sessionID) {
    //     // find existing session
    //     const session = this.sessionStore.findSession(sessionID);
    //     if (session) {
    //       socket.data.sessionID = sessionID;
    //       return next();
    //     }
    //   }
    //   const username = socket.handshake.auth.username;
    //   if (!username) {
    //     console.log("error thrown")
    //     return next(new Error("invalid username"));
    //   }
    //   // create new session
    //   socket.data.sessionID = '1234'
    //   next();
    // })


    this.server.on("connection", (socket) => {
      console.log('connection')
      socket.emit("SessionCreate", {
        sessionID: '1234'
      })
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
        // console.log(`Disconnecting ${socket.id} for "${reason}"`)
        // const exitRoomId = this.roomManager.handleUserDisconnect(socket.id);
        // this.emitGameState(exitRoomId);
      })

      socket.onAny((event, ...args) => {
        console.log(event, args);
      });
      
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
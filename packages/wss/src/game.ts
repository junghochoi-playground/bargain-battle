
import { ClientToServerEvents, ServerToClientEvents } from "../events";
import { type Server } from "socket.io";
import { RoomManager } from "./roomManager";


type SocketId = string;
type RoomId = string;

type Participant = {
  username: string,
  socketId: string,
  roomId: string
};

export class Game {



  

  private participants = new Map<SocketId, Participant>();
  private roomManager = new RoomManager(); 


  constructor( private server: Server<ClientToServerEvents, ServerToClientEvents>) {
    this.initialize();
  }


  private initialize() {
    this.server.on("connection", (socket) => {
      socket.on("UserJoin", (payload) => {
        
        console.log("USER_JOIN - received")
        if (this.roomManager.joinRoom(payload.socketId, payload.socketId, payload.username)){
          socket.join(payload.roomId);
          socket.emit("UserJoin", payload);
          console.log("USER_JOIN - emitted")
        }


      });
      
    });
  }
}

import { ClientToServerEvents, ServerToClientEvents, SocketData, UserInitializationPayload } from "../events";
import { Socket, type Server } from "socket.io";
import { RoomManager } from "./roomManager";
import { InMemorySessionStore as SessionStore } from "./sessionManager";
import { RoomId, Participant } from "../types";
import { v4 as uuidV4 } from 'uuid';
import { generateRoomCode, generateUserCode, generateSessionCode  } from './util/codeGenerator';
import { RoomNotFoundError } from "../errors";

export class Game {
  private roomManager = new RoomManager(); 
  private sessionStore = new SessionStore();

  constructor( private server: Server<ClientToServerEvents, ServerToClientEvents, {}, SocketData >) {
    this.initialize();
  }


  private initialize() {
    this.server.use((socket, next) => {
      const sessionId = socket.handshake.auth.sessionId
      const roomId = socket.handshake.auth.roomId

      console.log(socket.handshake.auth)

      

      // Check if RoomId is valid
      if (roomId === undefined || !this.roomManager.hasRoom(roomId)) {
        const err = new RoomNotFoundError(`RoomId: "${roomId}" does not exist`)

        console.log(err instanceof RoomNotFoundError)
        return next(err);
      }

      // Check for a Session, If there is a session 
      if (sessionId) {
        const session = this.sessionStore.findSession(sessionId);
        if (session) {
          socket.data.sessionId = sessionId;
          socket.data.userId = session.userId;
          socket.data.roomId = roomId;

          console.log(roomId, session.userId)

          const user: Participant | undefined = this.roomManager.getParticipant(roomId, session.userId);

          if (user !== undefined) {
            socket.data.username = user.username;
          }

          return next();
        }
      }

      // If there is no Session 
      socket.data.sessionId = generateSessionCode()
      socket.data.userId = generateUserCode()
      socket.data.roomId = roomId;
      return next();
    })


    this.server.on("connection", (socket) => {
      /**
       * Establish Sessions for all Web Socket Connections
       */
      this.sessionStore.saveSession(socket.data.sessionId, {
        userId: socket.data.userId, 
        connected: true
      });
    
      const userInitData: UserInitializationPayload = 
        typeof socket.data.username !== 'undefined'
        ? {
            sessionId: socket.data.sessionId,
            userId: socket.data.userId,
            userData: {
              userId: socket.data.userId,
              roomId: socket.data.roomId,
              username: socket.data.username
            }
          }
        : {
            sessionId: socket.data.sessionId, 
            userId: socket.data.userId,
            userData: undefined
          };


      console.log(userInitData)
      socket.emit("UserInitialization", userInitData)

      // this.userJoinAndUpdateGammeState(socket, socket.data.roomId, {
      //   id: socket.data.userId,
      //   username: socket.data.username
      // })

      this.createEventListeners(socket)
    });

  }  

  public createRoom(): RoomId {
    const roomCode = generateRoomCode()
    this.roomManager.createRoom(roomCode)
    return roomCode
  }

  private userJoinAndUpdateGameState(socket: Socket, roomId: string, user: Participant) {
    if (this.roomManager.joinRoom(roomId, user)){
      socket.join(roomId);
      user.roomId = roomId;
      this.emitGameState(roomId);
    }
  }
  private createEventListeners(socket: Socket): void {
      /**
       * Initialize Websocket Listeners
       */
      socket.on("UserJoin", (payload) => {
        if (this.roomManager.joinRoom(payload.roomId, {
          username: payload.username,
          userId: payload.userId,
          roomId: payload.roomId
        })){
          socket.join(payload.roomId);
          this.emitGameState(payload.roomId);
        }
      });

      socket.on("UserLeave", (payload) => {
        socket.leave(payload.roomId);
        this.emitGameState(payload.roomId);
      })

      socket.on("UserReconnect", (payload) => {
        socket.join(payload.roomId)
        this.emitGameState(payload.roomId)
      })

      socket.on("disconnecting", (reason) => {
        console.log(`Disconnecting ${socket.id} for "${reason}"`)
        // const exitRoomId = socket.handshake.auth.roomId
        console.log(socket.id)
        const exitRoomId = this.roomManager.handleUserDisconnect(socket.id);
        this.emitGameState(exitRoomId);
      })

      socket.onAny((event, ...args) => {
        console.log(event, args);
      });
  }

  private emitGameState(roomId: RoomId): void {
    this.server.to(roomId).emit("GameStateUpdate", {
    
      roomId: roomId,
      participants: this.roomManager. getParticipants(roomId)
      
    })
  }
}

import express, {Express, Request, Response } from 'express'
import dotenv from 'dotenv'

import { createServer, Server as HttpServer} from 'http'
import { Server as SocketIOServer, Socket } from 'socket.io'
import cors from 'cors'
import { Game } from './game'
import { v4 as uuidv4 } from 'uuid'; 

import { RoomManager } from './roomManager'
dotenv.config();

const app: Express = express();
const httpServer: HttpServer = createServer(app);
const port: String|undefined = process.env.PORT  || '4000';

app.use(cors());
app.use(express.json());
const io: SocketIOServer = new SocketIOServer(httpServer, {
  cors: {
    origin: "http://127.0.0.1:5173",
    methods: ["GET", "POST"]
  }
})



new Game(io)




// const userManager = new Map<string, string>(); // socketId -> roomId
// const roomManager: RoomManager = new RoomManager();

// app.post('/start-game', (req: Request, res:Response) => {
//   const gameRoom = uuidv4();
//   roomManager.createRoom(gameRoom);
  
//   res.json({
//     roomId: gameRoom,
//   });  
// })

// io.on('connection', (socket: Socket) => {
//   console.log(socket.id);

//   // socket.on(SocketEvents.JOIN_GAME, (roomId:string, socketId:string, username:string) => {
//   //   console.log('join_game')
//   //   socket.join(roomId);
//   //   userManager.set(socketId, roomId);
//   //   roomManager.joinRoom(roomId, socketId, username);
//   // });


//   socket.on('disconnecting', () => {
//     console.log('leave_game');

//     const roomId: string|undefined = userManager.get(socket.id);

//     if (roomId) {
//       socket.leave(roomId);
//       roomManager.leaveRoom(roomId, socket.id);
//     }

//     // console.log(roomId, socketId, username)
//     // socket.leave(roomId);
//     // roomManager.leaveRoom(roomId, socketId, username);
//   });
// })





httpServer.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
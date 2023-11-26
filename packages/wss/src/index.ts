
import express, {Express, Request, Response } from 'express'
import dotenv from 'dotenv'

import { createServer, Server as HttpServer} from 'http'
import { Server as SocketIOServer, Socket } from 'socket.io'
import cors from 'cors'
import { Game } from './game'
dotenv.config();

const app: Express = express();
const httpServer: HttpServer = createServer(app);
const port: String|undefined = process.env.PORT  || '4000';

app.use(cors({
  origin: "http://127.0.0.1:5173",
  methods: ["GET"],
  credentials: true
})); 
app.use(express.json());

const io: SocketIOServer = new SocketIOServer(httpServer, {
  cors: {
    origin: "http://127.0.0.1:5173",
    methods: ["GET", "POST"],
    credentials: true,
  }
})

const game = new Game(io)

app.get('/create-room', (req, res) => {
  const roomId = game.createRoom()

  res.send({roomId})
})

httpServer.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
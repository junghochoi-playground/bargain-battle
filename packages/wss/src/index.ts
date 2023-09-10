
import express, {Express, Request, Response } from 'express'
import dotenv from 'dotenv'

import { createServer, Server as HttpServer} from 'http'
import { Server as SocketIOServer, Socket } from 'socket.io'
import cors from 'cors'
import { Game } from './game'
import { v4 as uuidv4 } from 'uuid'; 
import path from 'path'
dotenv.config();

const app: Express = express();
const httpServer: HttpServer = createServer(app);
const port: String|undefined = process.env.PORT  || '4000';

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET"],
  credentials: true
})); 
app.use(express.json());

app.get('/create-session', (req, res) => {
  res.cookie('npt', uuidv4(), {
    sameSite: "none",
    // domain: "localhost:5173",  // Adding this 
    path: '/',
    maxAge: 86400,
    secure: true,
    httpOnly: true,
  });
  res.send('hello')
})

const io: SocketIOServer = new SocketIOServer(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  }
})

// io.engine.on("initial_headers", (headers, request) => {
//   console.log("hello");
//   headers["set-cookie"] = serialize("uid", "1234", { 
//     sameSite: "none",
//     domain: "localhost",
//     path: '/',
//     maxAge: 86400,
//     secure: true,
//     httpOnly: true,
//   });
// });



new Game(io)

httpServer.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
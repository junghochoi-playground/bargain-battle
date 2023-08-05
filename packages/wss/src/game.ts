
import { ClientToServerEvents, ServerToClientEvents } from "../events";
import { type Server } from "socket.io";

export class Game {
    constructor(
        private server: Server<ClientToServerEvents, ServerToClientEvents>
      ) {
        this.initialize();
      }


    private initialize() {

    }
}
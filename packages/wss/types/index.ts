type SocketId = string;
type RoomId = string;
type Participant = {
  username: string,
  socketId: string,
  roomId: string
};

export { SocketId, RoomId, Participant}
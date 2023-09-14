type RoomId = string;
type UserId = string;
type Participant = {
  id: string,
  username: string,
  roomId: string
};

export { RoomId, Participant, UserId }
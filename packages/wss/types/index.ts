type RoomId = string;
type UserId = string;
type Participant = {
  userId: string,
  username: string,
  roomId: string
};

export { RoomId, Participant, UserId }
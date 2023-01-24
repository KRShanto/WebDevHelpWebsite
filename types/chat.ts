export type RoomType = {
  _id: string;
  users: UserType[];
  createdAt: string;
};

export type UserType = {
  name: string;
  email: string;
  image: string;
};

export type MessageType = {
  _id: string;
  roomId: string;
  senderEmail: string;
  senderId: string;
  text: string;
  createdAt: string;
};

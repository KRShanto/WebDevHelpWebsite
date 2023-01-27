import Image from "next/image";
import { RoomType, UserType } from "../../types/chat";
import { Session } from "next-auth";

export default function ChatName({
  room,
  sessionUser,
}: {
  room: RoomType;
  sessionUser: UserType;
}) {
  const otherUser = room.users.filter(
    (user: any) => user._id !== sessionUser._id
  )[0];

  return (
    <>
      <Image
        className="img"
        src={otherUser.image}
        alt="user"
        width={70}
        height={70}
      />
      <p className="name">{otherUser.name}</p>
    </>
  );
}

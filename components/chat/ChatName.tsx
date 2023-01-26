import Image from "next/image";
import { RoomType } from "../../types/chat";
import { Session } from "next-auth";

export default function ChatName({
  room,
  session,
}: {
  room: RoomType;
  session: Session;
}) {
  const otherUser = room.users.filter(
    (user: any) => user.email !== session.user?.email
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

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
      <div className="img">
        <Image src={otherUser.image} alt="user" width={70} height={70} />
      </div>
      <div className="name">
        <p>{otherUser.name}</p>
      </div>
    </>
  );
}

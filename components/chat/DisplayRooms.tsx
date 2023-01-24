import { RoomType } from "../../types/chat";
import { Session } from "next-auth";
import ChatName from "./ChatName";

export default function DisplayRooms({
  rooms,
  session,
  setSelectedChat,
}: {
  rooms: RoomType[];
  session: Session;
  setSelectedChat: React.Dispatch<React.SetStateAction<RoomType | null>>;
}) {
  return (
    <div className="display-rooms">
      {rooms?.map((room: any, index: number) => {
        return (
          <button
            className="room"
            key={index}
            onClick={() => {
              setSelectedChat(room);
            }}
          >
            <ChatName room={room} session={session} />
          </button>
        );
      })}
    </div>
  );
}

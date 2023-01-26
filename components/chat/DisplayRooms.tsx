import { RoomType } from "../../types/chat";
import { Session } from "next-auth";
import ChatName from "./ChatName";
import { Dispatch, SetStateAction } from "react";

export default function DisplayRooms({
  rooms,
  session,
  setSelectedRoom,
  setShowConnectUserPopup,
}: {
  rooms: RoomType[];
  session: Session;
  setSelectedRoom: Dispatch<SetStateAction<RoomType | null>>;
  setShowConnectUserPopup: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <div className="display-rooms">
      <div className="users">
        {rooms?.map((room: any, index: number) => {
          return (
            <button
              className="user"
              key={index}
              onClick={() => {
                setSelectedRoom(room);
              }}
            >
              <ChatName room={room} session={session} />
            </button>
          );
        })}
      </div>

      <div className="options">
        <button
          className="connect-user"
          onClick={() => {
            setShowConnectUserPopup(true);
          }}
        >
          Connect User
        </button>
      </div>
    </div>
  );
}

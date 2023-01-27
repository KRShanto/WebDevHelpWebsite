import Image from "next/image";
import { MessageType, UserType } from "../../types/chat";
import { Session } from "next-auth";

export default function Message({
  message,
  otherUser,
  sessionUser,
}: {
  message: MessageType;
  otherUser: UserType;
  sessionUser: UserType;
}) {
  const isSentByCurrentUser = message.senderId === sessionUser._id;

  return (
    <div className={`message ${isSentByCurrentUser ? "sent" : "received"}`}>
      {
        // If the message is NOT sent by the current user, show the user's image beside the message
        !isSentByCurrentUser && (
          <div className="img">
            <Image src={otherUser.image} alt="user" width={70} height={70} />
          </div>
        )
      }

      <div className="message-div">
        <p className="message-by">
          {isSentByCurrentUser ? "You" : otherUser.name}
        </p>
        <p className="message-text">{message.text}</p>
      </div>
    </div>
  );
}

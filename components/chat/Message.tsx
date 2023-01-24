import Image from "next/image";
import { MessageType, UserType } from "../../types/chat";
import { Session } from "next-auth";

export default function Message({
  message,
  otherUser,
  session,
}: {
  message: MessageType;
  otherUser: UserType;
  session: Session;
}) {
  const isSentByCurrentUser = message.senderEmail === session.user?.email;

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

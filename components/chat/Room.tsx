import { useState } from "react";
import { Session } from "next-auth";
import { UserType, MessageType } from "../../types/chat";
import { Socket } from "socket.io-client";
import Message from "./Message";

export default function Room({
  messages,
  messageBoxRef,
  sessionUser,
  otherUsers,
  socket,
}: {
  messages: MessageType[];
  messageBoxRef: any;
  sessionUser: UserType;
  otherUsers: UserType[];
  socket: Socket;
}) {
  const [message, setMessage] = useState<string>("");

  // handle send message
  async function sendMessage(e: any) {
    // prevent the page from refreshing
    e.preventDefault();

    // Send the message to the server
    socket.emit("send-message", message);

    // Clear the input
    setMessage("");
  }

  return (
    <div className="room">
      <div className="messages" ref={messageBoxRef}>
        {messages.map((message: any, index: number) => {
          const otherMessageUser = otherUsers.filter(
            (user: any) => user._id === message.senderId
          )[0];

          return (
            <Message
              message={message}
              otherUser={otherMessageUser}
              sessionUser={sessionUser}
              key={index}
            />
          );
        })}
      </div>

      <form action="#" className="input-message" onSubmit={sendMessage}>
        <input
          type="text"
          placeholder="Enter your message"
          onChange={(e) => {
            setMessage(e.target.value);
          }}
          value={message}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

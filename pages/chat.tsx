import React, { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import useSWR from "swr";
import { useSession, signIn } from "next-auth/react";
import { Session } from "next-auth";
import Image from "next/image";

type Room = {
  _id: string;
  users: User[];
  createdAt: string;
};

type User = {
  name: string;
  email: string;
  image: string;
};

type Message = {
  _id: string;
  roomId: string;
  senderEmail: string;
  senderId: string;
  text: string;
  createdAt: string;
};

async function fetcher(url: string) {
  const res = await fetch(url);
  const json = await res.json();

  return json.data;
}

let socket: Socket;

export default function ChatPage() {
  const { data: session, status } = useSession();

  if (status === "unauthenticated") {
    return (
      <div>
        <h1>You are not logged in</h1>
        <button onClick={() => signIn()}>Sign in</button>
      </div>
    );
  } else if (status === "authenticated") {
    return <ChatApp session={session} />;
  } else {
    return <div>Loading...</div>;
  }
}

function ChatApp({ session }: { session: Session }) {
  const [selectedChat, setSelectedChat] = useState<Room | null>(null); // TODO: change this to selectedRoom
  const [messages, setMessages] = useState<Message[]>([]);
  const [otherUsers, setOtherUsers] = useState<User[]>([]);
  const messageBoxRef = useRef<HTMLDivElement>(null);

  // Get the rooms
  const {
    data: rooms,
    error: roomsError,
    isLoading: roomsAreLoading,
  } = useSWR("/api/rooms", fetcher);

  // Initialize socket
  useEffect(() => {
    initializeSocket();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Send join-room event to the server when the selected chat changes
  useEffect(() => {
    if (selectedChat && socket) {
      socket.emit("join-room", selectedChat._id);
    }
  }, [selectedChat]);

  // Get the messages when the selected chat changes
  useEffect(() => {
    if (selectedChat) {
      getMessages();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChat]);

  // Get the other users
  useEffect(() => {
    if (rooms) {
      const otherUsers = rooms.map((room: any) => {
        return room.users.find(
          (user: any) => user.email !== session.user?.email
        );
      });

      setOtherUsers(otherUsers);
    }
  }, [rooms, session]);

  // Get the messages when the selected chat changes
  async function getMessages() {
    const res = await fetch(`/api/messages/${selectedChat?._id}`);
    const json = await res.json();

    if (json.type === "Success") {
      setMessages(json.data);
    }
  }

  // function to Initialize socket
  async function initializeSocket() {
    await fetch("/api/socket");
    socket = io();

    socket.on("connect", () => {
      console.log("connected");

      // Send the user's email to the server
      socket.emit("set-userId", session.user?.email);
    });

    // Listen for the receive-message event
    socket.on("receive-message", (msg) => {
      console.log("The recieved message: ", msg);
      // Update the messages
      setMessages((messages: any) => [...messages, msg]);

      // Scroll to the bottom of the messages
      // TODO: Do this
      // messageBoxRef.current?.scrollTo(0, 100000000000000);
    });
  }

  return (
    <>
      <div id="chat">
        <DisplayRooms
          rooms={rooms}
          setSelectedChat={setSelectedChat}
          session={session}
        />

        {selectedChat && (
          <Room
            messages={messages}
            messageBoxRef={messageBoxRef}
            otherUsers={otherUsers}
            session={session}
          />
        )}
      </div>
    </>
  );
}

function ChatName({ room, session }: { room: Room; session: Session }) {
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

function Message({
  message,
  otherUser,
  session,
}: {
  message: Message;
  otherUser: User;
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

function Room({ messages, messageBoxRef, session, otherUsers }: any) {
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
            (user: any) => user.email === message.senderEmail
          )[0];

          return (
            <Message
              message={message}
              otherUser={otherMessageUser}
              session={session}
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
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

function DisplayRooms({
  rooms,
  session,
  setSelectedChat,
}: {
  rooms: Room[];
  session: Session;
  setSelectedChat: React.Dispatch<React.SetStateAction<Room | null>>;
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

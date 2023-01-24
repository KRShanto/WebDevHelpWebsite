import { useEffect, useRef, useState } from "react";
import { Session } from "next-auth";
import useSWR from "swr";
import { MessageType, RoomType, UserType } from "../../types/chat";
import { Socket, io } from "socket.io-client";
import DisplayRooms from "./DisplayRooms";
import Room from "./Room";

async function fetcher(url: string) {
  const res = await fetch(url);
  const json = await res.json();

  return json.data;
}

let socket: Socket;

export default function ChatApp({ session }: { session: Session }) {
  const [selectedChat, setSelectedChat] = useState<RoomType | null>(null); // TODO: change this to selectedRoom
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [otherUsers, setOtherUsers] = useState<UserType[]>([]);
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
            socket={socket}
          />
        )}
      </div>
    </>
  );
}

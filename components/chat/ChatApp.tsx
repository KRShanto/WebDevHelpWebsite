import { useEffect, useRef, useState } from "react";
import { Session } from "next-auth";
import useSWR from "swr";
import { MessageType, RoomType, UserType } from "../../types/chat";
import { Socket, io } from "socket.io-client";
import DisplayRooms from "./DisplayRooms";
import Room from "./Room";
import FindUserPopup from "../popup/FindUserPopup";

async function fetcher(url: string) {
  const res = await fetch(url);
  const json = await res.json();

  return json.data;
}

let socket: Socket;

export default function ChatApp({ sessionUser }: { sessionUser: UserType }) {
  const [selectedRoom, setSelectedRoom] = useState<RoomType | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [otherUsers, setOtherUsers] = useState<UserType[]>([]);
  const messageBoxRef = useRef<HTMLDivElement>(null);
  const [showConnectUserPopup, setShowConnectUserPopup] =
    useState<boolean>(false); // TODO: Use `popup` state instead. Also make a popup component
  const [popup, setPopup] = useState<"FindUserPopup" | null>(null); // TODO: use redux instead. Also make a popup component

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
    if (selectedRoom && socket) {
      socket.emit("join-room", selectedRoom._id);
    }
  }, [selectedRoom]);

  // Get the messages when the selected chat changes
  useEffect(() => {
    if (selectedRoom) {
      getMessages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRoom]);

  // Get the other users
  useEffect(() => {
    if (rooms) {
      const otherUsers = rooms.map((room: any) => {
        return room.users.find((user: any) => user._id !== sessionUser._id);
      });

      setOtherUsers(otherUsers);
    }
  }, [rooms, sessionUser]);

  // Get the messages when the selected chat changes
  async function getMessages() {
    const res = await fetch(`/api/messages/${selectedRoom?._id}`);
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
      console.log("Connected with Socket");

      // Send the user's email to the server
      socket.emit("set-userId", sessionUser._id);
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
        {showConnectUserPopup && (
          <FindUserPopup
            setShowConnectUserPopup={setShowConnectUserPopup}
            sessionUser={sessionUser}
            otherUsers={otherUsers}
          />
        )}

        <DisplayRooms
          rooms={rooms}
          setSelectedRoom={setSelectedRoom}
          sessionUser={sessionUser}
          setShowConnectUserPopup={setShowConnectUserPopup}
        />

        {selectedRoom && (
          <Room
            messages={messages}
            messageBoxRef={messageBoxRef}
            otherUsers={otherUsers}
            sessionUser={sessionUser}
            socket={socket}
          />
        )}
      </div>
    </>
  );
}

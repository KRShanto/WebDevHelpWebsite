import React, { useEffect, useRef, useState } from "react";
import { auth, db } from "../auth/config";
import {
  doc,
  getDoc,
  onSnapshot,
  getDocs,
  collection,
  query,
  where,
  addDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { User } from "firebase/auth";
import Image from "next/image";
import UserImage from "../fake/user.jpg"; // TODO: temporary image

const CHAT_COLLECTION = "chats";
const USER_COLLECTION = "users";
const MESSAGE_COLLECTION = "messages";

// TODO: update security rules for the database
export default function ChatPage() {
  // NOTE: there will be 3 users each rooms
  // 1. user1
  // 2. user2
  // 3. server bot
  //
  // There are some reserverd names -> Admin, server-bot

  const [user, setUser] = useState<User | null>(null);
  const [chats, setChats] = useState<any[]>([]);
  const [chatsUsers, setChatsUsers] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<{
    id: string;
    otherUser: any;
  } | null>(null);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  });

  useEffect(() => {
    // get all the rooms
    // where user's id is in the document's members array
    if (user) {
      const q = query(
        collection(db, CHAT_COLLECTION),
        where("members", "array-contains", user.uid)
      );
      getDocs(q).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // setRooms((rooms) => [...rooms, doc.id]);
          // setRooms((rooms) => [...rooms, doc.data()]);
          // also add the room id to the room object
          setChats((chats) => [...chats, { ...doc.data(), id: doc.id }]);
        });
      });
    }
  }, [user]);

  useEffect(() => {
    // Get all user's (accpet current user) names and photos from the database `users` collection when rooms change

    //   rooms.forEach((room) => {
    //     const q = query(
    //       collection(db, "users"),
    //       where("uid", "in", room.members)
    //     );
    //     getDocs(q).then((querySnapshot) => {
    //       querySnapshot.forEach((doc) => {
    //         console.log("====================================");
    //         console.log("USER: ", doc.data());
    //         console.log("====================================");

    //         setRoomsUsers((roomsUsers) => [...roomsUsers, doc.data()]);
    //       });
    //     });
    //   });

    chats.forEach((chat) => {
      // console.log("A signle piece of room: ", room);
      chat.members.forEach((member: string) => {
        if (member !== user?.uid) {
          const q = query(
            collection(db, USER_COLLECTION),
            where("uid", "==", member)
          );
          getDocs(q).then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              console.log("====================================");
              console.log("USER: ", doc.data());
              console.log("====================================");

              setChatsUsers((chatsUsers) => [...chatsUsers, doc.data()]);
            });
          });
        }
      });
    });
  }, [chats, user]);

  async function handleConnect(e: any) {
    e.preventDefault();
    // Create a new room with the given id
    // Create a new document in the rooms collection
    // Add both the users to the members array
    // Add a subcollection to the document and subdocument to the subcollection
    // subdocument: {message: "Welcome to the chat", sender: "server-bot", timestamp: serverTimestamp()}"}

    const newUserId = e.target[0].value;
    const userId = user?.uid;

    if (userId && newUserId) {
      // Query and check if the room already exists
      const q = query(
        collection(db, CHAT_COLLECTION),
        // where("members", "array-contains", userId),
        // where("members", "array-contains", newUserId)
        // where("members", "array-contains-any", [userId, newUserId])
        where("members", "==", [userId, newUserId])
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.size > 0) {
        // room already exists
        alert("Chat already exists");
        return;
      } else {
        // room does not exist
        // create a new room
        const newChatId = `${userId}-${newUserId}`;
        const newChatRef = doc(db, CHAT_COLLECTION, newChatId);
        await setDoc(newChatRef, {
          members: [userId, newUserId],
        });

        // add a subcollection to the document
        const newChatMessagesRef = collection(newChatRef, MESSAGE_COLLECTION);
        await addDoc(newChatMessagesRef, {
          message: "Welcome to the chat",
          sender: "server-bot",
          timestamp: serverTimestamp(),
        });

        // done
        alert("Chat created");

        // update the rooms state
        setChats((chats) => [...chats, { members: [userId, newUserId] }]);

        // // update the selected room
        // setSelectedRoom({
        //   id: newRoomId,
        //   otherUser: roomsUsers[roomsUsers.length - 1],
        // });
      }
    } else {
      alert("Please login");
    }
  }

  return (
    <div id="chat">
      {/* <form action="#" onSubmit={handleConnect}>
        <input
          type="text"
          placeholder="Enter the id of the user you want to chat with"
        />
        <button type="submit">Connect</button>
      </form> */}

      {/* <div className="display-rooms">
          {rooms.map((room, index) => {
            console.log("ROOMS USERS: ", roomsUsers);

            return (
              <div className="chat" key={index}>
                <p>
                  {roomsUsers[index]?.name}
                </p>
                <button
                  onClick={() => {
                    setSelectedRoom({
                      id: room.id,
                      otherUser: roomsUsers[index],
                    });
                  }}
                >
                  Select
                </button>
              </div>
            );
          })}
        </div> */}

      <DisplayChats
        chats={chats}
        chatsUsers={chatsUsers}
        setSelectedChat={setSelectedChat}
      />

      {/* <div className="chat-box"> */}
      {selectedChat && (
        <>
          <ChatBox chat={selectedChat} />
        </>
      )}
      {/* </div> */}
    </div>
  );
}

function ChatBox({ chat }: { chat: { id: string; otherUser: any } }) {
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState<string>("");

  const messageBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  });

  useEffect(() => {
    // Get all the messages of the room in real time
    // console.log("The id of the room is: ", room);
    const chatRef = doc(db, CHAT_COLLECTION, chat.id);
    const messagesRef = collection(chatRef, MESSAGE_COLLECTION);

    onSnapshot(messagesRef, (querySnapshot) => {
      // const messages: any[] = [];
      // querySnapshot.forEach((doc) => {
      //   messages.push(doc.data());
      // });
      // setMessages(messages);

      // Set the messages with sorted order
      const messages: any[] = [];
      querySnapshot.forEach((doc) => {
        console.log("The messages: ", doc.data());
        // messages.push(doc.data());

        // if the timestamp is null, don't include the msg
        if (doc.data().timestamp) {
          messages.push(doc.data());
        }
      });
      messages.sort((a, b) => {
        console.log("A: ", a);
        console.log("B: ", b);

        if (a.timestamp && b.timestamp) {
          return a.timestamp.seconds - b.timestamp.seconds;
        } else {
          return 0;
        }
      });

      setMessages(messages);
      // Scroll to the bottom of the messages
      messageBoxRef.current?.scrollTo(0, 100000);
    });
  }, [chat]);

  async function handleSendMessage(e: any) {
    e.preventDefault();

    if (message === "") return;

    const msg = message;

    setMessage("");

    // Add a new document to the subcollection
    // subdocument: {message: message, sender: user?.uid, timestamp: serverTimestamp()}"}
    const chatRef = doc(db, CHAT_COLLECTION, chat.id);
    const messagesRef = collection(chatRef, MESSAGE_COLLECTION);
    await addDoc(messagesRef, {
      message: msg,
      sender: user?.uid,
      timestamp: serverTimestamp(),
    });
  }

  return (
    <div className="chat-box">
      <div className="messages" ref={messageBoxRef}>
        {messages.map((message, index) => {
          return (
            <div
              className={`message ${
                message.sender === user?.uid ? "sent" : "received"
              }`}
              key={index}
            >
              {/* <div className="img">
                <Image src={UserImage} alt="user" width={50} height={50} />
              </div> */}

              {
                // If the message is NOT sent by the user, show the user's image beside the message
                message.sender !== user?.uid && (
                  <div className="img">
                    <Image src={UserImage} alt="user" width={50} height={50} />
                  </div>
                )
              }

              <div className="message-div">
                <p className="message-by">
                  {message.sender === user?.uid
                    ? ""
                    : message.sender !== "server-bot"
                    ? chat.otherUser.name
                    : "Server Bot"}
                </p>
                <p className="message-text">{message.message}</p>
              </div>

              {
                // // If the message is sent by the user, show the other user's image beside the message
                // message.sender === user?.uid && (
                //   <div className="img">
                //     <Image src={UserImage} alt="user" width={50} height={50} />
                //   </div>
                // )
              }
            </div>
          );
        })}
      </div>
      <form action="#" onSubmit={handleSendMessage} className="input-message">
        <input
          type="text"
          placeholder="Enter your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

function DisplayChats({
  chats,
  setSelectedChat,
  chatsUsers,
}: {
  chats: any;
  setSelectedChat: any;
  chatsUsers: any;
}) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  }, []);

  return (
    <div className="display-chats">
      {chats.map((chat: any, index: number) => {
        return (
          <button
            className="chat"
            key={index}
            onClick={() => {
              setSelectedChat({
                id: chat.id,
                otherUser: chatsUsers[index],
              });
            }}
          >
            {/* {roomsUsers[index]?.name} */}
            <div className="img">
              <Image src={UserImage} width={70} height={70} alt="user" />
            </div>
            <div className="name">
              <p>{chatsUsers[index]?.name}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

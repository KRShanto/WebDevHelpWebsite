import { Dispatch, SetStateAction, useState } from "react";
import Image from "next/image";
import { UserType } from "../../types/chat";
import { Session } from "next-auth";

type FoundUserType = UserType & {
  canConnect: boolean;
};

export default function FindUserPopup({
  setShowConnectUserPopup,
  sessionUser,
  otherUsers,
}: {
  setShowConnectUserPopup: Dispatch<SetStateAction<boolean>>;
  sessionUser: UserType;
  otherUsers: UserType[];
}) {
  const [foundUsers, setFoundUsers] = useState<FoundUserType[]>([]);

  async function handleSearch(e: any) {
    e.preventDefault();
    const value = e.target[0].value;

    if (value === "") {
      return;
    }

    const res = await fetch(`/api/find-user/${value}`);
    const json = await res.json();
    console.log("user found data: ", json);

    if (json.type === "Success") {
      // Check if the user is the current user or already connected
      const foundUsers = json.data.map((user: UserType) => {
        let canConnect = true;

        // Check if the user is the current user
        if (user._id === sessionUser._id) {
          canConnect = false;
        }

        // Check if the user is already connected
        for (let i = 0; i < otherUsers.length; i++) {
          if (user._id === otherUsers[i]._id) {
            canConnect = false;
            break;
          }
        }

        return {
          ...user,
          canConnect,
        };
      });

      setFoundUsers(foundUsers);
    }
  }

  async function handleConnect(anotherUserId: string) {
    console.log("anotherUserId: ", anotherUserId);

    const res = await fetch("/api/create-room", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ anotherUserId }),
    });

    const json = await res.json();
    console.log("connect room data: ", json);

    if (json.type === "Success") {
      // close the popup
      setShowConnectUserPopup(false);
    }
  }

  return (
    <div className="find-user-popup">
      <form className="search" onSubmit={handleSearch}>
        <h2 className="heading">Search name or id for of the user</h2>
        <div className="input-div">
          <input type="text" id="user-search" />
          <button type="submit">Search</button>
        </div>
      </form>

      <div className="found-users">
        {foundUsers.map((user: FoundUserType, index: number) => {
          return (
            <div className="user" key={index}>
              <Image
                className="img"
                src={user.image}
                alt="user"
                width={70}
                height={70}
              />
              <p className="name">{user.name}</p>
              {user.canConnect && (
                <button
                  type="submit"
                  className="connect"
                  onClick={() => handleConnect(user._id)}
                >
                  Connect
                </button>
              )}
            </div>
          );
        })}

        {foundUsers.length === 0 && (
          <p className="no-users-found">No users found</p>
        )}
      </div>

      <button className="close" onClick={() => setShowConnectUserPopup(false)}>
        Close
      </button>
    </div>
  );
}

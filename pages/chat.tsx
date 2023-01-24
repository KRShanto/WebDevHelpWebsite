import { useSession, signIn } from "next-auth/react";
import ChatApp from "../components/chat/ChatApp";

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

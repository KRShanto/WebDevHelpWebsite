import { useSession, signIn } from "next-auth/react";
import Head from "next/head";
import ChatApp from "../components/chat/ChatApp";
import NotLoggedIn from "../components/NotLoggedIn";

export default function ChatPage() {
  const { data: session, status } = useSession();

  if (status === "unauthenticated") {
    // TODO: style this
    return <NotLoggedIn />;
  } else if (status === "authenticated") {
    return (
      <>
        <Head>
          <title>General Chat</title>
          <meta
            name="description"
            content="General chatting page site's users"
          />
        </Head>

        {/* @ts-ignore */}
        <ChatApp sessionUser={session.user} />
      </>
    );
  } else {
    return <div>Loading...</div>;
  }
}

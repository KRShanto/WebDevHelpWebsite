import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";

export default function HomePage() {
  const { data: session, status } = useSession();

  console.log(session);

  // return (
  // <>
  //   <div className="intro">
  //     <h2 className="first-intro">Web Developer Help</h2>
  //     <h1 className="second-intro">
  //       We are a community to help the community
  //     </h1>
  //   </div>
  // </>
  // );

  if (session) {
    return (
      <>
        {" "}
        Signed in as {session.user?.email} <br />{" "}
        <button onClick={() => signOut()}>Sign out</button>{" "}
      </>
    );
  }
  return (
    <>
      {" "}
      Not signed in <br /> <button onClick={() => signIn()}>
        Sign in
      </button>{" "}
    </>
  );
}

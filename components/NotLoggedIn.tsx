import { signIn } from "next-auth/react";
import React from "react";

export default function NotLoggedIn() {
  return (
    <div className="not-logged-in">
      <h1>You are not logged in</h1>
      <button onClick={() => signIn()}>Sign in</button>
    </div>
  );
}

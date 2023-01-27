import React from "react";
import Link from "next/link";
import { signIn, useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav>
      <Link href="/" className="logo">
        WebDevHelp
      </Link>
      <div className="links">
        <Link href="/" className="link">
          Home
        </Link>

        <Link href="/chat" className="link">
          Chat
        </Link>

        <Link href="/questions" className="link">
          Questions
        </Link>

        {session ? (
          <button className="link" onClick={() => signOut()}>
            Sign Out
          </button>
        ) : (
          <button className="link" onClick={() => signIn()}>
            Sign In
          </button>
        )}

        <a
          href="https://github.com/KRShanto/WebDevHelpWebsite"
          className="link"
          target="_blank"
          rel="noreferrer"
        >
          Github
        </a>
      </div>
    </nav>
  );
}

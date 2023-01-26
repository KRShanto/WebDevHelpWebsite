import React from "react";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav>
      <div className="logo">WebDevHelp</div>
      <div className="links">
        <Link href="/" className="link">
          Home
        </Link>

        <Link href="/chat" className="link">
          Chat
        </Link>

        {/* <Link href="/signup" className="link">
          Signup
        </Link> */}

        <a
          href="https://github.com/WebDevHelpBD/backend"
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

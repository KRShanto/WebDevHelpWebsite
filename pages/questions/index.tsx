import React from "react";
import Link from "next/link";

export default function QuestionsPage() {
  return (
    <div className="questions-div">
      <div className="header">
        <form action="#" className="search-question">
          <label htmlFor="question-input">Search Questions</label>
          <input
            type="text"
            id="question-input"
            placeholder="Search Questions"
          />
          <button type="submit">Search</button>
        </form>

        <Link href="/questions/ask" className="ask-question">
          Ask Question
        </Link>
      </div>
    </div>
  );
}

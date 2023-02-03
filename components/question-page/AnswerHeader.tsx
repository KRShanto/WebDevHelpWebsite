import React from "react";

export default function AnswerHeader({ index }: { index: number }) {
  return (
    <div className="header">
      <h2>
        <a href={"#answer-" + (index + 1)}>Answer {index + 1}</a>
      </h2>
    </div>
  );
}

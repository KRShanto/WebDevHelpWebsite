import React, { useState } from "react";

export default function AddAnswer({
  questionId,
  setAnswersState,
}: {
  questionId: string;
  setAnswersState: React.Dispatch<React.SetStateAction<any[]>>;
}) {
  const [answerDescription, setAnswerDescription] = useState("");

  async function handleAddAnswer(event: any) {
    event.preventDefault();

    if (answerDescription === "") {
      // TODO: handle error
      return;
    }

    const res = await fetch("/api/create-answer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        questionId: questionId,
        description: answerDescription,
      }),
    });

    const json = await res.json();

    console.log("Response from /api/create-answer: ", json);

    if (json.type === "Success") {
      // setLaterAnswers((prev) => [...prev, json.data]);
      setAnswersState((prev) => [...prev, json.data]);
    }
  }
  return (
    <form className="add-answer" onSubmit={handleAddAnswer}>
      <h1 className="heading">Add your answer</h1>
      <textarea
        name="content"
        value={answerDescription}
        onChange={(event) => setAnswerDescription(event.target.value)}
      />
      <button type="submit">Post Your Answer</button>
    </form>
  );
}

import React, { useState } from "react";
import AddAnswer from "./AddAnswer";
import ShowAnswer from "./ShowAnswer";

export default function Answers({
  answers,
  answersVotes,
  answersComments,
  question,
}: {
  answers: any[];
  answersVotes: any[];
  answersComments: any[];
  question: any;
}) {
  const [answersState, setAnswersState] = useState<any[]>(answers);

  return (
    <div className="answers">
      <ShowAnswer
        answers={answers}
        answersVotes={answersVotes}
        answersComments={answersComments}
        question={question}
        answersState={answersState}
      />

      <AddAnswer questionId={question._id} setAnswersState={setAnswersState} />
    </div>
  );
}

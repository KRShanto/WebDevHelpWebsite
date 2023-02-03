import React, { useState } from "react";
import Image from "next/image";
import moment from "moment";

import Answer from "./Answer";
import AnswerHeader from "./AnswerHeader";
import AnswerComments from "./Comments";
import AddComment from "./AddComment";

export default function ShowAnswer({
  answers,
  answersVotes,
  answersComments,
  question,
  answersState,
}: {
  answers: any[];
  answersVotes: any[];
  answersComments: any[];
  question: any;
  answersState: any;
}) {
  const [answersVotesState, setAnswersVotesState] =
    useState<any[]>(answersVotes);
  const [answersCommentsState, setAnswersCommentsState] =
    useState<any[]>(answersComments);

  return (
    <div className="show-answer">
      {answersState.map((answer: any, index: number) => {
        return (
          <div
            className="answer-section"
            id={"answer-" + (index + 1)}
            key={index}
          >
            <AnswerHeader index={index} />

            <Answer
              answer={answer}
              answersVotesState={answersVotesState}
              index={index}
            />

            <AnswerComments
              answersCommentsState={answersCommentsState}
              index={index}
            />

            <AddComment answerId={answer._id} />
          </div>
        );
      })}
    </div>
  );
}

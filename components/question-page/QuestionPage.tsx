import React, { useState, useEffect } from "react";
import { VoteType } from "../../types/vote";
import Question from "./Question";
import DownSide from "./DownSide";

export const ICONS_SIZE = 25;

export default function QuestionPage({
  question,
  answers,
  questionVote,
  answersVotes,
  answersComments,
}: {
  question: any;
  answers: any;
  questionVote: null | VoteType;
  answersVotes: any[];
  answersComments: any[];
}) {
  return (
    <div className="question-page">
      <Question question={question} questionVote={questionVote} />

      <DownSide
        question={question}
        answers={answers}
        answersVotes={answersVotes}
        answersComments={answersComments}
      />
    </div>
  );
}

import React from "react";
import { VoteType } from "../../types/vote";
import QuestionVotes from "./action-buttons/QuestionVotes";
import Share from "./action-buttons/Share";
import Save from "./action-buttons/Save";
import Date from "./action-buttons/Date";
import Author from "./Author";

export default function Question({
  question,
  questionVote,
}: {
  question: any;
  questionVote: null | VoteType;
}) {
  return (
    <div className="question">
      <h1 className="title">{question.title}</h1>
      <div className="description">{question.description}</div>

      <div className="actions-info-section">
        <div className="actions">
          <QuestionVotes question={question} questionVote={questionVote} />
          <Share />
          <Save />
          <Date createdAt={question.createdAt} />
        </div>

        <Author
          name={question.author.name}
          image={question.author.image}
          verb="Asked"
        />
      </div>
    </div>
  );
}

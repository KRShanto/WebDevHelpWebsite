import React from "react";
import ShareIcon from "../../../public/icons/share.svg";
import ReportIcon from "../../../public/icons/report.svg";
import ClockIcon from "../../../public/icons/clock.svg";
import { ICONS_SIZE } from "../question-page/QuestionPage";
import AnswerVotes from "./action-buttons/AnswerVotes";
import Share from "./action-buttons/Share";
import Report from "./action-buttons/Report";
import Date from "./action-buttons/Date";
import Author from "./Author";

export default function Answer({
  answer,
  answersVotesState,
  index,
}: {
  answer: any;
  answersVotesState: any;
  index: number;
}) {
  return (
    <div className="answer">
      <p className="description">{answer.description}</p>

      <div className="actions-info-section">
        <div className="actions">
          <AnswerVotes
            answer={answer}
            answersVotesState={answersVotesState}
            index={index}
          />
          <Share />
          <Report />
          <Date createdAt={answer.createdAt} />
        </div>

        <Author
          name={answer.user.name}
          image={answer.user.image}
          verb="Answered"
        />
      </div>
    </div>
  );
}

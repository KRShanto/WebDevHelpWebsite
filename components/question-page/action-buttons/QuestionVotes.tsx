import React from "react";
import Image from "next/image";
import { VoteType } from "../../../types/vote";
import UpArrow from "../../../public/icons/up-arrow.svg";
import UpArrowSuccess from "../../../public/icons/up-arrow-success.svg";
import DownArrow from "../../../public/icons/down-arrow.svg";
import DownArrowSuccess from "../../../public/icons/down-arrow-success.svg";
import { ICONS_SIZE } from "../QuestionPage";

export default function QuestionVotes({
  questionVote,
  question,
}: {
  questionVote: null | VoteType;
  question: any;
}) {
  async function handleQuestionVoteUP() {
    const res = await fetch("/api/create-question-vote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        questionId: question._id,
        vote: VoteType.UP,
      }),
    });

    const json = await res.json();

    console.log("Response from /api/create-question-vote: ", json);
  }

  async function handleQuestionVoteDown() {
    const res = await fetch("/api/create-question-vote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        questionId: question._id,
        vote: VoteType.DOWN,
      }),
    });

    const json = await res.json();

    console.log("Response from /api/create-question-vote: ", json);
  }

  return (
    <div className="votes">
      <button className="up-votes vote" onClick={handleQuestionVoteUP}>
        {questionVote ? (
          questionVote === VoteType.UP ? (
            <Image
              src={UpArrowSuccess}
              alt="Up arrow"
              width={ICONS_SIZE}
              height={ICONS_SIZE}
            />
          ) : (
            <Image
              src={UpArrow}
              alt="Up arrow"
              width={ICONS_SIZE}
              height={ICONS_SIZE}
            />
          )
        ) : (
          <Image
            src={UpArrow}
            alt="Up arrow"
            width={ICONS_SIZE}
            height={ICONS_SIZE}
          />
        )}
        {question.upVotes}
      </button>

      <button className="down-votes vote" onClick={handleQuestionVoteDown}>
        {questionVote ? (
          questionVote === VoteType.DOWN ? (
            <Image
              src={DownArrowSuccess}
              alt="Down arrow"
              width={ICONS_SIZE}
              height={ICONS_SIZE}
            />
          ) : (
            <Image
              src={DownArrow}
              alt="Down arrow"
              width={ICONS_SIZE}
              height={ICONS_SIZE}
            />
          )
        ) : (
          <Image
            src={DownArrow}
            alt="Down arrow"
            width={ICONS_SIZE}
            height={ICONS_SIZE}
          />
        )}
        {question.downVotes}
      </button>
    </div>
  );
}

import React from "react";
import UpArrow from "../../../public/icons/up-arrow.svg";
import UpArrowSuccess from "../../../public/icons/up-arrow-success.svg";
import DownArrow from "../../../public/icons/down-arrow.svg";
import { VoteType } from "../../../types/vote";
import DownArrowSuccess from "../../../public/icons/down-arrow-success.svg";
import Image from "next/image";
import { ICONS_SIZE } from "../QuestionPage";

export default function AnswerVotes({
  answer,
  answersVotesState,
  index,
}: {
  answer: any;
  answersVotesState: any;
  index: number;
}) {
  async function handleAnswerVoteUp(answerId: string) {
    const res = await fetch("/api/create-answer-vote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        answerId,
        vote: VoteType.UP,
      }),
    });

    const json = await res.json();

    console.log("Response from /api/create-answer-vote: ", json);
  }

  async function handleAnswerVoteDown(answerId: string) {
    const res = await fetch("/api/create-answer-vote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        answerId,
        vote: VoteType.DOWN,
      }),
    });

    const json = await res.json();

    console.log("Response from /api/create-answer-vote: ", json);
  }

  return (
    <div className="votes">
      <button
        className="up-votes vote"
        onClick={() => handleAnswerVoteUp(answer._id)}
      >
        {answersVotesState[index] === VoteType.UP ? (
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
        )}
        {answer.upVotes}
      </button>
      <button
        className="down-votes vote"
        onClick={() => handleAnswerVoteDown(answer._id)}
      >
        {answersVotesState[index] === VoteType.DOWN ? (
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
        )}
        {answer.downVotes}
      </button>
    </div>
  );
}

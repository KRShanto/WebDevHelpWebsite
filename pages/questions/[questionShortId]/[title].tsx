import React, { useState } from "react";
import dbConnect from "../../../lib/dbConnect";
import Question from "../../../models/Question";
import Answer from "../../../models/Answer";
import Comment from "../../../models/Comment";
import QuestionVote from "../../../models/QuestionVote";
import AnswerVote from "../../../models/AnswerVote";
import { VoteType } from "../../../types/vote";
import { authOptions } from "../../api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import { useRouter } from "next/router";

export default function QuestionsPage({
  question,
  answers,
  questionVote,
  answersVotes,
  answersComments,
}: {
  question: any;
  answers: any;
  questionVote: boolean;
  answersVotes: any[];
  answersComments: any[];
}) {
  const [answerDescription, setAnswerDescription] = useState("");
  const [commentDescription, setCommentDescription] = useState("");

  const [answersState, setAnswersState] = useState<any[]>(answers);
  const [answersVotesState, setAnswersVotesState] =
    useState<any[]>(answersVotes);
  const [answersCommentsState, setAnswersCommentsState] =
    useState<any[]>(answersComments);

  const router = useRouter();

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
        questionId: question._id,
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

  async function handleAddComment(event: any, answerId: string) {
    event.preventDefault();

    if (commentDescription === "") {
      // TODO: handle error
      return;
    }

    const res = await fetch("/api/create-comment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        answerId,
        description: commentDescription,
      }),
    });

    const json = await res.json();

    console.log("Response from /api/create-comment: ", json);
  }

  return (
    <div className="question-page">
      <div className="question">
        <h1 className="title">{question.title}</h1>
        <div className="description">{question.description}</div>
        <p className="voted">
          {questionVote
            ? question.vote === VoteType.UP
              ? "You voted up"
              : "You voted down"
            : "no vote"}
        </p>

        <div className="info">
          <div className="author">
            <p className="name">{question.user.name}</p>
            <p className="date">{question.createdAt}</p>
            <p className="up-votes">{question.upVotes}</p>
            <p className="down-votes">{question.downVotes}</p>
          </div>
        </div>

        <div className="actions">
          <button onClick={handleQuestionVoteUP}>UP vote</button>
          <button onClick={handleQuestionVoteDown}>Down vote</button>
        </div>
      </div>

      <div className="answers">
        <div className="show-answer">
          {answersState.map((answer: any, index: number) => {
            return (
              <div className="answer" key={index}>
                <div className="description">{answer.description}</div>
                <div className="info">
                  <p className="name">{answer.user.name}</p>
                  <p className="date">{answer.createdAt}</p>
                  <p className="up-votes">{answer.upVotes}</p>
                  <p className="down-votes">{answer.downVotes}</p>
                  <div className="voted">
                    {answersVotesState[index] === VoteType.UP
                      ? "You voted up"
                      : answersVotesState[index] === VoteType.DOWN
                      ? "You voted down"
                      : "no vote"}
                  </div>
                </div>
                <div className="actions">
                  <button onClick={() => handleAnswerVoteUp(answer._id)}>
                    Up Vote
                  </button>
                  <button onClick={() => handleAnswerVoteDown(answer._id)}>
                    Down Vote
                  </button>

                  <div className="add-comment">
                    <form onSubmit={(e) => handleAddComment(e, answer._id)}>
                      <textarea
                        name="content"
                        placeholder="Add your comment"
                        value={commentDescription}
                        onChange={(event) =>
                          setCommentDescription(event.target.value)
                        }
                      />
                      <button type="submit">Add Comment</button>
                    </form>
                  </div>
                </div>
                <div className="comments">
                  {answersComments[index] &&
                    answersComments[index].map(
                      (comment: any, index: number) => {
                        return (
                          <div className="comment" key={index}>
                            <div className="description">
                              {comment.description}
                            </div>
                            <div className="info">
                              <p className="name">{comment.user.name}</p>
                              <p className="date">{comment.createdAt}</p>
                            </div>
                          </div>
                        );
                      }
                    )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="add-answer">
          <form onSubmit={handleAddAnswer}>
            <textarea
              name="content"
              placeholder="Add your answer"
              value={answerDescription}
              onChange={(event) => setAnswerDescription(event.target.value)}
            />
            <button type="submit">Add Answer</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: any) {
  const { questionShortId, title } = context.params;
  const session = await unstable_getServerSession(
    // @ts-ignore
    context.req,
    context.res,
    authOptions
  );
  // If the user has voted this question
  let questionVote = null;
  // The Question model
  let question = null;

  await dbConnect();

  // ************ Try to find the question by the shortId *************** //
  try {
    question = await Question.findOne({ shortId: questionShortId });
  } catch (error) {
    // do nothing
    // this would happen because the questionId is not a valid ObjectId
  }

  // If the question is not found, return notFound
  if (!question) {
    return {
      notFound: true,
    };
  }

  // ************ Check if the title is correct *************** //
  if (question.urlTitle !== title) {
    // redirect to the correct url
    return {
      redirect: {
        destination: `/questions/${question.shortId}/${question.urlTitle}`,
        permanent: true,
      },
    };
  }

  // **************** Get if the user has voted this question **************** //
  if (session) {
    const questionVoteResult = await QuestionVote.findOne({
      // @ts-ignore
      userId: session.user?._id,
      questionId: question._id,
    });

    if (questionVoteResult) {
      questionVote = questionVoteResult.vote;
    }
  }

  // *************** Get the answers for this question *************** //
  const answers = await Answer.find({ questionId: question._id });

  // ************ Get the comments for these answers *************** //

  // This is a variable to store the comments for each answer
  // It will be an array of arrays [[answer1Comments], [answer2Comments], ...
  const answersComments: any[] = Array(answers.length).fill(null);

  const answerPromises: any = answers.map(async (answer: any, index) => {
    const comments = await Comment.find({ answerId: answer._id });

    answersComments[index] = comments;
  });

  // TODO: Get the discussions for this question
  // TODO: Get the comments for these answers and discussions

  // ************** Get if the user has voted these answers ************** //

  // This is a variable to store the votes for each answer
  // It will be an array of votes [answer1Vote, answer2Vote, ...
  const answersVotes: any = Array(answers.length).fill(null);

  // Get if the user has voted these answers
  if (session) {
    const answerPromises = answers.map(async (answer: any, index) => {
      const answerVote = await AnswerVote.findOne({
        // @ts-ignore
        userId: session.user?._id,
        answerId: answer._id,
      });

      if (answerVote) {
        answersVotes[index] = answerVote.vote;
      }
    });

    await Promise.all(answerPromises);
  }

  await Promise.all(answerPromises);

  return {
    props: {
      question: JSON.parse(JSON.stringify(question)),
      answers: JSON.parse(JSON.stringify(answers)),
      questionVote,
      answersVotes: JSON.parse(JSON.stringify(answersVotes)),
      answersComments: JSON.parse(JSON.stringify(answersComments)),
    },
  };
}

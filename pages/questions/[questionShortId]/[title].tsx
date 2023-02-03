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
import QuestionPage from "../../../components/question-page/QuestionPage";

export default function QuestionsPage({
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
  // console.log("questionVote: ", questionVote);

  return (
    <QuestionPage
      question={question}
      answers={answers}
      questionVote={questionVote}
      answersVotes={answersVotes}
      answersComments={answersComments}
    />
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

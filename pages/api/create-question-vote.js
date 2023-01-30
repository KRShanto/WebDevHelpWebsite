import Question from "../../models/Question";
import QuestionVote from "../../models/QuestionVote";
import { authOptions } from "./auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import { VoteType } from "../../types/vote";

export default async function handler(req, res) {
  const session = await unstable_getServerSession(req, res, authOptions);

  // ************* Check if the user is authenticated or not ************** //
  if (!session) {
    return res.status(401).json({
      type: "Unauthorized",
      message: "You are not logged in to create a room",
    });
  }

  // ******** Get the data from the request body ******** //
  const { questionId, vote } = req.body;

  if (!Object.values(VoteType).includes(vote)) {
    return res.status(200).json({
      type: "InvalidVote",
      message: `Invalid vote type: ${vote}. Expected "UP" or "DOWN"`,
    });
  }

  // ************* Check if the question's vote already exists or not ************** //
  const questionVote = await QuestionVote.findOne({
    questionId,
    userId: session.user._id,
  });

  if (questionVote) {
    // return res.status(200).json({
    //   type: "Already",
    //   message: "You already voted this question",
    // });

    // Check if the vote is same or not
    if (questionVote.vote === vote) {
      return res.status(200).json({
        type: "Already",
        message: "You already voted this question",
      });
    }

    // Update the question vote
    await QuestionVote.updateOne(
      {
        questionId,
        userId: session.user._id,
      },
      {
        vote,
      }
    );

    // Update the question's vote count
    // TODO: make a function for this
    await Question.updateOne(
      {
        _id: questionId,
      },
      {
        $inc: {
          upVotes: vote === "UP" ? 1 : -1,
          downVotes: vote === "DOWN" ? 1 : -1,
        },
      }
    );

    // send the response
    return res.status(200).json({
      type: "Success",
      message: "Question vote updated successfully",
    });
  }

  // ************* Create a question vote and save it ************** //
  const newQuestionVote = new QuestionVote({
    questionId,
    userId: session.user._id,
    vote,
  });

  // save it
  await newQuestionVote.save();

  // ************* Update the question's vote count ************** //
  await Question.updateOne(
    {
      _id: questionId,
    },
    {
      $inc: {
        upVotes: vote === "UP" ? 1 : 0,
        downVotes: vote === "DOWN" ? 1 : 0,
      },
    }
  );

  // send the response
  res.status(201).json({
    type: "Success",
    message: "Question vote created successfully",
    data: newQuestionVote,
  });
}

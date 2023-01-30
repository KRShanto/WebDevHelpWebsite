import Answer from "../../models/Answer";
import AnswerVote from "../../models/AnswerVote";
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
  const { answerId, vote } = req.body;

  if (!Object.values(VoteType).includes(vote)) {
    return res.status(200).json({
      type: "InvalidVote",
      message: `Invalid vote type: ${vote}. Expected "UP" or "DOWN"`,
    });
  }

  // ************* Check if the answer's vote already exists or not ************** //
  const answerVote = await AnswerVote.findOne({
    answerId,
    userId: session.user._id,
  });

  if (answerVote) {
    // Check if the vote is same or not
    if (answerVote.vote === vote) {
      return res.status(200).json({
        type: "Already",
        message: "You already voted this answer",
      });
    }

    // Update the answer vote
    await Answer.updateOne(
      {
        answerId,
        userId: session.user._id,
      },
      {
        vote,
      }
    );

    // Update the answer's vote count
    // TODO: make a function for this
    await Answer.updateOne(
      {
        _id: answerId,
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
      message: "Answer vote updated successfully",
    });
  }

  // ************* Create a answer vote and save it ************** //
  const newAnswerVote = new AnswerVote({
    answerId,
    userId: session.user._id,
    vote,
  });

  // save it
  await newAnswerVote.save();

  // ************* Update the answer's vote count ************** //
  await Answer.updateOne(
    {
      _id: answerId,
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
    message: "Answer vote created successfully",
    data: newAnswerVote,
  });
}

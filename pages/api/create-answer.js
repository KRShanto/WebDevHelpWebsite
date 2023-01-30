import Answer from "../../models/Answer";
import Question from "../../models/Question";
import { authOptions } from "./auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";

export default async function handler(req, res) {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({
      type: "Unauthorized",
      message: "You are not logged in to create a room",
    });
  }

  // ******** Get the data from the request body ******** //
  const { description, questionId } = req.body;

  // ************* Create a answer ************** //
  const newAnswer = new Answer({
    description,
    questionId,
    user: {
      _id: session.user._id,
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
    },
  });

  // ************* Save the answer ************** //
  try {
    // save it
    await newAnswer.save();

    // update the question's answer count
    await Question.updateOne(
      {
        _id: questionId,
      },
      {
        $inc: {
          answers: 1,
        },
      }
    );

    // send the response
    res.status(201).json({
      type: "Success",
      message: "Answer created successfully",
      data: newAnswer,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      type: "ServerError",
      message: "Something went wrong while saving the answer",
    });
  }
}

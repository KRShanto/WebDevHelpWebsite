import dbConnect from "../../lib/dbConnect";
import Question from "../../models/Question";
import User from "../../models/User";
import { authOptions } from "./auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";

export default async function handler(req, res) {
  const session = await unstable_getServerSession(req, res, authOptions);

  await dbConnect();

  // ************* Check if the user is authenticated or not ************** //
  if (!session) {
    return res.status(401).json({
      type: "Unauthorized",
      message: "You are not logged in to create a room",
    });
  }

  // ******** Get the data from the request body ******** //
  const { title, description, tags } = req.body;

  // *********** Find out the session.user from the database (we need _id field) *********** //
  const user = await User.findOne({ email: session.user.email });

  // ************* Create a question ************** //
  const newQuestion = new Question({
    title,
    description,
    tags,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
    },
  });

  // ************* Save the question ************** //
  try {
    // save it
    await newQuestion.save();

    // send the response
    res.status(201).json({
      type: "Success",
      message: "Question created successfully",
      data: newQuestion,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      type: "ServerError",
      message: "Something went wrong while saving the question",
    });
  }
}

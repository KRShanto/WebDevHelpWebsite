import Comment from "../../models/Comment";
import dbConnect from "../../lib/dbConnect";
import { authOptions } from "./auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";

export default async function handler(req, res) {
  const session = await unstable_getServerSession(req, res, authOptions);

  await dbConnect();

  // ************* Check if the user is authenticated or not ************** //
  if (!session) {
    return res.status(401).json({
      type: "Unauthorized",
      message: "You are not logged in to create a comment",
    });
  }

  // ******** Get the data from the request body ******** //
  const { answerId, description } = req.body;

  // ************* Create a comment ************** //
  const newComment = new Comment({
    description,
    answerId,
    user: {
      _id: session.user._id,
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
    },
  });

  // ************* Save the comment ************** //
  try {
    // save it
    await newComment.save();

    // send the response
    res.status(201).json({
      type: "Success",
      message: "Comment created successfully",
      data: newComment,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      type: "ServerError",
      message: "Something went wrong while saving the comment",
    });
  }
}

import dbConnect from "../../lib/dbConnect";
import Room from "../../models/Room";
import User from "../../models/User";
import { authOptions } from "./auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";

export default async function handler(req, res) {
  const session = await unstable_getServerSession(req, res, authOptions);
  const { anotherUserEmail } = req.body;

  await dbConnect();

  // ************* Check if the user is authenticated or not ************** //
  if (!session) {
    return res.status(401).json({
      type: "Unauthorized",
      message: "You are not logged in to create a room",
    });
  }

  // *********** Find out the session.user from the database (we need _id field) *********** //
  const user = await User.findOne({ email: session.user.email });

  // ************ Check if the anotherUserId is session user or not ************ //
  if (anotherUserEmail === user.email) {
    return res.status(200).json({
      type: "SameUser",
      message: "You can't create a room with yourself",
    });
  }

  // *********** Find out the anotherUser from the database (we need _id field) *********** //
  const anotherUser = await User.findOne({ email: anotherUserEmail });

  // ************* Check if the anotherUser is valid ************** //
  if (!anotherUser) {
    return res.status(404).json({
      type: "NotFound",
      message: "User not found",
    });
  }

  // ************* Check if the room already exists ************* //
  const room = await Room.findOne({
    // Check if the two users are in the same room (not just one of them)
    $and: [{ "users._id": user._id }, { "users._id": anotherUser._id }],
  });

  if (room) {
    return res.status(400).json({
      type: "AlreadyExists",
      message: "Room already exists",
    });
  } else {
    console.log("The room doesn't exist yet");
  }

  // ************* Create a room ************** //
  const newRoom = new Room({
    users: [
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
      },
      {
        _id: anotherUser._id,
        name: anotherUser.name,
        email: anotherUser.email,
        image: anotherUser.image,
      },
    ],
  });

  const savedRoom = await newRoom.save();

  return res.status(200).json({
    type: "Success",
    message: "Room created successfully",
    data: { room: savedRoom },
  });
}

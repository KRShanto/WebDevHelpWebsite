import dbConnect from "../../lib/dbConnect";
import Room from "../../models/Room";
import User from "../../models/User";
import { authOptions } from "./auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";

export default async function handler(req, res) {
  const session = await unstable_getServerSession(req, res, authOptions);
  const { anotherUserId } = req.body;

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
  if (anotherUserId === user._id) {
    return res.status(400).json({
      type: "BadRequest",
      message: "You can't create a room with yourself",
    });
  }

  // ************* Check if the room already exists ************* //
  const room = await Room.findOne({
    users: {
      $all: [{ _id: user._id }, { _id: anotherUserId }],
    },
  });

  if (room) {
    return res.status(400).json({
      type: "AlreadyExists",
      message: "Room already exists",
    });
  }

  // ************* Check if the anotherUser is valid ************** //
  const anotherUser = await User.findOne({ _id: anotherUserId });

  if (!anotherUser) {
    return res.status(404).json({
      type: "NotFound",
      message: "User not found",
    });
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

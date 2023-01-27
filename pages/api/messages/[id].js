import dbConnect from "../../../lib/dbConnect";
import Message from "../../../models/Message";
// import User from "../../models/User";
import Room from "../../../models/Room";
import { authOptions } from "../auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";

// Get all messages of the room
export default async function handler(req, res) {
  const session = await unstable_getServerSession(req, res, authOptions);
  // id of the room
  const { id } = req.query;

  await dbConnect();

  // ************* Check if the user is authenticated or not ************** //
  if (!session) {
    return res.status(401).json({
      type: "Unauthorized",
      message: "You are not logged in to get messages",
    });
  }

  // ************* Check if the room exists ************* //
  const room = await Room.findOne({ _id: id });

  if (!room) {
    return res.status(404).json({
      type: "NotFound",
      message: "Room not found",
    });
  }

  // ************* Check if the user is in the room or not ************* //
  const isUserInRoom = room.users.find(
    (roomUser) => roomUser._id === session.user._id
  );

  if (!isUserInRoom) {
    return res.status(401).json({
      type: "Unauthorized",
      message: "You are not in this room",
    });
  }

  // ************* Get all messages of the room ************* //
  const messages = await Message.find({ roomId: id }).sort({
    createdAt: 1,
  });

  res.status(200).json({ type: "Success", data: messages });
}

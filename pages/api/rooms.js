import Room from "../../models/Room";
import User from "../../models/User";
import dbConnect from "../../lib/dbConnect";
import { authOptions } from "./auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";

// GET /api/rooms
// Get all rooms for the logged in user
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

  // ************ Search for all rooms where the user is present ************ //
  const rooms = await Room.find({
    users: {
      $elemMatch: { _id: session.user._id },
    },
  });

  res.status(200).json({ type: "Success", data: rooms });
}

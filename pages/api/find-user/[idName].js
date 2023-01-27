import User from "../../../models/User";
import dbConnect from "../../../lib/dbConnect";

// Get users by their _id or name
// First try to find by _id, if not found, try to find by name
// TODO: Find by email
export default async function handler(req, res) {
  const { idName } = req.query;

  await dbConnect();

  let user = null;

  // try to find by _id
  try {
    user = await User.findOne({ _id: idName });
  } catch (error) {
    // do nothing
  }

  if (user) {
    return res.status(200).json({ type: "Success", data: user });
  }

  const users = await User.find({ name: { $regex: idName, $options: "i" } });

  if (users.length === 0) {
    return res
      .status(200)
      .json({ type: "NotFound", message: "No users found" });
  }

  res.status(200).json({ type: "Success", data: users });
}

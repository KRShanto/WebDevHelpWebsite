import mongoose, { Schema } from "mongoose";

const GlobalRoomSchema = new Schema({
  users: {
    type: [
      {
        id: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      },
    ],
    required: true,
  },
});

const GlobalRoom =
  mongoose.models.GlobalRoom || mongoose.model("GlobalRoom", GlobalRoomSchema);

export default GlobalRoom;

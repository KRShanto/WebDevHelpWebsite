import mongoose, { Schema } from "mongoose";

const RoomSchema = new Schema({
  users: {
    type: [
      {
        _id: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        email: {
          type: String,
          required: true,
          unique: true,
        },
        image: {
          type: String,
          required: true,
        },
      },
    ],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Room = mongoose.models.Room || mongoose.model("Room", RoomSchema);

export default Room;

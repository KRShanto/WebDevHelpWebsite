import mongoose, { Schema } from "mongoose";

// Note that commnent is only for answers
const CommentSchema = new Schema({
  description: {
    type: String,
    required: true,
  },
  answerId: {
    type: Schema.Types.ObjectId,
    ref: "Answer",
    required: true,
  },
  user: {
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
    },
    image: {
      type: String,
      required: true,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Comment =
  mongoose.models.Comment || mongoose.model("Comment", CommentSchema);

export default Comment;

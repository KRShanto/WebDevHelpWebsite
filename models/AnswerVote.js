import mongoose, { Schema } from "mongoose";

const AnswerVoteSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  answerId: {
    type: Schema.Types.ObjectId,
    ref: "Answer",
    required: true,
  },
  vote: {
    type: String,
    enum: ["UP", "DOWN"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const AnswerVote =
  mongoose.models.AnswerVote || mongoose.model("AnswerVote", AnswerVoteSchema);

export default AnswerVote;

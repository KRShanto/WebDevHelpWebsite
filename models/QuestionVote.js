import mongoose, { Schema } from "mongoose";

const QuestionVoteSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  questionId: {
    type: Schema.Types.ObjectId,
    ref: "Question",
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

const QuestionVote =
  mongoose.models.QuestionVote ||
  mongoose.model("QuestionVote", QuestionVoteSchema);

export default QuestionVote;

import mongoose, { Schema } from "mongoose";

const AnswerSchema = new Schema({
  description: {
    type: String,
    required: true,
  },
  upVotes: {
    type: Number,
    default: 0,
  },
  downVotes: {
    type: Number,
    default: 0,
  },
  questionId: {
    type: Schema.Types.ObjectId,
    ref: "Question",
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

// Before creating/updating, check if the downVotes is less than 1 and if so, set it to 0
AnswerSchema.pre("save", function (next) {
  if (this.downVotes < 0) {
    this.downVotes = 0;
  }

  next();
});

const Answer = mongoose.models.Answer || mongoose.model("Answer", AnswerSchema);

export default Answer;

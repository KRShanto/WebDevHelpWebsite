import mongoose, { Schema } from "mongoose";
import shortId from "shortid";

/*
QuestionSchema  -> 
            AnswerSchema
                -> CommentSchema
            DiscussionSchema

*/

export const QuestionSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  urlTitle: {
    type: String,
  },
  description: {
    type: String,
  },
  tags: {
    type: [String],
  },
  upVotes: {
    type: Number,
    default: 0,
  },
  downVotes: {
    type: Number,
    default: 0,
  },
  shortId: {
    type: String,
    default: shortId.generate,
  },
  answers: {
    type: Number,
    default: 0,
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

QuestionSchema.pre("save", function (next) {
  // Before saving the question, replace the " " with "-" in the urlTitle
  this.urlTitle = this.title.replace(/ /g, "-");

  // If the upVotes is less than 0, set it to 0
  if (this.downVotes < 0) {
    this.downVotes = 0;
  }

  // If there is a ? in the urlTitle, remove it
  if (this.urlTitle.includes("?")) {
    this.urlTitle = this.urlTitle.replace("?", "");
  }

  next();
});

const Question =
  mongoose.models.Question || mongoose.model("Question", QuestionSchema);

export default Question;

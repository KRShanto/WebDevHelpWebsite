import React from "react";
import dbConnect from "../../../lib/dbConnect";
import Question from "../../../models/Question";

export default function QuestionsPage() {
  return <div>QuestionsPage</div>;
}

// Get the questionId from the URL
// Get redirect to /questions/[questionShortId]/[title] if the questionId is valid
export async function getServerSideProps(context: any) {
  const { questionShortId } = context.query;

  await dbConnect();

  let question;

  try {
    question = await Question.findOne({ shortId: questionShortId });
  } catch (error) {
    // do nothing
    // this would happen because the questionId is not a valid ObjectId
  }

  if (!question) {
    return {
      notFound: true,
    };
  }

  return {
    redirect: {
      destination: `/questions/${questionShortId}/${question.urlTitle}`,
      permanent: true,
    },
  };
}

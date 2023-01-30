import React from "react";
import Link from "next/link";
import dbConnect from "../../lib/dbConnect";
import Question from "../../models/Question";
import Answer from "../../models/Answer";

export default function QuestionsPage({ questions }: any) {
  return (
    <div className="questions-div">
      <div className="header">
        <form action="#" className="search-question">
          <label htmlFor="question-input">Search Questions</label>
          <input
            type="text"
            id="question-input"
            placeholder="Search Questions"
          />
          <button type="submit">Search</button>
        </form>

        <Link href="/questions/ask" className="ask-question">
          Ask Question
        </Link>

        <div className="display-questions">
          {questions.map((question: any) => (
            <div className="question" key={question._id}>
              <div className="user">
                <p className="name">
                  {question.user.name}
                  {/* TODO: image */}
                </p>
              </div>

              <div className="title">
                <Link href={`/questions/${question.shortId}/${question.title}`}>
                  {question.title}
                </Link>
              </div>
              <div className="tags">
                {question.tags.map((tag: string, index: number) => (
                  <span className="tag" key={index}>
                    {tag}
                  </span>
                ))}
              </div>
              <div className="vote-count">{question.upVotes} Upvotes</div>
              <div className="answer-count">{question.answers} Answers</div>

              <div className="date">
                {new Date(question.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: any) {
  await dbConnect();

  const questions = await Question.find({}).sort({ createdAt: -1 });

  // console.log(questions);

  return {
    props: {
      questions: JSON.parse(JSON.stringify(questions)),
    },
  };
}

import React from "react";
import Link from "next/link";
import dbConnect from "../../lib/dbConnect";
import Question from "../../models/Question";
import Image from "next/image";
import SearchIcon from "../../public/icons/search.svg";

export default function QuestionsPage({ questions }: any) {
  return (
    <div className="questions-section">
      <div className="header">
        <form className="search">
          <input
            type="text"
            id="question-input"
            placeholder="Search Questions"
          />
          <button type="submit">
            <Image src={SearchIcon} alt="Search Icon" width={25} height={25} />
          </button>
        </form>

        <Link href="/questions/ask" className="ask">
          Ask Question
        </Link>
      </div>

      <div className="display">
        {questions.map((question: any) => (
          <div className="question" key={question._id}>
            {/* <div className="user"> */}
            <Image
              className="user-image"
              src={question.user.image}
              width={70}
              height={70}
              alt={question.user.name}
            />
            {/* </div> */}

            <div className="middle">
              {/* <div className="text"> */}
              <p className="name">{question.user.name}</p>
              <Link
                className="title"
                href={`/questions/${question.shortId}/${question.urlTitle}`}
              >
                {question.title}
              </Link>
              {/* </div> */}
              <div className="tags">
                {question.tags.map((tag: string, index: number) => (
                  <div key={index}>
                    {tag && <span className="tag">{tag}</span>}
                  </div>
                ))}
              </div>
            </div>
            <div className="info">
              <div className="vote-count">
                <span className="count">{question.upVotes} </span>Upvotes
              </div>
              <div className="answer-count">
                <span className="count">{question.answers}</span> Answers
              </div>
              <div className="date">
                {new Date(question.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
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

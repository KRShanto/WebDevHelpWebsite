import Answers from "./Answers";

export default function DownSide({
  answers,
  answersVotes,
  answersComments,
  question,
}: {
  answers: any[];
  answersVotes: any[];
  answersComments: any[];
  question: any;
}) {
  return (
    <div className="down">
      {/* TODO: Discussion */}
      <Answers
        answers={answers}
        answersVotes={answersVotes}
        answersComments={answersComments}
        question={question}
      />
    </div>
  );
}

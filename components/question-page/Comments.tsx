import React from "react";
import Image from "next/image";

export default function AnswerComments({
  answersCommentsState,
  index,
}: {
  answersCommentsState: any[];
  index: number;
}) {
  return (
    <div className="comments">
      {answersCommentsState[index] &&
        answersCommentsState[index].length > 0 && (
          <>
            <p className="comments-text">Comments</p>
            {answersCommentsState[index].map((comment: any, index: number) => {
              return (
                <div className="comment" key={index}>
                  <Image
                    className="user-image"
                    src={comment.user.image}
                    alt="Picture of the author"
                    width={50}
                    height={50}
                  />
                  <div className="middle">
                    <p className="name">{comment.user.name} </p>
                    <div className="description">{comment.description}</div>
                  </div>
                </div>
              );
            })}
          </>
        )}
    </div>
  );
}

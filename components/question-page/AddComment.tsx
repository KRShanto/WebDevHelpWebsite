import React, { useState } from "react";

export default function AddComment({ answerId }: { answerId: number }) {
  const [commentDescription, setCommentDescription] = useState("");

  async function handleAddComment(event: any) {
    event.preventDefault();

    if (commentDescription === "") {
      // TODO: handle error
      return;
    }

    const res = await fetch("/api/create-comment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        answerId,
        description: commentDescription,
      }),
    });

    const json = await res.json();

    console.log("Response from /api/create-comment: ", json);
  }

  return (
    <form className="add-comment" onSubmit={handleAddComment}>
      <input
        name="content"
        placeholder="Add your comment"
        value={commentDescription}
        onChange={(event) => setCommentDescription(event.target.value)}
      />
      <button type="submit">Add Comment</button>
    </form>
  );
}

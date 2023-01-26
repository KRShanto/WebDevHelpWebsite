import React, { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";

export default function AskPage() {
  const { data: session, status } = useSession();

  if (status === "unauthenticated") {
    return (
      <div>
        <h1>You are not logged in</h1>
        <button onClick={() => signIn()}>Sign in</button>
      </div>
    );
  } else if (status === "authenticated") {
    return <Ask />;
  } else {
    return <div>Loading...</div>;
  }
}

function Ask() {
  const [open, setOpen] = useState<"Editor" | "Preview">("Editor");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [separatedTags, setSeparatedTags] = useState<string[]>([]);

  const [titleError, setTitleError] = useState(false); // TODO: use this

  // When the tags change, separate them
  useEffect(() => {
    const separatedTags = tags.split(" ");
    setSeparatedTags(separatedTags);
  }, [tags]);

  function openEditor() {
    console.log("Opening Editor");

    setOpen("Editor");
  }

  function openPreview() {
    console.log("Opening Preview");

    setOpen("Preview");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("Submitting");

    if (!title) {
      setTitleError(true);
    }

    const res = await fetch("/api/create-question", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        tags: separatedTags,
      }),
    });

    const json = await res.json();

    console.log("Json : ", json);

    if (json.type === "Success") {
      console.log("Success");
      // TODO: redirect to the question page
    } else {
      console.log("Error");
    }
  }

  return (
    <div className="ask-question">
      <h1 className="heading">Ask a question</h1>

      <div className="editor-preview-header">
        <button className="editor" onClick={openEditor}>
          Editor
        </button>
        <button className="preview" onClick={openPreview}>
          Preview
        </button>
      </div>

      <form className="editor" onSubmit={handleSubmit}>
        <div className="title">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="description">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="tags">
          <label htmlFor="tags">Tags</label>
          <input
            type="text"
            id="tags"
            placeholder="Tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

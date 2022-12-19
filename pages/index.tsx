import React from "react";

export default function index() {
  return (
    <>
      <div
        className="intro"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "1.5rem",
        }}
      >
        <h2
          className="first-intro"
          style={{
            // light cyan
            color: "#73fffa",
            // textShadow: "0 0 2px #73fffa",
          }}
        >
          Web Developer Help
        </h2>
        <h1
          className="second-intro"
          style={{
            color: "cyan",
            textShadow: "0 0 100px cyan",
          }}
        >
          We are a community to help the community
        </h1>
      </div>
    </>
  );
}

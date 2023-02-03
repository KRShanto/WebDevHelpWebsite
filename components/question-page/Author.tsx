import React from "react";
import Image from "next/image";

export default function Author({
  name,
  image,
  verb,
}: {
  name: string;
  image: string;
  verb: "Asked" | "Answered";
}) {
  return (
    <div className="author">
      <div className="by">{verb} by</div>
      <div className="image-and-name">
        <Image src={image} alt="Picture of the author" width={50} height={50} />
        <p className="name">{name}</p>
      </div>
    </div>
  );
}

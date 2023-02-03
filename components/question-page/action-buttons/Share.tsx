import React from "react";
import Image from "next/image";
import { ICONS_SIZE } from "../QuestionPage";
import ShareIcon from "../../../public/icons/share.svg";

export default function Share() {
  return (
    <button className="share">
      <Image
        src={ShareIcon}
        alt="Share icon"
        width={ICONS_SIZE}
        height={ICONS_SIZE}
      />
      Share
    </button>
  );
}

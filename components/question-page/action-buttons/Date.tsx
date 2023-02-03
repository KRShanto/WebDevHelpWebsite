import React from "react";
import Image from "next/image";
import { ICONS_SIZE } from "../QuestionPage";
import ClockIcon from "../../../public/icons/clock.svg";
import moment from "moment";

export default function Date({ createdAt }: { createdAt: string }) {
  return (
    <button className="created-date">
      <Image
        src={ClockIcon}
        alt="Clock icon"
        width={ICONS_SIZE}
        height={ICONS_SIZE}
      />
      {moment(createdAt).fromNow()}
    </button>
  );
}

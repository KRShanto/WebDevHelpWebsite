import React from "react";
import Image from "next/image";
import { ICONS_SIZE } from "../QuestionPage";
import SaveIcon from "../../../public/icons/save.svg";

export default function Save() {
  return (
    <button className="save">
      <Image
        src={SaveIcon}
        alt="Save icon"
        width={ICONS_SIZE}
        height={ICONS_SIZE}
      />
      Save
    </button>
  );
}

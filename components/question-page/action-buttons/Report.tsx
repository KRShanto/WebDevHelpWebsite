import React from "react";
import Image from "next/image";
import { ICONS_SIZE } from "../QuestionPage";
import ReportIcon from "../../../public/icons/report.svg";

export default function Report() {
  return (
    <button className="report">
      <Image
        src={ReportIcon}
        alt="Report icon"
        width={ICONS_SIZE}
        height={ICONS_SIZE}
      />
      Report
    </button>
  );
}

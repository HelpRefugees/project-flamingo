import React from "react";

import ReportCardComponent from "./ReportCardComponent";
import type { Report } from "../report/models";

interface Props {
  reports: Report[];
}

export default (props: Props) => (
  <div>
    {props.reports.map((report, index) => (
      <ReportCardComponent report={report} key={index} />
    ))}
  </div>
);

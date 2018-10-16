import React from "react";

import ReportCardComponent from "./ReportCardComponent";
import { Link } from "react-router-dom";

import type { Report } from "../report/models";

interface Props {
  reports: Report[];
  updateReport: Report => void;
}

export default (props: Props) => (
  <div>
    {props.reports.map(
      (report, index) =>
        report.completed ? (
          <ReportCardComponent
            report={report}
            key={index}
            updateReport={props.updateReport}
          />
        ) : (
          <Link
            key={report.id}
            to={`/reports/${report.id}`}
            style={{ textDecoration: "none" }}
          >
            <ReportCardComponent
              report={report}
              key={index}
              updateReport={props.updateReport}
            />
          </Link>
        )
    )}
  </div>
);

import React, { PureComponent } from "react";
import { Link } from "react-router-dom";

import ReportCardComponent from "./ReportCardComponent";
import type { Report } from "../report/models";

interface Props {
  reports: Report[];
  updateReport: Report => void;
}

export default class UnsubmittedReportListComponent extends PureComponent<
  Props
> {
  render() {
    const { reports, updateReport } = this.props;
    return (
      <div data-test-id="unsubmitted-reports">
        {reports.map((report, index) => (
          <Link
            key={report.id}
            to={`/my-reports/${report.id}/edit`}
            style={{ textDecoration: "none" }}
          >
            <ReportCardComponent
              report={report}
              key={index}
              updateReport={updateReport}
            />
          </Link>
        ))}
      </div>
    );
  }
}

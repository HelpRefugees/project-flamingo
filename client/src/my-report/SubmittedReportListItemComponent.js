import React, { PureComponent } from "react";
import moment from "moment";
import { Button, TableCell, TableRow, withStyles } from "@material-ui/core";

import type { Report } from "./models";
import { Link } from "react-router-dom";
import AcceptanceFilter from "../AcceptanceFilter";

const styles = {
  tableCellDiv: {
    margin: "2px",
    borderLeft: "1px solid #d9d9d9",
    paddingLeft: "24px"
  },
  reportListItemLink: {
    color: "#000000",
    textDecoration: "none"
  }
};

type Props = {
  report: Report,
  updateReport: (report: Report, errorMessage: string) => void,
  classes: any
};

class SubmittedReportListItemComponent extends PureComponent<Props> {
  render() {
    const { report, updateReport, classes } = this.props;
    const { id, grant, reportPeriod, submissionDate } = report;
    return (
      <TableRow data-test-id="report" key={id}>
        <TableCell data-test-id="report-grant">
          <Link
            to={`/my-reports/${report.id}`}
            className={classes.reportListItemLink}
          >
            <div>{grant}</div>
          </Link>
        </TableCell>
        <TableCell data-test-id="report-period">
          <Link
            to={`/my-reports/${report.id}`}
            className={classes.reportListItemLink}
          >
            <div className={classes.tableCellDiv}>
              {moment(reportPeriod).format("MMMM YYYY")}
            </div>
          </Link>
        </TableCell>
        <TableCell data-test-id="report-submitted">
          <Link
            to={`/my-reports/${report.id}`}
            className={classes.reportListItemLink}
          >
            <div className={classes.tableCellDiv}>
              {submissionDate
                ? moment(submissionDate).format("DD/MM/YYYY")
                : ""}
            </div>
          </Link>
        </TableCell>
        <AcceptanceFilter>
          <TableCell data-test-id="report-undo">
            <div className={classes.tableCellDiv}>
              <Button
                color="primary"
                data-test-id="report-unsubmit-button"
                onClick={() =>
                  updateReport(
                    { ...report, completed: false },
                    "Error unsubmitting report"
                  )
                }
              >
                Undo
              </Button>
            </div>
          </TableCell>
        </AcceptanceFilter>
      </TableRow>
    );
  }
}

export default withStyles(styles)(SubmittedReportListItemComponent);

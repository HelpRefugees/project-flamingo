import React, { PureComponent } from "react";
import { withStyles, Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";

import SubmittedReportListItemComponent from "./SubmittedReportListItemComponent";
import type { Report } from "./models";

const styles = {
  tableCellDiv: {
    margin: "2px",
    borderLeft: "1px solid #d9d9d9",
    paddingLeft: "24px"
  },
  tableReportGrant: {
    width: '66%'
  }
};

type Props = {
  reports: Report[],
  updateReport: (report: Report, errorMessage: string) => void,
  classes: any
}

class SubmittedReportListComponent extends PureComponent<Props> {
  renderListItems() {
    const { reports, updateReport } = this.props;
    return reports.map((report, index) => (
      <SubmittedReportListItemComponent
        report={report}
        key={index}
        updateReport={updateReport} />
    ));
  }

  render() {
    const { classes } = this.props;
    return (
      <Table data-test-id="submitted-reports">
        <TableHead>
          <TableRow>
            <TableCell className={classes.tableReportGrant}>
              <div>Grant</div>
            </TableCell>
            <TableCell>
              <div className={classes.tableCellDiv}>Period</div>
            </TableCell>
            <TableCell>
              <div className={classes.tableCellDiv}>Submitted</div>
            </TableCell>
            <TableCell>
              <div className={classes.tableCellDiv}>
                {/* undo */}
                &nbsp;
              </div>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{this.renderListItems()}</TableBody>
      </Table>
    );
  }
}

export default withStyles(styles)(SubmittedReportListComponent);
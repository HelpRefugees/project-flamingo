import React, { Component, Fragment } from "react";
import {
  Grid,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  withStyles
} from "@material-ui/core";
import moment from "moment";

import HeaderComponent from "../page-layout/HeaderComponent";

import type { Account } from "../authentication/models";
import type { Report } from "../report/models";

type Props = {
  classes: any,
  logout: () => void,
  account: ?Account,
  reports: ?(Report[]),
  loadReports: () => void,
  history: any
};

const styles = theme => ({
  rowContainer: {
    marginTop: theme.spacing.unit * 4
  },
  messagePaper: {
    textAlign: "center",
    paddingTop: theme.spacing.unit * 3,
    paddingBottom: theme.spacing.unit * 3,
    boxShadow: "none"
  },
  tablePaper: {
    boxShadow: "none"
  },
  tableHead: {
    height: "25px"
  },
  tableCellDiv: {
    margin: "2px",
    borderLeft: "1px solid #d9d9d9",
    paddingLeft: "24px"
  },
  row: {
    cursor: "pointer"
  }
});

const CustomTableHeaderRow = withStyles(theme => ({
  head: {
    height: "32px",
    fontSize: "10px",
    color: "#757c80",
    fontWeight: "normal",
    letterSpacing: "1.5px"
  }
}))(TableRow);

const CustomTableCell = withStyles(theme => ({
  head: {
    width: "66%"
  }
}))(TableCell);

export class ReportsListingComponent extends Component<Props> {
  componentWillMount() {
    this.props.loadReports();
  }

  noReportsMessage(classes: any) {
    return (
      <Paper className={classes.messagePaper}>
        <Typography
          data-test-id="no-reports-title"
          variant="h5"
          className={classes.paperTitle}
        >
          No submitted reports yet!
        </Typography>
        <Typography data-test-id="no-reports-message">
          Once you’ve a completed report it will appear here.
        </Typography>
      </Paper>
    );
  }

  redirectToSubmittedReportPage(reportId: number) {
    this.props.history.push(`/submittedReports/${reportId}`);
  }

  reportsTable(classes: any, reports: Report[]) {
    return (
      <Paper className={classes.tablePaper}>
        <Table data-test-id="submitted-reports">
          <TableHead className={classes.tableHead}>
            <CustomTableHeaderRow>
              <CustomTableCell>
                <div>GRANT</div>
              </CustomTableCell>
              <TableCell>
                <div className={classes.tableCellDiv}>PERIOD</div>
              </TableCell>
              <TableCell>
                <div className={classes.tableCellDiv}>SUBMITTED</div>
              </TableCell>
            </CustomTableHeaderRow>
          </TableHead>
          <TableBody>
            {reports.map((report: Report) => {
              return (
                <TableRow
                  data-test-id="report"
                  key={report.id}
                  onClick={() => this.redirectToSubmittedReportPage(report.id)}
                  className={classes.row}
                >
                  <TableCell data-test-id="report-grant">
                    <div>{report.grant}</div>
                  </TableCell>
                  <TableCell data-test-id="report-period">
                    <div className={classes.tableCellDiv}>
                      {moment(report.reportPeriod).format("MMMM YYYY")}
                    </div>
                  </TableCell>
                  <TableCell data-test-id="report-submitted">
                    <div className={classes.tableCellDiv}>
                      {report.submissionDate
                        ? moment(report.submissionDate).format("DD/MM/YYYY")
                        : ""}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
    );
  }

  render() {
    const { classes, logout, account, reports } = this.props;

    const pageContent
      = reports && reports.length > 0
        ? this.reportsTable(classes, reports)
        : this.noReportsMessage(classes);

    return (
      <Fragment>
        <HeaderComponent logout={logout} account={account} />
        <Grid container className={classes.rowContainer}>
          <Grid item xs={1} />
          <Grid item container xs={10} justify="center">
            <Typography variant="h3" data-test-id="page-title">
              Reports
            </Typography>
          </Grid>
        </Grid>
        <Grid container className={classes.rowContainer}>
          <Grid item xs={1} />
          <Grid item xs={10}>
            {pageContent}
          </Grid>
        </Grid>
      </Fragment>
    );
  }
}

export default withStyles(styles)(ReportsListingComponent);

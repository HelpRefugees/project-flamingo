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
import HeaderComponent from "../page-layout/HeaderComponent";

import type { Account } from "../authentication/models";
import type { Report } from "../report/models";

type Props = {
  classes: any,
  logout: () => void,
  account: ?Account,
  reports: ?(Report[]),
  loadReports: () => void
};

const moment = require("moment");

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
  paperTitle: {
    color: theme.palette.primary.main,
    fontWeight: "bold"
  }
});

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

  reportsTable(classes: any, reports: Report[]) {
    return (
      <Paper className={classes.tablePaper}>
        <Table data-test-id="submitted-reports">
          <TableHead>
            <TableRow>
              <TableCell>GRANT</TableCell>
              <TableCell>PERIOD</TableCell>
              <TableCell>SUBMITTED</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports.map((report: Report) => {
              return (
                <TableRow data-test-id="report" key={report.id}>
                  <TableCell data-test-id="report-grant">
                    {report.grant}
                  </TableCell>
                  <TableCell data-test-id="report-period">
                    {moment(report.reportPeriod).format("MMMM YYYY")}
                  </TableCell>
                  <TableCell data-test-id="report-submitted">
                    {moment(report.submissionDate).format("DD/MM/YYYY")}
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
    let completedReports = reports
      ? reports.filter(report => report.completed)
      : [];
    const pageContent
      = completedReports.length > 0
        ? this.reportsTable(classes, completedReports)
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

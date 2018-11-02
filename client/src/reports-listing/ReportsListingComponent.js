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
// $FlowIgnore: react-select types don't seem to work
import Select from "react-select";

import HeaderComponent from "../page-layout/HeaderComponent";

import type { Account } from "../authentication/models";
import type { Report } from "../my-report/models";

type Props = {
  classes: any,
  logout: () => void,
  account: ?Account,
  reports: ?(Report[]),
  loadReports: () => void,
  history: any
};

const grantNameFilterControlStyles = {
  control: styles => {
    return {
      ...styles,
      backgroundColor: "#f5f5f5",
      border: "none",
      boxShadow: "none"
    };
  },
  option: (styles, props) => {
    return {
      ...styles,
      backgroundColor: props.isSelected
        ? "#00857b"
        : props.isFocused
          ? "#f5f5f5"
          : "white",
      color: props.isSelected ? "white" : "black",
      ":active": {
        backgroundColor: props.isSelected ? null : "#f5f5f5"
      },
    };
  }
};

const styles = theme => ({
  reactSelectContainer: {
    background: "yellow",
    reactSelect__control: {
      background: "yellow"
    }
  },
  reactSelect: {
    background: "yellow"
  },
  grantNameFilter: {
    minWidth: theme.spacing.unit * 35,
    paddingRight: theme.spacing.unit * 3.5,
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    borderRadius: theme.spacing.unit / 2
  },
  tabHeader: {
    textTransform: "uppercase",
    fontWeight: "bold",
    letterSpacing: 0.1,
    paddingLeft: theme.spacing.unit * 7,
    paddingRight: theme.spacing.unit * 7,
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    color: "#00857b",
    borderBottom: "solid",
    fontSize: "14px",
    margin: "0"
  },
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
  },
  grantNameCell: {
    width: "66%"
  }
});

export class ReportsListingComponent extends Component<
  Props,
  { filter?: string }
> {
  constructor() {
    super();
    this.state = {
      filter: undefined
    };
  }
  componentWillMount() {
    this.props.loadReports();
  }

  getFilteredReports(reports: Report[]): Report[] {
    return this.state.filter
      ? reports.filter((report: Report) => report.grant === this.state.filter)
      : reports;
  }

  getFilterOptions(): any[] {
    const uniqueGrantNames = [];
    (this.props.reports || []).forEach(({ grant }) => {
      if (uniqueGrantNames.indexOf(grant) === -1) {
        uniqueGrantNames.push(grant);
      }
    });
    return uniqueGrantNames
      .sort()
      .map(grant => ({ value: grant, label: grant }));
  }

  updateFilter = (selection: { label: string, value: string }) => {
    this.setState({
      filter: selection ? selection.value : undefined
    });
  };

  redirectToSubmittedReportPage(reportId: number) {
    this.props.history.push(`/reports/${reportId}`);
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
        <Grid container justify="space-between">
          <Grid item>
            <h3 className={classes.tabHeader}>submitted reports</h3>
          </Grid>
          <Grid
            item
            data-test-id="grant-name-filter"
            className={classes.grantNameFilter}
          >
            <Select
              styles={grantNameFilterControlStyles}
              options={this.getFilterOptions()}
              onChange={this.updateFilter}
              isClearable
              placeholder="Filter grant name"
            />
          </Grid>
        </Grid>
        <Table data-test-id="submitted-reports">
          <TableHead className={classes.tableHead}>
            <TableRow>
              <TableCell className={classes.grantNameCell}>
                <div>Grant</div>
              </TableCell>
              <TableCell>
                <div className={classes.tableCellDiv}>Period</div>
              </TableCell>
              <TableCell>
                <div className={classes.tableCellDiv}>Submitted</div>
              </TableCell>
            </TableRow>
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
                  <TableCell data-test-id="report-grant" className={classes.grantNameCell} >
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
        ? this.reportsTable(classes, this.getFilteredReports(reports))
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

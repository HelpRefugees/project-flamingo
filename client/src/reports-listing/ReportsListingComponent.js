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
  withStyles,
  Tabs,
  Tab,
  Chip,
  Badge
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
      }
    };
  }
};

const styles = theme => ({
  chip: {
    color: "#ea1024",
    borderColor: "#ea1024"
  },
  badge: {
    padding: `0 ${theme.spacing.unit * 2}px`
  },
  grantNameFilter: {
    minWidth: theme.spacing.unit * 35,
    paddingRight: theme.spacing.unit * 3.5,
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    borderRadius: theme.spacing.unit / 2
  },
  select: {
    indicator: {
      textTransform: "uppercase",
      fontFamily: "Open Sans",
      fontWeight: "bold",
      letterSpacing: 0.1,
      paddingTop: theme.spacing.unit * 2,
      paddingBottom: theme.spacing.unit * 4,

      color: "#00857b",
      fontSize: "14px",
      margin: "0"
    }
  },
  tabHeader: {
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    borderRight: "solid 1px #e5e5e5",
    borderBottom: "solid 1px #e5e5e5",
    fontSize: "14px",
    margin: "0",
    fontWeight: "bold"
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
  {
    filter?: string,
    tabValue: number
  }
  > {
  constructor() {
    super();
    this.state = {
      filter: undefined,
      tabValue: 0
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
    let currentTabReports = this.props.reports || [];
    if (this.state.tabValue === 0) {
      currentTabReports = currentTabReports.filter(
        (report: Report) => report.completed
      );
    } else {
      currentTabReports = currentTabReports.filter(
        (report: Report) => !report.completed
      );
    }

    const uniqueGrantNames = [];
    currentTabReports.forEach(({ grant }) => {
      if (uniqueGrantNames.indexOf(grant) === -1) {
        uniqueGrantNames.push(grant);
      }
    });
    return uniqueGrantNames
      .sort()
      .map(grant => ({ value: grant, label: grant }));
  }

  getOverdueReports(reports: Report[]) {
    return reports.filter(
      (report: Report) =>
        moment(report.dueDate).isBefore(moment()) && !report.completed
    );
  }

  getSubmittedReports(reports: Report[]) {
    return reports.filter((report: Report) => report.completed);
  }

  getSelectedFilterValue() {
    return this.getFilterOptions().find(o => o.value === this.state.filter);
  }

  updateFilter = (selection: { label: string, value: string }) => {
    this.setState({
      filter: selection ? selection.value : undefined
    });
  };

  redirectToSubmittedReportPage(reportId: number) {
    this.props.history.push(`/reports/${reportId}`);
  }

  noReportsMessage(classes: any, title: string, message: string) {
    return (
      <Paper className={classes.messagePaper}>
        <Typography
          data-test-id="no-reports-title"
          variant="h5"
          className={classes.paperTitle}
        >
          {title}
        </Typography>
        <Typography data-test-id="no-reports-message">{message}</Typography>
      </Paper>
    );
  }

  reportsTable({
    classes,
    reports,
    reportSelector
  }: {
      classes: any,
      reports: Report[],
      reportSelector: string
    }) {
    return (
      <Table data-test-id={reportSelector}>
        <TableHead className={classes.tableHead}>
          <TableRow>
            <TableCell className={classes.grantNameCell}>
              <div>Grant</div>
            </TableCell>
            <TableCell>
              <div className={classes.tableCellDiv}>Period</div>
            </TableCell>
            <TableCell>
              <div className={classes.tableCellDiv}>
                {reportSelector === "submitted-reports"
                  ? "Submitted"
                  : "Late by days"}
              </div>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reports.map((report: Report) => {
            return (
              <TableRow
                data-test-id="report"
                key={report.id}
                onClick={() => {
                  if (reportSelector === "submitted-reports") {
                    this.redirectToSubmittedReportPage(report.id);
                  }
                }}
                className={classes.row}
              >
                <TableCell
                  data-test-id="report-grant"
                  className={classes.grantNameCell}
                >
                  <div>{report.grant}</div>
                </TableCell>
                <TableCell data-test-id="report-period">
                  <div className={classes.tableCellDiv}>
                    {moment(report.reportPeriod).format("MMMM YYYY")}
                  </div>
                </TableCell>
                <TableCell
                  data-test-id={
                    reportSelector === "submitted-reports"
                      ? "report-submitted"
                      : "report-due-date"
                  }
                >
                  <div className={classes.tableCellDiv}>
                    {reportSelector === "submitted-reports" ? (
                      report.submissionDate ? (
                        moment(report.submissionDate).format("DD/MM/YYYY")
                      ) : (
                          ""
                        )
                    ) : (
                        <Chip
                          className={classes.chip}
                          label={
                            moment(new Date()).diff(report.dueDate, "days") +
                            " days late"
                          }
                          variant="outlined"
                        />
                      )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  }

  reportsTabs(classes: any, reports: ?(Report[])) {
    const submittedReportsContent =
      reports &&
        this.getFilteredReports(this.getSubmittedReports(reports)).length > 0
        ? this.reportsTable({
          classes: classes,
          reports: this.getFilteredReports(this.getSubmittedReports(reports)),
          reportSelector: "submitted-reports"
        })
        : this.noReportsMessage(
          classes,
          "No submitted reports yet!",
          "Once you’ve a completed report it will appear here."
        );
    const overdueReportsContent =
      reports &&
        this.getFilteredReports(this.getOverdueReports(reports)).length > 0
        ? this.reportsTable({
          classes: classes,
          reports: this.getFilteredReports(this.getOverdueReports(reports)),
          reportSelector: "overdue-reports"
        })
        : this.noReportsMessage(classes, "Good news!", "No reports are late");

    return (
      <Paper className={classes.tablePaper}>
        <Grid container justify="space-between">
          <Tabs
            indicatorColor="primary"
            textColor="primary"
            value={this.state.tabValue}
            onChange={(event, value) => {
              this.setState({
                tabValue: value,
                filter: ""
              });
            }}
          >
            <Tab
              tabIndex={0}
              data-test-id="submitted-reports-tab"
              className={classes.tabHeader}
              label="Submitted reports"
            />
            <Tab
              tabIndex={1}
              data-test-id="overdue-reports-tab"
              className={classes.tabHeader}
              label={
                <>
                  <Badge
                    className={classes.badge}
                    color="secondary"
                    badgeContent={this.getOverdueReports(reports || []).length}
                  >
                    Late reports
                  </Badge>
                </>
                // "Late reports " + this.getOverdueReports(reports || []).length
              }
            />
          </Tabs>
          <Grid
            item
            data-test-id="grant-name-filter"
            className={classes.grantNameFilter}
          >
            <Select
              className={classes.Select}
              key={this.getSelectedFilterValue()}
              styles={grantNameFilterControlStyles}
              options={this.getFilterOptions()}
              getOptionValue={option => option.value}
              getOptionLabel={option => option.label}
              isClearable
              onChange={this.updateFilter}
              value={this.getSelectedFilterValue()}
              placeholder="Filter grant name"
            />
          </Grid>
        </Grid>
        {this.state.tabValue === 0 && submittedReportsContent}
        {this.state.tabValue === 1 && overdueReportsContent}
      </Paper>
    );
  }

  render() {
    const { classes, logout, account, reports } = this.props;

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
            {this.reportsTabs(classes, reports)}
          </Grid>
        </Grid>
      </Fragment>
    );
  }
}

export default withStyles(styles)(ReportsListingComponent);

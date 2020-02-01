import React, { Component, Fragment } from "react";
import {
  Badge,
  Chip,
  Grid,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  Typography,
  withStyles
} from "@material-ui/core";

import moment from "moment";
// $FlowIgnore: react-select types don't seem to work
import Select from "react-select";

import HeaderComponent from "../page-layout/HeaderComponent";

import { type Account } from "../authentication/models";
import { type Report } from "../my-report/models";
import BannerHeader from "../page-layout/BannerHeader";

type Props = {
  classes: any,
  logout: () => void,
  account: ?Account,
  reports: ?($Shape<Report>[]),
  loadReports: () => void,
  history: any
};

const defaultText = {
  fontSize: 14,
  fontFamily: `"Open Sans", sans-serif`
};

// https://react-select.com/styles
const grantNameFilterControlStyles = {
  control: styles => ({
    ...styles,
    backgroundColor: "#f5f5f5",
    border: "none",
    boxShadow: "none"
  }),
  placeholder: styles => ({
    ...styles,
    ...defaultText
  }),
  option: (styles, props) => ({
    ...styles,
    ...defaultText,
    backgroundColor: props.isSelected
      ? "#00857b"
      : props.isFocused
      ? "#f5f5f5"
      : "white",
    color: props.isSelected ? "white" : "black",
    ":active": {
      backgroundColor: props.isSelected ? null : "#f5f5f5"
    }
  })
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
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit,
    borderRadius: theme.spacing.unit / 2
  },
  rowContainer: {
    marginTop: theme.spacing.unit * 4
  },
  messagePaper: {
    textAlign: "center",
    paddingTop: theme.spacing.unit * 3,
    paddingBottom: theme.spacing.unit * 3
  },
  underlined: {
    borderBottom: "1px solid #e5e5e5"
  },
  grow: {
    flexGrow: 1
  },
  tableCellDiv: {
    margin: 2,
    borderLeft: "1px solid #d9d9d9",
    paddingLeft: theme.spacing.unit * 3
  },
  row: {
    cursor: "pointer"
  },
  grantNameCell: {
    width: "44%"
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

  componentDidMount() {
    this.props.loadReports();
  }

  getFilteredReports(reports: $Shape<Report>[]): $Shape<Report>[] {
    return this.state.filter
      ? reports.filter(
          (report: $Shape<Report>) => report.grant === this.state.filter
        )
      : reports;
  }

  getFilterOptions(): any[] {
    let currentTabReports = this.props.reports || [];
    if (this.state.tabValue === 0) {
      currentTabReports = currentTabReports.filter(
        (report: $Shape<Report>) => report.completed
      );
    } else {
      currentTabReports = currentTabReports.filter(
        (report: $Shape<Report>) => !report.completed
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

  getOverdueReports(reports: ?($Shape<Report>[])) {
    return (reports || []).filter(
      (report: $Shape<Report>) =>
        !report.completed && moment(report.dueDate).isBefore(moment())
    );
  }

  getSubmittedReports(reports: $Shape<Report>[]) {
    return reports.filter((report: $Shape<Report>) => report.completed);
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
    reports: $Shape<Report>[],
    reportSelector: string
  }) {
    return (
      <Table data-test-id={reportSelector}>
        <TableHead>
          <TableRow>
            <TableCell className={classes.grantNameCell}>
              <div>Grant</div>
            </TableCell>
            <TableCell>
              <div className={classes.tableCellDiv}>Region</div>
            </TableCell>
            <TableCell>
              <div className={classes.tableCellDiv}>Country</div>
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
          {reports.map((report: $Shape<Report>) => {
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
                <TableCell>
                  <div className={classes.tableCellDiv}>{report.region}</div>
                </TableCell>
                <TableCell>
                  <div className={classes.tableCellDiv}>{report.country}</div>
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

  renderLateReportsLabel() {
    const { reports, classes } = this.props;
    const label = "Late reports";
    const overdue = this.getOverdueReports(reports).length;
    if (overdue === 0) {
      return label;
    }
    return (
      <Badge className={classes.badge} color="secondary" badgeContent={overdue}>
        {label}
      </Badge>
    );
  }

  reportsTabs(classes: any, reports: ?($Shape<Report>[])) {
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
      <Paper>
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
              label="Submitted reports"
            />
            <Tab
              tabIndex={1}
              data-test-id="overdue-reports-tab"
              label={this.renderLateReportsLabel()}
            />
          </Tabs>
          <div className={`${classes.underlined} ${classes.grow}`}>&nbsp;</div>
          <Grid
            item
            data-test-id="grant-name-filter"
            className={`${classes.grantNameFilter} ${classes.underlined}`}
          >
            <Select
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
          <Grid item container xs={10}>
            <BannerHeader title="Reports" />
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

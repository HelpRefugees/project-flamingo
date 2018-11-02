import React, { Component } from "react";
import {
  Card,
  CardContent,
  Chip,
  Grid,
  Typography,
  withStyles
} from "@material-ui/core";
import moment from "moment";

import type { Report } from "./models";
import theme from "../theme";

const styles = () => {
  const normalColour = "#757c80";
  const dueColour = "#e68e00";
  const lateColour = "#ea1024";

  return {
    card: {
      boxShadow: "none"
    },
    reportStatus: {
      borderLeft: "1px solid #d9d9d9",
      paddingLeft: theme.spacing.unit * 2,
      marginLeft: theme.spacing.unit * 2
    },
    notFullWidth: {
      width: "initial"
    },
    cardContent: {
      // required to override :last-child rule on CardContent
      paddingBottom: `${theme.spacing.unit * 2}px !important`
    },
    statusLabel: {
      color: normalColour
    },
    statusOutlined: {
      borderColor: normalColour
    },
    lateStatusLabel: {
      color: lateColour
    },
    lateStatusOutlined: {
      borderColor: lateColour
    },
    dueStatusLabel: {
      color: dueColour
    },
    dueStatusOutlined: {
      borderColor: dueColour
    }
  };
};

type Props = {
  classes: any,
  report: Report
};

export class ReportCardComponent extends Component<Props> {
  renderReportStatus(report: Report, classes: any) {
    let status: string;
    let chipClasses = {
      label: classes.statusLabel,
      outlined: classes.statusOutlined
    };
    const dueDate = moment(report.dueDate);
    const delta = dueDate.diff(moment(), "days");

    if (report.completed && report.submissionDate) {
      status = moment(report.submissionDate).format("DD/MM/YYYY");
    } else if (delta < 0) {
      status = `${dueDate.fromNow(true)} late`;
      chipClasses = {
        label: classes.lateStatusLabel,
        outlined: classes.lateStatusOutlined
      };
    } else if (delta < 8) {
      status = `Due in ${dueDate.fromNow(true)}`;
      chipClasses = {
        label: classes.dueStatusLabel,
        outlined: classes.dueStatusOutlined
      };
    } else {
      status = moment(report.dueDate).format("DD/MM/YYYY");
    }

    return (
      <Chip
        label={status}
        classes={chipClasses}
        variant="outlined"
        data-test-id="report-status"
      />
    );
  }

  render() {
    const { report, classes } = this.props;

    return (
      <Card data-test-id="report" className={classes.card}>
        <CardContent className={classes.cardContent}>
          <Grid container justify="space-between">
            <Grid
              item
              container
              direction="column"
              xs={3}
              className={classes.notFullWidth}
            >
              <Typography color="textSecondary" variant="caption">
                Grant
              </Typography>
              <Typography data-test-id="report-grant-name">
                {report.grant}
              </Typography>
            </Grid>
            <Grid item container xs={9} justify="flex-end">
              <Grid
                item
                container
                direction="column"
                className={classes.notFullWidth}
              >
                <Typography color="textSecondary" variant="caption">
                  Period
                </Typography>
                <Typography data-test-id="report-period">
                  {moment(report.reportPeriod).format("MMMM YYYY")}
                </Typography>
              </Grid>
              <Grid
                item
                container
                className={`${classes.reportStatus} ${classes.notFullWidth}`}
                alignItems="center"
              >
                {this.renderReportStatus(report, classes)}
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  }
}

export default withStyles(styles)(ReportCardComponent);

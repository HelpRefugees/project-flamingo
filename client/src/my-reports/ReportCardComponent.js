import React, { Component } from "react";
import {
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Typography,
  withStyles
} from "@material-ui/core";

import type { Report } from "../report/models";
import theme from "../theme";

const moment = require("moment");

const styles = themes => ({
  reportStatus: {
    borderLeft: "1px solid #d9d9d9",
    paddingLeft: theme.spacing.unit * 2,
    marginLeft: theme.spacing.unit * 2
  },
  notFullWidth: {
    width: "initial"
  }
});

type Props = {
  classes: any,
  report: Report,
  updateReport: (report: Report) => void
};

export class ReportCardComponent extends Component<Props> {
  unsubmitReport = () => {
    this.props.updateReport({
      ...this.props.report,
      completed: false,
      submissionDate: undefined
    });
  };

  render() {
    const { report, classes } = this.props;

    return (
      <Card data-test-id="report">
        <CardContent>
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
              <Typography data-test-id="grant-name">{report.grant}</Typography>
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
              <Grid item className={classes.reportStatus}>
                <Chip
                  label={
                    report.completed && report.submissionDate
                      ? moment(report.submissionDate).format("DD/MM/YYYY")
                      : "Incomplete"
                  }
                  variant="outlined"
                  color="secondary"
                  data-test-id="report-status"
                />
                {report.completed && (
                  <Button
                    data-test-id="report-unsubmit-button"
                    color="primary"
                    onClick={() => this.unsubmitReport()}
                  >
                    Undo
                  </Button>
                )}
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  }
}

export default withStyles(styles)(ReportCardComponent);

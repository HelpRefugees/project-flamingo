import React from "react";
import {
  Card,
  CardContent,
  Chip,
  Grid,
  Typography,
  withStyles
} from "@material-ui/core";

import { Report } from "./models";
import theme from "../theme";

const styles = themes => ({
  reportStatus: {
    borderLeft: "1px solid #d9d9d9",
    paddingLeft: theme.spacing.unit * 2
  }
});

export const ReportComponent = (props: { report: Report, classes: any }) => {
  return (
    <Card data-test-id="report">
      <CardContent>
        <Grid container justify="space-between" alignItems="center">
          <Grid item container direction="column" xs={3}>
            <Typography color="textSecondary" variant="caption">
              Grant
            </Typography>
            <Typography data-test-id="grant-name">
              {props.report.grant}
            </Typography>
          </Grid>
          <Grid item className={props.classes.reportStatus}>
            <Chip
              label="Incomplete"
              variant="outlined"
              color="secondary"
              data-test-id="report-status"
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default withStyles(styles)(ReportComponent);

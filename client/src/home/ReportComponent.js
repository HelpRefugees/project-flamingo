import React from "react";
import { Card, CardContent, Chip, Grid, Typography } from "@material-ui/core";

import { Report } from "./models";

export default (props: { report: Report }) => {
  return (
    <Card data-test-id="report">
      <CardContent>
        <Grid container justify="space-between">
          <Grid item container direction="column" xs={3}>
            <Typography color="textSecondary" variant="caption">
              Grant
            </Typography>
            <Typography data-test-id="grant-name">
              {props.report.grant}
            </Typography>
          </Grid>
          <Grid item>
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

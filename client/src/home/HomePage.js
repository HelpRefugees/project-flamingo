import React, { Component, Fragment } from "react";
import { Grid } from "@material-ui/core";

import ReportComponent from "./ReportComponent";
import type { Report } from "./models";

type Props = {};

export default class HomePage extends Component<Props> {
  render() {
    const reports: Report[] = [{ grant: "Grant Mitchell" }];
    return (
      <Fragment>
        {/* Header placeholder */}
        <Grid container>
          <Grid item xs={12} style={{ backgroundColor: "#fff", height: 80 }} />
        </Grid>

        <Grid container>
          <Grid item xs={1} />
          <Grid item xs={10}>
            <h1 data-test-id="page-title">Monthly Report</h1>
            {reports.map((report, index) => (
              <ReportComponent report={report} key={index} />
            ))}
          </Grid>
        </Grid>
      </Fragment>
    );
  }
}

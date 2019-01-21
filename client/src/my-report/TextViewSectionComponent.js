import React from "react";
import { Grid, Paper, Typography } from "@material-ui/core";

type Props = {
  titleKey: string,
  title: string,
  valueKey: string,
  value: string,
  classes: any
};

export class TextViewSectionComponent extends React.PureComponent<Props> {
  formatParagraph(content?: string): ?any {
    return (content || "").split("\n").map((item, index) => (
      <span key={index}>
        {item}
        <br />
      </span>
    ));
  }

  render() {
    const { title, classes, titleKey, value, valueKey } = this.props;
    return (
      <Paper
        justify="center"
        className={classes.pagePaper}
        data-test-id={titleKey}
      >
        <Grid container direction="column" spacing={32}>
          <Grid item>
            <Typography variant="h4" data-test-id="report-section-title">
              {title}
            </Typography>
            <hr className={classes.rule} />
          </Grid>
          <Grid item>
            <Typography data-test-id={valueKey} className={classes.progress}>
              {this.formatParagraph(value)}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    );
  }
}

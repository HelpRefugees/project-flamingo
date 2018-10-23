import React, { Component } from "react";
import { withStyles, Paper, Grid, Button } from "@material-ui/core";

type Props = {
  classes: any,
  title: string,
  subtitle: string,
  onSave: () => void,
  disabled: boolean,
  children?: ?any
};

const styles = themes => ({
  headerText: {
    color: "#404040"
  },
  subtitleText: {
    fontSize: "14px",
    color: "#404040",
    marginLeft: "4px",
    fontWeight: "normal",
    lineHeight: "1.3rem",
    letterSpacing: "0.1px"
  },
  pagePaper: {
    padding: themes.spacing.unit * 4,
    boxShadow: "none",
    margin: themes.spacing.unit * 2
  }
});

class ReportSectionComponent extends Component<Props> {
  render() {
    const { classes, title, subtitle, onSave, disabled, children } = this.props;
    return (
      <Paper
        justify="center"
        className={classes.pagePaper}
        data-test-id="report-section"
      >
        <Grid container direction="column" spacing={32}>
          <Grid item>
            <h1
              data-test-id="section-title"
              className={[classes.fontFamily, classes.headerText].join(" ")}
            >
              {title}
            </h1>
            <h2
              className={classes.subtitleText}
              data-test-id="section-subtitle"
            >
              {subtitle}
            </h2>
            {children}
          </Grid>
          <Grid item>
            <Button
              data-test-id="section-save-button"
              color="primary"
              variant="outlined"
              disabled={disabled}
              fullWidth={false}
              onClick={onSave.bind(this)}
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </Paper>
    );
  }
}

export default withStyles(styles)(ReportSectionComponent);

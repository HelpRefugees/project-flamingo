import React, { Component } from "react";
import { withStyles, Paper, Grid, Button } from "@material-ui/core";

type Props = {
  classes: any,
  title: string,
  subtitle: string,
  onSave: () => void,
  disabled: boolean,
  children?: ?any,
  optional: boolean
};

const styles = themes => ({
  headerText: {
    color: "#404040",
    margin: 0,
    fontWeight: "normal",
    fontFamily: "open Sans",
    fontSize: "24px"
  },
  optionalSubtitleText: {
    fontSize: "14px",
    color: "#7f7f7f",
    fontFamily: "open Sans",
    marginBottom: 0,
    marginLeft: "5px"
  },
  subtitleText: {
    fontSize: "14px",
    color: "#7f7f7f",
    fontWeight: "normal",
    lineHeight: "1.3rem",
    letterSpacing: "0.1px",
    fontFamily: "open Sans",
    marginBottom: themes.spacing.unit * 2.5
  },
  pagePaper: {
    padding: themes.spacing.unit * 4,
    boxShadow: "none",
    margin: themes.spacing.unit * 2
  },
  saveButton: {
    minWidth: "140px"
  }
});

class ReportSectionComponent extends Component<Props> {
  render() {
    const {
      classes,
      title,
      subtitle,
      onSave,
      disabled,
      children,
      optional,
      ...others
    } = this.props;
    return (
      <Paper justify="center" className={classes.pagePaper} {...others}>
        <Grid container direction="column" spacing={32}>
          <Grid item>
            <Grid container justify="flex-start" alignItems="center">
              <h1
                data-test-id="section-title"
                className={[classes.fontFamily, classes.headerText].join(" ")}
              >
                {title}
              </h1>
              {optional && (
                <h2
                  data-test-id="optional-title"
                  className={classes.optionalSubtitleText}
                >
                  - Optional
                </h2>
              )}
            </Grid>
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
              className={classes.saveButton}
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

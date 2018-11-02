import React, { Component } from "react";
import { withStyles, Paper, Grid, Button, Typography } from "@material-ui/core";

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
    margin: 0
  },
  optionalSubtitleText: {
    color: "#7f7f7f",
    fontWeight: 600,
    marginBottom: 0,
    marginLeft: "5px"
  },
  subtitleText: {
    color: "#7f7f7f",
    fontSize: 14,
    fontWeight: 600,
    lineHeight: "1.3rem",
    marginBottom: themes.spacing.unit * 2.5,
    opacity: 0.87
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
            <Grid container alignItems="flex-end">
              <Typography data-test-id="section-title" variant="h4">
                {title}
              </Typography>
              {optional && (
                <Typography
                  data-test-id="optional-title"
                  className={classes.optionalSubtitleText}
                >
                  - Optional
                </Typography>
              )}
            </Grid>
            <p data-test-id="section-subtitle" className={classes.subtitleText}>
              {subtitle}
            </p>
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

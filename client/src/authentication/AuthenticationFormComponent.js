import React, { Component } from "react";
import { Grid, Paper, withStyles } from "@material-ui/core";

type Props = {
  classes: any,
  children: any
};

const styles = themes => ({
  loginPaper: {
    padding: themes.spacing.unit * 4
  },
  logo: {
    paddingBottom: themes.spacing.unit * 3
  },
  outerContainer: {
    height: "100vh",
    width: "100%"
  }
});

class AuthenticationFormComponent extends Component<Props> {
  render() {
    const { classes, children } = this.props;

    return (
      <Grid
        container
        spacing={24}
        direction="column"
        justify="center"
        className={classes.outerContainer}
      >
        <Grid container justify="center">
          <Grid item xs={4}>
            <Paper justify="center" className={classes.loginPaper}>
              <Grid
                container
                justify="center"
                direction="column"
                alignItems="center"
                spacing={8}
              >
                <img
                  src="logo.png"
                  alt="Help Refugees Logo"
                  className={classes.logo}
                />
                {children}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(AuthenticationFormComponent);

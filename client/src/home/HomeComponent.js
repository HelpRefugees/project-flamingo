import React, { Component, Fragment } from "react";
import {
  Grid,
  Typography,
  withStyles,
  AppBar,
  Toolbar,
  MenuItem,
  Menu,
  Button,
  Icon
} from "@material-ui/core";

import ReportComponent from "./ReportComponent";
import type { Report } from "./models";

type Props = {
  classes: any,
  logout: () => void
};

type State = {
  anchorEl: any
};

const styles = theme => ({
  rowContainer: {
    marginTop: theme.spacing.unit * 4
  },
  header: {
    boxShadow: "none",
    justifyContent: "space-between"
  },
  headerLogo: {
    margin: theme.spacing.unit,
    height: theme.spacing.unit * 8
  },
  menuItem: {
    minWidth: "150px"
  }
});

export class HomeComponent extends Component<Props, State> {
  handleClick = (event: Event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  logout = () => {
    this.props.logout();
  };

  state = {
    anchorEl: null
  };

  render() {
    const reports: Report[] = [{ grant: "Grant Mitchell" }];
    const { classes } = this.props;
    const { anchorEl } = this.state;
    return (
      <Fragment>
        <AppBar position="static" color="inherit" className={classes.header}>
          <Toolbar>
            <Grid container justify="space-between" alignItems="center">
              <img
                src="logo.png"
                alt="Help Refugees Logo"
                className={classes.headerLogo}
              />
              <Button
                data-test-id="user-menu"
                aria-owns={anchorEl ? "simple-menu" : null}
                aria-haspopup="true"
                onClick={this.handleClick}
              >
                Ellen Smith
                <Icon className={classes.icon}>arrow_drop_down</Icon>
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={this.handleClose}
              >
                <MenuItem
                  data-test-id="logout-menuitem"
                  className={classes.menuItem}
                  onClick={this.logout}
                >
                  Logout
                </MenuItem>
              </Menu>
            </Grid>
          </Toolbar>
        </AppBar>

        <Grid container className={classes.rowContainer}>
          <Grid item xs={1} />
          <Grid item container xs={10} justify="center">
            <Typography variant="display2" data-test-id="page-title">
              Monthly Report
            </Typography>
          </Grid>
        </Grid>

        <Grid container className={classes.rowContainer}>
          <Grid item xs={1} />
          <Grid item xs={10}>
            <Typography variant="display1">Incomplete Reports</Typography>
          </Grid>
        </Grid>

        <Grid container className={classes.rowContainer}>
          <Grid item xs={1} />
          <Grid item xs={10}>
            {reports.map((report, index) => (
              <ReportComponent report={report} key={index} />
            ))}
          </Grid>
        </Grid>
      </Fragment>
    );
  }
}

export default withStyles(styles)(HomeComponent);

import React, { Component } from "react";
import {
  Grid,
  withStyles,
  AppBar,
  Toolbar,
  MenuItem,
  Menu,
  Button,
  Icon,
  Typography
} from "@material-ui/core";
import { Link, withRouter } from "react-router-dom";

import type { Account } from "../authentication/models";
import Navigation from "./Navigation";
// import  withRouter  from "react-router-dom/withRouter";

type Props = {
  classes: any,
  logout: () => void,
  account: Account,
  history: any,
  navigateToHome: (props: any) => void
};

type State = {
  anchorElement: any
};

const styles = theme => ({
  headerLogo: {
    margin: theme.spacing.unit,
    maxHeight: "45px"
  },
  menuItem: {
    minWidth: "150px"
  },
  userMenu: {
    textTransform: "none",
    paddingRight: "0px"
  },
  settings: {
    textDecoration: "none",
    minWidth: "150px"
  }
});

export class HeaderComponent extends Component<Props, State> {
  static defaultProps = {
    navigateToHome: (props: any) => {
      props.history.push("/");
    }
  };
  expandMenu = (event: Event) => {
    this.setState({ anchorElement: event.currentTarget });
  };

  collapseMenu = () => {
    this.setState({ anchorElement: null });
  };

  logout = () => {
    this.props.logout();
  };

  state = {
    anchorElement: null
  };

  renderSettingsNavigations = (classes: any) => {
    return (
      <MenuItem data-test-id="settings-menuitem" className={classes.menuItem}>
        <Link to={`/settings/users`} className={classes.settings}>
          <Typography> Settings</Typography>
        </Link>
      </MenuItem>
    );
  };
  render() {
    const { classes, account } = this.props;
    const { anchorElement } = this.state;
    return (
      <AppBar position="static" color="inherit">
        <Toolbar>
          <Grid container justify="space-between" alignItems="center">
            <Grid item>
              <img
                data-test-id="logo"
                src="/logo-wide.png"
                alt="Help Refugees Logo"
                className={classes.headerLogo}
                onClick={() => {
                  this.props.navigateToHome(this.props);
                }}
              />
            </Grid>
            <Grid item>
              <Navigation />
              <Button
                data-test-id="user-menu"
                aria-owns={anchorElement ? "simple-menu" : null}
                aria-haspopup="true"
                onClick={this.expandMenu}
                className={classes.userMenu}
              >
                <span data-test-id="user-name">
                  {account ? account.name : "No name"}
                </span>
                <Icon className={classes.icon}>arrow_drop_down</Icon>
              </Button>
              <Menu
                id="simple-menu"
                anchorEl={anchorElement}
                open={Boolean(anchorElement)}
                onClose={this.collapseMenu}
              >
                {account &&
                  account.role === "help-refugees" &&
                  this.renderSettingsNavigations(classes)}
                <MenuItem
                  data-test-id="logout-menuitem"
                  className={classes.menuItem}
                  onClick={this.logout}
                >
                  Logout
                </MenuItem>
              </Menu>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    );
  }
}

HeaderComponent.defaultProps = {
  navigateToHome: (props: any) => {
    props.history.push("/");
  }
};
export default withRouter(withStyles(styles)(HeaderComponent));

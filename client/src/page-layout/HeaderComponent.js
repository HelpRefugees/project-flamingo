import React, { Component } from "react";
import {
  Grid,
  withStyles,
  AppBar,
  Toolbar,
  MenuItem,
  Menu,
  Button,
  Icon
} from "@material-ui/core";
import { Link } from "react-router-dom";

import type { Account } from "../authentication/models";
import Navigation from "./Navigation";

type Props = {
  classes: any,
  logout: () => void,
  account: Account
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
  }
});

export class HeaderComponent extends Component<Props, State> {
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

  render() {
    const { classes, account } = this.props;
    const { anchorElement } = this.state;
    return (
      <AppBar position="static" color="inherit">
        <Toolbar>
          <Grid container justify="space-between" alignItems="center">
            <Grid item>
              <Link to={`/`}>
                <img
                  data-test-id="logo"
                  src="/logo-wide.png"
                  alt="Help Refugees Logo"
                  className={classes.headerLogo}
                />
              </Link>
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

export default withStyles(styles)(HeaderComponent);

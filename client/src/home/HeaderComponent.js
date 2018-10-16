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

type Props = {
  classes: any,
  logout: () => void
};

type State = {
  anchorElement: any
};

const styles = theme => ({
  header: {
    boxShadow: "none"
  },
  headerLogo: {
    margin: theme.spacing.unit,
    maxHeight: "45px"
  },
  menuItem: {
    minWidth: "150px"
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
    const { classes } = this.props;
    const { anchorElement } = this.state;
    return (
      <AppBar position="static" color="inherit" className={classes.header}>
        <Toolbar>
          <Grid container justify="space-between" alignItems="center">
            <Link to={`/home`}>
              <img
                data-test-id="logo"
                src="/logo-wide.png"
                alt="Help Refugees Logo"
                className={classes.headerLogo}
              />
            </Link>
            <Button
              data-test-id="user-menu"
              aria-owns={anchorElement ? "simple-menu" : null}
              aria-haspopup="true"
              onClick={this.expandMenu}
            >
              Ellen Smith
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
        </Toolbar>
      </AppBar>
    );
  }
}

export default withStyles(styles)(HeaderComponent);

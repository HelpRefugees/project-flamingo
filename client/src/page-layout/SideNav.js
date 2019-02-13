import React, { Component } from "react";
import {
  withStyles,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Typography
} from "@material-ui/core";
import { withRouter } from "react-router-dom";
// $FlowIgnore: ExpansionPanel types don't seem to work
import ExpandMore from "@material-ui/icons/ExpandMore";
// $FlowIgnore: ExpansionPanel types don't seem to work
import ExpandLess from "@material-ui/icons/ExpandLess";
// $FlowIgnore: ExpansionPanel types don't seem to work
import Collapse from "@material-ui/core/Collapse";

const styles = theme => ({
  subItem: {
    backgroundColor: theme.palette.primary.main
  },
  subItemText: {
    color: theme.palette.background.paper
  },
  sideNav: {
    borderRadius: "0px",
    flex: 1
  },
  list: {
    height: "88.5vh"
  },
  sideNavHeader: {
    textTransform: "uppercase",
    fontSize: "10px",
    marginLeft: theme.spacing.unit * 3,
    display: "block",
    color: theme.palette.primary.main,
    fontWeight: "600px",
    fontStyle: "normal",
    fontStretch: "normal",
    lineHeight: "1.6px",
    letterSpacing: "1.5px",
    padding: theme.spacing.unit
  }
});

type props = {
  history: any,
  classes: any
};
type state = {
  expand: boolean
};
export class NavComponent extends Component<props, state> {
  constructor() {
    super();
    this.state = {
      expand: false
    };
  }
  navigateTo = (url: string) => {
    this.props.history.push(url);
  };
  expandMenu = () => {
    this.setState(state => ({ expand: !state.expand }));
  };

  render() {
    const { classes } = this.props;
    return (
      <Grid container>
        <Paper className={classes.sideNav}>
          <Typography className={classes.sideNavHeader}>settings</Typography>
          <List component="nav" className={classes.list}>
            <ListItem
              button
              selected
              onClick={() => {
                this.navigateTo("/settings/users");
              }}
            >
              <ListItemText primary="Manage users" />
            </ListItem>
            <Divider />
            <ListItem onClick={this.expandMenu} button>
              <ListItemText primary="Report settings" />
              {this.state.expand ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={this.state.expand}>
              <ListItem
                button
                className={classes.subItem}
                onClick={() => {
                  this.navigateTo("/settings/report");
                }}
              >
                <ListItemText
                  color="white"
                  primary="Demographic information"
                  className={classes.subItemText}
                  style={{ color: "white" }}
                />
              </ListItem>
            </Collapse>
            <Divider />
          </List>
        </Paper>
      </Grid>
    );
  }
}

export default withRouter(withStyles(styles)(NavComponent));

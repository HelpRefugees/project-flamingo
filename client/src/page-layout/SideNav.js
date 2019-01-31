import React, { Component } from "react";
import {
  withStyles,
  Grid,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  List,
  ListItem,
  ListItemText,
  Divider,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Modal
} from "@material-ui/core";
import { Link, withRouter } from "react-router-dom";
import ExpandMore from "@material-ui/icons/ExpandMore";
import ExpandLess from "@material-ui/icons/ExpandLess";
import Collapse from "@material-ui/core/Collapse";
// $FlowIgnore: ExpansionPanel types don't seem to work
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
// $FlowIgnore: ExpansionPanel types don't seem to work
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
// $FlowIgnore: ExpansionPanel types don't seem to work
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import type { Account } from "../authentication/models";
import Navigation from "./Navigation";

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
export class NavComponent extends Component {
  constructor() {
    super();
    this.state = {
      expand: false
    };
  }
  navigateTo = url => {
    this.props.history.push(url);
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

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
  Typography
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";

import HeaderComponent from "../page-layout/HeaderComponent";
import BannerHeader from "../page-layout/BannerHeader";
import ButtonLink from "../page-layout/ButtonLink";

import { type Account } from "../authentication/models";
import { type User } from "./models";

const styles = theme => ({
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
  },
  rowContainer: {
    marginTop: theme.spacing.unit * 4
  },
  addGrantButton: {
    width: "171px",
    height: "36px",
    background: "#ffffff",
    color: "#00857b",
    marginTop: theme.spacing.unit * 5.5,
    fontSize: "14px",
    borderRadius: "0px"
  },
  tableUser: {
    margin: "2px",
    borderLeft: "1px solid #d9d9d9",
    paddingLeft: "24px"
  },
  tableIcon: {
    textAlign: "center",
    color: theme.palette.primary.main
  },
  clickable: {
    cursor: "pointer"
  }
});

type Props = {
  account: Account,
  logout: () => void,
  classes: any,
  users: User[],
  loadUsers: () => void,
  history: any
};

class UsersListingComponent extends Component<Props> {
  componentWillMount() {
    this.props.loadUsers();
  }
  render() {
    const users = this.props.users || [];
    const { classes, logout, account } = this.props;
    return (
      <>
        <HeaderComponent
          logout={logout}
          account={account}
          history={this.props.history}
        />
        <Grid container>
          <Grid item xs={3}>
            <Grid container>
              <Paper className={classes.sideNav}>
                <Typography className={classes.sideNavHeader}>
                  settings
                </Typography>
                <List component="nav" className={classes.list}>
                  <ListItem button selected={true}>
                    <ListItemText primary="Manage users" />
                  </ListItem>
                  <Divider />
                </List>
              </Paper>
            </Grid>
          </Grid>

          <Grid item xs={9}>
            <Grid container className={classes.rowContainer}>
              <Grid item xs={1} />
              <Grid item container xs={10}>
                <BannerHeader title="Users">
                  <ButtonLink
                    to={"/grants/new"}
                    data-test-id="add-grant-button"
                    className={classes.addGrantButton}
                  >
                    ADD NEW USER
                  </ButtonLink>
                </BannerHeader>
              </Grid>
              <Grid container className={classes.rowContainer}>
                <Grid item xs={1} />
                <Grid item xs={10}>
                  <Table data-test-id="grant-list">
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>
                          <div className={classes.tableUser}>Role</div>
                        </TableCell>
                        <TableCell>
                          <div className={classes.tableUser}>Email</div>
                        </TableCell>
                        <TableCell>
                          <div className={classes.tableUser}>Delete</div>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {users.map((user: User, index: number) => (
                        <TableRow key={index}>
                          <TableCell>
                            <div>{user.name}</div>
                          </TableCell>
                          <TableCell>
                            <div className={classes.tableUser}>{user.role}</div>
                          </TableCell>
                          <TableCell>
                            <div className={classes.tableUser}>
                              {user.username}
                            </div>
                          </TableCell>
                          <TableCell className={classes.tableIcon}>
                            <div className={classes.tableUser}>
                              <DeleteIcon
                                className={classes.clickable}
                                onClick={() => {}}
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </>
    );
  }
}
export default withStyles(styles)(UsersListingComponent);

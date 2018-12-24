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
import DeleteIcon from "@material-ui/icons/Delete";

import HeaderComponent from "../page-layout/HeaderComponent";
import BannerHeader from "../page-layout/BannerHeader";

import { type Account } from "../authentication/models";
import { type User } from "./models";

const styles = theme => ({
  formControl: {
    marginBottom: theme.spacing.unit * 2.5,
    minWidth: 120
  },
  addUserForm: {
    padding: theme.spacing.unit * 5
  },
  AddUserModal: {
    marginTop: "15%",
    marginLeft: "30%",
    width: "40%",
    borderRadius: "8px"
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
  },
  rowContainer: {
    marginTop: theme.spacing.unit * 4
  },
  addUserButton: {
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
  history: any,
  addUser: (user: $Shape<User>, errorMsg: string) => Promise<any>,
  deleteUser: (userId: number, errorMsg: string) => Promise<any>
};

type state = {
  name: string,
  username: string,
  role: string,
  open: boolean
};

class UsersListingComponent extends Component<Props, state> {
  constructor() {
    super();
    this.state = {
      name: "",
      username: "",
      role: "",
      open: false
    };
  }
  componentWillMount() {
    this.props.loadUsers();
  }

  closeModal = () =>
    this.setState({
      open: false,
      name: "",
      username: "",
      role: ""
    });

  openModal = () =>
    this.setState({
      open: true
    });

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  updateField = (event: Event, key: string) => {
    this.setState({
      [key]: (event.target: window.HTMLInputElement).value
    });
  };

  deleteUser = (userId: number) => {
    this.props.deleteUser(userId, "Can't delete user linked to Grant");
  };
  renderAddUserModal = classes => {
    return (
      <Modal
        open={this.state.open}
        onClose={this.closeModal}
        className={classes.AddUserModal}
      >
        <Paper>
          <Grid container direction="column">
            <Grid item className={classes.addUserForm}>
              <Grid container alignItems="flex-end">
                <Typography data-test-id="grant-info-title" variant="h4">
                  Add new user
                </Typography>
              </Grid>
              <p />
              <TextField
                className={classes.formControl}
                data-test-id="name-text"
                fullWidth={true}
                value={this.state.name}
                onChange={value => this.updateField(value, "name")}
                variant="outlined"
                label="Name"
              />
              <TextField
                className={classes.formControl}
                data-test-id="username-text"
                fullWidth={true}
                value={this.state.username}
                onChange={value => this.updateField(value, "username")}
                variant="outlined"
                label="Email"
              />
              <FormControl
                variant="outlined"
                className={classes.formControl}
                fullWidth={true}
              >
                <InputLabel htmlFor="outlined-age">Role</InputLabel>
                <Select
                  value={this.state.role}
                  onChange={this.handleChange}
                  input={
                    <OutlinedInput
                      labelWidth={30}
                      name="role"
                      id="outlined-age"
                    />
                  }
                >
                  <MenuItem value={"implementing-partner"}>
                    implementing partner
                  </MenuItem>
                  <MenuItem value={"help-refugees"}>help refugees</MenuItem>
                </Select>
              </FormControl>
              <Grid container alignItems="flex-end" direction="row-reverse">
                <Button color="secondary" onClick={this.closeModal}>
                  cancel
                </Button>
                <Button
                  color="primary"
                  onClick={() => {
                    this.props
                      .addUser(
                        {
                          username: this.state.username,
                          name: this.state.name,
                          role: this.state.role
                        },
                        "Unable to add user"
                      )
                      .then(() => {
                        this.closeModal();
                        this.props.history.push("/settings/users");
                      });
                  }}
                >
                  save
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Modal>
    );
  };

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
        {this.renderAddUserModal(classes)}
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
                  <Button
                    onClick={this.openModal}
                    className={classes.addUserButton}
                  >
                    ADD NEW USER
                  </Button>
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
                                onClick={() => {
                                  this.deleteUser(user.id);
                                }}
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

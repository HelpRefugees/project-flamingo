import { connect } from "react-redux";
import { type Dispatch } from "redux";

import { type State } from "../reducers";
import { loadUsers, logout, addUser } from "../actions";
import UsersListingComponent from "./UsersListingComponent";

import { type User } from "./models";

const mapStateToProps = (state: State): any => ({
  isAthenticated: state.isAuthenticated,
  account: state.account,
  users: state.users
});

const mapDispatchToProps = (dispatch: Dispatch<any>): any => ({
  loadUsers: () => dispatch(loadUsers()),
  logout: () => dispatch(logout()),
  addUser: (user: User, errorMessage: string) =>
    dispatch(addUser(user, errorMessage))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UsersListingComponent);

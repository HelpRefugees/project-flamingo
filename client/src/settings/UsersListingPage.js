import { connect } from "react-redux";
import { type Dispatch } from "redux";

import { type State } from "../reducers";
import { loadUsers, logout } from "../actions";
import UsersListingComponent from "./UsersListingComponent";

const mapStateToProps = (state: State): any => ({
  isAthenticated: state.isAuthenticated,
  account: state.account,
  users: state.users
});

const mapDispatchToProps = (dispatch: Dispatch<any>): any => ({
  loadUsers: () => dispatch(loadUsers()),
  logout: () => dispatch(logout())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UsersListingComponent);

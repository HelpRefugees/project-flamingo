import { connect } from "react-redux";
import type { Dispatch } from "redux";

import EditGrantComponent from "./EditGrantComponent";
import { logout, updateGrant, loadUsers } from "../actions";
import type { State } from "../reducers";
import type { Grant } from "./models";

const mapStateToProps = (state: State): any => ({
  isAuthenticated: state.isAuthenticated,
  account: state.account,
  grant: state.grant,
  users: (state.users || []).filter(
    user => user.role === "implementing-partner"
  )
});

const mapDispatchToProps = (dispatch: Dispatch<any>): any => ({
  logout: () => dispatch(logout()),
  updateGrant: (grant: Grant, errorMessage: string) =>
    dispatch(updateGrant(grant, errorMessage)),
  loadUsers: () => dispatch(loadUsers())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditGrantComponent);

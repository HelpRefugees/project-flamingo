import { connect } from "react-redux";
import type { Dispatch } from "redux";

import AddGrantComponent from "./AddGrantComponent";
import { logout, addGrant, loadUsers } from "../actions";
import { type State } from "../reducers";
import { type AddGrantModel } from "./models";

const mapStateToProps = (state: State): any => ({
  isAuthenticated: state.isAuthenticated,
  account: state.account,
  grants: state.grants,
  users: (state.users || []).filter(
    user => user.role === "implementing-partner"
  )
});

const mapDispatchToProps = (dispatch: Dispatch<any>): any => ({
  logout: () => dispatch(logout()),
  addGrant: (grant: AddGrantModel, errorMessage: string) =>
    dispatch(addGrant(grant, errorMessage)),
  loadUsers: () => dispatch(loadUsers)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddGrantComponent);

import { connect } from "react-redux";
import type { Dispatch } from "redux";

import AddGrantComponent from "./AddGrantComponent";
import { logout, addGrant } from "../actions";
import type { State } from "../reducers";

const mapStateToProps = (state: State): any => ({
  isAuthenticated: state.isAuthenticated,
  account: state.account,
  grants: state.grants
});

const mapDispatchToProps = (dispatch: Dispatch<any>): any => ({
  logout: () => dispatch(logout()),
  addGrant: grant => dispatch(addGrant(grant))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddGrantComponent);

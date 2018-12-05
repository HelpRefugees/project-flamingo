import { connect } from "react-redux";
import type { Dispatch } from "redux";

import AddGrantComponent from "./AddGrantComponent";
import { logout, addGrant } from "../actions";
import type { State } from "../reducers";
import type { AddGrantModel } from "./models";

const mapStateToProps = (state: State): any => ({
  isAuthenticated: state.isAuthenticated,
  account: state.account,
  grants: state.grants
});

const mapDispatchToProps = (dispatch: Dispatch<any>): any => ({
  logout: () => dispatch(logout()),
  addGrant: (grant: AddGrantModel, errorMessage: string) =>
    dispatch(addGrant(grant, errorMessage))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddGrantComponent);

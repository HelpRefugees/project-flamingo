import { connect } from "react-redux";
import type { Dispatch } from "redux";

import GrantsListingComponent from "./GrantsListingComponent";
import { logout, loadGrants, selectGrant, updateGrant } from "../actions";
import type { State } from "../reducers";
import type { Grant } from "./models";

const mapStateToProps = (state: State): any => ({
  isAuthenticated: state.isAuthenticated,
  account: state.account,
  grants: state.grants
});

const mapDispatchToProps = (dispatch: Dispatch<any>): any => ({
  loadGrants: () => dispatch(loadGrants()),
  logout: () => dispatch(logout()),
  selectGrant: (grant: Grant) => dispatch(selectGrant(grant)),
  updateGrant: (grant: Grant, errorMessage: string) =>
    dispatch(updateGrant(grant, errorMessage))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GrantsListingComponent);

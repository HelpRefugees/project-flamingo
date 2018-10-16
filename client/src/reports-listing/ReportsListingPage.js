import { connect } from "react-redux";
import type { Dispatch } from "redux";

import ReportsListingComponent from "./ReportsListingComponent";
import { logout } from "../actions";
import type { State } from "../reducers";

const mapStateToProps = (state: State): any => ({
  isAuthenticated: state.isAuthenticated,
  account: state.account
});

const mapDispatchToProps = (dispatch: Dispatch<any>): any => ({
  logout: () => dispatch(logout())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReportsListingComponent);

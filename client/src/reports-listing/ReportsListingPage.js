import { connect } from "react-redux";
import { type Dispatch } from "redux";

import ReportsListingComponent from "./ReportsListingComponent";
import { logout, loadReports } from "../state/actions";
import { type State } from "../state/reducers";

const mapStateToProps = (state: State): any => ({
  isAuthenticated: state.isAuthenticated,
  account: state.account,
  reports: state.reports
});

const mapDispatchToProps = (dispatch: Dispatch<any>): any => ({
  loadReports: () => dispatch(loadReports()),
  logout: () => dispatch(logout())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReportsListingComponent);

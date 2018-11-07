import { connect } from "react-redux";
import { type Dispatch } from "redux";

import SubmittedReportComponent from "./SubmittedReportComponent";
import { logout, loadReportDetails } from "../actions";
import { type State } from "../reducers";

const mapStateToProps = (state: State): any => ({
  isAuthenticated: state.isAuthenticated,
  report: state.currentReport,
  account: state.account
});

const mapDispatchToProps = (dispatch: Dispatch<any>): any => ({
  logout: () => dispatch(logout()),
  loadReportDetails: (id: string) => dispatch(loadReportDetails(id))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SubmittedReportComponent);

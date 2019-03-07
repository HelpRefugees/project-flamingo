import { connect } from "react-redux";
import { type Dispatch } from "redux";

import SubmittedReportComponent from "./SubmittedReportComponent";
import { loadReport, logout } from "../state/actions";
import { type State } from "../state/reducers";

const mapStateToProps = (state: State): any => ({
  isAuthenticated: state.isAuthenticated,
  report: state.report,
  account: state.account
});

const mapDispatchToProps = (dispatch: Dispatch<any>): any => ({
  logout: () => dispatch(logout()),
  loadReport: (id: number) => dispatch(loadReport(id))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SubmittedReportComponent);

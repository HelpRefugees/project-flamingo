import { connect } from "react-redux";
import type { Dispatch } from "redux";

import ReportComponent from "./ReportComponent";
import { logout, updateReport } from "../actions";
import type { State } from "../reducers";
import type { Report } from "./models";

const mapStateToProps = (state: State): any => ({
  isAuthenticated: state.isAuthenticated,
  reports: state.reports,
  account: state.account
});

const mapDispatchToProps = (dispatch: Dispatch<any>): any => ({
  logout: () => dispatch(logout()),
  updateReport: (report: Report) => dispatch(updateReport(report))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReportComponent);

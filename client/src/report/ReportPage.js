import { connect } from "react-redux";
import type { Dispatch } from "redux";

import ReportComponent from "./ReportComponent";
import { logout, saveReport } from "../actions";
import type { State } from "../reducers";
import type { Report } from "./models";

const mapStateToProps = (state: State): any => ({
  isAuthenticated: state.isAuthenticated,
  reports: state.reports
});

const mapDispatchToProps = (dispatch: Dispatch<any>): any => ({
  logout: () => dispatch(logout()),
  saveReport: (report: Report) => dispatch(saveReport(report))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReportComponent);

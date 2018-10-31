import { connect } from "react-redux";
import type { Dispatch } from "redux";

import ReportEditComponent from "./ReportEditComponent";
import { logout, updateReport } from "../actions";
import type { State } from "../reducers";
import type { Report } from "./models";

const mapStateToProps = (state: State): $Shape<State> => ({
  isAuthenticated: state.isAuthenticated,
  reports: state.reports,
  account: state.account,
  submittedReport: state.submittedReport,
  isLoading: state.isLoading,
  savedReport: state.savedReport
});

const mapDispatchToProps = (dispatch: Dispatch<any>): any => ({
  logout: () => dispatch(logout()),
  updateReport: (report: Report) => dispatch(updateReport(report))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReportEditComponent);

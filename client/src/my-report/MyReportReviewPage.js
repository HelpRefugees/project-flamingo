import { connect } from "react-redux";
import type { Dispatch } from "redux";

import MyReportReviewComponent from "./MyReportReviewComponent";
import { logout, updateReport } from "../actions";
import type { State } from "../reducers";
import type { Report } from "./models";

const mapStateToProps = (state: State, ownProps: any): any => {
  const reportId = ownProps.match.params.id;
  const report = (state.reports || []).find((report) => report.id === parseInt(reportId, 10));
  return {
    isAuthenticated: state.isAuthenticated,
    report,
    account: state.account,
    submittedReport: state.submittedReport,
    isLoading: state.isLoading,
    savedReport: state.savedReport
  }
};

const mapDispatchToProps = (dispatch: Dispatch<any>): any => ({
  logout: () => dispatch(logout()),
  updateReport: (report: Report) => dispatch(updateReport(report))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyReportReviewComponent);

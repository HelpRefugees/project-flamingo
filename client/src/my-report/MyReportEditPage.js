import { connect } from "react-redux";
import type { Dispatch } from "redux";

import MyReportEditComponent from "./MyReportEditComponent";
import { logout, updateReport, loadReport } from "../actions";
import type { State } from "../reducers";
import type { Report } from "./models";

const mapStateToProps = (state: State): any => {
  return {
    isAuthenticated: state.isAuthenticated,
    report: state.report,
    account: state.account,
    isLoading: state.isLoading
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>): any => ({
  logout: () => dispatch(logout()),
  loadReport: (id: number) => dispatch(loadReport(id)),
  updateReport: (report: $Shape<Report>, errorMessage: string) =>
    dispatch(updateReport(report, errorMessage))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyReportEditComponent);

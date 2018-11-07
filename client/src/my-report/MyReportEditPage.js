import { connect } from "react-redux";
import { type Dispatch } from "redux";

import MyReportEditComponent from "./MyReportEditComponent";
import { logout, updateReport, loadReportDetails } from "../actions";
import { type State } from "../reducers";
import { type Report } from "./models";

const mapStateToProps = (state: State, ownProps: any): any => {
  return {
    isAuthenticated: state.isAuthenticated,
    report: state.currentReport,
    account: state.account,
    isLoading: state.isLoading,
  }
};

const mapDispatchToProps = (dispatch: Dispatch<any>): any => ({
  logout: () => dispatch(logout()),
  updateReport: (report: Report, errorMessage: string) =>
    dispatch(updateReport(report, errorMessage)),
  loadReportDetails: (id: string) => dispatch(loadReportDetails(id))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyReportEditComponent);

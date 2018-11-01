import { connect } from "react-redux";
import type { Dispatch } from "redux";

import { logout } from "../actions";
import type { State } from "../reducers";
import MyReportComponent from "./MyReportComponent";

const mapStateToProps = (state: State, ownProps: any): any => {
  const reportId = ownProps.match.params.id;
  const report = (state.reports || []).find((report) => report.id === parseInt(reportId, 10));
  return {
    report,
    isAuthenticated: state.isAuthenticated,
    account: state.account
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>): any => ({
  logout: () => dispatch(logout())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyReportComponent);

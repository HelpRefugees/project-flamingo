import { connect } from "react-redux";
import { type Dispatch } from "redux";

import { logout } from "../actions";
import { type State } from "../reducers";
import MyReportComponent from "./MyReportComponent";

const mapStateToProps = (state: State, ownProps: any): any => {
  return {
    report: state.currentReport,
    isAuthenticated: state.isAuthenticated,
    account: state.account
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>): any => ({
  logout: () => dispatch(logout()),
  loadReportDetails: (id: string) => dispatch(() => { })
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyReportComponent);

import { connect } from "react-redux";
import { type Dispatch } from "redux";

import { logout, loadReport } from "../state/actions";
import { type State } from "../state/reducers";
import MyReportComponent from "./MyReportComponent";

const mapStateToProps = (state: State): any => ({
  report: state.report,
  isAuthenticated: state.isAuthenticated,
  account: state.account
});

const mapDispatchToProps = (dispatch: Dispatch<any>): any => ({
  logout: () => dispatch(logout()),
  loadReport: (id: number) => dispatch(loadReport(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(MyReportComponent);

import { connect } from "react-redux";
import { type Dispatch } from "redux";

import MyReportEditComponent from "./MyReportEditComponent";
import {
  logout,
  updateReport,
  loadReport,
  loadSectors
} from "../state/actions";
import { type State } from "../state/reducers";
import { type Report } from "./models";

const mapStateToProps = (state: State): any => {
  return {
    isAuthenticated: state.isAuthenticated,
    report: state.report,
    account: state.account,
    isLoading: state.isLoading,
    sectors: state.sectors
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>): any => ({
  logout: () => dispatch(logout()),
  loadReport: (id: number) => dispatch(loadReport(id)),
  updateReport: (report: $Shape<Report>, errorMessage: string) =>
    dispatch(updateReport(report, errorMessage)),
  loadSectors: () => dispatch(loadSectors())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyReportEditComponent);

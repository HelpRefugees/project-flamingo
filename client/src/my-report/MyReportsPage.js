import { connect } from "react-redux";
import type { Dispatch } from "redux";

import MyReportsComponent from "./MyReportsComponent";
import { logout, loadReports, updateReport } from "../state/actions";
import { type State } from "../state/reducers";
import type { Props } from "./MyReportsComponent";
import type { Report } from "./models";

const mapDispatchToProps = (dispatch: Dispatch<any>): any => ({
  logout: () => dispatch(logout()),
  loadReports: () => dispatch(loadReports()),
  updateReport: (report: Report, errorMessage: string) =>
    dispatch(updateReport(report, errorMessage))
});

const mapStateToProps: (state: State) => $Shape<Props> = ({
  reports,
  account
}) => ({
  reports,
  account
});

export default connect(mapStateToProps, mapDispatchToProps)(MyReportsComponent);

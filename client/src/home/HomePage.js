import { connect } from "react-redux";
import type { Dispatch } from "redux";

import HomeComponent from "./HomeComponent";
import { logout, loadReports, updateReport } from "../actions";
import type { State } from "../reducers";
import type { Props } from "./HomeComponent";
import type { Report } from "../report/models";

const mapDispatchToProps = (dispatch: Dispatch<any>): any => ({
  logout: () => dispatch(logout()),
  loadReports: () => dispatch(loadReports()),
  updateReport: (report: Report) => dispatch(updateReport(report))
});

const mapStateToProps: (state: State) => $Shape<Props> = ({
  reports,
  account
}) => ({
  reports,
  account
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeComponent);

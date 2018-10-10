import { connect } from "react-redux";
import type { Dispatch } from "redux";

import HomeComponent from "./HomeComponent";
import { logout, loadReports } from "../actions";
import type { State } from "../reducers";
import type { Props } from "./HomeComponent";

const mapDispatchToProps = (dispatch: Dispatch<any>): any => ({
  logout: () => dispatch(logout()),
  loadReports: () => dispatch(loadReports())
});

const mapStateToProps: (state: State) => $Shape<Props> = ({ reports }) => ({
  reports
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeComponent);

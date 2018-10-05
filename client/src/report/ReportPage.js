import { connect } from "react-redux";
import type { Dispatch } from "redux";

import ReportComponent from "./ReportComponent";
import { logout } from "../actions";

const mapDispatchToProps = (dispatch: Dispatch<any>): any => ({
  logout: () => dispatch(logout())
});

export default connect(
  () => ({}),
  mapDispatchToProps
)(ReportComponent);

import { connect } from "react-redux";
import type { Dispatch } from "redux";

import ResetPasswordComponent from "./ResetPasswordComponent";
import { resetPassword } from "../actions";

const mapStateToProps = (): any => ({});

const mapDispatchToProps = (dispatch: Dispatch<any>): any => ({
  resetPassword: (...args) => dispatch(resetPassword(...args))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResetPasswordComponent);

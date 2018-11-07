import { connect } from "react-redux";
import type { Dispatch } from "redux";

import ForgottenPasswordComponent from "./ForgottenPasswordComponent";
import { forgotPassword } from "../actions";

const mapStateToProps = (): any => ({});

const mapDispatchToProps = (dispatch: Dispatch<any>): any => ({
  resetPassword: credentials => dispatch(forgotPassword(credentials))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ForgottenPasswordComponent);

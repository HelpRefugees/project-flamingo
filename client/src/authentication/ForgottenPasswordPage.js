import { connect } from "react-redux";
import type { Dispatch } from "redux";

import ForgottenPasswordComponent from "./ForgottenPasswordComponent";
import type { State } from "../reducers";
import { resetPassword } from "../actions";

const mapStateToProps = (state: State): any => ({});

const mapDispatchToProps = (dispatch: Dispatch<any>): any => ({
  resetPassword: credentials => dispatch(resetPassword(credentials)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ForgottenPasswordComponent);

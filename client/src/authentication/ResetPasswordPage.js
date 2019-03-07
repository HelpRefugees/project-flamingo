import { connect } from "react-redux";
import { type Dispatch } from "redux";

import ResetPasswordComponent from "./ResetPasswordComponent";
import { resetPassword } from "../state/actions";
import { type State } from "../state/reducers";

const mapStateToProps = ({ isLoading }: State): any => ({ isLoading });

const mapDispatchToProps = (dispatch: Dispatch<any>): any => ({
  resetPassword: (...args) => dispatch(resetPassword(...args))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResetPasswordComponent);

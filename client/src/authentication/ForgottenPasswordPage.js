import { connect } from "react-redux";
import { type Dispatch } from "redux";

import ForgottenPasswordComponent from "./ForgottenPasswordComponent";
import { forgotPassword } from "../state/actions";
import { type State } from "../state/reducers";

const mapStateToProps = ({ isLoading }: State): any => ({ isLoading });

const mapDispatchToProps = (dispatch: Dispatch<any>): any => ({
  resetPassword: credentials => dispatch(forgotPassword(credentials))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ForgottenPasswordComponent);

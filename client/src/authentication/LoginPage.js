import { connect } from "react-redux";
import { type Dispatch } from "redux";

import LoginComponent from "./LoginComponent";
import { login, logout } from "../state/actions";
import { type State } from "../state/reducers";

const mapStateToProps = (state: State): any => ({
  isAuthenticated: state.isAuthenticated,
  role: state.account ? state.account.role : undefined,
  isLoading: state.isLoading
});

const mapDispatchToProps = (dispatch: Dispatch<any>): any => ({
  login: credentials => dispatch(login(credentials)),
  initializeLogin: () => dispatch(logout())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginComponent);

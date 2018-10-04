import { connect } from "react-redux";
import type { Dispatch } from "redux";

import LoginComponent from "./LoginComponent";
import { login, logout } from "../actions";
import type { State } from "../reducers";

const mapStateToProps = (state: State): any => ({
  isAuthenticated: state.isAuthenticated
});

const mapDispatchToProps = (dispatch: Dispatch<any>): any => ({
  login: credentials => dispatch(login(credentials)),
  initializeLogin: () => dispatch(logout())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginComponent);

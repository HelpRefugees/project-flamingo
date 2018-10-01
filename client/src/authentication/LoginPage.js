import { connect } from "react-redux";

import LoginComponent from "./LoginComponent";
import { login } from "../actions";

const mapStateToProps = state => ({
  isAuthenticated: state.isAuthenticated
});

const mapDispatchToProps = dispatch => ({
  login: credentials => dispatch(login(credentials))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginComponent);

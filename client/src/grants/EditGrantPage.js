import { connect } from "react-redux";
import { type Dispatch } from "redux";

import EditGrantComponent from "./EditGrantComponent";
import {
  logout,
  updateGrant,
  loadUsers,
  loadCountries
} from "../state/actions";
import { type State } from "../state/reducers";
import { type Grant } from "./models";

const mapStateToProps = (state: State): any => ({
  isAuthenticated: state.isAuthenticated,
  account: state.account,
  grant: state.grant,
  users: (state.users || []).filter(
    user => user.role === "implementing-partner"
  ),
  countries: state.countries
});

const mapDispatchToProps = (dispatch: Dispatch<any>): any => ({
  logout: () => dispatch(logout()),
  updateGrant: (grant: Grant, errorMessage: string) =>
    dispatch(updateGrant(grant, errorMessage)),
  loadUsers: () => dispatch(loadUsers()),
  loadCountries: () => dispatch(loadCountries())
});

export default connect(mapStateToProps, mapDispatchToProps)(EditGrantComponent);

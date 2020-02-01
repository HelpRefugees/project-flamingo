import { connect } from "react-redux";
import type { Dispatch } from "redux";

import AddGrantComponent from "./AddGrantComponent";
import { logout, addGrant, loadUsers, loadCountries } from "../state/actions";
import { type State } from "../state/reducers";
import { type AddGrantModel } from "./models";

const mapStateToProps = (state: State): any => ({
  isAuthenticated: state.isAuthenticated,
  account: state.account,
  grants: state.grants,
  users: (state.users || []).filter(
    user => user.role === "implementing-partner"
  ),
  countries: state.countries
});

const mapDispatchToProps = (dispatch: Dispatch<any>): any => ({
  logout: () => dispatch(logout()),
  addGrant: (grant: AddGrantModel, errorMessage: string) =>
    dispatch(addGrant(grant, errorMessage)),
  loadUsers: () => dispatch(loadUsers()),
  loadCountries: () => dispatch(loadCountries())
});

export default connect(mapStateToProps, mapDispatchToProps)(AddGrantComponent);

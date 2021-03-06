import { connect } from "react-redux";
import { type Dispatch } from "redux";

import GrantComponent from "./GrantComponent";
import { logout, updateGrant, loadUsers, extendGrant } from "../state/actions";
import { type State } from "../state/reducers";
import { type Grant } from "./models";

const mapStateToProps = (state: State): any => ({
  isAuthenticated: state.isAuthenticated,
  account: state.account,
  grant: state.grant,
  users: (state.users || []).filter(
    user => user.role === "implementing-partner"
  )
});

const mapDispatchToProps = (dispatch: Dispatch<any>): any => ({
  logout: () => dispatch(logout()),
  updateGrant: (grant: Grant, errorMessage: string) =>
    dispatch(updateGrant(grant, errorMessage)),
  extendGrant: (
    id: number,
    startDate: string,
    endDate: string,
    errorMessage: string
  ) => dispatch(extendGrant(id, startDate, endDate, errorMessage)),
  loadUsers: () => dispatch(loadUsers())
});

export default connect(mapStateToProps, mapDispatchToProps)(GrantComponent);

import { connect } from "react-redux";
import { type Dispatch } from "redux";

import { type State } from "../reducers";
import { loadSectors, logout, addSector, deleteSector } from "../actions";
import DemographicInfoListingComponent from "./DemographicInfoListingComponent";

const mapStateToProps = (state: State): any => ({
  isAthenticated: state.isAuthenticated,
  account: state.account,
  sectors: state.sectors
});

const mapDispatchToProps = (dispatch: Dispatch<any>): any => ({
  loadSectors: () => dispatch(loadSectors()),
  logout: () => dispatch(logout()),
  addSector: (sector: string, errorMessage: string) =>
    dispatch(addSector(sector, errorMessage)),
  deleteSector: (sector: string, errorMessage: string) =>
    dispatch(deleteSector(sector, errorMessage))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DemographicInfoListingComponent);

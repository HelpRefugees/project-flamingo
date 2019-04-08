import { connect } from "react-redux";
import { type Dispatch } from "redux";

import { type State } from "../state/reducers";
import {
  loadCountries,
  addCountry,
  deleteCountry,
  addRegion,
  deleteRegion,
  logout
} from "../state/actions";
import CountriesRegionsListingComponent from "./CountriesRegionsListingComponent";

const mapStateToProps = (state: State): any => ({
  isAthenticated: state.isAuthenticated,
  account: state.account,
  countries: state.countries
});

const mapDispatchToProps = (dispatch: Dispatch<any>): any => ({
  loadCountries: () => dispatch(loadCountries()),
  addCountry: (country: string, errorMessage: string) =>
    dispatch(addCountry(country, errorMessage)),
  deleteCountry: (country: string, errorMessage: string) =>
    dispatch(deleteCountry(country, errorMessage)),
  addRegion: (region: string, country: string, errorMessage: string) =>
    dispatch(addRegion(region, country, errorMessage)),
  deleteRegion: (country: string, region: string, errorMessage: string) =>
    dispatch(deleteRegion(country, region, errorMessage)),
  logout: () => dispatch(logout())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CountriesRegionsListingComponent);

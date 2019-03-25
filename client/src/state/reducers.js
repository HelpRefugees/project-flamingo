import { type Report } from "../my-report/models";
import { Account } from "../authentication/models";
import { type Grant } from "../grants/models";
import { type User } from "../settings/models";

export type State = {
  isAuthenticated: ?boolean,
  reports: ?($Shape<Report>[]),
  report: ?$Shape<Report>,
  grants: ?($Shape<Grant>[]),
  grant: ?$Shape<Grant>,
  account: ?Account,
  isLoading: boolean,
  errorMessage: ?string,
  environment: ?string,
  users: ?(User[]),
  sectors: ?(string[]),
  countries: ?(string[])
};

export const initialState: State = {
  isAuthenticated: undefined,
  reports: undefined,
  report: undefined,
  grants: undefined,
  grant: undefined,
  account: undefined,
  isLoading: false,
  errorMessage: undefined,
  environment: undefined,
  users: undefined,
  sectors: undefined,
  countries: undefined
};

type Action = {
  type: string,
  payload: any
};

const reducers = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case "SET_LOGGED_IN": {
      return {
        ...state,
        isAuthenticated: true,
        account: action.payload
      };
    }

    case "SET_LOGGED_IN_ERROR": {
      return {
        ...state,
        isAuthenticated: false,
        account: undefined
      };
    }

    case "SET_LOGGED_OUT": {
      return {
        ...state,
        isAuthenticated: undefined,
        account: undefined
      };
    }

    case "LOAD_REPORTS_SUCCESS": {
      return {
        ...state,
        reports: action.payload
      };
    }

    case "LOAD_REPORT_SUCCESS": {
      return {
        ...state,
        report: action.payload
      };
    }

    case "LOAD_REPORT_START": {
      return {
        ...state,
        report: undefined
      };
    }

    case "SAVE_REPORT_SUCCESS": {
      const updatedReport: $Shape<Report> = (action.payload: any);
      return {
        ...state,
        reports: (state.reports || []).map(report => {
          if (report.id === updatedReport.id) {
            return updatedReport;
          }
          return report;
        })
      };
    }

    case "CLEAR_ERROR_MESSAGE": {
      return { ...state, errorMessage: undefined };
    }

    case "SET_ERROR_MESSAGE": {
      return {
        ...state,
        errorMessage: action.payload
      };
    }

    case "LOAD_GRANTS_SUCCESS": {
      return {
        ...state,
        grants: action.payload
      };
    }

    case "LOAD_USERS_SUCCESS": {
      return {
        ...state,
        users: action.payload,
        errorMessage: undefined
      };
    }

    case "LOAD_SECTORS_SUCCESS": {
      const demoInfo = action.payload;
      return {
        ...state,
        sectors: demoInfo.values,
        errorMessage: undefined
      };
    }

    case "LOAD_COUNTRIES_SUCCESS": {
      const country = action.payload;
      return {
        ...state,
        countries: country.values,
        errorMessage: undefined
      };
    }

    case "SET_LOADING": {
      return {
        ...state,
        isLoading: true
      };
    }

    case "SET_NOT_LOADING": {
      return {
        ...state,
        isLoading: false
      };
    }

    case "GET_INFO_SUCCESS": {
      const { environment } = action.payload || {};
      return {
        ...state,
        environment
      };
    }

    case "ADD_GRANT_SUCCESS": {
      return {
        ...state,
        grants: action.payload
      };
    }

    case "ADD_USER_SUCCESS": {
      return {
        ...state,
        users: action.payload,
        errorMessage: undefined
      };
    }

    case "ADD_SECTOR_SUCCESS": {
      const demoInfo = action.payload;

      return {
        ...state,
        sectors: demoInfo.values,
        errorMessage: undefined
      };
    }

    case "ADD_COUNTRY_SUCCESS": {
      const country = action.payload;

      return {
        ...state,
        countries: country.values,
        errorMessage: undefined
      };
    }

    case "ADD_REGION_SUCCESS": {
      const country = action.payload;

      return {
        ...state,
        countries: country.values,
        errorMessage: undefined
      };
    }

    case "DELETE_SECTOR_SUCCESS": {
      const newSectors = (state.sectors || []).filter(
        sector => sector !== action.payload
      );
      return {
        ...state,
        errorMessage: undefined,
        sectors: newSectors
      };
    }

    case "DELETE_COUNTRY_SUCCESS": {
      return {
        ...state,
        errorMessage: undefined,
        countries: action.payload
      };
    }

    case "DELETE_REGION_SUCCESS": {
      return {
        ...state,
        errorMessage: undefined,
        countries: action.payload
      };
    }

    case "SELECT_GRANT": {
      return {
        ...state,
        grant: action.payload
      };
    }

    case "DELETE_USER_SUCCESS": {
      const newUsers = (state.users || []).filter(
        user => user.id !== action.payload
      );
      return {
        ...state,
        errorMessage: undefined,
        users: newUsers
      };
    }

    case "DELETE_USER_FAILED": {
      return {
        ...state,
        errorMessage: action.payload
      };
    }

    case "DELETE_SECTOR_FAILED": {
      return {
        ...state,
        errorMessage: action.payload
      };
    }

    case "DELETE_COUNTRY_FAILED": {
      return {
        ...state,
        errorMessage: action.payload
      };
    }

    case "DELETE_REGION_FAILED": {
      return {
        ...state,
        errorMessage: action.payload
      };
    }

    default: {
      return state;
    }
  }
};

export default reducers;

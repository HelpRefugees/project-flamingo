import { type Report } from "./my-report/models";
import { Account } from "./authentication/models";
import { type Grant } from "./grants/models";
import { type User } from "./settings/models";

export type State = {
  isAuthenticated: ?boolean,
  reports: ?(Report[]),
  report: ?Report,
  grants: ?(Grant[]),
  grant: ?Grant,
  account: ?Account,
  isLoading: boolean,
  errorMessage: ?string,
  environment: ?string,
  users: ?(User[])
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
  users: undefined
};

type Action = {
  type: string,
  payload?: ?any
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
      const updatedReport: Report = (action.payload: any);
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
    case "SELECT_GRANT": {
      return {
        ...state,
        grant: action.payload
      };
    }

    case "DELETE_USER_SUCCESS": {
      let newUsers = state.users.filter(user => user.id !== action.payload);
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

    default: {
      return state;
    }
  }
};

export default reducers;

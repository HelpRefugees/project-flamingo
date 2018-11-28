import type { Report } from "./my-report/models";
import { Account } from "./authentication/models";
import type { Grant } from "./grants/models";

export type State = {
  isAuthenticated: ?boolean,
  reports: ?(Report[]),
  report: ?Report,
  grants: ?(Grant[]),
  account: ?Account,
  isLoading: boolean,
  errorMessage: ?string,
  environment: ?string
};

export const initialState: State = {
  isAuthenticated: undefined,
  reports: undefined,
  report: undefined,
  grants: undefined,
  account: undefined,
  isLoading: false,
  errorMessage: undefined,
  environment: undefined
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
    default: {
      return state;
    }
  }
};

export default reducers;

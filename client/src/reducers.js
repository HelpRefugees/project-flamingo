import type { Report } from "./my-report/models";
import type { Account } from "./authentication/models";

export type State = {
  isAuthenticated: ?boolean,
  reports: ?(Report[]),
  savedReport: ?boolean,
  account: ?Account,
  isLoading: boolean,
  submittedReport: boolean
};

export const initialState: State = {
  isAuthenticated: undefined,
  reports: undefined,
  savedReport: undefined,
  account: undefined,
  isLoading: false,
  submittedReport: false
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

    case "SAVE_REPORT_START": {
      return {
        ...state,
        submittedReport: false
      };
    }

    case "SAVE_REPORT_SUCCESS": {
      const updatedReport: Report = (action.payload: any);
      return {
        ...state,
        submittedReport: updatedReport.completed,
        savedReport: true,
        reports: (state.reports || []).map(report => {
          if (report.id === updatedReport.id) {
            return updatedReport;
          }
          return report;
        })
      };
    }

    case "SAVE_REPORT_FAILURE": {
      return {
        ...state,
        savedReport: false
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

    case "LOAD_REPORTS_FAILURE":
    default: {
      return state;
    }
  }
};

export default reducers;

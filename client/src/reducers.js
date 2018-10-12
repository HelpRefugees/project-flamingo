import type { Report } from "./report/models";

export type State = {
  isAuthenticated: ?boolean,
  reports: ?(Report[]),
  savedReport: ?boolean
};

export const initialState: State = {
  isAuthenticated: undefined,
  reports: undefined,
  savedReport: undefined
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
        isAuthenticated: true
      };
    }

    case "SET_LOGGED_IN_ERROR": {
      return {
        ...state,
        isAuthenticated: false
      };
    }

    case "SET_LOGGED_OUT": {
      return {
        ...state,
        isAuthenticated: undefined
      };
    }

    case "ADD_REPORTS": {
      return {
        ...state,
        reports: action.payload
      };
    }

    case "SAVE_REPORT_SUCCESS": {
      const editedReport: Report = (action.payload: any);
      return {
        ...state,
        savedReport: true,
        reports: (state.reports || []).map(report => {
          if (report.id === editedReport.id) {
            return editedReport;
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

    default: {
      return state;
    }
  }
};

export default reducers;

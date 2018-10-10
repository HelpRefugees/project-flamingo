import { Report } from "./home/models";

export type State = {
  isAuthenticated: ?boolean,
  reports: ?(Report[])
};

export const initialState: State = {
  isAuthenticated: undefined,
  reports: undefined
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

    default: {
      return state;
    }
  }
};

export default reducers;

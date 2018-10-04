export interface State {
  isAuthenticated?: boolean;
}

interface Action {
  type: string;
}

const reducers = (state: State = {}, action: Action): State => {
  switch (action.type) {
    case "SET_LOGGED_IN":
      return {
        isAuthenticated: true
      };
    case "SET_LOGGED_IN_ERROR":
      return {
        isAuthenticated: false
      };
    case "SET_LOGGED_OUT":
      return {};
    default:
      return state;
  }
};

export default reducers;

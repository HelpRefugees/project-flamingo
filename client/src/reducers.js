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
    case "SET_NOT_LOGGED_IN":
      return {
        isAuthenticated: false
      };
    case "INITIALIZE_LOGGED_IN":
      return {};
    default:
      return state;
  }
};

export default reducers;

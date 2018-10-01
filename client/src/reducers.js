const reducers = (state = {}, action) => {
  switch (action.type) {
  case "SET_LOGGED_IN":
    return {
      isAuthenticated: true
    };
  case "SET_NOT_LOGGED_IN":
    return {
      isAuthenticated: false
    };
  default:
    return state;
  }
};

export default reducers;

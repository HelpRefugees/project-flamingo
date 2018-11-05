import configureStore from "redux-mock-store";
import { initializer } from "./middleware";

import * as actions from "./actions";
import { appStarted } from "./actions";

describe("middleware", () => {
  describe("initializer", () => {
    it("requests the info from the backend on mount", () => {
      const thunkAction = { type: "THUNK_ACTION" };
      const getInfo = jest
        .spyOn(actions, "getInfo")
        .mockImplementation(() => thunkAction);
      const mockStore = configureStore([initializer]);
      const store = mockStore();

      expect(getInfo).not.toHaveBeenCalled();

      store.dispatch(appStarted());

      expect(getInfo).toHaveBeenCalledTimes(1);
      expect(store.getActions()).toEqual([thunkAction, appStarted()]);
    });

    it("calls the next middleware", () => {
      const next = jest.fn();

      initializer({ dispatch: () => {} })(next)({
        type: "UNKNOWN",
        payload: {}
      });

      expect(next).toHaveBeenCalledTimes(1);
    });
  });
});

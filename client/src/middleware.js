import { getInfo } from "./actions";

type Action = {
  type: string,
  payload: ?any
};

type Store = {
  dispatch: (?any) => void
};

type Next = Action => void;

export const initializer = ({ dispatch }: Store) => (next: Next) => (
  action: Action
) => {
  if (action.type === "APP_STARTED") {
    dispatch(getInfo());
  }
  next(action);
};

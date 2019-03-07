import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
// $FlowIgnore: redux-persist types don't seem to work
import { persistStore, persistReducer } from "redux-persist";
// $FlowIgnore: redux-persist types don't seem to work
import storage from "redux-persist/lib/storage";
import { composeWithDevTools } from "redux-devtools-extension";

import reducers from "./reducers";
import { initializer } from "../middleware";

const persistConfig = {
  key: "root",
  storage
};

const persistedReducer = persistReducer(persistConfig, reducers);

export default () => {
  let store = createStore(
    persistedReducer,
    // $FlowIgnore: apply middleware does not seem to understand the default export type
    composeWithDevTools(applyMiddleware(thunk, initializer))
  );
  let persistor = persistStore(store);
  return { store, persistor };
};

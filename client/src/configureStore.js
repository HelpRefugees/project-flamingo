import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
// $FlowIgnore: redux-persist types don't seem to work
import { persistStore, persistReducer } from "redux-persist";
// $FlowIgnore: redux-persist types don't seem to work
import storage from "redux-persist/lib/storage";

import reducers from "./reducers";

const persistConfig = {
  key: "root",
  storage
};

const persistedReducer = persistReducer(persistConfig, reducers);

export default () => {
  let store = createStore(persistedReducer, applyMiddleware(thunk));
  let persistor = persistStore(store);
  return { store, persistor };
};

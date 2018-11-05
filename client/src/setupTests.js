import React from 'react';
import { configure, mount } from "enzyme";
import configureStore from 'redux-mock-store';
import Adapter from "enzyme-adapter-react-16";
import { Provider } from "react-redux";

configure({ adapter: new Adapter() });

const middleware = [];
const mockStore = configureStore(middleware);

export const mountWithProvider = (children: any | null, initialState: any) => mount(
  <Provider store={mockStore(initialState)}>
    {children}
  </Provider>
);

global.fetch = require("jest-fetch-mock");

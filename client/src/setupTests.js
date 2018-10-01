import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

global.fetch = require("jest-fetch-mock");

global.assertLater = (done, body) => {
  setTimeout(() => {
    try {
      body();
      done();
    } catch (err) {
      done.fail(err);
    }
  });
};

import React from "react";
import { shallow } from "enzyme";

import { ReportsListingComponent } from "./ReportsListingComponent";

describe("ReportsListingComponent", () => {
  let wrapper;

  describe("with no reports", () => {
    beforeEach(() => {
      wrapper = shallow(
        <ReportsListingComponent
          classes={{}}
          account={undefined}
          logout={() => {}}
          reports={[]}
        />
      );
    });

    it("displays a message if there are no completed reports", () => {
      expect(
        wrapper
          .find('[data-test-id="no-reports-message"]')
          .render()
          .text()
      ).toContain("No submitted reports");
    });
  });
});

import React from "react";
import { GrantsListingComponent } from "./GrantsListingComponent";
import { Account } from "../authentication/models";
import { shallow } from "enzyme";

describe("GrantsListingComponent", () => {
  const account: $Shape<Account> = {};

  describe("onMount", () => {
    it("requests the list of grants", () => {
      const loadGrants = jest.fn();

      expect(loadGrants).not.toHaveBeenCalled();

      shallow(
        <GrantsListingComponent
          loadGrants={loadGrants}
          classes={{}}
          account={account}
          grants={[]}
          logout={() => {}}
        />
      );

      expect(loadGrants).toHaveBeenCalledTimes(1);
    });
  });

  describe("grants", () => {
    it("renders the list of grants", () => {
      const grants = [{ grant: "grant", name: "name" }];
      const wrapper = shallow(
        <GrantsListingComponent
          loadGrants={() => {}}
          classes={{}}
          account={account}
          grants={grants}
          logout={() => {}}
        />
      );

      expect(
        wrapper
          .find('[data-test-id="grant-name"]')
          .render()
          .text()
      ).toEqual("name");

      expect(
        wrapper
          .find('[data-test-id="grant-organisation"]')
          .render()
          .text()
      ).toEqual("grant");
    });
  });
});

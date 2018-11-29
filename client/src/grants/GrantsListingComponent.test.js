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
    let grants;
    let wrapper;
    let mockHistoryPush;
    beforeEach(() => {
      mockHistoryPush = jest.fn();
      grants = [
        {
          grant: "grant",
          name: "name",
          username: "a username",
          id: 10,
          organization: "string",
          sector: "string",
          description: "string",
          country: "string",
          region: "string",
          otherInfo: "string"
        }
      ];
      wrapper = shallow(
        <GrantsListingComponent
          loadGrants={() => {}}
          classes={{}}
          account={account}
          grants={grants}
          logout={() => {}}
          history={{ push: mockHistoryPush }}
        />
      );
    });

    it("renders the list of grants", () => {
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

      expect(
        wrapper
          .find('[data-test-id="grant-username"]')
          .render()
          .text()
      ).toEqual("a username");
    });
  });
});

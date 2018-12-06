import React from "react";
import { GrantsListingComponent } from "./GrantsListingComponent";
import { Account } from "../authentication/models";
import { shallow } from "enzyme";

describe("GrantsListingComponent", () => {
  const account: $Shape<Account> = {};

  describe("onMount", () => {
    it("requests the list of grants", () => {
      const loadGrants = jest.fn();
      const mockSelectGrant = jest.fn();
      expect(loadGrants).not.toHaveBeenCalled();

      shallow(
        <GrantsListingComponent
          loadGrants={loadGrants}
          classes={{}}
          account={account}
          grants={[]}
          logout={() => {}}
          history={{ push: jest.fn() }}
          selectGrant={mockSelectGrant}
        />
      );

      expect(loadGrants).toHaveBeenCalledTimes(1);
    });
  });

  describe("grants", () => {
    let grants;
    let wrapper;
    let mockHistoryPush;
    let mockSelectGrant;
    beforeEach(() => {
      mockHistoryPush = jest.fn();
      mockSelectGrant = jest.fn();
      grants = [
        {
          grant: "grant",
          name: "name",
          username: "a username",
          id: 10,
          organization: "organization",
          sector: "sector",
          description: "desc",
          country: "country",
          region: "region",
          otherInfo: "info"
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
          selectGrant={mockSelectGrant}
        />
      );
    });

    it("renders the list of grants", () => {
      expect(
        wrapper
          .find('[data-test-id="grant-name"]')
          .render()
          .text()
      ).toEqual(grants[0].grant);

      expect(
        wrapper
          .find('[data-test-id="grant-organisation"]')
          .render()
          .text()
      ).toEqual(grants[0].name);

      expect(
        wrapper
          .find('[data-test-id="grant-region"]')
          .render()
          .text()
      ).toEqual(grants[0].region);
    });
  });
});

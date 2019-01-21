import React from "react";
import { GrantsListingComponent } from "./GrantsListingComponent";
import { type Account } from "../authentication/models";
import { type Grant } from "./models";
import { shallow } from "enzyme";

describe("GrantsListingComponent", () => {
  const account: $Shape<Account> = {};
  let grants;
  let wrapper;
  let mockHistoryPush;
  let mockSelectGrant;
  let mockUpdateGrant;
  let mockLoadGrants;
  const grant: $Shape<Grant> = {
    id: 1,
    grant: "selected grant",
    owner: "selected username",
    organization: "selected organization",
    sector: "selected sector",
    description: "selected desc",
    country: "selected country",
    region: "selected region",
    otherInfo: "selected info"
  };

  beforeEach(() => {
    mockHistoryPush = jest.fn();
    mockSelectGrant = jest.fn();
    mockUpdateGrant = jest.fn();
    mockLoadGrants = jest.fn();
  });

  describe("onMount", () => {
    it("requests the list of grants", () => {
      expect(mockLoadGrants).not.toHaveBeenCalled();

      shallow(
        <GrantsListingComponent
          loadGrants={mockLoadGrants}
          classes={{}}
          account={account}
          grants={[]}
          logout={() => {}}
          history={{ push: jest.fn() }}
          selectGrant={mockSelectGrant}
          grant={grant}
          updateGrant={mockUpdateGrant}
        />
      );

      expect(mockLoadGrants).toHaveBeenCalledTimes(1);
    });
  });

  describe("grants", () => {
    beforeEach(() => {
      grants = [
        {
          id: 10,
          grant: "grant",
          owner: "a username",
          organization: "organization",
          sector: "sector",
          description: "desc",
          country: "country",
          region: "region",
          otherInfo: "info",
          periods: [
            {
              startDate: "",
              endDate: ""
            }
          ]
        }
      ];
      wrapper = shallow(
        <GrantsListingComponent
          loadGrants={mockLoadGrants}
          classes={{}}
          account={account}
          grants={grants}
          logout={() => {}}
          history={{ push: mockHistoryPush }}
          selectGrant={mockSelectGrant}
          grant={grant}
          updateGrant={mockUpdateGrant}
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
      ).toEqual(grants[0].organization);

      expect(
        wrapper
          .find('[data-test-id="grant-region"]')
          .render()
          .text()
      ).toEqual(grants[0].region);
    });
  });
});

import React from "react";
import { shallow } from "enzyme";

import { type Grant } from "./models";
import { EditGrantComponent } from "./EditGrantComponent";

describe("EditGrantComponent", () => {
  const users = [
    {
      username: "user1@user.org",
      name: "user1",
      id: 1,
      role: "implementing-partner"
    },
    {
      username: "user2@user.org",
      name: "user2",
      id: 2,
      role: "implementing-partner"
    },
    {
      username: "user3@user.org",
      name: "user3",
      id: 3,
      role: "help-refugees"
    }
  ];
  let wrapper;
  let account;
  let grant;
  let mockSaveGrant;
  let mockLoadUsers;

  beforeEach(() => {
    mockSaveGrant = jest.fn().mockImplementation(() => Promise.resolve());
    mockLoadUsers = jest.fn();

    grant = {
      id: 10,
      organization: "string",
      grant: "string",
      owner: "string",
      sector: "string",
      description: "string",
      country: "string",
      region: "string",
      otherInfo: "string",
      startDate: "",
      endDate: "",
      periods: [{ startDate: "", endDate: "" }]
    };
    account = {
      username: "a@a.com",
      name: "a",
      role: "help-refugees"
    };
    wrapper = shallow(
      <EditGrantComponent
        grant={grant}
        account={account}
        history={{ push: jest.fn() }}
        logout={() => {}}
        classes={{}}
        updateGrant={mockSaveGrant}
        loadUsers={mockLoadUsers}
        users={users}
      />
    );
  });

  it("renders current grant details", () => {
    expect(
      wrapper.find('[data-test-id="grant-name-text"]').prop("value")
    ).toEqual(grant.grant);

    expect(
      wrapper.find('[data-test-id="organization-name-text"]').prop("value")
    ).toEqual(grant.organization);

    expect(wrapper.find('[data-test-id="sector-text"]').prop("value")).toEqual(
      grant.sector
    );

    expect(
      wrapper.find('[data-test-id="grant-description-text"]').prop("value")
    ).toEqual(grant.description);

    expect(wrapper.find('[data-test-id="region-text"]').prop("value")).toEqual(
      grant.region
    );

    expect(
      wrapper.find('[data-test-id="other-info-text"]').prop("value")
    ).toEqual(grant.otherInfo);

    expect(
      wrapper.find('[data-test-id="account-email"]').prop("value")
    ).toEqual(grant.owner);

    expect(
      wrapper.find('[data-test-id="save-grant-button"]').prop("disabled")
    ).toEqual(true);
  });

  it("Edits the current grant", () => {
    const editedGrant: $Shape<Grant> = {
      id: 10,
      organization: "organization name",
      grant: "some grant",
      owner: "string",
      sector: "string",
      description: "string",
      country: "string",
      region: "string",
      otherInfo: "string",
      endDate: "",
      startDate: "",
      periods: [
        {
          startDate: "",
          endDate: ""
        }
      ]
    };
    expect(
      wrapper.find('[data-test-id="save-grant-button"]').prop("disabled")
    ).toEqual(true);
    wrapper
      .find('[data-test-id="grant-name-text"]')
      .simulate("change", { target: { value: editedGrant.grant } });

    expect(
      wrapper.find('[data-test-id="grant-name-text"]').prop("value")
    ).toEqual(editedGrant.grant);

    wrapper
      .find('[data-test-id="organization-name-text"]')
      .simulate("change", { target: { value: editedGrant.organization } });

    expect(
      wrapper.find('[data-test-id="organization-name-text"]').prop("value")
    ).toEqual(editedGrant.organization);

    expect(
      wrapper.find('[data-test-id="save-grant-button"]').prop("disabled")
    ).toEqual(false);

    wrapper.update();

    wrapper.find('[data-test-id="save-grant-button"]').simulate("click");

    expect(mockSaveGrant).toHaveBeenCalledWith(
      editedGrant,
      "Unable to update grant"
    );
  });
});

import React from "react";
import { shallow } from "enzyme";

import { AddGrantComponent } from "./AddGrantComponent";

describe("AddGrantComponent", () => {
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
  let mockAddGrant;
  let mockLoadUsers;

  beforeEach(() => {
    account = {
      username: "a@a.com",
      name: "a",
      role: "help-refugees"
    };
    mockAddGrant = jest.fn().mockImplementation(() => Promise.resolve());
    mockLoadUsers = jest.fn();

    wrapper = shallow(
      <AddGrantComponent
        account={account}
        classes={{}}
        logout={jest.fn()}
        addGrant={mockAddGrant}
        history={{ push: jest.fn() }}
        isLoading={false}
        loadUsers={mockLoadUsers}
        users={users}
      />
    );
  });

  it("renders add grant form", () => {
    expect(
      wrapper
        .find('[data-test-id="grant-info-title"]')
        .render()
        .text()
    ).toContain("Grant information");

    expect(
      wrapper
        .find('[data-test-id="grant-info-subtitle"]')
        .render()
        .text()
    ).toContain("Please fill out the form below with the grant information.");

    expect(wrapper.find('[data-test-id="grant-name-text"]').exists()).toEqual(
      true
    );

    expect(
      wrapper.find('[data-test-id="organization-name-text"]').exists()
    ).toEqual(true);

    expect(wrapper.find('[data-test-id="sector-text"]').exists()).toEqual(true);

    expect(
      wrapper.find('[data-test-id="grant-description-text"]').exists()
    ).toEqual(true);

    expect(wrapper.find('[data-test-id="region-text"]').exists()).toEqual(true);

    expect(wrapper.find('[data-test-id="other-info-text"]').exists()).toEqual(
      true
    );

    expect(
      wrapper
        .find('[data-test-id="account-info-title"]')
        .render()
        .text()
    ).toContain("Account information");

    expect(
      wrapper
        .find('[data-test-id="account-info-subtitle"]')
        .render()
        .text()
    ).toContain(
      "By adding an email address you are inviting a user to this grant. There can be only a single email added."
    );

    expect(wrapper.find('[data-test-id="account-email"]').exists()).toEqual(
      true
    );
  });

  it("invokes add grant when click on add grant", () => {
    wrapper.find('[data-test-id="add-grant-button"]').simulate("click");
    expect(mockAddGrant).toBeCalled();
  });
});

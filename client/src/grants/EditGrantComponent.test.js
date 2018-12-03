import React from "react";
import { shallow, mount } from "enzyme";

import { type Grant } from "./models";
import { EditGrantComponent } from "./EditGrantComponent";

describe("EditGrantComponent", () => {
  let wrapper;
  let account;
  let grant;
  let mockSaveGrant;

  beforeEach(() => {
    mockSaveGrant = jest.fn().mockImplementation(() => Promise.resolve());
    grant = {
      id: 10,
      name: "string",
      grant: "string",
      username: "string",
      sector: "string",
      description: "string",
      country: "string",
      region: "string",
      otherInfo: "string"
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
        onSave={mockSaveGrant}
      />
    );
  });

  it("renders current grant details", () => {
    expect(
      wrapper.find('[data-test-id="grant-name-text"]').prop("value")
    ).toEqual(grant.grant);

    expect(
      wrapper.find('[data-test-id="organization-name-text"]').prop("value")
    ).toEqual(grant.name);

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
    ).toEqual(grant.username);

    expect(
      expect(
        wrapper.find('[data-test-id="save-grant-button"]').prop("disabled")
      ).toEqual(true)
    );
  });

  it("Edits the current grant", () => {
    const editedGrant: Grant = {
      id: 10,
      name: "organization name",
      grant: "some grant",
      username: "string",
      sector: "string",
      description: "string",
      country: "string",
      region: "string",
      otherInfo: "string"
    };
    expect(
      expect(
        wrapper.find('[data-test-id="save-grant-button"]').prop("disabled")
      ).toEqual(true)
    );
    wrapper
      .find('[data-test-id="grant-name-text"]')
      .simulate("change", { target: { value: editedGrant.grant } });

    expect(
      wrapper.find('[data-test-id="grant-name-text"]').prop("value")
    ).toEqual(editedGrant.grant);

    wrapper
      .find('[data-test-id="organization-name-text"]')
      .simulate("change", { target: { value: editedGrant.name } });

    expect(
      wrapper.find('[data-test-id="organization-name-text"]').prop("value")
    ).toEqual(editedGrant.name);

    expect(
      wrapper.find('[data-test-id="save-grant-button"]').prop("disabled")
    ).toEqual(false);

    wrapper.update();

    wrapper.find('[data-test-id="save-grant-button"]').simulate("click");

    expect(mockSaveGrant).toHaveBeenCalledWith(editedGrant);
  });
});

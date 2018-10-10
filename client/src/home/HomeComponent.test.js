import React from "react";
import { mount } from "enzyme";

import HomeComponent from "./HomeComponent";

describe("HomeComponent", () => {
  it("requests the reports", () => {
    const mockLoadReports = jest.fn();

    mount(
      <HomeComponent
        classes={{}}
        reports={[]}
        logout={() => {}}
        loadReports={mockLoadReports}
      />
    );

    expect(mockLoadReports).toHaveBeenCalled();
  });
});

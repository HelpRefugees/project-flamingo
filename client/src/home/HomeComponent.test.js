import React from "react";
import { mount } from "enzyme";

import { HomeComponent } from "./HomeComponent";
import { MemoryRouter } from "react-router-dom";

describe("HomeComponent", () => {
  it("requests the reports", () => {
    const mockLoadReports = jest.fn();

    mount(
      <MemoryRouter>
        <HomeComponent
          classes={{}}
          reports={[]}
          logout={() => {}}
          loadReports={mockLoadReports}
        />
      </MemoryRouter>
    );

    expect(mockLoadReports).toHaveBeenCalled();
  });
});

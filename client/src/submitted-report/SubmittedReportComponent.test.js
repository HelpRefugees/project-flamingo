import React from "react";
import { shallow } from "enzyme";

import { SubmittedReportComponent } from "./SubmittedReportComponent";
import HeaderComponent from "../page-layout/HeaderComponent";
import type { Report } from "../report/models";
import type { Account } from "../authentication/models";

describe("SubmittedReportComponent", () => {
  let wrapper;
  let mockLogout;

  const report1: Report = {
    id: 1,
    grant: "Hugh Grant",
    overview: "Hugh Overview",
    completed: true,
    reportPeriod: "2018-09-01T00:00:00.000Z",
    submissionDate: "2018-10-03T00:00:00.000Z"
  };
  const report2: Report = {
    id: 2,
    grant: "Grant Shapps",
    overview: "Shapps Overview\nGrant writes more than Hugh\nSeriously shut up",
    completed: true,
    reportPeriod: "2018-10-01T00:00:00.000Z"
  };
  let reports: Report[] = [report1, report2];

  const account: Account = {
    username: "steve@ip.org",
    name: "Steve Jones",
    role: "help-refugees"
  };

  it("renders a header component and passes the logout method and the account to it", () => {
    wrapper = shallow(
      <SubmittedReportComponent
        logout={mockLogout}
        match={{ params: { id: "1" } }}
        classes={{}}
        reports={reports}
        account={account}
      />
    );
    expect(wrapper.find(HeaderComponent).prop("logout")).toBe(mockLogout);
    expect(wrapper.find(HeaderComponent).prop("account")).toBe(account);
  });

  describe("with completed report", () => {
    beforeEach(() => {
      wrapper = shallow(
        <SubmittedReportComponent
          logout={mockLogout}
          match={{ params: { id: "1" } }}
          classes={{}}
          reports={[report1]}
          account={account}
        />
      );
    });

    it("renders the grant name", () => {
      expect(
        wrapper
          .find('[data-test-id="grant-name"]')
          .render()
          .text()
      ).toContain("Hugh Grant");
    });

    it("renders the grant submission date", () => {
      expect(
        wrapper
          .find('[data-test-id="submission-date"]')
          .render()
          .text()
      ).toContain("03/10/2018");
    });

    it("renders the grant overview", () => {
      expect(
        wrapper
          .find('[data-test-id="report-progress"]')
          .render()
          .text()
      ).toContain(report1.overview);
    });
  });

  describe("with multiline report", () => {
    beforeEach(() => {
      wrapper = shallow(
        <SubmittedReportComponent
          logout={mockLogout}
          match={{ params: { id: "2" } }}
          classes={{}}
          reports={reports}
          account={account}
        />
      );
    });

    it("splits up the text", () => {
      expect(
        wrapper
          .find('[data-test-id="report-progress"]')
          .render()
          .children()
      ).toHaveLength(3);
    });
  });
});

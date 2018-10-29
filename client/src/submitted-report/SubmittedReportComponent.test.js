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
    submissionDate: "2018-10-03T00:00:00.000Z",
    keyActivity: {
      activityName: "Test activity",
      numberOfParticipants: "200",
      demographicInfo: "any value",
      impactOutcome: "impact"
    },
    operatingEnvironment: "",
    beneficiaryFeedback: ""
  };
  const report2: Report = {
    id: 2,
    grant: "Grant Shapps",
    overview: "Shapps Overview\nGrant writes more than Hugh\nSeriously shut up",
    completed: true,
    reportPeriod: "2018-10-01T00:00:00.000Z",
    keyActivity: {},
    operatingEnvironment: "",
    beneficiaryFeedback: ""
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

    const fields = {
      "grant-name": "Hugh Grant",
      "submission-date": "03/10/2018",
      "report-progress": report1.overview,
      "report-key-activity-name": report1.keyActivity.activityName,
      "report-number-of-participants": report1.keyActivity.numberOfParticipants,
      "report-demographic-info": report1.keyActivity.demographicInfo,
      "report-impact-outcome": report1.keyActivity.impactOutcome
    };

    Object.entries(fields).forEach(([name, expectedContent]) => {
      it(`renders the grant ${name.replace("-", " ")}`, () => {
        expect(
          wrapper
            .find(`[data-test-id="${name}"]`)
            .render()
            .text()
        ).toContain(expectedContent);
      });
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

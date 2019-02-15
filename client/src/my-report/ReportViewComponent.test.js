import React from "react";
import { shallow } from "enzyme";

import { ReportViewComponent } from "./ReportViewComponent";
import { type Report } from "./models";

describe("ReportViewComponent", () => {
  let wrapper;

  const report1: $Shape<Report> = {
    id: 1,
    grant: "Hugh Grant",
    overview: "Hugh Overview",
    completed: true,
    reportPeriod: "2018-09-01T00:00:00.000Z",
    submissionDate: "2018-10-03T00:00:00.000Z",
    keyActivities: [
      {
        activityName: "Test activity",
        numberOfParticipants: "200",
        demographicInfo: [
          {
            number: 12,
            type: "men",
            note: "text"
          }
        ],
        impactOutcome: "impact"
      }
    ],
    operatingEnvironment: "",
    beneficiaryFeedback: "",
    challengesFaced: "",
    incidents: "",
    otherIssues: "",
    materialsForFundraising: "",
    attachments: []
  };

  describe("with completed report", () => {
    beforeEach(() => {
      wrapper = shallow(<ReportViewComponent classes={{}} report={report1} />);
    });

    const fields = {
      "report-progress": report1.overview,
      "report-operating-environment": report1.operatingEnvironment,
      "report-key-activity-name": report1.keyActivities[0].activityName,
      "report-number-of-participants":
        report1.keyActivities[0].numberOfParticipants,
      "report-impact-outcome": report1.keyActivities[0].impactOutcome,
      "report-beneficiary-feedback": report1.beneficiaryFeedback,
      "report-challenges-faced": report1.challengesFaced,
      "report-incidents": report1.incidents,
      "report-other-issues": report1.otherIssues,
      "report-materials-for-fundraising": report1.materialsForFundraising
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
});

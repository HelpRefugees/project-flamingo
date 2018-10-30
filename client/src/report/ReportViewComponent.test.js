import React from "react";
import { shallow } from "enzyme";

import { ReportViewComponent } from "./ReportViewComponent";
import type { Report } from "../report/models";

describe("ReportViewComponent", () => {
  let wrapper;

  const report1: $Shape<Report> = {
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

  const report2: $Shape<Report> = {
    id: 2,
    grant: "Grant Shapps",
    overview: "Shapps Overview\nGrant writes more than Hugh\nSeriously shut up",
    completed: true,
    reportPeriod: "2018-10-01T00:00:00.000Z",
    keyActivity: {},
    operatingEnvironment: "",
    beneficiaryFeedback: ""
  };

  describe("with completed report", () => {
    beforeEach(() => {
      wrapper = shallow(<ReportViewComponent classes={{}} report={report1} />);
    });

    const fields = {
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
      wrapper = shallow(<ReportViewComponent classes={{}} report={report2} />);
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

import React from "react";
import { mount } from "enzyme";

import type { Report } from "./models";
import SubmittedReportListItemComponent from "./SubmittedReportListItemComponent";
import { Link, MemoryRouter } from "react-router-dom";

describe("SubmittedReportListItemComponent", () => {
  const submittedReport: Report = {
    id: 2,
    grant: "Grant Shapps",
    overview: "Shapps",
    completed: true,
    reportPeriod: "2018-10-01T00:00:00.000Z",
    submissionDate: "2018-10-02T00:00:00.000Z",
    keyActivities: [{}],
    operatingEnvironment: "",
    beneficiaryFeedback: "",
    challengesFaced: "",
    incidents: "",
    otherIssues: "",
    dueDate: "",
    materialsForFundraising: ""
  };

  let wrapper;

  const textForCell = dataTestId =>
    wrapper.find(`TableCell[data-test-id="${dataTestId}"]`).text();

  const dummyUpdateReport = jest.fn();

  beforeEach(() => {
    wrapper = mount(
      <MemoryRouter>
        <table>
          <tbody>
            <SubmittedReportListItemComponent
              report={submittedReport}
              updateReport={dummyUpdateReport}
            />
          </tbody>
        </table>
      </MemoryRouter>
    );
  });

  it("renders overview information", () => {
    expect(textForCell("report-grant")).toEqual(submittedReport.grant);
    expect(textForCell("report-period")).toEqual("October 2018");
    expect(textForCell("report-submitted")).toEqual("02/10/2018");
  });

  it("renders links for the submitted report", () => {
    const links = wrapper.find(Link);
    expect(links).toHaveLength(3);
    links.forEach(l => expect(l.prop("to")).toEqual("/my-reports/2"));
  });

  it("renders an undo button", () => {
    wrapper
      .find('Button[data-test-id="report-unsubmit-button"]')
      .simulate("click");
    expect(dummyUpdateReport).toHaveBeenCalledWith({
      ...submittedReport,
      completed: false
    }, "Error unsubmitting report");
  });
});

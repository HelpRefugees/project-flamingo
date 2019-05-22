import { Document, Paragraph, TextRun } from "docx";
import {
  type Report,
  type KeyActivity,
  type DemographicInfo
} from "../my-report/models";
import moment from "moment";

export class ReportCreator {
  reportSubTitles = {
    overview: "Grant overview",
    // keyActivities: " Key activities & impact",
    operatingEnvironment: "Operating environment",
    beneficiaryFeedback: "Beneficiary feedback",
    challengesFaced: "Challenges faced and lessons learned",
    incidents: "Incidents and near misses",
    otherIssues:
      "Is there anything you would like to use our platform to speak about?",
    materialsForFundraising: "Materials for fundraising"
  };
  create(report: Report) {
    let document = new Document();

    document.Header.createParagraph(
      `Submitted on: ${moment(report.submissionDate).format("DD/MM/YYYY")}`
    );

    document.addParagraph(
      this.createReportHeader(report.grant, report.reportPeriod)
    );

    Object.entries(report).forEach(([key: string, value: any]) => {
      if (Object.keys(this.reportSubTitles).some(section => section === key)) {
        this.createReportSection(this.reportSubTitles[key], value, document);
      }
    });

    this.createKeyActivities(document, report.keyActivities);
    return document;
  }

  createReportHeader(grant: string, period: string) {
    let reportHeaderParagraph = new Paragraph().maxRightTabStop().title();
    reportHeaderParagraph.addRun(new TextRun(grant).bold());
    reportHeaderParagraph.addRun(
      new TextRun(moment(period).format("MMMM YYYY")).tab().bold()
    );
    return reportHeaderParagraph;
  }

  createReportSubtitle(subTitle: string) {
    return new Paragraph(subTitle).heading1().thematicBreak();
  }

  createReportSection(
    sectionTitle: string,
    sectionText: any,
    document: Document
  ) {
    document.addParagraph(this.createReportSubtitle(sectionTitle));
    let sectionTextParagraph = new Paragraph();
    sectionTextParagraph.addRun(new TextRun(sectionText).bold()).bullet();
    sectionTextParagraph.addRun(
      new TextRun()
        .break()
        .break()
        .break()
    );
    document.addParagraph(sectionTextParagraph);
  }

  createReportTextParagraph(text: string) {
    return new Paragraph(text);
  }

  createKeyActivities(document: Document, keyActivities: KeyActivity[]) {
    document.addParagraph(this.createReportSubtitle("Key activities & impact"));
    keyActivities.forEach(activity => {
      let titleParagraph = new Paragraph().maxRightTabStop();
      titleParagraph.addRun(new TextRun(activity.activityName).bold());
      titleParagraph.addRun(
        new TextRun(`${activity.numberOfParticipants || ""} participant`)
          .tab()
          .bold()
      );
      document.addParagraph(titleParagraph);
      activity.demographicInfo.forEach((demoInfo: DemographicInfo) => {
        let infoTextParagraph = new Paragraph().maxRightTabStop();
        infoTextParagraph.addRun(
          new TextRun(`${demoInfo.number} ${demoInfo.type}`)
        );
        infoTextParagraph.addRun(new TextRun(demoInfo.note).tab());
        document.addParagraph(infoTextParagraph);
      });
      document.addParagraph(
        this.createReportTextParagraph(activity.impactOutcome || "")
      );
    });
  }
}

const capitalizeFirstLetter = (word: string) => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};

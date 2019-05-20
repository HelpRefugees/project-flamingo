import { Document, Paragraph, TextRun } from "docx";
import { type Report } from "../my-report/models";
import moment from "moment";

export class ReportCreator {
  create(report: Report) {
    let document = new Document();

    document.Header.createParagraph(
      `Submission Date : ${moment(report.submissionDate).format("DD/MM/YYYY")}`
    );

    document.addParagraph(
      this.createReportHeader(report.grant, report.reportPeriod)
    );

    Object.entries(report).forEach(([key: string, value: any]) => {
      if (
        key !== "id" &&
        key !== "submissionDate" &&
        key !== "keyActivities" &&
        key !== "attachments"
      ) {
        this.createReportSection(key, value, document);
      }
    });
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
    document.addParagraph(
      this.createReportSubtitle(capitalizeFirstLetter(sectionTitle))
    );
    let sectionTextParagraph = new Paragraph();
    sectionTextParagraph.addRun(new TextRun(sectionText).bold());
    document.addParagraph(sectionTextParagraph);
  }

  createReportTextParagraph(text: string) {
    return new Paragraph(text);
  }
}

const capitalizeFirstLetter = (word: string) => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};

export type Report = {
  id: number,
  overview: string,
  keyActivity: {
    activityName?: string,
    numberOfParticipants?: string,
    demographicInfo?: string,
    impactOutcome?: string
  },
  operatingEnvironment: string,
  beneficiaryFeedback: string,
  challengesFaced: string,
  incidents: string,
  grant: string,
  completed: boolean,
  reportPeriod: string,
  dueDate: string,
  submissionDate?: string
};

export type Report = {
  id: number,
  overview: string,
  keyActivity: {
    activityName?: string,
    numberOfParticipants?: string,
    demographicInfo?: string,
    impactOutcome?: string
  },
  grant: string,
  completed: boolean,
  reportPeriod: string,
  submissionDate?: string
};

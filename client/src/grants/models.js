export type Grant = {
  id: number,
  organization: string,
  grant: string,
  owner: string,
  sector: string,
  description: string,
  country: string,
  region: string,
  otherInfo: string,
  startDate: string,
  endDate: string,
  archived: boolean,
  periods: any[]
};

export type AddGrantModel = {
  grantName: string,
  organizationName: string,
  sector: string,
  grantDescription: string,
  country: string,
  region: string,
  otherInfo: string,
  accountEmail: string
};

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
  archived: boolean
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

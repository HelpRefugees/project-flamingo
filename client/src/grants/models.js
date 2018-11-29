export type Grant = {
  id: number,
  name: string,
  grant: string,
  username: string,
  organization: string,
  sector: string,
  description: string,
  country: string,
  region: string,
  otherInfo: string
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

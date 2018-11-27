export type Grant = {
  name: string,
  grant: string,
  username: string
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

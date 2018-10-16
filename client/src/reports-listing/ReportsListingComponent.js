import React, { Component, Fragment } from "react";
import HeaderComponent from "../page-layout/HeaderComponent";

import type { Account } from "../authentication/models";

type Props = {
  logout: () => void,
  account: ?Account
};

export default class ReportsListingComponent extends Component<Props> {
  render() {
    const { logout, account } = this.props;
    return (
      <Fragment>
        <HeaderComponent logout={logout} account={account} />
        <h1 data-test-id="page-title">Reports</h1>
      </Fragment>
    );
  }
}

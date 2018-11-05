import React from "react";
import { Redirect, Route } from "react-router-dom";

import type { Account } from "../authentication/models";

type Props = {
  path: string,
  isAuthenticated?: boolean,
  account?: Account,
  component: any,
  allowed: string[]
};

export default (props: Props) => {
  const {
    path,
    isAuthenticated,
    account,
    component: Component,
    allowed
  } = props;
  return (
    <Route
      path={path}
      render={props => {
        if (!isAuthenticated) {
          return <Redirect to="/" />;
        }
        if (account && allowed.indexOf(account.role) === -1) {
          return <Redirect to="/forbidden" />;
        }
        return <Component {...props} />;
      }}
    />
  );
};

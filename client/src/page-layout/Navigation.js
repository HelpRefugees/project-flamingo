import React, { Component } from "react";
import RoleFilter from "../authorization/RoleFilter";
import ButtonLink from "./ButtonLink";

type Props = {};

export default class Navigation extends Component<Props> {
  render() {
    return (
      <RoleFilter permit="help-refugees">
        <ButtonLink data-test-id="nav-link-reports" to="/reports">
          Reports
        </ButtonLink>
        <ButtonLink data-test-id="nav-link-grants" to="/grants">
          Grants
        </ButtonLink>
      </RoleFilter>
    );
  }
}

import React, { Component } from "react";
import RoleFilter from "../authorization/RoleFilter";
import ButtonNavLink from "./ButtonNavLink";

type Props = {};

export default class Navigation extends Component<Props> {
  render() {
    return (
      <RoleFilter permit="help-refugees">
        <ButtonNavLink data-test-id="nav-link-reports" to="/reports">
          Reports
        </ButtonNavLink>
        <ButtonNavLink data-test-id="nav-link-grants" to="/grants">
          Grants
        </ButtonNavLink>
      </RoleFilter>
    );
  }
}

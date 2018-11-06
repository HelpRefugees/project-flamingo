import { NavLink } from "react-router-dom";
import { Button } from "@material-ui/core";
import React from "react";

export default ({ children, to, activeClassName, ...others }: any) => {
  const NavLinkComponent = props => (
    <NavLink to={to} activeStyle={{ color: "#00857b" }} {...props} />
  );
  return (
    <Button {...others} component={NavLinkComponent}>
      {children}
    </Button>
  );
};

import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";
import React from "react";

export default ({ children, to, ...others }: any) => {
  const LinkComponent = props => <Link to={to} {...props} />;
  return (
    <Button {...others} component={LinkComponent}>
      {children}
    </Button>
  );
};

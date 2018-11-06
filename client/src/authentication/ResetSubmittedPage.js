import React from "react";
import AuthenticationFormComponent from "./AuthenticationFormComponent";
import { Typography, withStyles } from "@material-ui/core";
import ButtonLink from "../page-layout/ButtonLink";

export default withStyles(theme => ({
  text: {
    marginBottom: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 2,
    textAlign: "center"
  },
  button: {
    height: 56
  }
}))(({ classes }) => (
  <AuthenticationFormComponent>
    <Typography variant="h3">Almost there!</Typography>
    <Typography data-test-id="message" className={classes.text}>
      If you have a HelpRefugees account linked to this email address, we'll
      send you instructions to reset your password.
    </Typography>
    <ButtonLink
      data-test-id="back-to-login"
      color="primary"
      to="/"
      className={classes.button}
    >
      Back to login
    </ButtonLink>
  </AuthenticationFormComponent>
));

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
    <Typography variant="h3">That’s all!</Typography>
    <Typography data-test-id="message" className={classes.text}>
      You succesfully set your new password! Ready to get back to reporting?
    </Typography>
    <ButtonLink
      data-test-id="back-to-login"
      color="primary"
      variant="contained"
      fullWidth
      to="/"
      className={classes.button}
    >
      Log in
    </ButtonLink>
  </AuthenticationFormComponent>
));

import React, { Component } from "react";
import {
  Button,
  FormControl,
  FormGroup,
  TextField,
  Typography,
  withStyles
} from "@material-ui/core";
import AuthenticationFormComponent from "./AuthenticationFormComponent";

const styles = theme => ({
  form: {
    width: "100%"
  },
  button: {
    height: 56
  },
  text: {
    marginTop: theme.spacing.unit * 2,
    textAlign: "center"
  }
});

type Props = {
  classes: any,
  resetPassword: string => void
};

export class ForgottenPasswordComponent extends Component<
  Props,
  { username: string }
> {
  constructor() {
    super();
    this.state = { username: "" };
  }

  setUsername = (event: Event) => {
    this.setState({ username: (event.target: window.HTMLInputElement).value });
  };

  resetPassword = (event: Event) => {
    this.props.resetPassword(this.state.username).then(success => {
      if (success) {
        this.props.history.push("/reset-submitted");
      }
    });
    event.preventDefault();
  };

  render() {
    const { classes } = this.props;
    return (
      <AuthenticationFormComponent>
        <Typography variant="h3">Forgot your password?</Typography>
        <Typography className={classes.text}>
          No worries, just enter your email address below and we'll send you a
          reset email.
        </Typography>
        <form
          onSubmit={event => this.resetPassword(event)}
          className={classes.form}
        >
          <FormGroup>
            <FormControl margin="normal" required>
              <TextField
                data-test-id="username-input"
                label="Email"
                type="email"
                fullWidth
                variant="outlined"
                onChange={event => this.setUsername(event)}
                error={this.props.isAuthenticated === false}
                value={this.state.username}
              />
            </FormControl>
            <FormControl margin="normal">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                data-test-id="reset-password"
                className={classes.button}
              >
                Request a reset mail
              </Button>
            </FormControl>
          </FormGroup>
        </form>
      </AuthenticationFormComponent>
    );
  }
}
export default withStyles(styles)(ForgottenPasswordComponent);

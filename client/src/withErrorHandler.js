import React from "react";
import { Snackbar, SnackbarContent, withStyles } from "@material-ui/core";
import { connect } from "react-redux";
import { type Dispatch } from "redux";

import { errorExpired } from "./state/actions";

class ErrorDisplay extends React.Component<{
  errorMessage: string,
  classes: any
}> {
  render() {
    return (
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={true}
      >
        <SnackbarContent
          data-test-id="error-message"
          className={this.props.classes.errorMessage}
          message={this.props.errorMessage}
        />
      </Snackbar>
    );
  }
}

const StyledErrorDisplay = withStyles(() => ({
  errorMessage: {
    backgroundColor: "#ea1024"
  }
}))(ErrorDisplay);

type Props = {
  clearError: () => void,
  errorMessage: ?string
};

export default (WrappedComponent: any) => {
  class SnackBarErrorHandler extends React.Component<Props> {
    componentDidMount() {
      this.props.clearError();
    }

    componentWillUnmount() {
      this.props.clearError();
    }

    renderErrors() {
      if (this.props.errorMessage) {
        return <StyledErrorDisplay errorMessage={this.props.errorMessage} />;
      }
      return null;
    }

    render() {
      const { clearError, ...others } = this.props;
      return (
        <>
          {this.renderErrors()}
          <WrappedComponent {...others} />
        </>
      );
    }
  }

  const mapStateToProps = ({ errorMessage }) => ({
    errorMessage
  });

  const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
    clearError: () => dispatch(errorExpired())
  });

  return connect(mapStateToProps, mapDispatchToProps)(SnackBarErrorHandler);
};

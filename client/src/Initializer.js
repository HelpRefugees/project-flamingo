// eslint-disable-next-line no-unused-vars
import React, { Component } from "react";
import { connect } from "react-redux";
import { appStarted } from "./state/actions";

type Props = {
  onLoad: () => void,
  environment: string,
  children: ?any
};

class Initializer extends Component<Props> {
  componentDidMount() {
    const { onLoad } = this.props;
    onLoad();
  }

  render() {
    const { environment, children } = this.props;
    if (environment === undefined) {
      return null;
    }
    return <>{children}</>;
  }
}

const mapStateToProps = ({ environment }: any) => ({ environment });

const mapDispatchToProps = (dispatch: any) => ({
  onLoad: () => dispatch(appStarted())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Initializer);

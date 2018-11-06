import { Component } from "react";
import { connect } from "react-redux";

type Props = {
  permit: string,
  role: ?string,
  children: any
};

class RoleFilter extends Component<Props> {
  render() {
    const { permit, role, children } = this.props;
    if (permit === role) {
      return children;
    }
    return null;
  }
}

const mapStateToProps = ({ account: { role } } = {}) => ({ role });

export default connect(mapStateToProps)(RoleFilter);

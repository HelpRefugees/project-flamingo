import { connect } from 'react-redux';

type Props = {
  environment: string,
  children: any | null,
};

const permit = ['development', 'test'];

export const AcceptanceFilter = ({ environment, children }: Props) => permit.includes(environment) ? children : null;

const mapStateToProps = ({ environment }) => ({ environment });

export default connect(mapStateToProps)(AcceptanceFilter);
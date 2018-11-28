import React, { Component, Fragment } from "react";
import {
  withStyles,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from "@material-ui/core";

import { Account } from "../authentication/models";
import { type Grant } from "./models";
import HeaderComponent from "../page-layout/HeaderComponent";
import BannerHeader from "../page-layout/BannerHeader";
import ButtonLink from "../page-layout/ButtonLink";

type Props = {
  account: Account,
  loadGrants: () => void,
  grants: Grant[],
  logout: () => void,
  classes: any
};

const styles = theme => ({
  rowContainer: {
    marginTop: theme.spacing.unit * 4
  },
  addGrantButton: {
    width: "171px",
    height: "36px",
    background: "#ffffff",
    color: "#00857b",
    marginTop: theme.spacing.unit * 5.5,
    fontSize: "14px",
    borderRadius: "0px"
  }
});

export class GrantsListingComponent extends Component<Props> {
  componentWillMount() {
    this.props.loadGrants();
  }

  renderListItems() {
    const grants = this.props.grants || [];
    return grants.map((grant: Grant, index: number) => (
      <TableRow data-test-id="report" key={index}>
        <TableCell data-test-id="grant-name">{grant.name}</TableCell>
        <TableCell data-test-id="grant-organisation">{grant.grant}</TableCell>
        <TableCell data-test-id="grant-username">{grant.username}</TableCell>
      </TableRow>
    ));
  }

  render() {
    const { logout, account, classes } = this.props;
    return (
      <Fragment>
        <HeaderComponent logout={logout} account={account} />
        <Grid container className={classes.rowContainer}>
          <Grid item xs={1} />
          <Grid item container xs={10}>
            <BannerHeader title="Grants">
              <ButtonLink
                to={"/grants/new"}
                data-test-id="add-grant-button"
                className={classes.addGrantButton}
              >
                ADD NEW GRANT
              </ButtonLink>
            </BannerHeader>
          </Grid>
          <Grid container className={classes.rowContainer}>
            <Grid item xs={1} />
            <Grid item xs={10}>
              <Table data-test-id="grant-list">
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.tableReportGrant}>
                      Organisation
                    </TableCell>
                    <TableCell className={classes.tableReportGrant}>
                      Grant
                    </TableCell>
                    <TableCell className={classes.tableReportGrant}>
                      Account Name
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>{this.renderListItems()}</TableBody>
              </Table>
            </Grid>
          </Grid>
        </Grid>
      </Fragment>
    );
  }
}

export default withStyles(styles)(GrantsListingComponent);

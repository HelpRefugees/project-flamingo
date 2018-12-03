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
import CreateIcon from "@material-ui/icons/Create";

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
  classes: any,
  history: any
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
  },
  tableGrant: {
    margin: "2px",
    borderLeft: "1px solid #d9d9d9",
    paddingLeft: "24px"
  },
  clickable: {
    cursor: "pointer"
  }
});

export class GrantsListingComponent extends Component<Props> {
  componentWillMount() {
    this.props.loadGrants();
  }

  renderListItems(classes) {
    const grants = this.props.grants || [];
    return grants.map((grant: Grant, index: number) => (
      <TableRow data-test-id="report" key={index}>
        <TableCell data-test-id="grant-organisation">{grant.name}</TableCell>
        <TableCell data-test-id="grant-name">
          <div className={classes.tableGrant}>{grant.grant}</div>
        </TableCell>
        <TableCell data-test-id="grant-region">
          <div className={classes.tableGrant}>{grant.region}</div>
        </TableCell>
        <TableCell data-test-id="grant-action">
          <div className={classes.tableGrant}>
            <CreateIcon
              className={classes.clickable}
              onClick={() => {
                this.props.history.push(`/grants/edit/${grant.id}`);
              }}
            />
          </div>
        </TableCell>
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
                    <TableCell>Organisation</TableCell>
                    <TableCell>
                      <div className={classes.tableGrant}>Grant Name </div>
                    </TableCell>
                    <TableCell>
                      <div className={classes.tableGrant}>Region</div>
                    </TableCell>
                    <TableCell>
                      <div className={classes.tableGrant} />
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>{this.renderListItems(classes)}</TableBody>
              </Table>
            </Grid>
          </Grid>
        </Grid>
      </Fragment>
    );
  }
}

export default withStyles(styles)(GrantsListingComponent);

import React, { Component, Fragment } from "react";
import {
  withStyles,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Typography,
  Tab,
  Tabs,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Chip,
  Tooltip
} from "@material-ui/core";
import CreateIcon from "@material-ui/icons/Create";
import Archive from "@material-ui/icons/Archive";
import Unarchive from "@material-ui/icons/Unarchive";
import moment from "moment";
// $FlowIgnore: react-select types don't seem to work
import Select from "react-select";
import { Account } from "../authentication/models";
import { type Grant } from "./models";
import HeaderComponent from "../page-layout/HeaderComponent";
import BannerHeader from "../page-layout/BannerHeader";
import ButtonLink from "../page-layout/ButtonLink";

type Props = {
  account: Account,
  loadGrants: () => void,
  grants: $Shape<Grant>[],
  logout: () => void,
  classes: any,
  updateGrant: (grant: $Shape<Grant>, errorMessage: string) => Promise<any>,
  grant: $Shape<Grant>,
  history: any,
  selectGrant: (grant: $Shape<Grant>) => void
};

const defaultText = {
  fontSize: 14,
  fontFamily: `"Open Sans", sans-serif`
};

// https://react-select.com/styles
const grantNameFilterControlStyles = {
  control: styles => ({
    ...styles,
    backgroundColor: "#f5f5f5",
    border: "none",
    boxShadow: "none"
  }),
  placeholder: styles => ({
    ...styles,
    ...defaultText
  }),
  option: (styles, props) => ({
    ...styles,
    ...defaultText,
    backgroundColor: props.isSelected
      ? "#00857b"
      : props.isFocused
        ? "#f5f5f5"
        : "white",
    color: props.isSelected ? "white" : "black",
    ":active": {
      backgroundColor: props.isSelected ? null : "#f5f5f5"
    }
  })
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
  },
  badge: {
    padding: `0 ${theme.spacing.unit * 2}px`
  },
  grantNameFilter: {
    minWidth: theme.spacing.unit * 35,
    paddingRight: theme.spacing.unit * 3.5,
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit,
    borderRadius: theme.spacing.unit / 2
  },
  messagePaper: {
    textAlign: "center",
    paddingTop: theme.spacing.unit * 3,
    paddingBottom: theme.spacing.unit * 3
  },
  underlined: {
    borderBottom: "1px solid #e5e5e5"
  },
  grow: {
    flexGrow: 1
  },
  tableCellDiv: {
    margin: 2,
    borderLeft: "1px solid #d9d9d9",
    paddingLeft: theme.spacing.unit * 3
  },
  row: {
    cursor: "pointer"
  },
  grantNameCell: {
    width: "66%"
  },
  expiredLabel: {
    color: "#ea1024"
  },
  expiredOutlined: {
    borderColor: "#ea1024"
  },
  expiryDev: {
    margin: "2px",
    borderLeft: "1px solid #d9d9d9",
    paddingLeft: "24px"
  }
});

export class GrantsListingComponent extends Component<Props, any> {
  constructor() {
    super();
    this.state = {
      filter: undefined,
      tabValue: 0,
      dialogOpen: false,
      grant: undefined
    };
  }
  componentWillMount() {
    this.props.loadGrants();
  }

  handleArchiveOpen = () => {
    this.setState({ dialogOpen: true });
  };

  renderDialog(archive: string) {
    const { updateGrant } = this.props;
    return (
      <Dialog
        open={this.state.dialogOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {archive === "archive"
            ? "You are about to archive this grant"
            : "You are about to unarchive this grant"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {archive === "archive"
              ? "Archiving grant will stop the genaration of reports, are you sure you want to do this?"
              : "Unarchiving grant will start the genaration of reports, are you sure you want to do this?"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              let grant = this.state.grant;
              if (grant.archived) {
                grant.archived = false;
              } else {
                grant.archived = true;
              }
              updateGrant(grant, `unable to  ${archive} grant`)
                .then(() => {
                  this.props.loadGrants();
                  this.setState({ dialogOpen: false });
                })
                .catch(() => {
                  this.props.loadGrants();
                  this.setState({ dialogOpen: false });
                });
            }}
            color="primary"
          >
            Yes
          </Button>
          <Button
            onClick={() => {
              this.setState({ dialogOpen: false });
            }}
            color="primary"
            autoFocus
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  getFilteredGrants(grants: $Shape<Grant>[]): $Shape<Grant>[] {
    return this.state.filter
      ? grants.filter(
          (grant: $Shape<Grant>) => grant.grant === this.state.filter
        )
      : grants;
  }

  getFilterOptions(): any[] {
    let currentTabGrants = this.props.grants || [];
    if (this.state.tabValue === 0) {
      currentTabGrants = currentTabGrants.filter(
        (grant: $Shape<Grant>) => !grant.archived
      );
    } else {
      currentTabGrants = currentTabGrants.filter(
        (grant: $Shape<Grant>) => grant.archived
      );
    }

    const uniqueGrantNames = [];
    currentTabGrants.forEach(({ grant }) => {
      if (uniqueGrantNames.indexOf(grant) === -1) {
        uniqueGrantNames.push(grant);
      }
    });
    return uniqueGrantNames
      .sort()
      .map(grant => ({ value: grant, label: grant }));
  }

  getArchivedGrants(grants: ?($Shape<Grant>[])) {
    return (grants || []).filter((grant: $Shape<Grant>) => grant.archived);
  }

  getOngoingGrants(grants: $Shape<Grant>[]) {
    return grants.filter((grant: $Shape<Grant>) => !grant.archived);
  }

  getSelectedFilterValue() {
    return this.getFilterOptions().find(o => o.value === this.state.filter);
  }

  updateFilter = (selection: { label: string, value: string }) => {
    this.setState({
      filter: selection ? selection.value : undefined
    });
  };

  noGrantsMessage(classes: any, title: string, message: string) {
    return (
      <Paper className={classes.messagePaper}>
        <Typography
          data-test-id="no-gratns-title"
          variant="h5"
          className={classes.paperTitle}
        >
          {title}
        </Typography>
        <Typography data-test-id="no-gratns-message">{message}</Typography>
      </Paper>
    );
  }

  renderExpiryIndicator(endDate: any, classes: any) {
    let status = moment(endDate).format("DD/MM/YYYY");
    let chipClasses = {
      label: classes.expiredLabel,
      outlined: classes.expiredOutlined
    };
    const dueDate = moment(endDate);
    const delta = dueDate.diff(moment(), "days");
    console.log(delta);
    if (delta >= -7 && delta < 0) {
      return (
        <Tooltip title="Expiring Soon" placement="top-end">
          <Chip label={status} classes={chipClasses} variant="outlined" />
        </Tooltip>
      );
    } else if (delta > 0) {
      return (
        <Tooltip title="Grant Expired" placement="top-end">
          <Chip label={status} classes={chipClasses} variant="outlined" />
        </Tooltip>
      );
    } else {
      return status;
    }
  }

  renderListItems(classes: any, grants: $Shape<Grant>[], archived: string) {
    return (
      <>
        {grants.map((grant: $Shape<Grant>, index: number) => (
          <TableRow data-test-id="grant" key={index}>
            <TableCell data-test-id="grant-organisation">
              {grant.organization}
            </TableCell>
            <TableCell data-test-id="grant-name">
              <div className={classes.tableGrant}>{grant.grant}</div>
            </TableCell>
            <TableCell data-test-id="grant-region">
              <div className={classes.tableGrant}>{grant.region}</div>
            </TableCell>
            <TableCell data-test-id="grant-end-date">
              <div className={classes.tableGrant}>
                {this.renderExpiryIndicator(grant.endDate, classes)}
              </div>
            </TableCell>
            <TableCell data-test-id="grant-archive">
              <div className={classes.tableGrant}>
                {archived === "archive" ? (
                  <Archive
                    className={classes.clickable}
                    onClick={() => {
                      this.handleArchiveOpen();
                      this.setState({ grant: { ...grant } });
                    }}
                  />
                ) : (
                  <Unarchive
                    className={classes.clickable}
                    onClick={() => {
                      this.handleArchiveOpen();
                      this.setState({ grant: { ...grant } });
                    }}
                  />
                )}
              </div>
            </TableCell>
            <TableCell data-test-id="grant-action">
              <div className={classes.tableGrant}>
                <CreateIcon
                  className={classes.clickable}
                  onClick={() => {
                    this.props.selectGrant(grant);
                    this.props.history.push(`/grants/${grant.id}/edit`);
                  }}
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </>
    );
  }

  grantsTable({
    classes,
    grants,
    grantSelector
  }: {
    classes: any,
    grants: $Shape<Grant>[],
    grantSelector: string
  }) {
    return (
      <div>
        <Table data-test-id={grantSelector}>
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
                <div className={classes.tableGrant}>Expiry Date</div>
              </TableCell>
              <TableCell>
                <div className={classes.tableGrant}>
                  {grantSelector === "ongoing-grants" ? "ARCHIVE" : "UNARCHIVE"}
                </div>
              </TableCell>
              <TableCell>
                <div className={classes.tableGrant}>{"  "}</div>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.renderListItems(
              classes,
              grantSelector === "ongoing-grants"
                ? this.getOngoingGrants(grants)
                : this.getArchivedGrants(grants),
              grantSelector === "ongoing-grants" ? "archive" : "unarchive"
            )}
          </TableBody>
        </Table>
        <div>
          {this.renderDialog(
            grantSelector === "ongoing-grants" ? "archive" : "unarchive"
          )}
        </div>
      </div>
    );
  }

  grantsTabs(classes: any, grants: ?($Shape<Grant>[])) {
    const ongoingGrantsContent =
      grants && this.getFilteredGrants(this.getOngoingGrants(grants)).length > 0
        ? this.grantsTable({
            classes: classes,
            grants: this.getFilteredGrants(this.getOngoingGrants(grants)),
            grantSelector: "ongoing-grants"
          })
        : this.noGrantsMessage(
            classes,
            "No ongoing grants yet!",
            "Once there is ongoing grants it will appear here."
          );

    const archivedGrantsContent =
      grants &&
      this.getFilteredGrants(this.getArchivedGrants(grants)).length > 0
        ? this.grantsTable({
            classes: classes,
            grants: this.getFilteredGrants(this.getArchivedGrants(grants)),
            grantSelector: "archived-grants"
          })
        : this.noGrantsMessage(
            classes,
            "No archived grants yet!",
            "Once there is archived grants it will appear here."
          );

    return (
      <Paper>
        <Grid container justify="space-between">
          <Tabs
            indicatorColor="primary"
            textColor="primary"
            value={this.state.tabValue}
            onChange={(event, value) => {
              this.setState({
                tabValue: value,
                filter: ""
              });
            }}
          >
            <Tab
              tabIndex={0}
              data-test-id="ongoing-grants"
              label="ongoing grants"
            />
            <Tab
              tabIndex={1}
              data-test-id="archived-grants"
              label="archived grants"
            />
          </Tabs>
          <div className={`${classes.underlined} ${classes.grow}`}>&nbsp;</div>
          <Grid
            item
            data-test-id="grant-name-filter"
            className={`${classes.grantNameFilter} ${classes.underlined}`}
          >
            <Select
              key={this.getSelectedFilterValue()}
              styles={grantNameFilterControlStyles}
              options={this.getFilterOptions()}
              getOptionValue={option => option.value}
              getOptionLabel={option => option.label}
              isClearable
              onChange={this.updateFilter}
              value={this.getSelectedFilterValue()}
              placeholder="Filter grant name"
            />
          </Grid>
        </Grid>
        {this.state.tabValue === 0 && ongoingGrantsContent}
        {this.state.tabValue === 1 && archivedGrantsContent}
      </Paper>
    );
  }

  render() {
    const { logout, account, classes, grants } = this.props;
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
              {this.grantsTabs(classes, grants)}
            </Grid>
          </Grid>
        </Grid>
      </Fragment>
    );
  }
}

export default withStyles(styles)(GrantsListingComponent);

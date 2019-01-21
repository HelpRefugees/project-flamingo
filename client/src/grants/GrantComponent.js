import React, { Component, Fragment } from "react";
import {
  Grid,
  withStyles,
  AppBar,
  Toolbar,
  Button,
  Modal,
  FormControl,
  Paper,
  Typography,
  TextField
} from "@material-ui/core";
import ArrowBack from "@material-ui/icons/ArrowBack";
import moment from "moment";

import HeaderComponent from "../page-layout/HeaderComponent";
import { TextViewSectionComponent } from "../my-report/TextViewSectionComponent";
import { type Grant } from "./models";
import { type Account } from "../authentication/models";
import { type User } from "../settings/models";

type Props = {
  classes: any,
  logout: () => void,
  account: Account,
  updateGrant: (grant: $Shape<Grant>, errorMessage: string) => Promise<any>,
  history: any,
  grant: $Shape<Grant>,
  users: $Shape<User>[],
  loadUsers: () => void,
  extendGrant: (
    id: number,
    startDate: string,
    endDate: string,
    errorMessage: string
  ) => Promise<any>
};

const styles = themes => ({
  formControl: {
    marginBottom: themes.spacing.unit * 2.5,
    minWidth: 120
  },
  extendGrantForm: {
    padding: themes.spacing.unit * 5
  },
  extendGrantModal: {
    marginTop: "15%",
    marginLeft: "35%",
    width: "30%",
    borderRadius: "8px"
  },
  headerButton: {
    marginRight: themes.spacing.unit * 2.5,
    marginLeft: themes.spacing.unit * 2.5
  },
  outerContainer: {
    height: "100vh",
    marginTop: themes.spacing.unit * 5,
    width: "100%"
  },
  image: {
    width: "120px",
    height: "120px",
    borderRadius: "5px",
    margin: "24px"
  },
  definitionListTitle: {
    fontSize: "10px",
    letterSpacing: "1.5px",
    color: "#757c80",
    textTransform: "uppercase",
    marginBottom: "8px",
    borderTop: "solid 1px #e5e5e5",
    paddingTop: "16px"
  },
  definitionListItem: {
    lineHeight: "1.43",
    margin: "0 0 24px"
  },
  activityName: {
    fontWeight: "600",
    fontSize: "20px",
    color: "#393e40"
  },
  pagePaper: {
    paddingTop: themes.spacing.unit * 3,
    paddingBottom: themes.spacing.unit * 3,
    paddingLeft: themes.spacing.unit * 4,
    paddingRight: themes.spacing.unit * 4,
    boxShadow: "none",
    marginBottom: themes.spacing.unit * 3
  },
  rule: {
    marginTop: themes.spacing.unit * 2,
    borderTop: "solid 1px #e5e5e5",
    borderBottom: "none",
    borderLeft: "none",
    borderRight: "none",
    height: "1px",
    position: "relative",
    left: "-32px",
    width: "calc(100% + 2 * 32px)"
  },
  progress: {
    margin: "4px",
    fontSize: "14px",
    color: "#404040",
    letterSpacing: "0.3px"
  }
});
export class GrantComponent extends Component<
  Props,
  { open: boolean, startDate: string, endDate: string }
> {
  constructor() {
    super();
    this.state = {
      open: false,
      startDate: "",
      endDate: ""
    };
  }
  closeModal = () =>
    this.setState({
      open: false
    });

  openModal = () =>
    this.setState({
      open: true
    });

  updateField = (event: Event, key: string) => {
    const date = new Date((event.target: window.HTMLInputElement).value);
    this.setState({ [key]: date.toISOString() });
  };
  renderExtendGrantModal = (classes: any) => {
    return (
      <Modal
        open={this.state.open}
        onClose={this.closeModal}
        className={classes.extendGrantModal}
      >
        <Paper>
          <Grid container direction="column">
            <Grid item className={classes.extendGrantForm}>
              <Grid container alignItems="flex-end">
                <Typography variant="h4">Extend Grant</Typography>
              </Grid>
              <p />

              <FormControl
                variant="outlined"
                className={classes.formControl}
                fullWidth={true}
              >
                <TextField
                  fullWidth={true}
                  className={classes.formControl}
                  label="Period start Date"
                  type="date"
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true
                  }}
                  value={moment(this.state.startDate).format("YYYY-MM-DD")}
                  onChange={value => this.updateField(value, "startDate")}
                />
                <TextField
                  fullWidth={true}
                  className={classes.formControl}
                  label="Period end Date"
                  type="date"
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true
                  }}
                  value={moment(this.state.endDate).format("YYYY-MM-DD")}
                  onChange={value => this.updateField(value, "endDate")}
                />
              </FormControl>
              <Grid container alignItems="flex-end" direction="row-reverse">
                <Button color="secondary" onClick={this.closeModal}>
                  cancel
                </Button>
                <Button
                  color="primary"
                  onClick={() => {
                    this.props
                      .extendGrant(
                        this.props.grant.id,
                        this.state.startDate,
                        this.state.endDate,
                        "Unable to extend grant"
                      )
                      .then(() => {
                        this.props.history.push("/grants");
                      });
                  }}
                >
                  save
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Modal>
    );
  };

  renderToolbar = (classes: any) => {
    return (
      <AppBar position="static" color="inherit">
        <Toolbar>
          <Grid container justify="space-between">
            <Grid
              item
              container
              direction="row"
              xs={8}
              sm={6}
              lg={3}
              justify="flex-start"
            >
              <Grid item container direction="column" xs={3} sm={6}>
                <Button onClick={() => this.props.history.push("/grants")}>
                  <ArrowBack className={classes.icon} />
                </Button>
              </Grid>
            </Grid>
            <Grid
              item
              container
              direction="row"
              xs={4}
              sm={6}
              lg={3}
              justify="flex-end"
            >
              <Button
                className={classes.headerButton}
                data-test-id="extend-grant-button"
                variant="outlined"
                color="primary"
                disabled={false}
                onClick={this.openModal}
              >
                EXTEND
              </Button>
              <Button
                className={classes.headerButton}
                data-test-id="edit-grant-button"
                variant="outlined"
                color="primary"
                disabled={false}
                onClick={() => {
                  this.props.history.push(
                    `/grants/${this.props.grant.id}/edit`
                  );
                }}
              >
                EDIT
              </Button>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    );
  };
  render() {
    const { logout, classes, account, grant } = this.props;
    return (
      <Fragment>
        <HeaderComponent logout={logout} account={account} />
        {this.renderExtendGrantModal(classes)}
        {this.renderToolbar(classes)}
        <Grid
          container
          spacing={24}
          direction="column"
          className={classes.outerContainer}
        >
          <Grid container justify="center">
            <Grid item xs={6}>
              <TextViewSectionComponent
                classes={classes}
                value={grant.grant}
                valueKey={"grant"}
                titleKey={"grant"}
                title={"Grant name"}
              />
              <TextViewSectionComponent
                classes={classes}
                value={grant.organization}
                valueKey={"organization"}
                titleKey={"organization"}
                title={"Organization name"}
              />
              <TextViewSectionComponent
                classes={classes}
                value={grant.sector}
                valueKey={"sector"}
                titleKey={"sector"}
                title={"Sector"}
              />
              <TextViewSectionComponent
                classes={classes}
                value={grant.description}
                valueKey={"description"}
                titleKey={"description"}
                title={"Grant description"}
              />
              <Grid
                container
                justify="space-between"
                direction="row"
                spacing={24}
              >
                <Grid item xs={12} sm={6}>
                  <TextViewSectionComponent
                    classes={classes}
                    value={grant.country}
                    valueKey={"country"}
                    titleKey={"country"}
                    title={"Country"}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextViewSectionComponent
                    classes={classes}
                    value={grant.region}
                    valueKey={"region"}
                    titleKey={"region"}
                    title={"Region"}
                  />
                </Grid>
              </Grid>
              <Grid
                container
                justify="space-between"
                direction="row"
                spacing={24}
              >
                <Grid item xs={12} sm={6}>
                  <TextViewSectionComponent
                    classes={classes}
                    value={grant.startDate}
                    valueKey={"startDate"}
                    titleKey={"StartDate"}
                    title={"Start date"}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextViewSectionComponent
                    classes={classes}
                    value={grant.endDate}
                    valueKey={"endDate"}
                    titleKey={"endDate"}
                    title={"End date"}
                  />
                </Grid>
              </Grid>

              <TextViewSectionComponent
                classes={classes}
                value={grant.otherInfo}
                valueKey={"otherInfo"}
                titleKey={"otherInfo"}
                title={"Other information"}
              />
              <TextViewSectionComponent
                classes={classes}
                value={grant.owner}
                valueKey={"owner"}
                titleKey={"owner"}
                title={"Account information"}
              />
            </Grid>
          </Grid>
        </Grid>
      </Fragment>
    );
  }
}

export default withStyles(styles)(GrantComponent);

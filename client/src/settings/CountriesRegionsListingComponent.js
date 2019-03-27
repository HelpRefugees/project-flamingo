import React, { Component } from "react";
import {
  withStyles,
  Grid,
  Paper,
  List,
  ListItem,
  Typography,
  Button,
  TextField,
  Modal,
  Chip,
  IconButton
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";

import HeaderComponent from "../page-layout/HeaderComponent";
import SideNav from "../page-layout/SideNav";

import { type Account } from "../authentication/models";
import { type Country } from "./models";

const styles = theme => ({
  addSector: {
    color: theme.palette.primary.main,
    cursor: "pointer"
  },
  chip: {
    flex: 1,
    justifyContent: "space-between"
  },
  pagePaper: {
    padding: theme.spacing.unit * 4,
    boxShadow: "none",
    margin: theme.spacing.unit * 2
  },
  subtitleText: {
    color: "#7f7f7f",
    fontSize: 14,
    fontWeight: 600,
    lineHeight: "1.3rem",
    marginBottom: theme.spacing.unit * 2.5,
    opacity: 0.87
  },
  pageTitle: {
    paddingBottom: theme.spacing.unit * 2.5,
    marginBottom: theme.spacing.unit * 1
  },
  titleUnderline: {
    backgroundColor: theme.palette.primary.main,
    width: theme.spacing.unit * 4,
    height: theme.spacing.unit * 0.5,
    marginBottom: theme.spacing.unit * 3
  },
  subItem: {
    backgroundColor: theme.palette.primary.main
  },
  subItemText: {
    color: theme.palette.background.paper
  },
  formControl: {
    marginBottom: theme.spacing.unit * 2.5,
    minWidth: 120
  },
  addUserForm: {
    padding: theme.spacing.unit * 5
  },
  AddUserModal: {
    marginTop: "15%",
    marginLeft: "30%",
    width: "40%",
    borderRadius: "8px"
  },
  sideNav: {
    borderRadius: "0px",
    flex: 1
    // //el div elly barra
    // maxHeight: "90vh",
    // overFlowY: "scroll",
    // overFlowX: "hidden",
    // //el div elly gowa
    // maxHeight: "90vh",
    // overFlowY: "scroll"
  },
  list: {
    height: "88.5vh"
  },
  sideNavHeader: {
    textTransform: "uppercase",
    fontSize: "10px",
    marginLeft: theme.spacing.unit * 3,
    display: "block",
    color: theme.palette.primary.main,
    fontWeight: "600px",
    fontStyle: "normal",
    fontStretch: "normal",
    lineHeight: "1.6px",
    letterSpacing: "1.5px",
    padding: theme.spacing.unit
  },
  rowContainer: {
    marginTop: theme.spacing.unit * 4
  },
  addUserButton: {
    width: "171px",
    height: "36px",
    background: "#ffffff",
    color: "#00857b",
    marginTop: theme.spacing.unit * 5.5,
    fontSize: "14px",
    borderRadius: "0px"
  },
  tableUser: {
    margin: "2px",
    borderLeft: "1px solid #d9d9d9",
    paddingLeft: "24px"
  },
  tableIcon: {
    textAlign: "center",
    color: theme.palette.primary.main
  },
  clickable: {
    cursor: "pointer"
  },
  gridBorder: {
    border: "solid 1px #d4d7d9",
    marginBottom: theme.spacing.unit * 5.5,
    paddingLeft: theme.spacing.unit * 3,
    borderRadius: "4px"
  },
  headerBotBorder: {
    borderBottom: "solid 1px #d4d7d9",
    marginRight: theme.spacing.unit * 3,
    // paddingBottom: theme.spacing.unit * 3,
    justifyContent: "space-between"
  },
  listItemPadding: {
    paddingLeft: "0px"
  },
  mainFont: {
    color: "#393e40"
  },
  countryName: {
    color: "#393e40",
    display: "inline-table"
  },
  countryHeader: {
    color: "#000000"
  }
});

type Props = {
  account: Account,
  logout: () => void,
  classes: any,
  countries: Country[],
  loadCountries: () => void,
  addCountry: (name: string, errorMsg: string) => Promise<any>,
  deleteCountry: (country: string, errorMsg: string) => Promise<any>,
  addRegion: (
    country: string,
    region: string,
    errorMsg: string
  ) => Promise<any>,
  deleteRegion: (
    country: string,
    region: string,
    errorMsg: string
  ) => Promise<any>,
  history: any,
  addSector: (name: string, errorMsg: string) => Promise<any>,
  deleteSector: (name: string, errorMsg: string) => Promise<any>
};

type state = {
  name: string,
  open: boolean,
  whichModal: string,
  whichCountry: string
};

class CountriesRegionsListingComponent extends Component<Props, state> {
  constructor() {
    super();
    this.state = {
      name: "",
      open: false,
      whichModal: "",
      whichCountry: ""
    };
  }
  componentWillMount() {
    this.props.loadCountries();
  }

  closeModal = () =>
    this.setState({
      open: false,
      name: ""
    });

  openModal = () =>
    this.setState({
      open: true
    });

  navigateTo = url => {
    this.props.history.push(url);
  };

  updateField = (event: Event, key: string) => {
    this.setState({
      [key]: (event.target: window.HTMLInputElement).value
    });
  };

  deleteRegion = (country: string, region: string) => {
    this.props.deleteRegion(country, region, "Can't delete Region");
  };

  deleteCountry = (country: string) => {
    this.props.deleteCountry(country, "Can't delete Country");
  };

  renderAddModel = (classes, caller) => {
    return (
      <Modal
        open={this.state.open}
        onClose={this.closeModal}
        className={classes.AddUserModal}
      >
        <Paper>
          <Grid container direction="column">
            <Grid item className={classes.addUserForm}>
              <Grid container alignItems="flex-end">
                <Typography data-test-id="grant-info-title" variant="h4">
                  {caller === "region" ? "Add new region" : "Add new country"}
                </Typography>
              </Grid>
              <p />
              <TextField
                className={classes.formControl}
                data-test-id="name-text"
                fullWidth={true}
                value={this.state.name}
                onChange={value => this.updateField(value, "name")}
                variant="outlined"
                label="Name"
              />

              <Grid container alignItems="flex-end" direction="row-reverse">
                <Button color="secondary" onClick={this.closeModal}>
                  cancel
                </Button>
                <Button
                  color="primary"
                  onClick={() => {
                    caller === "region"
                      ? this.props
                          .addRegion(
                            this.state.name,
                            this.state.whichCountry,
                            "Unable to add Region"
                          )
                          .then(() => {
                            this.closeModal();
                            this.props.loadCountries();
                          })
                      : this.props
                          .addCountry(this.state.name, "Unable to add Country")
                          .then(() => {
                            this.closeModal();
                            this.props.loadCountries();
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

  render() {
    const countries = this.props.countries || [];
    const { classes, logout, account } = this.props;
    return (
      <>
        <HeaderComponent
          logout={logout}
          account={account}
          history={this.props.history}
        />
        {this.renderAddModel(classes, this.state.whichModal)}
        <Grid container className={classes.sideNav}>
          <Grid item xs={3}>
            <SideNav />
          </Grid>
          <Grid item xs={9}>
            <Grid container className={classes.rowContainer}>
              <Grid item xs={2} />
              <Grid item xs={8}>
                <Grid item>
                  <Typography
                    align="center"
                    variant="h3"
                    className={classes.pageTitle}
                  >
                    Grant settings
                  </Typography>
                  <hr className={classes.titleUnderline} />
                  <Paper className={classes.pagePaper}>
                    <Grid item>
                      <Typography variant="h4" className={classes.mainFont}>
                        Country & Region
                      </Typography>
                    </Grid>
                    <Grid item>
                      <p className={classes.subtitleText}>
                        Please add any countries and their sectors you operate
                        in
                      </p>
                      {countries.map((country: Country, countryKey: number) => {
                        return (
                          <List
                            component="nav"
                            key={countryKey}
                            className={classes.gridBorder}
                          >
                            <Grid className={classes.headerBotBorder}>
                              <Typography
                                variant="h4"
                                className={classes.countryName}
                              >
                                {country.country}
                              </Typography>
                              <IconButton
                                aria-label="Delete"
                                onClick={() =>
                                  this.deleteCountry(country.country)
                                }
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Grid>
                            {country.regions.map(
                              (region: string, key: number) => {
                                return (
                                  <ListItem
                                    key={key}
                                    className={classes.listItemPadding}
                                  >
                                    <Chip
                                      className={classes.chip}
                                      label={region}
                                      onDelete={() =>
                                        this.deleteRegion(
                                          country.country,
                                          region
                                        )
                                      }
                                      variant="outlined"
                                    />
                                  </ListItem>
                                );
                              }
                            )}

                            <ListItem className={classes.listItemPadding}>
                              <Typography
                                variant="h4"
                                className={classes.addSector}
                                style={{ fontSize: "14px" }}
                                onClick={() => {
                                  this.setState({
                                    whichModal: "region",
                                    whichCountry: country.country
                                  });
                                  this.openModal();
                                }}
                              >
                                Add a region…
                              </Typography>
                            </ListItem>
                          </List>
                        );
                      })}
                    </Grid>
                    <Typography
                      variant="h4"
                      className={classes.addSector}
                      onClick={() => {
                        this.setState({ whichModal: "country" });
                        this.openModal();
                      }}
                    >
                      Add another country…
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </>
    );
  }
}
export default withStyles(styles)(CountriesRegionsListingComponent);

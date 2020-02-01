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
  Chip
} from "@material-ui/core";

import HeaderComponent from "../page-layout/HeaderComponent";
import SideNav from "../page-layout/SideNav";

import { type Account } from "../authentication/models";

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
  }
});

type Props = {
  account: Account,
  logout: () => void,
  classes: any,
  sectors: string[],
  loadSectors: () => void,
  history: any,
  addSector: (name: string, errorMsg: string) => Promise<any>,
  deleteSector: (name: string, errorMsg: string) => Promise<any>
};

type state = {
  name: string,
  open: boolean
};

class DemographicInfoListingComponent extends Component<Props, state> {
  constructor() {
    super();
    this.state = {
      name: "",
      open: false
    };
  }
  componentDidMount() {
    this.props.loadSectors();
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

  deleteSector = (sectorName: string) => {
    this.props.deleteSector(sectorName, "Can't delete Sector");
  };

  renderAddDemoInfoModal = classes => {
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
                  Add new sector
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
                    this.props
                      .addSector(this.state.name, "Unable to add sector")
                      .then(() => {
                        this.closeModal();
                        this.props.loadSectors();
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
    const sectors = this.props.sectors || [];
    const { classes, logout, account } = this.props;
    return (
      <>
        <HeaderComponent
          logout={logout}
          account={account}
          history={this.props.history}
        />
        {this.renderAddDemoInfoModal(classes)}
        <Grid container>
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
                    Report settings
                  </Typography>
                  <hr className={classes.titleUnderline} />
                  <Paper className={classes.pagePaper}>
                    <Grid item>
                      <Typography variant="h4">
                        Demographic information
                      </Typography>
                    </Grid>
                    <Grid item>
                      <p className={classes.subtitleText}>
                        Please add any Demographic name you want to include as a
                        variable in the reports
                      </p>
                      <List component="nav">
                        {sectors.map((sector: string, key: number) => {
                          return (
                            <ListItem key={key}>
                              <Chip
                                className={classes.chip}
                                label={sector}
                                onDelete={() => this.deleteSector(sector)}
                                variant="outlined"
                              />
                            </ListItem>
                          );
                        })}

                        <ListItem>
                          <Typography
                            variant="h4"
                            className={classes.addSector}
                            onClick={this.openModal}
                          >
                            Please add a Demographic option…
                          </Typography>
                        </ListItem>
                      </List>
                    </Grid>
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
export default withStyles(styles)(DemographicInfoListingComponent);

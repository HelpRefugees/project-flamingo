import React, { Component } from "react";
import { withStyles, Typography } from "@material-ui/core";

const background = {
  minHeight: "310px",
  position: "fixed",
  top: "0",
  left: "0",
  width: "100%"
};

const styles = () => ({
  header: {
    color: "#ffffff",
    marginTop: "32px",
    marginBottom: "32px",
    padding: 0,
    fontSize: "48px",
    fontWeight: 600
  },
  backgroundImage: {
    ...background,
    backgroundImage: "url(/banner.jpg)",
    backgroundPosition: "top",
    backgroundRepeat: "no-repeat",
    backgroundColor: "white",
    backgroundSize: "cover",
    width: "100%",
    zIndex: "-2",
    filter: "grayscale(100%)"
  },
  backgroundGradient: {
    ...background,
    background: "linear-gradient(80deg, #004d46, #00857b)",
    zIndex: "-1",
    opacity: 0.8
  }
});

type Props = {
  classes: any,
  children: ?any
};

class BannerHeader extends Component<Props> {
  render() {
    const { children, classes } = this.props;
    return (
      <>
        <Typography
          className={classes.header}
          variant="h3"
          data-test-id="page-title"
        >
          {children}
        </Typography>
        <div className={classes.backgroundImage} />
        <div className={classes.backgroundGradient} />
      </>
    );
  }
}

export default withStyles(styles)(BannerHeader);

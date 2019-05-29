import React from "react";
import { withStyles } from "@material-ui/core";
import { withRouter } from "react-router-dom";

const styles = () => ({
  backgroundImage: {
    backgroundImage: "url(/404.png)",
    backgroundSize: "contain",
    height: "100vh"
  }
});
const NotFound = ({ classes, history }: any) => (
  <div
    className={classes.backgroundImage}
    onClick={() => {
      history.push("/");
    }}
  />
);
export default withRouter(withStyles(styles)(NotFound));

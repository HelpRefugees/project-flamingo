import React from "react";
import { withStyles } from "@material-ui/core";
import { withRouter } from "react-router-dom";

const styles = () => ({
  backgroundImage: {
    height: "100vh",
    backgroundImage: "url(/404.png)",
    backgroundSize: "100% 100%"
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

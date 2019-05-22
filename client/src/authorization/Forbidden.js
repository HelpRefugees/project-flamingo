import React from "react";
import { withStyles } from "@material-ui/core";
import { withRouter } from "react-router-dom";

const styles = () => ({
  backgroundImage: {
    backgroundImage: "url(/forbidden.png)",
    backgroundSize: "cover",
    height: "100vh"
  }
});
const Forbidden = ({ classes, history }: any) => (
  <div
    className={classes.backgroundImage}
    onClick={() => {
      history.push("/");
    }}
  />
);
export default withRouter(withStyles(styles)(Forbidden));

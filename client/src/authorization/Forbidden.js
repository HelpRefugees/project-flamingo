import React from "react";
import { withStyles } from "@material-ui/core";
import { withRouter } from "react-router-dom";

const styles = () => ({
  backgroundImage: {
    backgroundImage: "url(/forbidden.png)",
    backgroundSize: "100% 100%",
    height: "100vh"
  }
});
const Forbidden = ({ classes, history }: any) => (
  <div
    className={classes.backgroundImage}
    data-test-id="forbidden"
    onClick={() => {
      history.push("/");
    }}
  />
);
export default withRouter(withStyles(styles)(Forbidden));

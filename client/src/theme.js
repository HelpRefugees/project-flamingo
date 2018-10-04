import createMuiTheme from "@material-ui/core/styles/createMuiTheme";

export default createMuiTheme({
  palette: {
    primary: { main: "#00857B" },
    background: { default: "#f4f4f4", paper: "#ffffff" }
  },
  typography: {
    allVariants: { color: "#404040" },
    body1: { fontSize: 18 },
    caption: { fontSize: 10, textTransform: "uppercase" }
  }
});

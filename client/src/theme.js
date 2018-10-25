import createMuiTheme from "@material-ui/core/styles/createMuiTheme";

export default createMuiTheme({
  palette: {
    primary: { main: "#00857B" },
    background: { default: "#f4f4f4", paper: "#ffffff" }
  },
  typography: {
    useNextVariants: true,
    allVariants: { color: "#404040" },
    body2: { fontSize: 18 },
    h1: { fontSize: "33px" },
    caption: { fontSize: 10, textTransform: "uppercase" }
  }
});
